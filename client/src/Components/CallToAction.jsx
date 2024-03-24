import { Button } from 'flowbite-react'
import React from 'react'

function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl'>
        <div className='flex-1 justify-center flex flex-col '>
            <h2 className='text-2xl'>
                Want to see more of my Projects ?
            </h2>
            <p className='text-gray-500 my-2'>
                Checkout my github repositories with 20+ projects
            </p>
            <Button gradientDuoTone='purpleToPink'className='rounded-tl-xl rounded-bl-none'><a href='https://github.com/chandan1971' target='_blank' rel='noopener noreferrer' >GitHub</a></Button>
        </div >
        <div className='p-7 flex-1'>
            <img src="https://www.bleepstatic.com/content/hl-images/2022/04/08/GitHub___headpic.jpg"  />
        </div>
    </div>
  )
}

export default CallToAction