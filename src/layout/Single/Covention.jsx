import React from 'react'
import Navbar from '../../components/Navbar'
import ConventionImage from '../../assets/convention.jpeg'
import { BsFillCaretDownFill } from 'react-icons/bs'
import { FaLocationDot, FaMessage } from 'react-icons/fa6'
import { FaCalendarAlt, FaUser } from 'react-icons/fa'
import { RiExternalLinkLine } from "react-icons/ri";
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'

const Covention = () => {
  const nav = useNavigate()
  return (
    <div className='flex flex-col w-[100vw] h-[fit] overflow-y-auto '>
      <Navbar type={"verified"} />

      <div className='bg-black md:px-[2rem] px-[1rem] flex items-center gap-x-4 py-3 '>
        <span className='text-white'>Covention</span>
        <BsFillCaretDownFill className=' text-lightOrange -rotate-90' />
        <span className='text-white'>2024</span>
        <BsFillCaretDownFill className=' text-lightOrange -rotate-90' />
      </div>

      <div className='md:px-[2rem] px-[1rem] bg-darkBlue h-[86vh] w-[100vw] flex justify-start items-start gap-x-[5rem] md:flex-row flex-col pt-10'>
        
        
        <div className='md:flex-1 flex-none'>
          <h1 className='text-2xl text-white font-semibold'>UK Games Expo</h1>
          <p className='text-white text-wrap line-clamp-5 mt-3 md:w-[80%] w-[100%]'>Also known as UKGE, the UK Games Expo is the largest Tabletop Games Convention in the UK - where all aspects of the tabletop gaming hobby are represented under one roof. At UK Games Expo there are two huge halls full of exhibitors who want to show you their games. You can see them, you can try them out, and if you like them you can buy them. There is also a huge library of games to borrow and play on hundreds of tables of open gaming - open for anyone to play anything in.</p>
          <div className='md:w-[80%] w-[100%] px-3 py-4 bg-[#F2F0EF] flex justify-between items-center mt-5'>
            <p>Your are currently not attending this convention</p>
            <Button onClickFunc={()=>nav(`/attend`)} title={"Mark as attending"} className={"w-[12rem] text-nowrap truncate px-2 h-[2.2rem] rounded-md cursor-pointer text-white bg-lightOrange"}/>
          </div>
        </div>


        <div className='w-[15rem] h-[20rem] rounded-md bg-[#0d2539] p-3 flex flex-col justify-center md:mt-0 mt-4'>
          <div className='flex justify-center items-center my-10'>
            <img src={ConventionImage} alt="" className='w-[6rem] h-[6rem] rounded-full' />
          </div>
          <div className='flex items-center gap-x-4 mb-2'>
            <FaCalendarAlt className='text-lightOrange' />
            <p className='text-white'>31 May - 2 June</p>
          </div>
          <div className='flex items-center gap-x-4'>
            <FaLocationDot className='text-lightOrange' />
            <p className='text-white'>XYZ Location</p>
          </div>
          <div className='flex items-center gap-x-4 mt-2'>
            <RiExternalLinkLine className='text-lightOrange' />
            <p className='text-white'>www.ul.games.co</p>
          </div>
        </div>
      </div>

    </div >
  )
}

export default Covention
