const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");
const Post = require("./models/Post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "upload/" });
const fs = require("fs");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());

//set static(public)
app.use("/upload", express.static(__dirname + "/upload"));

//database Connection
const MONGODB_URI = process.env.MONGODB_URI;
console.log(MONGODB_URI);
mongoose.connect(MONGODB_URI);

app.get("/", (req, res) => {
  res.send("<h1>This is a RESFUL");
});

//User Register
const salt = bcrypt.genSaltSync(10);
app.post("/register", async (req, res) => {
  const { username, password } = req.body; // สลายโครงสร้าง
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

//Login
const secret = process.env.SECRET;
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username }); //เอา username ไปหาข้อมูลจากฐานข้อมูล
  const isMatchedPassword = bcrypt.compareSync(password, userDoc.password); //เช็ค พาส ที่ได้จากฟอร์ม และในฐานข้อมูลว่าเหมือนกันไหม
  if (isMatchedPassword) {
    //logged in
    jwt.sign({ username, id: userDoc }, secret, {}, (err, token) => {
      if (err) throw err;
      //save data in cookie
      res.cookie("token", token).json({
        id: userDoc.id,
        username,
      });
    });
  } else {
    res.status(400).json("wrong credentials");
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

//createPost
app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  console.log(req.body);
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1]; //ตำแหน่งสุดท้าย = n-1 เสมอ
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);
  const { token } = req.cookies || [];
  jwt.verify(token, secret, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
});
app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createAt: -1 })
      .limit(20)
  );
});
app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

app.get("/post/:id", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1]; //ตำแหน่งสุดท้าย = n-1 เสมอ
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }
  const {token} = req.cookie;
  jwt.verify(token, secret, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    res.json(postDoc);
  });
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("server is running 0n http://localhost:" + PORT);
});
