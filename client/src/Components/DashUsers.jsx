import React, { useEffect } from 'react'
import {useSelector} from 'react-redux'
import { useState } from 'react'
import {  Table,Modal,Button } from 'flowbite-react'
import { Link } from 'react-router-dom'
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import {FaCheck, FaTimes} from 'react-icons/fa'

function DashUsers() {
  const {currentUser}=useSelector((state=>state.user))
  const [users,setUsers]=useState([])
  const [showMore,setShowMore]=useState(true);
  const [showModel,setShowModel]=useState(false)
  const [userIdToDelete,setUserIdToDelete]=useState('')
  useEffect(()=>{
    const fetchUsers=async()=>{
      try {
        const res=await fetch(`http://localhost:3000/api/user/getusers?userId=${currentUser._id}`,{
          method:'GET',
          mode:'cors',
          credentials:'include',
          headers:{
            'Content-Type':'application/json',
          'Access-Control-Allow-Origin':'http://localhost:3000',
          'Access-Control-Allow-Credentials':'false',
          'Accept':'application/json'
          }
        })
        const data=await res.json()
        if(res.ok){
          setUsers(data.users)
          if(data.users.length<9){
            setShowMore(false);
          }
          
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    if(currentUser.isAdmin){
       fetchUsers()
    }
  },[currentUser._id])
  const handleShowMore=async ()=>{
    const startIndex=users.length;
    try {
      const res=await fetch(`http://localhost:3000/api/post/getposts?startIndex=${startIndex}`)
      const data=await res.json();
      if(res.ok){
        setUsers((prev)=>[...prev,...data.users]);
        if(data.users.length<9){
          setShowMore(false);
        }
      }
      
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleDeleteUser=async()=>{
    setShowModel(false);
    try {
      const res=await fetch(`http://localhost:3000/api/user/delete/${userIdToDelete}`,{
        method:'DELETE',
        mode:'cors',
        credentials:'include',
        headers:{'Content-Type':'application/json',
          'Access-Control-Allow-Origin':'http://localhost:3000',
          'Access-Control-Allow-Credentials':'false',
          'Accept':'application/json'
        }
      })
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUsers((prev) =>
          prev.filter((user) => user._id !== userIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {
        currentUser.isAdmin && users && users.length>0 ?(
          <>
            <Table hoverable className='shadow-md'>
              <Table.Head>
                <Table.HeadCell>Date created</Table.HeadCell>
                <Table.HeadCell>User Image</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Admin</Table.HeadCell>
                <Table.HeadCell>
                  <span>Delete</span>
                </Table.HeadCell>
              </Table.Head>
              {users.map((user)=>(
                  <Table.Body className='divide-y' key={user._id}>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                        <img
                          src={user.profilePicture}
                          alt={user.username}
                          className='w-10 h-10 object-cover bg-gray-500 rounded-full'
                        />
                    </Table.Cell>
                    <Table.Cell>
                        {user.username}
                    </Table.Cell>
                    <Table.Cell>
                        {user.email}
                    </Table.Cell>
                    <Table.Cell>{user.isAdmin ? (<FaCheck className='text-teal-500'></FaCheck>):(<FaTimes className='text-red-500'></FaTimes>)}</Table.Cell>
                    <Table.Cell >
                      <Button
                        onClick={() => {
                          setShowModel(true);
                          setUserIdToDelete(user._id);
                        }}
                        color='failure'
                        className='font-medium hover:underline cursor-pointer'
                        disabled={user.isAdmin}>
                        Delete
                      </Button>
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
          <p>You have no Users yet</p>
        )
      }
      {
          <Modal show={showModel} onClose={()=> setShowModel(false)} popup size='md'>
            <Modal.Header>
            </Modal.Header>
            <Modal.Body>
              <div className='text-center'>
                <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'></HiOutlineExclamationCircle>
                <h3 className='mb-5 text-lg text-gray-500'>Are you sure you want to delete this user ?</h3>
                <div className='flex gap-32'>
                  <Button color='failure' onClick={handleDeleteUser}>Yes, I am Sure</Button>
                  <Button color='gray' onClick={()=>setShowModel(false)}>No, Cancel</Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        }
    </div>
  )
}

export default DashUsers