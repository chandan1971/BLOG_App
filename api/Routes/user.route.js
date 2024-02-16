const express=require("express")
const test=require("../controllers/user.contoller.js")

const router=express.Router()

router.get('/test',test)
//router.put('/update:userId',verifyToken,updateUser)

module.exports=router

