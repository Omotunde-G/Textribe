const express = require('express')
const router = express.Router();

const collaboController = require('../controllers/collaboController')

router.get('/as', collaboController.fetchcontributions)
router.get('/all', collaboController.fetcher)

module.exports= router;