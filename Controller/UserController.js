const User = require('../Models/User');
const jwt = require("jsonwebtoken");

const createToken = (userId) => {
  const payload = {
    userId: userId,
  };
  const token = jwt.sign(payload, "harshit", { expiresIn: "1h" });
  return token;
}
const registerUser = async (req, res) => {
  try {
    const { name, email, password, image } = req.body;

    const newUser = new User({
      name,
      email,
      password,
      image,
    });

    const savedUser = await newUser.save();

    res.status(201).json({//201 for creation
      success: true,
    //   user: savedUser,
    message: 'User registered successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error registering user',
    });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(404)
      .json({ message: "Email and the password are required" });
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({success: false, message: "User not found" });
      }
      if (user.password !== password) {
        return res.status(404).json({ success: false, message: "Invalid Password!" });
      }

      const token = createToken(user._id);
      res.status(200).json({ success: true,userToken: token });
    })
    .catch((error) => {
      console.log("error in finding the user", error);
      res.status(500).json({ message: "Internal server Error!" });
    });
};
//endpoint to access all the users
const getAllUser = async (req,res) => {
  const accessToken = req.header('Authorization');

if (!accessToken) {
  return res.status(401).json({ errorcode: 401,success: false, message: 'Access token is missing' });
}
const decoded = jwt.verify(accessToken,'harshit');
const loggedInUserId = req.params.userId;

// Check if the token is expired
if (decoded.exp < Date.now() / 1000) {
  return res.status(401).json({ success: false, message: 'Access token is expired' });
}
  console.log("hererererrerererrererr");

  User.find({ _id: { $ne: loggedInUserId } })
    .then((users) => {
      res.status(200).json({success: true, data: users});
    })
    .catch((err) => {
      console.log("Error retrieving users", err);
      res.status(500).json({ message: "Error retrieving users" ,success: false});
    });
}

//endpoint to send a request to a user
const sendFriendRequest = async (req,res) => {
  const accessToken = req.header('Authorization');

if (!accessToken) {
  return res.status(401).json({errorcode: 401, success: false, message: 'Access token is missing' });
}
const decoded = jwt.verify(accessToken,'harshit');
  console.error('here 1', req);
  const { currentUserId, selectedUserId } = req.body;

  try {
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { freindRequests: currentUserId },
    });

    await User.findByIdAndUpdate(currentUserId, {
      $push: { sentFriendRequests: selectedUserId },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(200).json({ success: false });
  }
}
//endpoint to show all the friend-requests of a particular user
const getAllFriendRequestReceived = async (req,res) => {
  const accessToken = req.header('Authorization');

if (!accessToken) {
  return res.status(401).json({errorcode: 401, success: false, message: 'Access token is missing' });
}
const decoded = jwt.verify(accessToken,'harshit');
  
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate("freindRequests", "name email image")
      .lean();
    const freindRequests = user.freindRequests;

    res.json({success: true,data:freindRequests});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const acceptFriendRequest = async (req,res) => {
  const accessToken = req.header('Authorization');

if (!accessToken) {
  return res.status(401).json({errorcode: 401, success: false, message: 'Access token is missing' });
}
const decoded = jwt.verify(accessToken,'harshit');
  try {
    const { senderId, recepientId } = req.body;

    const sender = await User.findById(senderId);
    const recepient = await User.findById(recepientId);

    sender.friends.push(recepientId);
    recepient.friends.push(senderId);

    recepient.freindRequests = recepient.freindRequests.filter(
      (request) => request.toString() !== senderId.toString()
    );

    sender.sentFriendRequests = sender.sentFriendRequests.filter(
      (request) => request.toString() !== recepientId.toString
    );

    await sender.save();
    await recepient.save();

    res.status(200).json({success: true, message: "Friend Request accepted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

  //endpoint to access all the friends
const getAllFriendsList = async (req,res) => {
  const accessToken = req.header('Authorization');

if (!accessToken) {
  return res.status(401).json({errorcode: 401, success: false, message: 'Access token is missing' });
}
const decoded = jwt.verify(accessToken,'harshit');
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "friends",
      "name email image"
    );
    const acceptedFriends = user.friends;
    res.json({success: true,data:acceptedFriends});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const getAllFriendRequestSent = async (req,res) => {
  const accessToken = req.header('Authorization');

if (!accessToken) {
  return res.status(401).json({errorcode: 401, success: false, message: 'Access token is missing' });
}
const decoded = jwt.verify(accessToken,'harshit');
    try{
      const {userId} = req.params;
      const user = await User.findById(userId).populate("sentFriendRequests","name email image").lean();
  
      const sentFriendRequests = user.sentFriendRequests;
  
      // res.json({success: true,data:sentFriendRequests});
      res.json({success: true,data:sentFriendRequests});
    } catch(error){
      console.log("error",error);
      res.status(500).json({ error: "Internal Server" });
    }
}
//get uuser details
const getuserDetails = async (req,res) => {
  const accessToken = req.header('Authorization');

if (!accessToken) {
  return res.status(401).json({errorcode: 401, success: false, message: 'Access token is missing' });
}
const decoded = jwt.verify(accessToken,'harshit');
  try {
    const { userId } = req.params;
    const userDetails = await User.findById(userId);

    res.json({success:true, data:userDetails});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


  
  module.exports = {
    registerUser,
    loginUser,
    getAllUser,
    sendFriendRequest,
    getAllFriendRequestSent,
    acceptFriendRequest,
    getAllFriendsList,
    getAllFriendRequestReceived,
    getuserDetails
  };