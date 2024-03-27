import React, { useEffect, useState } from 'react'
import moment from 'moment'
import {FaThumbsUp} from 'react-icons/fa'
import { useSelector } from 'react-redux'

function Comment({comment, onLike}) {
    const {currentUser}=useSelector(state=>state.user)
    const [user,setUser]=useState({})
    console.log(user);
    useEffect(()=>{
        const getUser=async()=>{
            try {
                const res=await fetch(`http://localhost:3000/api/user/${comment.userId}`,{
                    method:'GET',
                })
                const data=await res.json();
                if(res.ok){
                    setUser(data);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        getUser();
    },[comment])
    
  return (
    <div className='flex  p-9 border-b dark:border-gray-600 text-sm'>
        <div className='flex-shrink-0 mr-3'>
            <img src={user.profilePicture} alt={user.username} className='w-10 h-10 rounded-full bg-gray-200'/>
        </div>
        <div className='flex-1'>
            <div className='flex items-center mb-1'>
                <span className='font-bold mr-1 text-xs turncate'>{user ? `@${user.username}`:"anonymous user"}</span>
                <span className='text-gray-500 text-xs'>
                    {moment(comment.createdAt).fromNow()}
                </span>
            </div>
            <p className='text-gray-500 pb-2'>{comment.content}</p>
            <div className='flex items-center gap-2 pt-2 text-xs border-t dark:border-gray-700 max-w-fit '>
                <button className={`text-gray-400 hover:text-blue-500 ${
                    currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'
                }`} type='button' onClick={()=>{
                    onLike(comment._id)
                }}>
                    <FaThumbsUp className='text-sm'></FaThumbsUp>
                </button>
                <p className='text-gray-400'>
                    {
                        comment.numberofLikes >0 && comment.numberofLikes+ " "+(comment.numberofLikes===1 ? 'Like':"Likes")
                    }
                </p>
            </div>
        </div>
    </div>
  )
}

export default Comment