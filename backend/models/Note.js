const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // To diffferent users
    ref: "user",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: "General",
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model("notes", NotesSchema);
User.createIndexes();
module.exports = User;
