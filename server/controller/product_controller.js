const Product = require("../model/product_model");
const User = require("../model/user_model");
const HttpError = require("../model/http_error");
const mongoose = require("mongoose");

const addProduct = async (req, res, next) => {
  try {
    const { product_name, product_price, product_company_name,product_description } = req.body;
    const shopOwnerId = req.userId;
    const newProduct = new Product({
      product_name,
      product_price,
      product_company_name,
      product_description,
      shop_owner: shopOwnerId,
    });

    await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    console.error("Error adding product:", err);
    return next(new HttpError("Error adding product!", 500));
  }
};

const getshopProducts = async (req, res, next) => {
  try {
    const userId = req.userId;
    const products = await Product.find({ shop_owner: userId });

    if (!products.length) {
      return next(new HttpError("No products found for this shop.", 404));
    }

    res.json({ Products: products });
  } catch (err) {
    return next(new HttpError("Error fetching products!", 500));
  }
};

 const getAllProducts = async (req, res, next) => {
  try {
    
    const items = await Product.find();

    res.status(200).json({ 
      count: items.length,
      Items: items 
    });
  } catch (err) {
    return next(new HttpError("Error fetching item !", 500));
  }
}

// const getProductsByUserId = async (req, res, next) => {
//   try {
//     const { userId } = req.params;
//     console.log('get products by user id');
//     const items = await Product.find({ shop_owner: userId });

//     res.status(200).json({ 
//       count: items.length,
//       Items: items 
//     });

//   } catch (err) {
//     return next(new HttpError("Error fetching items product!", 500));
//   }
// };

const getProductsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userObjectId = new mongoose.Types.ObjectId(userId); // Convert userId to ObjectId

    const products = await Product.aggregate([
      {
        $match: { shop_owner: userObjectId } // Filter by shop_owner
      },
      {
        $lookup: {
          from: "users", // Join with users collection
          localField: "shop_owner",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "ratings", // Join with ratings collection
          localField: "shop_owner",
          foreignField: "shop_owner", // Match ratings by product_id
          as: "ratings",
        },
      },
      {
        $addFields: {
          shop_owner: "$shop_owner", // Keep shop_owner
          full_name: { $arrayElemAt: ["$userDetails.full_name", 0] }, // Extract user full name
          email: { $arrayElemAt: ["$userDetails.email", 0] },
          rating: { $avg: "$ratings.rating" } // Calculate average rating
        },
      },
      {
        $project: {
          _id: 1,
          shop_owner: 1,
          product_name: 1,
          product_description: 1,
          product_price: 1,
          product_category: 1,
          full_name: 1,
          email: 1,
          rating: 1
        },
      },
    ]);

    res.status(200).json({ 
      count: products.length,
      Items: products
    });
  } catch (err) {
    console.error("Error fetching products with a rating:", err);
    return next(new HttpError("Error fetching products!", 500));
  }
};






const updateProduct = async (req, res, next) => {
  try {
    const { product_name, product_price, product_company_name, product_description } = req.body;
    const productId = req.params.id;

   

    const product = await Product.findById(productId);
    if (!product) {
      return next(new HttpError("Product not found.", 404));
    }

    if (!product.shop_owner.equals(new mongoose.Types.ObjectId(req.userId))) {
      return next(new HttpError("You do not have permission to update this product.", 403));
    }
    product.product_name = product_name || product.product_name;
    product.product_price = product_price || product.product_price;
    product.product_company_name = product_company_name || product.product_company_name;
    product.product_description = product_description || product.product_description; 
    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (err) {
    console.error("Error updating product:", err);
    return next(new HttpError("Error updating product!", 500));
  }
};


const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    
    const product = await Product.findById(productId);
    if (!product) {
      return next(new HttpError("Product not found.", 404));
    }

    if (!product.shop_owner.equals(new mongoose.Types.ObjectId(req.userId))) {
      return next(new HttpError("You do not have permission to delete this product.", 403));
    }

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    return next(new HttpError("Error deleting product!", 500));
  }
};

module.exports = {
  addProduct,
  getshopProducts,
  updateProduct,
  deleteProduct,
  getProductsByUserId,
  getAllProducts,
};
