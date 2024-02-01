const express = require('express')
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "./uploads" });

//import controller
const authController = require('../controllers/authController')

router.post('/register', upload.single("image"),authController.registerUser)
router.post('/login', authController.loginUser)

module.exports = router;

