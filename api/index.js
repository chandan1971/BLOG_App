const express=require('express')
const mongoose=require('mongoose')
require('dotenv').config()
const userRoutes=require("./Routes/user.route.js");

const app=express();

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



