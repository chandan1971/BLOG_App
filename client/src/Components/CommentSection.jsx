import { Alert, Button, Textarea } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Comment from './Comment'

function CommentSection({postId}) {
    const {currentUser}=useSelector(state=>state.user)
    const [comment,setComment]=useState('')
    const [commentError,setCommentError]=useState(null)
    const [comments,setComments]=useState([])
    const navigate=useNavigate();
    useEffect(()=>{
        const getComments=async()=>{
            try {
                const res=await fetch(`/api/comment/getPostComment/${postId}`,{
                    method:'GET',
                })
                const data=await res.json();
                if(res.ok){
                    console.log(data);
                    setComments(data);
                }
                else{
                    console.log(data.message);
                }

            } catch (error) {
                console.log(error.message);
            }
        }
        getComments();
    },[postId])

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setCommentError(null);
        try {
            const res=await fetch(`/api/comment/create`,{
        method:'POST',
        mode:'cors',
        headers:{'Content-Type':'application/json',
        'Access-Control-Allow-Origin':'*',
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
                setCommentError(null);
                setComments([data,...comments]);
            }
        } catch (error) {
            console.log(error);
            setCommentError(error);
        }
    }

    const handleLike=async(commentId)=>{
        try {
            if(!currentUser){
                navigate('/signIn')
            }
            const res=await fetch(`/api/comment/likeComment/${commentId}`,{
                method:'PUT',
                mode:'cors',
                headers:{
                    'Content-Type':'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Access-Control-Allow-Credentials':'false',
                    'Accept':'application/json'
                },
                credentials:'include',
            })
            const data=await res.json();
            if(res.ok){
                setComments(comments.map((comment)=>
                    comment._id===commentId ? {
                        ...comment,
                        likes:data.likes,
                        numberofLikes:data.numberofLikes,
                    } :comment
                ));
            }
            else{
                console.log(data.message);
            }
        } catch (error) {
            console.log(data.message);
        }
    }

    const handleEdit=async (comment,editedContent)=>{
        setComments(
            comments.map((c)=>
            c._id=== comment._id ? {...c, content:editedContent}:comment)
        )
    }
    const handleDelete=async(comment)=>{
        setComments(comments.filter((c)=> c._id!==comment))
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
        {
            comments.length===0 ? (
                <p className='text-sm my-5'>No Comments yet !</p>
            ):
            (
                <>
                <div className='text-sm my-5 flex items-center gap-1'>
                    <p>Comments</p>
                    <div className='border border-gray-500 py-1 px-2 rounded-sm'>
                        <p>{comments.length}</p>
                    </div>
                </div>
                {
                comments.map(comment=>(
                    <Comment key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEdit} onDelete={handleDelete}></Comment>
                ))
                }
                </>
                
            )
        }
    </div>
  )
}

export default CommentSection