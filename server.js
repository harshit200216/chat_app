const express = require("express");
const bodyParser = require("body-parser");
// import bodyParser from 'body-parser';

const mongoose = require("mongoose");
const passport = require("passport");
require("dotenv").config()
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const userRoute = require("./Routes/UserRoute");
const messageRouter = require("./Routes/MessageRoute")

const app = express();
const port = 8000;
const cors = require("cors");


(async () => {
    try {
      await mongoose.connect(process.env.DB_CONNECTION_URL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
      console.log('Connected to MongoDB database');
      // Routes setup after the database connection is successful
      app.use(cors());
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({extended: false}));
      app.use(passport.initialize());
      app.use("/api/user/v1",userRoute);
      app.use("/api/message/v1", messageRouter);
      app.listen(process.env.PORT, () => {
        console.log("Server is running");
      });
    } catch (error) {
      console.error('Error connecting to MongoDB database:', error);
    }
  })();