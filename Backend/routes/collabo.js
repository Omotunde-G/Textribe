const express = require('express')
const router = express.Router();

const collaboController = require('../controllers/collaboController')


router.get('/all',collaboController.fetchAllContribution)
router.post('/add', collaboController.addContribution)
router.get('/origin', collaboController.getContributeAndOrigin)
router.put('/update/:story_id', collaboController.updateContributions)

module.exports= router;