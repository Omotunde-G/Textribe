const express = require('express')
const router = express.Router();
const storiesController = require('../controllers/storiesController');
const multer = require("multer");
const upload = multer({ dest: "./uploads" });


router.post('/create/:user_id', upload.single("image"), storiesController.createStory);
router.get('/all', storiesController.fetchAllStories)
router.delete('/:storyId', storiesController.deteleStory);
router.patch('/:storyId', storiesController.editStoryById);
router.get('/:user_id', storiesController.fetchStoriesByAuthorId)
// router.get('/fetch/:story_id', storiesController.getStoryById)

module.exports = router;
