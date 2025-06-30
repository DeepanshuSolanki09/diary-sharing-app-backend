const createjwt = require("../config/jwtgenerate");
const User = require("../models/userschema");
const bcrypt = require("bcrypt");
const cloudinary = require("../config/cloudninary.js");
const fs = require("fs")

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name) {
      return res.status(500).json({
        success: false,
        message: "Please Enter The Name",
      });
    }
    if (!email) {
      return res.status(500).json({
        success: false,
        message: "Please Enter The Email",
      });
    }
    if (!password) {
      return res.status(500).json({
        success: false,
        message: "Please Enter The Password",
      });
    }

    const x = await User.findOne({ email });
    if (x != null) {
      return res.status(500).json({
        success: false,
        message: "User Already exist with the given Email",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a profile picture",
      });
    }
    const result = await cloudinary.uploader.upload(req.file.path,{
      folder: "diaryApp/users",
    })

    fs.unlinkSync(req.file.path);

    const z = await bcrypt.hash(password, 10);
    const y = await User.create({
      name,
      email,
      password: z,
      profilePicture: result.secure_url,
    });
    return res.status(200).json({
      success: true,
      message: "User Created With The Given Details",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error",
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(500).json({
        success: false,
        message: "Please Enter The Email",
      });
    }
    if (!password) {
      return res.status(500).json({
        success: false,
        message: "Please Enter The Password",
      });
    }
    const x = await User.findOne({ email });
    if (!x) {
      return res.status(500).json({
        success: false,
        message: "User Don't exist with the given Email",
      });
    }
    const y = await bcrypt.compare(password, x.password);
    if (y != true) {
      return res.status(500).json({
        success: false,
        message: "Please Enter The Correct Password",
      });
    }
    const token = createjwt({ id: x._id });
    return res.status(200).json({
      success: true,
      message: "User Logged In With The Given Details",
      token,
      user: {
        name: x.name,
        email: x.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error",
    });
  }
}

async function loginme(req, res) {
  try {
    const { id } = req.user;
    const x = await User.findById(id);
    return res.status(200).json({
      success: true,
      message: "Details Are Fetched Successfully",
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
      message: "error",
    });
  }
}

async function logout(req, res) {
  try {
    return res.status(200).json({
      success: true,
      message: "User Logged Out Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error",
    });
  }
}

module.exports = { register, login, loginme, logout };
