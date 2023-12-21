const express = require("express");
require("dotenv").config();
const cors = require("cors")
const mongoose = require("mongoose")

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const app = express();
const multer = require("multer")
const uploadMiddleware = multer({dest:"upload/"})
const fs = require("fs")
app.use(cors({credentials:true, origin: "http://localhost:5173"}));
app.use(express.json());
const secret = 'your_secret_key_here'; 

//data
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI).then((ok , err)=>{
    if(ok){
        return console.log("DB conntected")
    }
    return console.log(err)
})

app.get("/" , (req,res) => {
    res.send("<h1>This is a Restful API for SE NPRU Blog</h1>")
})


//User reg
const salt = bcrypt.genSaltSync(10);
const User = require('./models/User')
app.post("/register", async (req,res)=> {
    const {username, password} = req.body;
    try {
        const userDoc = await User.create({
            username,
            password:bcrypt.hashSync(password, salt)
        })
        res.json(userDoc);
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
})


//User login 
app.post("/login", async (req,res)=> {
    const {username, password} = req.body;
   const userDoc = await User.findOne({username})
   const isMatchedPassword = bcrypt.compareSync(password,userDoc.password)
   if(isMatchedPassword){
    jwt.sign({username, id: userDoc}, secret, {},(err, token) =>{
   if(err) throw err;
   res.cookie("token" ,token).json({
    id:userDoc.id,
    username,
   })
     })
   }else {
    res.status(400).json("wrong credentials")
   }

})
//log out
app.post("/logout" ,(req,res) =>{
    res.cookie("token","").json("ok")
})




//creat
app.post("/post",uploadMiddleware.single("file"), async (req,res)=> {
 const {originname: originalname, path} = req.file;
 const parts = originalname.split(".");
 const ext = parts[parts.length - 1 ];
 const newPath = path + "." + ext;
 fs.renameSync(path,newPath);
 const {token} = req.cookies;
 jwt.verify(token, secret,async (err,info) =>{
    if(err) throw err;
    const {title,summary,connect} = req.body;
    const postDoc = await Post.create({
        title,
        summary,
        connect,
        cover:newPath,
        author:info.id,
    })
    res.json(postDoc)
 })

})


///get all post








const PORT = process.env.PORT;
app.listen(PORT,() => {
    console.log("Server is runnig on http://localhost" + PORT)
})
