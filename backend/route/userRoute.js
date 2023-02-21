const express = require('express');
const { registerUser, authUser, allUsers} = require('../controls/DataController');
const {verify} = require('../middleware/userAuth')

const router = express.Router();

router.route('/').post(registerUser).get(verify, allUsers)  // this may be confusing as it has both post and get but trust me its simpler, if we recieved a get request then get works elif post then the post works
// in the get request it has to go the verify middleware first after which it has to go to the allUsers
router.post('/login', authUser)

module.exports = router;