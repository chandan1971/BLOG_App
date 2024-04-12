import React from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Project from './pages/Project.jsx'
import Header from './Components/Header.jsx'
import FooterCom from './Components/Footer.jsx'
import Privateroute from './Components/Privateroute.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CreatePost from './pages/CreatePost.jsx'
import OnlyAdminPrivateRoute from './Components/OnlyAdminPrivateRoute.jsx'
import UpdatePost from './pages/UpdatePost.jsx'
import PostPage from './pages/PostPage.jsx'
import ScrollToTop from './Components/ScrollToTop.jsx'
import Search from './pages/Search.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop></ScrollToTop>
      <Header></Header>
      <Routes>
        <Route path='/' element={<Home></Home>} ></Route>
        <Route path='/about' element={<About></About>} ></Route>
        <Route path='/signUp' element={<SignUp></SignUp>} ></Route>
        <Route path='/search'element={<Search></Search>} ></Route>
        <Route path='/signIn'element={<SignIn></SignIn>} ></Route>
        <Route path='/project' element={<Project></Project>}></Route>
        <Route element={<Privateroute></Privateroute>}>
          <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
        </Route>
        <Route element={<OnlyAdminPrivateRoute></OnlyAdminPrivateRoute>}>
          <Route path='/create-post' element={<CreatePost></CreatePost>}></Route>
          <Route path='/update-post/:postId' element={<UpdatePost></UpdatePost>}></Route>
        </Route>
      <Route path='/post/:postsSlug' element={<PostPage></PostPage>}></Route>
      </Routes>
      <FooterCom></FooterCom>
    </BrowserRouter>
  )
}