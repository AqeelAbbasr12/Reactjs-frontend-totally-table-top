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
        <div className='flex flex-col w-[100vw] min-h-[100vh] max-h-fit overflow-y-auto bg-[#0d2539]'>
            <Navbar type={"verified"} />
            <div className='pt-[2.3rem] flex  justify-between items-start md:flex-row flex-col bg-darkBlue md:px-[2rem] flex-1 h-[fit] md:h-[86rem] w-[100vw] gap-x-6'>

                <div className='flex-1 rounded-md px-2 mb-2 w-full md:mt-0 mt-4'>
                    <h1 className='text-white text-2xl font-semibold'>Messages (2 new)</h1>

                    <div className='flex items-start gap-x-6 mt-4 md:flex-row flex-col'>
                        <div className='min-w-full md:mb-0 mb-3 md:min-w-[13rem] p-2 bg-[#0d2539] rounded-md'>
                            <div className='flex justify-between items-center mb-2 border-b border-gray-500 pb-2 cursor-pointer'>
                                <div className='flex items-center gap-x-3'>
                                    <img src={FaceImage} alt="" className='w-[2rem] h-[2rem] rounded-full' />
                                    <p className='text-white'>Roz</p>
                                </div>
                                <div className='w-[1rem] h-[1rem] rounded-full bg-red'></div>
                            </div>
                            <div className='flex justify-between items-center mb-2 border-b border-gray-500 pb-2 cursor-pointer'>
                                <div className='flex items-center gap-x-3'>
                                    <img src={FaceImage} alt="" className='w-[2rem] h-[2rem] rounded-full' />
                                    <p className='text-white'>Roz</p>
                                </div>
                                <div className='w-[1rem] h-[1rem] rounded-full bg-red'></div>
                            </div>
                            <div className='flex justify-between items-center mb-2 border-b border-gray-500 pb-2 cursor-pointer'>
                                <div className='flex items-center gap-x-3'>
                                    <img src={FaceImage} alt="" className='w-[2rem] h-[2rem] rounded-full' />
                                    <p className='text-white'>Roz</p>
                                </div>
                                <div className='w-[1rem] h-[1rem] rounded-full bg-red'></div>
                            </div>
                        </div>

                        <div className='flex-1 p-2 bg-[#0d2539] rounded-md'>
                            <div className='flex items-start gap-x-[1rem]'>
                                <img src={FaceImage} alt="" className='w-[2rem] h-[2rem] rounded-full' />
                                <div className='bg-darkBlue p-2 text-white flex-1 rounded-md'>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                </div>
                            </div>

                            <div className='flex  items-start gap-x-[1rem] mt-4'>
                                <div className='bg-darkBlue p-2 text-white flex-1 rounded-md'>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                </div>
                                <img src={FaceImage} alt="" className='w-[2rem] h-[2rem] rounded-full' />
                            </div>

                            <div className='flex items-start gap-x-[1rem] mt-4'>
                                <img src={FaceImage} alt="" className='w-[2rem] h-[2rem] rounded-full' />
                                <div className='bg-darkBlue p-2 text-white flex-1 rounded-md'>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                </div>
                            </div>


                            <div className='flex items-start gap-x-[1rem] mt-4'>
                                <img src={FaceImage} alt="" className='w-[2rem] h-[2rem] rounded-full' />
                                <div className='bg-darkBlue p-2 text-white flex-1 rounded-md'>
                                    <textarea type="text" name="" id="" className='w-full bg-darkBlue h-[10rem] rounded-md outline-none text-white resize-none' placeholder='Write a reply' />
                                </div>
                            </div>
                            <div className='flex justify-between items-center m-3'>
                                <p className='text-white'>Replies are only visible to people in this conversation.</p>
                                <Button title={"Reply"} className={`w-[8rem] h-[2.3rem] rounded-md text-white bg-[#E78530]`}/>
                            </div>

                        </div>
                    </div>
                </div>


            </div>

        </div>
    )
}

export default Layout
