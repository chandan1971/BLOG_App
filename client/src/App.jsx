import React from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Projects from './pages/Projects'
import Header from './Components/Header.jsx'
import FooterCom from './Components/Footer.jsx'
import Privateroute from './Components/Privateroute.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path='/' element={<Home></Home>} ></Route>
        <Route path='/about' element={<About></About>} ></Route>
        <Route path='/signUp' element={<SignUp></SignUp>} ></Route>
        <Route path='/signIn'element={<SignIn></SignIn>} ></Route>
        <Route path='/projects' elements={<Projects></Projects>}></Route>
        <Route element={<Privateroute></Privateroute>}>
          <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
        </Route>
      </Routes>
      <FooterCom></FooterCom>
    </BrowserRouter>
  )
}
