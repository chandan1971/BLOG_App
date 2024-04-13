import React, { useEffect } from 'react'
import {useSelector} from 'react-redux'
import { useState } from 'react'
import {  Table,Modal,Button } from 'flowbite-react'
import { Link } from 'react-router-dom'
import {HiOutlineExclamationCircle} from 'react-icons/hi'

function Dashposts() {
  const {currentUser}=useSelector((state=>state.user))
  const [userPosts,setUserPosts]=useState([])
  const [showMore,setShowMore]=useState(true);
  const [showModel,setShowModel]=useState(false)
  const [postIdToDelete,setPostIdToDelete]=useState('')
  useEffect(()=>{
    const fetchPosts=async()=>{
      try {
        const res=await fetch(`/api/post/getposts?userId=${currentUser._id}`,{
          method:'GET',
        })
        const data=await res.json()
        if(res.ok){
          setUserPosts(data.posts)
          if(data.posts.length<9){
            setShowMore(false);
          }
          
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    if(currentUser.isAdmin){
       fetchPosts()
    }
  },[currentUser._id])
  const handleShowMore=async ()=>{
    const startIndex=userPosts.length;
    try {
      const res=await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`)
      const data=await res.json();
      if(res.ok){
        setUserPosts((prev)=>[...prev,...data.posts]);
        if(data.posts.length<9){
          setShowMore(false);
        }
      }
      
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleDeletePost=async()=>{
    setShowModel(false);
    try {
      const res=await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,{
        method:'DELETE',
        mode:'cors',
        credentials:'include',
        headers:{'Content-Type':'application/json',
          'Access-Control-Allow-Origin':'*',
          'Access-Control-Allow-Credentials':'false',
          'Accept':'application/json'
        }
      })
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {
        currentUser.isAdmin && userPosts && userPosts.length>0 ?(
          <>
            <Table hoverable className='shadow-md'>
              <Table.Head>
                <Table.HeadCell>Date Updated</Table.HeadCell>
                <Table.HeadCell>Post Image</Table.HeadCell>
                <Table.HeadCell>Post Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell>
                  <span>Edit</span>
                </Table.HeadCell>
              </Table.Head>
              {userPosts.map((post)=>(
                  <Table.Body className='divide-y' key={post._id}>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`}>
                        <img
                          src={post.image}
                          alt={post.title}
                          className='w-20 h-10 object-cover bg-gray-500'
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className='font-medium text-gray-900 dark:text-white'
                        to={`/post/${post.slug}`}
                      >
                        {post.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModel(true);
                          setPostIdToDelete(post._id);
                        }}
                        className='font-medium text-red-500 hover:underline cursor-pointer'
                      >
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className='text-teal-500 hover:underline'
                        to={`/update-post/${post._id}`}
                      >
                        <span>Edit</span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
            {
              showMore && (
                <button onClick={handleShowMore} className='w-full text-teal-500 text-sm py-7'>
                  Show More
                </button>
              )
            }
          </>
        ):(
          <p>You have no posts yet</p>
        )
      }
      {
          <Modal show={showModel} onClose={()=> setShowModel(false)} popup size='md'>
            <Modal.Header>
            </Modal.Header>
            <Modal.Body>
              <div className='text-center'>
                <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'></HiOutlineExclamationCircle>
                <h3 className='mb-5 text-lg text-gray-500'>Are you sure you want to delete your post ?</h3>
                <div className='flex gap-32'>
                  <Button color='failure' onClick={handleDeletePost}>Yes, I am Sure</Button>
                  <Button color='gray' onClick={()=>setShowModel(false)}>No, Cancel</Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        }
    </div>
  )
}

export default Dashposts