const express=require('express')
const signUp = require('../controllers/auth.contoller.js')

const router=express.Router()

router.post('/signUp',signUp.signup)
router.post('/signin',signUp.signin)
router.post('/google',signUp.google)

module.exports=router


