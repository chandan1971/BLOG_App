const express=require('express')
const mongoose=require('mongoose')
require('dotenv').config()
const userRoutes=require("./Routes/user.route.js");
const authRoutes=require("./Routes/auth.route.js")
const postRoutes=require("./Routes/post.route.js")
const commentRoutes=require('./Routes/comment.route.js')
const cors=require('cors')
const cookieParser=require('cookie-parser')
const path =require('path');



const app=express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}));
app.use(express.json())
app.use(cookieParser())

app.listen(3000,()=>{
    console.log(`Server is running on port 3000`);
})


mongoose
.connect(process.env.MONGO_URI)
.then(()=>{
    console.log(`MongoDb Connected`);
})
.catch((err)=>{
    console.log(err);
})

app.use('/api/user',userRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/post',postRoutes);
app.use('/api/comment',commentRoutes);

__dirname=path.resolve()
console.log(__dirname);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,'client', 'dist', 'index.html'));
});


app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message=err.message || `Internal Server Error`;
    res.status(statusCode).json({
        success:false,
        statusCode,
        message
    });
});


