import { Button } from 'flowbite-react'
import React from 'react'
import { BsGithub } from 'react-icons/bs'

function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl'>
        <div className='flex-1 justify-center flex flex-col '>
            <h2 className='text-2xl'>
                Want to see more of my Projects...
            </h2>
            <p className='text-gray-500 my-2'>
                Checkout my github repositories with 20+ interesting projects
            </p>
            <Button gradientDuoTone='purpleToPink'className='rounded-tl-xl rounded-bl-none'><a href='https://github.com/chandan1971' target='_blank' rel='noopener noreferrer' ><BsGithub></BsGithub> GitHub</a></Button>
        </div >
        <div className='p-7 flex-1'>
            <img src="https://img.freepik.com/free-photo/cute-cat-with-computer_23-2150932178.jpg?t=st=1713000463~exp=1713004063~hmac=63a1b503cd8f537e4fd90a85a612685e6c4e8e1873d943f9e0ff35a1bc4d0d46&w=996"  />
        </div>
    </div>
  )
}

export default CallToAction