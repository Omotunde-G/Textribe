const express = require('express')
const router = express.Router();
const storiesController = require('../controllers/storiesController');

router.post('/create', storiesController.createStory);
router.get('/all', storiesController.fetchAllStories)
router.delete('/:storyId', storiesController.deteleStory);
router.patch('/:storyId', storiesController.editStoryById);
router.get('/:storyId', storiesController.fetchStoryById)
// // router.put('/accept-collaboration/:collaborationId', storiesController.acceptCollaborationAndUpdateStory);
// // router.post('/reject-collaboration', storiesController.rejectCollaboration);

module.exports = router;



// Create a story
// router.post('/create',  storiesController.createStory);

// // Fetch a story by ID
// router.get('/:storyId',  storiesController.fetchStoryById);

// // Create a collaboration
// router.post('/collaborate',  storiesController.createCollaboration);

// // Get all collaborations for a story
// router.get('/:storyId/collaborations',  storiesController.getCollaborationsForStory);



