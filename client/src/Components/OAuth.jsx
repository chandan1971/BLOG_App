import React from 'react'
import { Button } from 'flowbite-react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import {GoogleAuthProvider, signInWithPopup,getAuth} from 'firebase/auth'
import { app } from '../firebase'
import { signInSuccess } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'


const OAuth = () => {
const auth=getAuth(app)
const dispatch=useDispatch()
const navigate=useNavigate()
const handleGoogleClick=async()=>{
    const provider=new GoogleAuthProvider()
    provider.setCustomParameters({
        prompt:'select_account'
    })
    try{
        const resultsFromGoogle=await signInWithPopup(auth,provider)
        const res=await fetch(`/api/auth/google`,{
            method:'POST',
            mode:'cors',
        headers:{'Content-Type':'application/json',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials':'false',
        'Accept':'application/json'
      },
            body:JSON.stringify({
                name:resultsFromGoogle.user.displayName,
                email:resultsFromGoogle.user.email,
                googlePhotoUrl:resultsFromGoogle.user.photoURL,
            }),
            credentials:'include',
        })
        const data= await res.json()
        console.log(data);
        if(res.status===200){

            dispatch(signInSuccess(data))
            navigate('/')
        }
    }
    catch(error){
        console.log(error);
    }
}
  return (
    <Button type='button'gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
        <AiFillGoogleCircle className='w-6 h-6 mr-2' ></AiFillGoogleCircle>Continue with Google
    </Button>
  )
}

export default OAuth