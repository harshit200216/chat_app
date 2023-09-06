const express = require("express");

const router = express.Router();
const userController = require('../Controller/UserController');

//Register  User
router.post("/register",userController.registerUser)

// //Login user
router.post('/login',userController.loginUser);

//get all user except current user
router.get('/:userId', userController.getAllUser)

//send frinend request
router.post('/friend-request/', userController.sendFriendRequest)

// get list of all friend request sent
router.get('/friend-request/:userId',userController.getAllFriendRequestReceived)


//accept friend request
router.post('/friend-request/accept',userController.acceptFriendRequest);

//get all friends
router.get('/accepted-friends/:userId',userController.getAllFriendsList)

//get all friend request sent
router.get('/friend-requests/sent/:userId',userController.getAllFriendRequestSent)

router.get('/userDetails/:userId',userController.getuserDetails)


module.exports = router;

