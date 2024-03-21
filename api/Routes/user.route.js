const express=require('express')
const verifyToken=require('../utils/verifyUser.js')
const {updateUser,deleteUser,signout,getusers,test}=require('../controllers/user.contoller.js')


const router=express.Router()

router.get('/test',test)
router.put('/update/:userId',verifyToken,updateUser)
router.delete('/delete/:userId',verifyToken,deleteUser)
router.post('/signout',signout);
router.get('/getusers',verifyToken,getusers) 

module.exports=router

