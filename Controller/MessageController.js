const Message = require('../Models/Message');
const jwt = require("jsonwebtoken");

const multer = require("multer");

// userController.js

const sendMessage = async (req, res) => {
  try {
    const { senderId, recepientId, messageType, messageText } = req.body;
    console.log("harjbvksvbs");

    const newMessage = new Message({
      senderId,
      recepientId,
      messageType,
      message: messageText,
      timestamp: new Date(),
      imageUrl: messageType === 'image' ? req.file.path : null,
    });

    await newMessage.save();
    res.status(200).json({ message: 'Message sent successfully' ,success: true});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//endpoint to fetch the messages between two users in the chatRoom
const fetchMessagesBetweenUsers = async (req, res) => {
  const accessToken = req.header('Authorization');

if (!accessToken) {
  return res.status(401).json({errorcode: 401, success: false, message: 'Access token is missing' });
}
const decoded = jwt.verify(accessToken,'harshit');

  console.log("vciuscsbcjskdcvksd 1",req.params);
  try {
    const { senderId, recepientId } = req.params;
    console.log("vciuscsbcjskdcvksd 1",senderId,recepientId);

    const messages = await Message.find({
      $or: [
        { senderId: senderId, recepientId: recepientId },
        { senderId: recepientId, recepientId: senderId },
      ],
    }).populate("senderId", "_id name");

    res.json({data: messages,success: true});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

//endpoint to delete the messages!
  const deleteMessages = async (req, res) => {
    const accessToken = req.header('Authorization');

if (!accessToken) {
  return res.status(401).json({errorcode: 401, success: false, message: 'Access token is missing' });
}
const decoded = jwt.verify(accessToken,'harshit');
    try {
      const { messages } = req.body;
  
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ message: "invalid req body!" });
      }
  
      await Message.deleteMany({ _id: { $in: messages } });
  
      res.json({success: true, message: "Message deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server" });
    }
  }


module.exports = {
    sendMessage,
    fetchMessagesBetweenUsers,
    deleteMessages,
  };
