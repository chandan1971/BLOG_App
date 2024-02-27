import { Navbar, TextInput,Button, Dropdown, Avatar, DropdownDivider } from 'flowbite-react'
import React from 'react'
import {Link, useLocation} from "react-router-dom"
import {AiOutlineSearch} from "react-icons/ai"
import {FaMoon,FaSun} from "react-icons/fa"
import {useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice'
import { signoutUser } from '../redux/user/userSlice'


function Header() {
    const path=useLocation().pathname;
    const {currentUser}=useSelector(state=>state.user)
    const dispatch=useDispatch()
    const {theme}=useSelector(state=>state.theme)

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
    <Navbar className='border-b-2'>
        <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from from-indigo-500  via-purple-500 to-pink-500 rounded-lg text-white'>Sahand's</span>
            Blog
        </Link>
        <form >
            <TextInput
                type='text'
                placeholder='Search...'
                rightIcon={AiOutlineSearch}
                className='hidden lg:inline'
            >
            </TextInput>

        </form>
        <Button className='w-12 h-10 lg:hidden' color='gray' pill>
            <AiOutlineSearch></AiOutlineSearch>
        </Button>
        <div className='flex gap-2 md:order-2'>
            <Button className='w-12 h-10 sm:inline' color='grey' pill onClick={()=>{
                dispatch(toggleTheme())
            }}>{theme ==='light' ? <FaMoon></FaMoon>:<FaSun></FaSun>}</Button>     
            {
                currentUser ? (
                    <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                        <Avatar
                        alt='user'
                        img={currentUser.profilePicture} rounded></Avatar>
                    }>
                    <Dropdown.Header>
                        <span className='block text-sm'>@{currentUser.username}</span>
                        <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                    </Dropdown.Header>
                    <Link to={'/dashboard?tab=profile'}>
                    <Dropdown.Item>
                        Profile
                    </Dropdown.Item>
                    </Link>
                    <DropdownDivider></DropdownDivider>
                    <Dropdown.Item onClick={handleSignOutUser}>
                        SignOut
                    </Dropdown.Item>
                    </Dropdown>
                ):
                (
                    <Link to='/signUp'>
                        <Button gradientDuoTone='purpleToBlue' outline>Sign In</Button>
                    </Link>
                )
            } 
            
            <Navbar.Toggle></Navbar.Toggle>
        </div>
        <Navbar.Collapse>
            <Navbar.Link active={path==='/'}  as={'div'}>
                <Link to='/'>Home</Link>
            </Navbar.Link>
            <Navbar.Link active={path==='/about'} as={'div'}>
                <Link to='/about'>About</Link>
            </Navbar.Link>
            <Navbar.Link active={path==='/project'} as={'div'}>
                <Link to='/project'>Project</Link>
            </Navbar.Link>
            
        </Navbar.Collapse>
    </Navbar>
  )
}

export default Header