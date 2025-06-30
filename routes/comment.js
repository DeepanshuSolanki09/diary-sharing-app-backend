const express = require("express");
const Diary = require("../models/diaryschema");
const Comment = require("../models/commentschema");
const route = express.Router();
const authm = require("../config/authm");

route.post("/diaries/:id/comments", authm, async (req, res) => {
  try {
    const x = await Diary.findById(req.params.id);
    if (x == null) {
      return res.status(500).json({
        success: false,
        message: "Diary Not Found",
      });
    }
    const { comment } = req.body;
    if (!comment) {
      return res.status(500).json({
        success: false,
        message: "Please Enter The Comment",
      });
    }

    const y = await Comment.create({
      comment,
      user: req.user.id,
      diary: req.params.id,
    });
    await Diary.findByIdAndUpdate(req.params.id, { $push: { comments: y._id } });
    return res.status(200).json({
      success: true,
      message: "Comment Added Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
});

route.get("/diaries/:id/comments", authm, async (req, res) => {
  try {
    const x = await Diary.findById(req.params.id)
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "name profilePicture",
        },
      });
    if (x == null) {
      return res.status(500).json({
        success: false,
        message: "Diary Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Comments fethched Successfully",
      comments: x.comments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
});

route.put("/comments/:id", authm, async (req, res) => {
  try {
    const x = await Comment.findById(req.params.id).populate(
      "diary",
      "creator"
    );
    if (x == null) {
      return res.status(500).json({
        success: false,
        message: "Comment Not Found",
      });
    }

    if ((req.user.id.toString() != x.diary.creator.toString()) && (req.user.id.toString() != x.user.toString())) {
      return res.status(500).json({
        success: false,
        message: "You Are Not Allowed To Do This",
      });
    }
    const {comment} = req.body;
    const updates = {};
    if (!comment) {
      return res.status(500).json({
        success: false,
        message: "Please Enter The Comment",
      });
    }

    if(comment) updates.comment = comment;

    await Comment.findByIdAndUpdate(req.params.id,updates);
    return res.status(200).json({
      success: true,
      message: "Comment Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
});

route.delete("/comments/:id", authm, async (req, res) => {
  try {
    const x = await Comment.findById(req.params.id).populate(
      "diary",
      "creator"
    );
    if (x == null) {
      return res.status(500).json({
        success: false,
        message: "Comment Not Found",
      });
    }

   if ((req.user.id.toString() != x.diary.creator.toString()) && (req.user.id.toString() != x.user.toString())) {
      return res.status(500).json({
        success: false,
        message: "You Are Not Allowed To Do This",
      });
    }

    await Comment.findByIdAndDelete(req.params.id);
    await Diary.findByIdAndUpdate(x.diary._id,{$pull : {comments:x._id}});
    return res.status(200).json({
      success: true,
      message: "Comment Deleted Successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
});

module.exports = route;
