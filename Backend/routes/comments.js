const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');

// routes
router.post('/:storyId/comment', commentsController.addComment);
router.get('/:storyId/comments', commentsController.getCommentsByStoryId);

module.exports = router;
