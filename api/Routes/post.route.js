const express=require('express');
const verifyToken=require('../utils/verifyUser')
const posts=require("../controllers/post.controller")

const router=express.Router();

router.post('/create',verifyToken,posts.create)

module.exports=router