const Feedback = require('../model/feedback_model');

// User submits feedback
const createFeedback = async (req, res) => {
  const { title, message } = req.body; 
    const userId = req.userId;
    const status = 'pending';
    const response = null;
  const feedback = new Feedback({ userId, title, message,status, response }); // <-- include title
  await feedback.save();
  res.json({ success: true, feedback });
};

// Admin gets all feedbacks
const getFeedbacks = async (req, res) => {
  const feedbacks = await Feedback.find().populate('userId', 'name email');
  res.json(feedbacks);
};

// Admin responds to a feedback
const respondToFeedback = async (req, res) => {
  const { response, title } = req.body; // <-- allow updating title if needed
  const updateFields = { response, status: 'responded' };
  if (title) updateFields.title = title; // <-- update title if provided

  const feedback = await Feedback.findByIdAndUpdate(
    req.params.id,
    updateFields,
    { new: true }
  );
  res.json(feedback);
};

module.exports = {
  createFeedback,
  getFeedbacks,
  respondToFeedback,
};