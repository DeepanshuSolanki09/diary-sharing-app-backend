const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/connectdb");
const auth = require("./routes/auth");
const comment = require("./routes/comment");
const diary = require("./routes/diary");
const user = require("./routes/user");


app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use("/api/v1",auth);
app.use("/api/v1",comment);
app.use("/api/v1",diary);
app.use("/api/v1",user);


app.listen(4000, () => {
    console.log("server started");
    connectDB();
})