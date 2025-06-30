const express = require("express");
const { register, login, loginme, logout } = require("../controllers/authcontrollers");
const authm = require("../config/authm");
const upload = require("../config/multer");
const route = express.Router();

route.post("/auth/register" ,upload.single("profile"), register)

route.post("/auth/login" , login)

route.get("/auth/login/me" , authm , loginme)

route.post("/auth/logout" ,authm, logout)

module.exports = route