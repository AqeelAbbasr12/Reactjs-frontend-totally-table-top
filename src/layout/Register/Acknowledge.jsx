import React from 'react'
import Navbar from '../../components/Navbar'
import { TiTick } from 'react-icons/ti'
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'

const Acknowledge = () => {
  const nav = useNavigate()
  return (
    <div className='flex flex-col w-[100vw] h-[100vh]'>
        <Navbar />
        <div className='bg-darkBlue md:px-[2rem] flex-1 h-[90vh] md:h-[86rem] w-[100vw] flex justify-center items-center flex-col'>
            <div className='w-[5rem] h-[5rem] rounded-full flex justify-center items-center bg-lightPeach'>
              <TiTick className='text-6xl text-red'/>
            </div>
            <h1 className='mt-3 text-white font-semibold'>Thanks for creating an account</h1>
            <p className='text-white mt-2'>We verify all new accounts to keep our community safe.</p>
            <p className='text-white mt-1'>Check your email for a link to verify your account.</p>
            <Button onClickFunc={()=>nav("/")} title={"Login"} className={"w-[7rem] h-[2.3rem] bg-lightOrange text-white rounded-md mt-3"}/>
        </div>
    </div>
  )
}

export default Acknowledge
