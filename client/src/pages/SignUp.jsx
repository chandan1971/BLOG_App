import { Alert, Button, Label, Spinner, TextInput} from 'flowbite-react'
import {Link,useNavigate} from "react-router-dom"
import React, { useState } from 'react'
import OAuth from '../Components/OAuth';

function SignUp() {
  const [formData,setFormData]=useState({});
  const[erroMessage,setErrorMessage]=useState('');
  const[loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value.trim()})
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!formData.username || !formData.email || !formData.password){
      return setErrorMessage(`Please Fillout All Fields`)
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res=await fetch(`/api/auth/signUp`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(formData),
      })
      const data=await res.json(); 
      setLoading(false);
      console.log(data.success);
      if(data.success===true){
        navigate('/signIn')
      }
      else{
        setErrorMessage('Signup Failed !')
      }
    } 
    catch (err) {
      setLoading(false);
    }
  }
  console.log(formData);
  return (
    <div className='min-h-screen mt-20 '>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        <div className='flex-1'>
            <Link to="/" className='font-bold dark:text-white text-4xl'>
                  <span className='px-2 py-1 bg-gradient-to-r from from-indigo-500  via-purple-500 to-pink-500 rounded-lg text-white'>Chandan's</span>
                  Blog
            </Link>
            <p className='text-sm mt-5 '>
              This is a demo project. You can Sign Up with your email and password.
              Or with Google.
            </p>
        </div>
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your Username' >
              </Label>
              <TextInput type='text' placeholder='Username' id="username" onChange={handleChange}></TextInput>
            </div>
            <div>
              <Label value='Your Email' >
              </Label>
              <TextInput type='email' placeholder='name@company.com' id="email" onChange={handleChange}></TextInput>
            </div>
            <div>
              <Label value='Your Password' >
              </Label>
              <TextInput type='password' placeholder='Password' id="password" onChange={handleChange}></TextInput>
            </div>
            <Button gradientDuoTone="purpleToPink" type='submit' disabled={loading}>
              {
                loading?(
                  <>
                  <Spinner size='sm'></Spinner>
                  <span>Loading...</span>
                  </>
                ):'SignUp'
              }
            </Button>
            <OAuth></OAuth>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Already Have an Account ?</span>
            <Link to={'/signIn'} className='text-blue-500'>SignIn</Link>
          </div>
          {
            erroMessage && (
              <Alert className='mt-5' color="failure">
                {erroMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default SignUp