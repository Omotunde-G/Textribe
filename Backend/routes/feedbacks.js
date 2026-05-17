// routes/feedback.js
const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

router.post('/contributions/:contributionId/feedback', feedbackController.sendFeedback);
router.get('/users/:userId/feedback', feedbackController.getUserFeedback);

module.exports = router;
