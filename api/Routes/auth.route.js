const express=require('express')
const sigup = require('../controllers/auth.contoller.js')

const router=express.Router()

router.post('/signUp',sigup)

module.exports=router


