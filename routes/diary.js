const express = require("express");
const route = express.Router();
const upload = require("../config/multer");
const cloudinary = require("../config/cloudninary.js");
const fs = require("fs");
const Diary = require("../models/diaryschema");
const User = require("../models/userschema");
const authm = require("../config/authm");

route.post("/diaries", authm, upload.single("diary"), async (req, res) => {
  try {
    const { title, content, date } = req.body;
    if (!title) {
      return res.status(500).json({
        success: false,
        message: "Please Enter The Title",
      });
    }
    if (!content) {
      return res.status(500).json({
        success: false,
        message: "Please Enter The Content",
      });
    }
    if (!date) {
      return res.status(500).json({
        success: false,
        message: "Please Enter The Date",
      });
    }
    if (!req.file) {
      return res.status(500).json({
        success: false,
        message: "Please Upload The Diary Image",
      });
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "diaryApp/diary",
    });
    fs.unlinkSync(req.file.path);

    const x = await Diary.create({
      title,
      content,
      date,
      creator: req.user.id,
      filelink: result.secure_url,
    });
    await User.findByIdAndUpdate(req.user.id, { $push: { diary: x._id } });
    return res.status(200).json({
      success: true,
      message: "Post Created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
});

route.get("/diaries", authm, async (req, res) => {
  try {
    const x = await Diary.find({})
      .select("title content date creator filelink rating comments")
      .populate("creator", "name profilePicture");
    return res.status(200).json({
      success: true,
      message: "Diaries Fetched Successfully",
      diaries: x,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
});

route.get("/diaries/:id", authm, async (req, res) => {
  try {
    const x = await Diary.findById(req.params.id)
      .select("title content date creator filelink rating comments")
      .populate({
        path: "creator",
        select: "name profilePicture",
      });

    if (x == null) {
      return res.status(500).json({
        success: false,
        message: "Can't Find The Diary",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Diaries Fetched Successfully",
      diary: {
        title: x.title,
        content: x.content,
        date: x.date,
        filelink: x.filelink,
        creator: { name: x.creator.name, dp: x.creator.profilePicture },
        rating: x.rating,
        comment: x.comments,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
});

route.put("/diaries/:id", authm, upload.single("diary"), async (req, res) => {
  try {
    const x = await Diary.findById(req.params.id);
    if (x == null) {
      return res.status(500).json({
        success: false,
        message: "Can't Find The Diary",
      });
    }

    if (req.user.id.toString() !== x.creator.toString()) {
      return res.status(500).json({
        success: false,
        message: "You Are Not Allowed To Do This",
      });
    }
    const { title, content, date } = req.body;
    const updates = {};
    if (title) updates.title = title;
    if (content) updates.content = content;
    if (date) updates.date = date;

    if (req.file && req.file.path) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "diaryApp/diary",
      });
      fs.unlinkSync(req.file.path);
      updates.filelink = result.secure_url;
    }

    await Diary.findByIdAndUpdate(req.params.id, updates);
    return res.status(200).json({
      success: true,
      message: "Post Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
});

route.delete("/diaries/:id", authm, async (req, res) => {
  try {
    const x = await Diary.findById(req.params.id);
    if (x == null) {
      return res.status(500).json({
        success: false,
        message: "Can't Find The Diary",
      });
    }

    if (req.user.id.toString() !== x.creator.toString()) {
      return res.status(403).json({
        success: false,
        message: "You Are Not Allowed To Do This",
      });
    }

    await Diary.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(req.user.id, { $pull: { diary: x._id } });
    return res.status(200).json({
      success: true,
      message: "Post Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
});

module.exports = route;
