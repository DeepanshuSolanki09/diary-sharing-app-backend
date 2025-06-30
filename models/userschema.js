const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: String,
  diary: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Diary",
    },
  ],
},{timestamps:true});

const User = mongoose.model("user", userschema);
module.exports = User;
