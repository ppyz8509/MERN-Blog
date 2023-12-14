const express = require("express");
require("dotenv").config();
const cors = require("cors")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const app = express();

app.use(cors({credentials:true, origin: "http://localhost:5173"}));
app.use(express.json());


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



const PORT = process.env.PORT;
app.listen(PORT,() => {
    console.log("Server is runnig on http://localhost" + PORT)
})
