const express=require('express')
const verifyToken=require('../utils/verifyUser.js')
const silly=require('../controllers/user.contoller.js')

const router=express.Router()

router.get('/test',silly.test)
router.put('/update/:userId',verifyToken,silly.updateUser)
router.delete('/delete/:userId',verifyToken,silly.deleteUser)

module.exports=router

