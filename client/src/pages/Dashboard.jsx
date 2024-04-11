import React from 'react'
import { useLocation } from 'react-router-dom'
import { useState,useEffect } from 'react'
import DashSidebar from '../Components/DashSidebar.jsx'
import DashProfile from '../Components/DashProfile.jsx'
import Dashposts from '../Components/Dashposts.jsx'
import DashUsers from '../Components/DashUsers.jsx'
import DashboardComponent from '../Components/DashboardComponent.jsx'

function Dashboard() {
  const location=useLocation()
  const [tab,setTab]=useState('')
  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search)
    const tabFromUrl=urlParams.get('tab')
    if(tabFromUrl!=''){
      setTab(tabFromUrl)
    }
  },[location.search])
  return (
    <div className='min-h-screen flex flex-col md:flex-row w-full'>
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar></DashSidebar>
      </div>
        {/* profile */}
        {tab==='profile' && <DashProfile></DashProfile>}
        {/* posts */}
        {tab==='posts' && <Dashposts></Dashposts>}
        {/* Users */}
        {tab==='users' && <DashUsers></DashUsers>}
        {/* dashboardComponent */}
        {tab=='dash' && <DashboardComponent></DashboardComponent>}
    </div>
  )
}

export default Dashboard