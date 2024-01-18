const express = require('express')
const router = express.Router();
const usersController = require("../controllers/usersController");


router.get('/', usersController.fetchUser)
router.get('/userProfile', usersController.fetchUserProfiles)
router.get('/userProfile/:username', usersController.fetchUserByUsername )
router.get('/userProfile/:user_id', usersController.fetchUserById)
router.post('/userProfile/:user_id', usersController.UserProfile)
router.route('/updateProfile/:user_id')
    .post(usersController.CreateOrUpdateUserProfile)
    .put(usersController.CreateOrUpdateUserProfile);
router.post('/updateProfile/:username', usersController.createUserProfileByUsername)

module.exports = router;
// get profile GET
// edit profile PATCH 
// delete profile DELETE