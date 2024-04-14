import React, { useEffect, useState } from 'react'
import moment from 'moment'
import {FaThumbsUp} from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Button, Modal, Textarea } from 'flowbite-react'
import {HiOutlineExclamationCircle } from 'react-icons/hi'



function Comment({comment, onLike, onEdit,onDelete}) {
    const {currentUser}=useSelector(state=>state.user)
    const [user,setUser]=useState({})
    const [isEditting,setIsEditting]=useState(false);
    const [content,setContent]=useState(comment.content)
    const [isDeleting,setIsDeleting]=useState(false)
    const [commentTodelete,setCommentToDelete]=useState('')
    console.log(user);
    useEffect(()=>{
        const getUser=async()=>{
            try {
                const res=await fetch(`/api/user/${comment.userId}`,{
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

    const handleEdit=async(comment,content)=>{
        setIsEditting(true);
    }

    const handleSave=async()=>{
        try {
            const res=await fetch(`/api/comment/editComment/${comment._id}`,{
                method:'PUT',
                mode:'cors',
                headers:{
                    'Content-Type':'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Access-Control-Allow-Credentials':'false',
                    'Accept':'application/json'
                },
                body:JSON.stringify({content}),
                credentials:'include'
            })
            const data=await res.json();
            if(res.ok){
                setIsEditting(false);
                onEdit(comment,content);
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    const handleDelete=()=>{
        setIsDeleting(true);
        setCommentToDelete(comment._id);
    }
    const handleDeleteComment=async()=>{
        try {
            const res=await fetch(`/api/comment/deleteComment/${comment._id}`,{
                method:'DELETE',
                mode:'cors',
                headers:{
                    'Content-Type':'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Access-Control-Allow-Credentials':'false',
                    'Accept':'application/json'
                },
                credentials:'include'
            })
            const data=await res.json();
            if(res.ok){
                setIsDeleting(false);
                onDelete(commentTodelete)
                setCommentToDelete('');
            }
            else{
                console.log(data.message);
                
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    
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
            {
                isEditting ? (
                    <>
                    <Textarea className='mb-2' rows='3' value={content} onChange={(e)=>{
                        setContent(e.target.value)
                    }}>
                    </Textarea>
                    <div className='flex justify-end gap-2 text-sm'>
                        <Button className='' type='button' size='sm' gradientDuoTone='purpleToBlue' onClick={handleSave}>
                        Save
                        </Button>
                        <Button className='' type='button' size='sm' gradientDuoTone='purpleToBlue' outline onClick={()=>setIsEditting(false)}>
                        Cancel
                        </Button>
                    </div>
                    </>

                ):
                (<p className='text-gray-500 pb-2'>{comment.content}</p>)
            }
            
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
                {
                    currentUser && (currentUser._id === comment.userId ) && (
                        <>
                        <button type='button' className='text-gray-400 hover:text-blue-500' onClick={handleEdit}>
                            Edit
                        </button>
                        <button type='button' className='text-gray-400 hover:text-red-500' onClick={handleDelete}>
                            Delete
                        </button>
                        </>
                    )
                }
            </div>
        </div>
        {
          <Modal show={isDeleting} onClose={()=> setIsDeleting(false)} popup size='md'>
            <Modal.Header>
            </Modal.Header>
            <Modal.Body>
              <div className='text-center'>
                <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'></HiOutlineExclamationCircle>
                <h3 className='mb-5 text-lg text-gray-500'>Are you sure you want to delete this Comment ?</h3>
                <div className='flex gap-32'>
                  <Button color='failure' onClick={handleDeleteComment}>Yes, I am Sure</Button>
                  <Button color='gray' onClick={()=>setIsDeleting(false)}>No, Cancel</Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        }
    </div>
  )
}

export default Comment