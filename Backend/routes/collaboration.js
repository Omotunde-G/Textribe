const express = require('express');
const router = express.Router();
const collaborationController = require('../controllers/collaborationController');

router.post('/:storyId/contribute/save', collaborationController.saveContributionDraft);
router.post('/:storyId/contribute', collaborationController.submitContribution);
router.get('/author/:authorId/contributions', collaborationController.getContributionsByAuthor);
router.post('/contributions/:id/accept', collaborationController.acceptContribution);
router.post('/contributions/:id/decline', collaborationController.declineContribution);
router.post('/collaborations/:id/merge', collaborationController.mergeContribution);
router.post('/collaborations/:id/feedback', collaborationController.sendFeedback);
router.get('/collaboration/:id', collaborationController.getContributionById);

module.exports = router;
