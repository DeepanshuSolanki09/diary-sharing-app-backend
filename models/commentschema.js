const mongoose = require("mongoose");

const commentschema = new mongoose.Schema({
  comment: {
    required: true,
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  diary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Diary",
    required: true,
  },
},{timestamps:true});

const Comment = mongoose.model("Comment", commentschema);
module.exports = Comment;
