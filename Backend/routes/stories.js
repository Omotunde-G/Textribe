const express = require('express')
const router = express.Router();
const storiesController = require('../controllers/storiesController');
const multer = require("multer");
const upload = multer({ dest: "./uploads" });
const authenticateToken = require("../middlewares/authmiddleware");
 

router.post('/create/:user_id', upload.single("image"), storiesController.createStory);
router.get('/all', storiesController.fetchAllStories)
router.delete('/:storyId', storiesController.deteleStory);
router.patch('/:storyId', storiesController.editStoryById);
router.get('/:user_id', storiesController.fetchStoriesByAuthorId)
router.post('/:storyId/like', authenticateToken,  storiesController.likeStory); 
router.get('/:storyId/likes', storiesController.getStoryLikes);
// router.get('/fetch/:story_id', storiesController.getStoryById)

module.exports = router;
