const mongoose = require("mongoose");

async function connectDB(){
    try {
        await mongoose.connect("mongodb://localhost:27017/weeeee");
        console.log("Db connected successfully")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB