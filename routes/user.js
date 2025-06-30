const express = require("express");
const User = require("../models/userschema");
const route = express.Router();
const bcrypt = require("bcrypt");
const upload = require("../config/multer");
const cloudinary = require("../config/cloudninary.js");
const fs = require("fs");
const authm = require("../config/authm");

route.get("/users", authm, async (req, res) => {
  try {
    const x = await User.find({}).select("name email diary profilePicture");
    return res.status(200).json({
      success: true,
      message: "data fetched successfully",
      user: x,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
});

route.get("/user/:id", authm, async (req, res) => {
  try {
    const x = await User.findById(req.params.id).select(
      "name email diary profilePicture"
    );
    if (x == null) {
      return res.status(500).json({
        success: false,
        message: "Can't Find User",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Data Fetched Successfully",
      user: {
        name: x.name,
        email: x.email,
        diary: x.diary,
        dp: x.profilePicture,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
});

route.put("/user/:id", authm, upload.single("profile"), async (req, res) => {
  try {
    const x = await User.findById(req.params.id).select(
      "name email diary profilePicture"
    );
    if (x == null) {
      return res.status(500).json({
        success: false,
        message: "Can't Find User",
      });
    }

    const { id } = req.user;
    if (id != req.params.id) {
      return res.status(500).json({
        success: false,
        message: "You Can't Edit This User",
      });
    }
    if (req.file && req.file.path) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "diaryApp/users",
      });
      fs.unlinkSync(req.file.path);
      updates.profilePicture = result.secure_url;
    }
    const { name, email, password } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (email) updates.email = email;
    if (password && password.trim() !== "") {
      updates.password = await bcrypt.hash(password, 10);
    }

    await User.findByIdAndUpdate(req.params.id, updates);

    return res.status(200).json({
      success: true,
      message: "User Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
});

route.delete("/user/:id", authm, async (req, res) => {
  try {
    const x = await User.findById(req.params.id).select(
      "name email diary profilePicture"
    );
    if (x == null) {
      return res.status(500).json({
        success: false,
        message: "Can't Find User",
      });
    }

    const { id } = req.user;
    if (id != req.params.id) {
      return res.status(500).json({
        success: false,
        message: "You Can't Delete This User",
      });
    }
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "User Deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
});

module.exports = route;
