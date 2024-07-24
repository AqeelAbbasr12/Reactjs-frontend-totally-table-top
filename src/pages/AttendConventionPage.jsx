import React from 'react'
import Navbar from '../components/Navbar'
import ConventionImage from '../assets/convention.jpeg'
import { BsFillCaretDownFill } from 'react-icons/bs'
import { FaLocationDot, FaMessage } from 'react-icons/fa6'
import { FaCalendarAlt, FaUser } from 'react-icons/fa'
import { RiExternalLinkLine } from "react-icons/ri";
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import { TiTick } from "react-icons/ti";
import { FaQuestion } from "react-icons/fa";
import { ImCross } from 'react-icons/im'

const AttendConventionPage = () => {
  const nav = useNavigate()
  return (
    <div className='flex flex-col w-[100vw] h-[100vh] overflow-y-auto bg-darkBlue '>
      <Navbar type={"verified"} />

      <div className='bg-black md:px-[2rem] px-[1rem] flex items-center gap-x-4 py-3 cursor-pointer '>
        <BsFillCaretDownFill onClick={() => nav(`/single/conv/1`)} className=' text-lightOrange rotate-90' />
        <span onClick={() => nav(`/single/conv/1`)} className='text-white'>Back to UK game Expo</span>
      </div>

      <div className='md:px-[2rem] px-[1rem] bg-darkBlue h-[fit] w-[100vw] flex justify-center items-center py-10'>

        <div className='w-[40rem]  rounded-md bg-[#0d2539] p-3 flex flex-col justify-center md:mt-0 mt-4'>
          <div className='flex justify-center items-center my-3'>
            <img src={ConventionImage} alt="" className='w-[10rem] h-[10rem] rounded-full' />
          </div>
          <p className='text-white text-3xl font-semibold text-center mb-2'>Attending UK game Expo</p>
          <p className='text-white text-center mb-2'>Choose the days you’ll be attending UK Games Expo. Your friends will be updated with your attendance.</p>

          <div className='flex justify-between items-center mb-3'>
            <p className='text-white'>Friday 31st May 2024</p>
            <div className='flex justify-between px-2 items-center w-[15rem] h-[2.3rem] ml-3 rounded-md border border-gray-300 cursor-pointer'>
            <p className='text-white flex items-center gap-x-3'><TiTick/>Attending</p>
            <BsFillCaretDownFill className='text-white ' />
            </div>
          </div>

          <div className='flex justify-between items-center mb-3'>
            <p className='text-white'>Saturday 1nd June 2024</p>
            <div className='flex justify-between px-2 items-center w-[15rem] h-[2.3rem] ml-3 rounded-md border border-gray-300 cursor-pointer'>
              <p className='text-white flex items-center gap-x-3'><FaQuestion/> Maybe attending</p>
              <BsFillCaretDownFill className='text-white ' />
            </div>
          </div>

          <div className='flex justify-between items-center mb-3'>
            <p className='text-white'>Sunday 2nd June 2024</p>
            <div className='flex justify-between px-2 items-center w-[15rem] h-[2.3rem] ml-3 rounded-md border border-gray-300 cursor-pointer'>
            <p className='text-white flex items-center gap-x-3'><ImCross/>Not attending</p>
            <BsFillCaretDownFill className='text-white ' />
            </div>
          </div>

          <div className='flex justify-center items-center mt-2'>
            <Button onClickFunc={()=>nav(`/single/conv/1`)} title={"Save attendance"} className={"w-[12rem] h-[2.3rem] rounded-md text-white bg-lightOrange"}/>
          </div>

        </div>
      </div>

    </div>
  )
}

export default AttendConventionPage
