const express = require('express')
const router = express.Router();
const usersController = require("../controllers/usersController")

router.get('/', usersController.fetchUser)

module.exports = router;
// get profile GET
// edit profile PATCH 
// delete profile DELETE