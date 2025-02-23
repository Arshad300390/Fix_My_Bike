const User = require("../model/user_model");
const Bike = require("../model/bike_model");
const HttpError = require("../model/http_error");
const userProfileImageUpload = require("../middleware/upload_user_profile_image");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { v2: cloudinary } = require("cloudinary");

const signup = async (req, res, next) => {
  try {
    const { full_name, email, password, phone_number, address, role } =
      req.body;

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new HttpError("User With This Email Already Exists!", 409));
    }

    let userProfileImageUrl = null;
    if (req.file) {
      userProfileImageUrl =
        await userProfileImageUpload.cloudinaryUserProfileImageUpload(req.file);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      full_name,
      email,
      password: hashedPassword,
      phone_number,
      address,
      role,
      profile_image: userProfileImageUrl,
    });
    console.log(user);
    await user.save();
    console.log("User created successfully:", user);

    res.status(201).json({ message: "User Created Successfully!" });
  } catch (err) {
    console.error("Error during signup process:", err);
    return next(new HttpError("Error Creating User!", 500));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return next(new HttpError("User Not Found!", 404));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new HttpError("Invalid Password!", 401));
    }

    const payload = {
      userType: user.role,
      user: {
        id: user.id,
        email: user.email,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
      if (err) {
        return next(new HttpError("Error Generating Token!", 500));
      }
      console.log(token);
      res.json({ message: "Login Successfully", token });
    });
  } catch (err) {
    console.error("Error:", err);
    return next(new HttpError("Error Logging In!", 500));
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { userId, userType } = req;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return next(new HttpError("User Not Found!", 404));
    }

    const users = await User.find({
      role: userType === "customer" ? "customer" :"mechanic",
    }).select("full_name email phone_number role");

    res.json({ User: { ...user.toObject(), users } });
  } catch (err) {
    return next(new HttpError("Error Getting Users!", 500));
  }
};

//
const getMechanics = async (req, res, next) => {
  try {
    const mechanics = await User.find({ role: "mechanic" }).select(
      "full_name email phone_number role address"
    );

    if (!mechanics.length) {
      return next(new HttpError("No mechanics found!", 404));
    }

    // Send the response with the mechanics' data
    res.status(200).json({ mechanics: mechanics });
  } catch (err) {
    return next(new HttpError("Error Getting Mechanics!", 500));
  }
};

const getSellers = async (req, res, next) => {
  try {
    const sellers = await User.find({ role: "seller" }).select(
      "full_name email phone_number role address"
    );
    if (!sellers.length) {
      return next(new HttpError("No sellers found!", 404));
    }

    // Send the response with the sellers' data
    res.status(200).json({ Sellers: sellers });
  } catch (err) {
    return next(new HttpError("Error Getting Sellers!", 500));
  }
};

//

const getUsersById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return next(new HttpError("User Not Found For Provided Id!", 404));
    }
    res.json({ User: user });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return next(new HttpError("User Not Found For Provided Id!", 404));
    }
    return next(new HttpError("Server Error", 500));
  }
};

const updateUsers = async (req, res, next) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: "Invalid User Id" });
  }

  try {
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (
      req.headers["content-type"] &&
      req.headers["content-type"].includes("multipart/form-data")
    ) {
      if (req.body.full_name) user.full_name = req.body.full_name;
      if (req.body.address) user.address = req.body.address;
      if (req.file) {
        if (user.profile_image) {
          const publicId = user.profile_image
            .split("/")
            .slice(-4)
            .join("/")
            .split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        }

        const folderPath = "fix_my_bike/uploads/user_profile_images";

        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: folderPath,
          unique_filename: false,
        });

        user.profile_image = result.secure_url;
      }
    }

    await user.save();

    res.status(200).json({ message: "User Updated Successfully.", user });
  } catch (err) {
    console.log("Error updating User:", err);
    return next(new HttpError("Failed To Update User!", 500));
  }
};

const deleteUsers = async (req, res, next) => {
  const userId = req.params.id;

  if (!userId) {
    return next(new HttpError("Invalid User ID", 400));
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new HttpError("User not found.", 404));
    }

    if (user.profile_image) {
      try {
        const publicId = user.profile_image
          .split("/")
          .slice(-4)
          .join("/")
          .split(".")[0];

        const deletionResult = await cloudinary.uploader.destroy(publicId);
        if (deletionResult.result !== "ok") {
          console.error(
            `Failed to delete Client Profile Image from Cloudinary: ${publicId}`
          );
        }
      } catch (err) {
        console.error(
          "Error deleting Client Profile image from Cloudinary:",
          err
        );
      }
    }

    await User.deleteOne({ _id: userId });

    await Bike.deleteMany({ _id: userId });

    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Internal server error.", 500));
  }
};

const logout = async (req, res, next) => {
  try {
    res.json({ message: "Logout Successful", token: null });
  } catch (err) {
    console.error("Error Logging Out:", err);
    return next(new HttpError("Error Logging Out!", 500));
  }
};

const resetPassword = async (req, res, next) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new HttpError("User Not Found!", 404));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password Reset Successfully!" });
  } catch (err) {
    console.log("Error:", err);
    return next(new HttpError("Error Resetting Password!", 500));
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  console.log(`Received request to reset password for email: ${email}`);

  try {
    const existingUser = await User.findOne({ email });
    console.log(`Looking for user in database with email: ${email}`);

    if (!existingUser) {
      console.error("User does not exist!");
      return next(new HttpError("User does not exist!", 404));
    }
    console.log(`User found: ${existingUser.email}`);

    const secret = process.env.JWT_SECRET + existingUser.password;
    console.log(`Generated secret for token: ${secret}`);

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      secret,
      {
        expiresIn: "5m",
      }
    );
    console.log("Generated password reset token:", token);

    // Construct the reset password URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${existingUser._id}/${token}`;
    console.log("Password reset URL:", resetUrl);

    // Configure Mailtrap SMTP transport using provided environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // Mailtrap SMTP host from .env
      port: process.env.EMAIL_PORT, // Port from .env (465 is typically SSL)
      auth: {
        user: process.env.EMAIL_USER, // SMTP username from .env
        pass: process.env.EMAIL_PASS, // SMTP password from .env
      },
      secure: true, // Use SSL for security (recommended for port 465)
    });

    await transporter.verify((error) => {
      if (error) {
        console.error("Error verifying transporter:", error);
        return next(new HttpError("Transporter verification failed", 500));
      } else {
        console.log("Mailer transporter is ready to send emails.");
      }
    });

    const mailOptions = {
      from: "fixmybike@gmail.com",
      to: existingUser.email,
      subject: "Password Reset Request",
      text: `Please click the following link to reset your password: ${resetUrl}. This link is valid for 5 minutes.`,
      html: `<p>Please click the following link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link is valid for 5 minutes.</p>`,
    };
    console.log(`Sending email to: ${existingUser.email}`);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return next(new HttpError("Failed to send reset token email", 500));
      } else {
        console.log("Email sent successfully: " + info.response);
        return res
          .status(200)
          .json({ message: "Password reset link sent to your email." });
      }
    });

    console.log("Password reset link (sent):", resetUrl);
  } catch (error) {
    console.error("Error:", error);
    return next(new HttpError("Error Processing Password Reset!", 500));
  }
};

module.exports = {
  signup,
  login,
  getMechanics,
  getUsers,
  getUsersById,
  updateUsers,
  deleteUsers,
  logout,
  resetPassword,
  forgotPassword,
  getSellers,
};
