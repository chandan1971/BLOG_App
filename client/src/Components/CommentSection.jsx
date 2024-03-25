import { Alert, Button, Textarea } from 'flowbite-react'
import React, { useState } from 'react'
import {useSelector} from 'react-redux'
import { Link } from 'react-router-dom'

function CommentSection({postId}) {
    const {currentUser}=useSelector(state=>state.user)
    const [comment,setComment]=useState('')
    const [commentError,setCommentError]=useState(null)
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
            const res=await fetch('http://localhost:3000/api/comment/create',{
        method:'POST',
        mode:'cors',
        headers:{'Content-Type':'application/json',
        'Access-Control-Allow-Origin':'http://localhost:3000',
        'Access-Control-Allow-Credentials':'false',
        'Accept':'application/json'
      },
        body:JSON.stringify({
            content:comment,
            postId,
            userId:currentUser._id,
        }),
        credentials:'include',
      })
            const data= await res.json();
            if(res.ok){
                setComment('');
            }
        } catch (error) {
            console.log(error);
            setCommentError(error);
        }
    }
  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
        {
            currentUser ? 
            (
                <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                    <p>Signed in as :</p>
                    <img  className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture} alt="" />
                    <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-600 hover:underline'>
                        @{currentUser.username}
                    </Link>
                </div>
            ):
            (
                <div className='text-sm text-teal-500 my-5 flex gap-1'>
                    You must be signed in to comment.
                    <Link to={'/sign-in'} className='text-blue-500 hover:underline'>
                        Login
                    </Link>
                </div>
            )
        }
        {
            currentUser && (
                <form className='border border-teal-500 rounded-md p-3 ' onSubmit={handleSubmit}>
                    <Textarea placeholder='Add a Comment...' rows='3' maxLength='200' onChange={(e)=>{
                        setComment(e.target.value)
                    }} value={comment}></Textarea>
                    <div className='flex justify-between items-center mt-5'>
                        <p className='text-gray-500 text-xs'>{200-comment.length} charachters remaining</p>
                    <Button outline gradientDuoTone='purpleToBlue' type='submit'>
                        Submit
                    </Button>
                    </div>
                {
                    commentError && (
                        <Alert color='failure' className='mt-5'>
                            {commentError}
                        </Alert>
                    )
                }
                </form>
            )
        }
    </div>
  )
}

export default CommentSection