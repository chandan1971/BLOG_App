import React,{useEffect,useState} from 'react'
import {Sidebar} from 'flowbite-react'
import {HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiUser} from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'
import { signoutUser } from '../redux/user/userSlice'
import {useDispatch, useSelector } from 'react-redux'


function DashSidebar() {
    const location=useLocation()
    const [tab,setTab]=useState('')
    const {currentUser}=useSelector(state=>state.user)
    
    useEffect(()=>{
        const urlParams=new URLSearchParams(location.search)
        const tabFromUrl=urlParams.get('tab')
        if(tabFromUrl!=''){
        setTab(tabFromUrl)
        }
    },[location.search])
    const dispatch=useDispatch();

    const handleSignOutUser=async ()=>{
        try {
          const res=await fetch(`http://localhost:3000/api/user/signout`,{
            method:'POST',
            mode:'cors',
            credentials: 'include',
            headers:{'Content-Type':'application/json',
            'Access-Control-Allow-Origin':'http://localhost:3000',
            'Access-Control-Allow-Credentials':'false',
            'Accept':'application/json'
          }
          })
          if(res.status==200){
            dispatch(signoutUser())
          }
        } catch (error) {
          console.log(error);
        }
        
      }
  return (
    <Sidebar className='w-full '>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
                <Link to='/dashboard?tab=profile'>
                <Sidebar.Item active={tab==='profile'} icon={HiUser} label={currentUser.isAdmin ? "Admin":"User"} labelColor="dark" as='div'>
                    Profile
                </Sidebar.Item>
                </Link>
                {
                  currentUser.isAdmin &&(
                    <Link to='/dashboard?tab=posts'>
                      <Sidebar.Item active={tab==='posts'} icon={HiDocumentText} as='div'>
                          Posts
                      </Sidebar.Item>
                    </Link>
                  )
                }
                {
                  currentUser.isAdmin &&(
                    <Link to='/dashboard?tab=users'>
                      <Sidebar.Item active={tab==='users'} icon={HiOutlineUserGroup} as='div'>
                          Users
                      </Sidebar.Item>
                    </Link>
                  )
                }
                <Sidebar.Item onClick={handleSignOutUser}  icon={HiArrowSmRight} className='cursor-pointer'  >
                    SignOut
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar