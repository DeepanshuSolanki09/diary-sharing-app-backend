const mongoose = require("mongoose");

const diaryschema = new mongoose.Schema({
  title: String,
  content: String,
  filelink: String,
  date: {
    type: Date,
    default: Date.now(),
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  rating: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      value: {
        type: Number,
        min: 0,
        max: 5,
      },
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Comment"
    },
  ],
},{timestamps:true});

const Diary = mongoose.model("Diary", diaryschema);
module.exports = Diary;
