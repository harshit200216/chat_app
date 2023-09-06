const express = require("express");

const router = express.Router();
const messageController = require('../Controller/MessageController');
const multer = require("multer");
// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("bcvvckjlbka;lncbvjaklb");
      cb(null, "files"); // Specify the desired destination folder
    },
    filename: function (req, file, cb) {
        console.log("bcvvckjlbka;lncbvjaklb 1",file,cb,req.body);
      // Generate a unique filename for the uploaded file
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });
const upload = multer({ storage: storage });

// send messages
router.post('/messages', upload.single('imageFile'), messageController.sendMessage);


router.get('/:senderId/:recepientId',  messageController.fetchMessagesBetweenUsers);

router.post('/deleteMessages',messageController.deleteMessages);

module.exports = router;

