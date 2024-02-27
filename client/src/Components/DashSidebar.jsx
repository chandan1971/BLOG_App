import React,{useEffect,useState} from 'react'
import {Sidebar} from 'flowbite-react'
import {HiArrowSmRight, HiUser} from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'
import { signoutUser } from '../redux/user/userSlice'
import {useDispatch } from 'react-redux'

function DashSidebar() {
    const location=useLocation()
    const [tab,setTab]=useState('')
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
            <Sidebar.ItemGroup>
                <Link to='/dashboard?tab=profile'>
                <Sidebar.Item active={tab==='profile'} icon={HiUser} label={"User"} labelColor="dark" as='div'>
                    Profile
                </Sidebar.Item>
                </Link>
                <Sidebar.Item onClick={handleSignOutUser}  icon={HiArrowSmRight} className='cursor-pointer'  >
                    SignOut
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar