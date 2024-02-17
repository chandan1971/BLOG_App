const express=require("express")
const verifyToken=require('../utils/verifyUser.js')
const controllers=require('../controllers/user.contoller.js')

const router=express.Router()

router.get('/test',controllers.test)
router.put('/update/:userId',verifyToken,controllers.updateUser)

module.exports=router

