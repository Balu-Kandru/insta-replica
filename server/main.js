
const express= require ("express")
const mongoose = require("mongoose");
const multer=require("multer")
const postModel = require("./model/post")
const app=express()
const fs=require("fs")
const cors = require("cors");
//const url="http://localhost:3000"
//const heroku="https://insta-replica-10x.herokuapp.com"

//middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//app.use(cors());

// const allowlist = ['https://insta-replica-10x.herokuapp.com/postview'];

//     const corsOptionsDelegate = (req, callback) => {
//     let corsOptions;

//     let isDomainAllowed = allowlist.indexOf(req.header('Origin')) !== -1;
//     if (isDomainAllowed) {
//         // Enable CORS for this request
//         corsOptions = { origin: true }
//     } else {
//         // Disable CORS for this request
//         corsOptions = { origin: false }
//     }
//     callback(null, corsOptions)
// }

// app.use(cors(corsOptionsDelegate));

// var allowlist = ['https://insta-replica-10x.herokuapp.com']
// var corsOptionsDelegate = function (req, callback) {
//   var corsOptions;
//   if (allowlist.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false } // disable CORS for this request
//   }
//   callback(null, corsOptions) // callback expects two parameters: error and options
// }
//storage
const Storage=multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

const upload=multer({
    storage:Storage
}).single("testimage")






mongoose.connect("mongodb+srv://Balu_Kandru:Balu1998@instagram.anvjmni.mongodb.net/instagram?retryWrites=true&w=majority",()=>{
    console.log("connected to db")
},(err)=>{
    console.log(err)
})
app.get("/wishes",(req,res)=>{
    res.send("hello")
})

app.post("/post",(req,res)=>{
    // res.header('Access-Control-Allow-Origin', '*');

    // // Request methods you wish to allow
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // // Set to true if you need the website to include cookies in the requests sent
    // // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    upload(req,res,(err)=>{
        if(err){
            console.log(err)
        }else{
            const newImage=new postModel({
                author:req.body.name,
                location:req.body.location,
                description:req.body.description,
                date:req.body.date,
                image:{
                    data:fs.readFileSync("uploads/" +req.file.filename) ,
                    contentType:"image/png"
                }
            })
            newImage.save().then(()=>{
                res.send("success")
            }).catch((err)=>{
                console.log(err)
            })
        }
    })
})
//cors(corsOptionsDelegate)

app.get("/",(req,res)=>{
    try{
        res.header("Access-Control-Allow-Origin": "https://insta-replica-10x.herokuapp.com");
        res.header("Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept");
        postModel.find().sort({_id:-1}).then((allData)=>{
            res.status(200).json(allData)
        })
    }catch(err){
        console.log(err)
    }
})

const port = process.env.PORT || 3001;

app.listen(port, function() {
    console.log("Server started.......on",port);
});
