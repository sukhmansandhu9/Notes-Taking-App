// Code for making connection to mongodb (database)
const mongoose = require("mongoose");

const mongoURL =
  "mongodb://localhost:27017/inotebook?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
// Specify the name of database here as above I specify the inotebook
// 27017
const connectToMongo = () => {
  mongoose.connect(mongoURL, () => {
    console.log("Connected to Mongo successfully");
  });
};

module.exports = connectToMongo;
