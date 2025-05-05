const express = require('express');
const router = express.Router();
const { createReview, getReviewsByItem } = require('../controller/review_controller');
const authMiddleware = require('../middleware/authMiddleware/authMiddleware');

router.post('/reviews/create-review', authMiddleware, createReview);
router.get('/reviews/get-review-by-id/:itemType/:itemId', authMiddleware, getReviewsByItem); 
module.exports = router;
