import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Left from '../../components/Left'
import { ImCross } from 'react-icons/im'
import { BsFillCaretDownFill } from 'react-icons/bs'
import FaceImage from '../../assets/face.avif'
import { FaRegStar } from 'react-icons/fa'
import { FaMessage } from 'react-icons/fa6'
import ImageCross from '../../assets/red-cross.png'


const Layout = () => {
    const nav = useNavigate()
    const [showData, setshowData] = useState(false)
    const data = [1, 2, 3, 4, 5, 6, 7]
    return (
        <div className='flex flex-col w-[100vw] h-[100vh]'>
            <Navbar type={"verified"} />
            <div className='pt-[2.3rem] flex  justify-between items-start md:flex-row flex-col bg-darkBlue md:px-[2rem] flex-1 h-[fit] md:h-[86rem] w-[100vw] gap-x-6'>

                {/* LEFT  */}
                <Left />

                {/* RIGHT  */}
                <div className='flex-1 rounded-md px-2 mb-2 w-full md:mt-0 mt-4'>
                    <div className='sm:flex justify-between items-center'>
                        <h1 className='text-white text-2xl font-semibold'>Your activity feed</h1>
                        <div className='flex items-center gap-x-4 sm:mt-0 mt-2'>
                            <div onClick={() => setshowData(!showData)} className='flex justify-between px-2 items-center w-[11rem] h-[2.3rem] rounded-md border border-gray-300 cursor-pointer'>
                                <p className='text-white'>Show everything</p>
                                <BsFillCaretDownFill className='text-white ' />
                            </div>
                            <Button title={"Post update"} className={'w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange'} />

                        </div>
                    </div>

                    {
                        !showData ?
                            <div className='w-[100%] h-[52.5vh] mt-4 bg-[#0d2539] rounded-md flex justify-center items-center flex-col'>
                                {/* <ImCross className='text-red text-6xl border border-red rounded-full' /> */}
                                <img className='justify-center' src={ImageCross} alt="" />
                                <h1 className='text-lg text-center font-semibold mt-3 mb-5 text-white'>No activity</h1>
                                <p className='text-white mb-0'>Important updates notification and</p>
                                <p className='text-white mb-4'>more from friends will appear here</p>
                                <Button title={"Find friends"} className={'w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange'} />
                            </div> :
                            data.map((i, index) => (
                                <div key={i} className='w-[100%] bg-[#0d2539] py-3 px-4 mt-5 rounded-md'>
                                    <div className='flex justify-between items-center'>
                                        <div className='flex items-center gap-x-4'>
                                            <div className='flex items-center'>
                                                <img src={FaceImage} alt="" className='w-[3rem] h-[3rem] rounded-full' />
                                                <div className='w-[3rem] h-[3rem] rounded-full flex justify-center items-center bg-lightOrange'>UKGE</div>
                                            </div>
                                            <div>
                                                <p className='text-white'><span className='text-lightOrange'>Daphin</span> is attending <span className='text-lightOrange'>UK games Expo</span></p>
                                            </div>
                                        </div>
                                        <p className='text-white'>Just now</p>

                                    </div>
                                    <p className='text-white mt-3'>Daphine will attend UK games expo on Friday 31st 2024 and Sunday 1st June  2024</p>

                                    <div className='flex items-center gap-x-4 mt-4'>
                                        <div className='flex items-center gap-x-2'>
                                            <FaMessage className='text-white' />
                                            <p className='text-white'>0</p>
                                        </div>
                                        <FaRegStar className='text-white' />
                                    </div>
                                </div>
                            ))
                    }

                </div>


            </div>

        </div>
    )
}

export default Layout