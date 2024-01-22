import React from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Projects from './pages/Projects'
import Header from './Components/Header'

export default function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path='/' element={<Home></Home>} ></Route>
        <Route path='/about' element={<About></About>} ></Route>
        <Route path='/sign-up' element={<SignUp></SignUp>} ></Route>
        <Route path='/sign-in'element={<SignIn></SignIn>} ></Route>
        <Route path='/projects' elements={<Projects></Projects>}></Route>
      </Routes>
    </BrowserRouter>
  )
}
