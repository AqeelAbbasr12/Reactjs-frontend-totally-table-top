import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Left from '../../components/Left'
import { ImCross } from 'react-icons/im'
import { BsFillCaretDownFill } from 'react-icons/bs'
import FaceImage from '../../assets/face.avif'
import { FaRegStar, FaUser } from 'react-icons/fa'
import { FaMessage } from 'react-icons/fa6'

const Layout = () => {
    const nav = useNavigate()
    const data = [1, 2, 3, 4, 5, 6, 7, 8]
    return (
        <div className='flex flex-col w-[100vw] overflow-y-auto bg-[#0d2539]'>
            <Navbar type={"verified"} />
            <div className='pt-[2.3rem] flex  justify-between items-start md:flex-row flex-col bg-darkBlue md:px-[2rem] flex-1 h-[fit] md:h-[86rem] w-[100vw] gap-x-6'>

                <div className='flex-1 rounded-md px-2 mb-2 w-full md:mt-0 mt-4'>
                    <h1 className='text-white text-2xl font-semibold'>Notifications (6 new)</h1>

                    <div className='mt-6'>
                        {
                            data.map((i, index) => (

                                <div key={i} className='bg-[#0d2539] w-[100%] rounded-md p-3 flex justify-between sm:flex-row flex-col  mb-3'>

                                    <div className='flex items-center gap-x-4'>
                                        <div className='w-[1.5rem] h-[1.5rem] rounded-full bg-red'></div>
                                        <img src={FaceImage} alt="" className='w-[3rem] h-[3rem] rounded-full' />
                                        <p className='text-white'><span className='text-lightOrange'>Niles</span> sent you a friend request</p>
                                    </div>

                                    <div className='flex gap-x-4 items-center sm:mt-0 mt-3'>
                                        <p className='text-white cursor-pointer'>Ignore</p>
                                        <Button title={"Accept"} className={`text-white border border-lightOrange w-[7rem] h-[2.3rem] rounded-md`}/>
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
