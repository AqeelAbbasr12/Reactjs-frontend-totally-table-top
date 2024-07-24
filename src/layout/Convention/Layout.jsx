import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Left from '../../components/Left'
import FaceImage from '../../assets/face.avif'
import { FaBuilding, FaCalendarAlt, FaDiceFive, FaList } from 'react-icons/fa'
import { BsFillCaretDownFill } from 'react-icons/bs'


const Layout = () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8]
  const nav = useNavigate()
  const [showSub, setshowSub] = useState({show:false,key:null})
  return (
    <div className='flex flex-col w-[100vw] h-[100vh] overflow-y-auto bg-darkBlue'>
      <Navbar type={"verified"} />
      <div className='pt-[2.3rem] flex  justify-between items-start md:flex-row flex-col bg-darkBlue md:px-[2rem] flex-1 h-[fit] md:h-[86rem] w-[100vw] gap-x-6'>

        {/* LEFT  */}
        <Left />

        {/* RIGHT  */}
        <div className='flex-1 rounded-md px-2 mb-2 md:mt-0 mt-4 w-[100%]'>

          <div className='flex justify-between items-center flex-wrap'>
            <h1 className='text-white text-2xl font-semibold'>Your conventions</h1>
            <Button onClickFunc={() => nav("/complete")} title={"Add convention"} className={"min-w-[10rem] min-h-[2.3rem] rounded-md bg-transparent text-white border border-lightOrange sm:mt-0 mt-2"} />
          </div>

          <div className='bg-[#0d2539] p-3 w-[100%] h-fit md:h-[100%] rounded-md mt-6 overflow-y-auto'>
            {
              data.map((i) => (
                <div className='flex justify-between items-center mb-2'>
                  <div className='flex items-center gap-x-2'>
                    <img src={FaceImage} alt="" className='w-[2rem] h-[2rem] rounded-full' />
                    <p className='text-lightOrange font-semibold text-lg'>UK Games Expo</p>
                  </div>
                  <div>
                    <p className='text-white'>May 2024</p>
                  </div>
                  <div className='flex items-center gap-x-3'>
                    <FaList className='text-white cursor-pointer' />
                    <FaBuilding className='text-white cursor-pointer' />
                    <FaCalendarAlt className='text-white cursor-pointer' />
                    <FaDiceFive className='text-white cursor-pointer' />
                  </div>
                  <div className='flex gap-x-3 items-center cursor-pointer relative'>
                    <p onClick={() => setshowSub({show:!showSub.show,key:i})} className='text-white'>Activity</p>
                    <BsFillCaretDownFill className='text-white' onClick={() => setshowSub({show:!showSub.show,key:i})} />
                    {
                      (showSub.show && showSub.key===i)&& (
                        <div className='absolute top-[2rem] left-[-4rem] bg-black p-4 w-[fit] z-50 rounded-md '>
                          <Link to={"/convention/attendance"} className='block mb-1 cursor-pointer text-white text-nowrap'>Your attendance</Link>
                          <Link to={"/agenda"} className='block mb-1 cursor-pointer text-white'>Agenda</Link>
                          <Link to={"/accomodation"} className='block mb-1 cursor-pointer text-white'>Accomodations</Link>
                          <Link to={"/event"} className='block mb-1 cursor-pointer text-white'>Events</Link>
                          <Link to={"/game/sale"} className='block mb-1 cursor-pointer text-white'>Games for sale</Link>
                        </div>
                      )

                    }
                  </div>
                </div>
              ))
            }
          </div>

        </div>


      </div>

    </div>
  )
}

export default Layout
