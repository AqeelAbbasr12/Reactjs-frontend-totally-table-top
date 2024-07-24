import React from 'react'
import Navbar from '../../components/Navbar'
import FaceImage from '../../assets/face.avif'
import ConventionImage from '../../assets/convention.jpeg'
import { FaBuilding, FaCalendarAlt, FaDiceFive, FaList } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { BsFillCaretDownFill } from 'react-icons/bs'
import Button from '../../components/Button'
import { TiTick } from 'react-icons/ti'

const Layout = () => {
    // const data = [1, 2, 3, 4, 5]
    const nav = useNavigate()
    return (
        <div className='flex flex-col w-[100vw] h-[100vh] overflow-y-auto'>
            <Navbar type={"verified"} />

            <div className='bg-black md:px-[2rem] px-[1rem] flex items-center gap-x-4 py-3 '>
                <span className='text-white'>Account</span>
                <BsFillCaretDownFill className=' text-lightOrange -rotate-90' />
                <span className='text-white'>Your conventions</span>
            </div>


            <div className='md:px-[2rem] px-[1rem] bg-darkBlue h-[86vh] w-[100vw] pt-3'>

                <div className='flex justify-between items-start sm:items-center flex-wrap w-[100%] sm:flex-row flex-col'>
                    <div className='flex items-center gap-x-4'>
                        <div className='min-w-[3rem] min-h-[3rem] rounded-full bg-lightOrange  flex justify-center items-center'>UKGE</div>
                        <h1 className='text-3xl font-bold text-white'>UK Games Expo 2024</h1>
                    </div>
                    <div className='flex items-center gap-x-3 sm:mt-0 mt-3'>
                        <p className='text-white '>Actions</p>
                        <BsFillCaretDownFill className='text-lightOrange rotate-360' />
                    </div>
                </div>

                <div className='w-[100%] bg-[#0d2539]  px-3 py-5 rounded-md mt-6'>

                    <div className='flex justify-between items-center'>
                        <div className='flex gap-x-3 items-center'>
                            <div className='w-[2rem] h-[2rem] flex justify-center items-center rounded-full bg-lightOrange'><TiTick className='text-[#0d2539]' /></div>
                            <p className='text-white'>You’re going!</p>
                        </div>
                        <div>
                            <Button title={"Change"} className={`w-[8rem] h-[2.3rem] rounded-md border border-lightOrange text-white`} />
                        </div>
                    </div>

                    <p className='text-white mt-2'>Marked as attending on 31st May 2024 and maybe on 1st June 2024</p>

                </div>

                <div className='sm:flex justify-center items-center gap-x-8 mt-6'>

                    <div className='flex-1 bg-[#0d2539] p-3 rounded-md'>
                        <div className='flex items-center gap-x-4'>
                            <FaCalendarAlt className='text-white' />
                            <p className='text-white'>Events</p>
                        </div>

                        <div className='flex justify-between items-center mt-3'>
                            <p className='text-white'>Nothing Yet</p>
                            <Button title={"Create"} className={`w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange`} />
                        </div>
                    </div>

                    <div className='flex-1 bg-[#0d2539] p-3 rounded-md sm:mt-0 mt-3'>
                        <div className='flex items-center gap-x-4'>
                            <FaDiceFive className='text-white' />
                            <p className='text-white'>Games</p>
                        </div>
                        <div className='flex justify-between items-center mt-3'>
                            <p className='text-white'>1 For Sale</p>
                            <Button title={"Games"} className={`w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange`} />
                        </div>
                    </div>


                </div>

                <div className='sm:flex justify-center items-center gap-x-8 mt-6'>

                    <div className='flex-1 bg-[#0d2539] p-3 rounded-md'>
                        <div className='flex items-center gap-x-4'>
                            <FaList className='text-white' />
                            <p className='text-white'>Agenda</p>
                        </div>

                        <div className='flex justify-between items-center mt-3'>
                            <p className='text-white'>Not Started</p>
                            <Button onClickFunc={()=>{nav("/agenda")}} title={"Create"} className={`w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange`} />
                        </div>
                    </div>

                    <div className='flex-1 bg-[#0d2539] p-3 rounded-md  sm:mt-0 mt-3'>
                        <div className='flex items-center gap-x-4'>
                            <FaBuilding className='text-white' />
                            <p className='text-white'>Accommodation</p>
                        </div>
                        <div className='flex justify-between items-center mt-3'>
                            <p className='text-white'>1 Stay</p>
                            <Button title={"Edit"} className={`w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange`} />
                        </div>
                    </div>


                </div>

            </div>




        </div>
    )
}

export default Layout
