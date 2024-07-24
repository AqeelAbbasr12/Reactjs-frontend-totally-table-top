import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom'
import { TbGridDots } from 'react-icons/tb'
import { IoListSharp } from 'react-icons/io5'
import ConventionImage from '../../assets/convention.jpeg'
import Input from '../../components/Input'
import { BsFillCaretDownFill } from 'react-icons/bs'


const Layout = () => {
    const data = [1, 2, 3, 4, 5]
    const nav = useNavigate()
    const [currentView, setCurrentView] = useState("grid")
    const dummyList = ['Brand New', 'Excellent', 'Good', 'Fair', 'Below average'];
    return (
        <div className='flex flex-col w-[100vw] min-h-[100vh] max-h-fit overflow-y-auto bg-darkBlue'>
            <Navbar type={"verified"} />
            <div className='md:px-[2rem] px-[1rem] bg-darkBlue h-[86vh] w-[100vw] pt-3 overflow-y-auto'>
                {/* TOOGLE LAYOUT  */}
                <div className='flex justify-between items-center'>
                    <h1 className='text-3xl font-semibold text-white'>Games for sales</h1>
                    <div className='flex gap-x-2 items-center'>
                        <p className='text-white'>1,084 games for sale</p>
                        <div className='border border-lightOrange flex items-center w-[fit] justify-center h-[2rem]'>
                            <IoListSharp onClick={() => setCurrentView("list")} className={`text-white h-full w-[2rem] p-2 cursor-pointer ${currentView === "list" && ' bg-lightOrange'}`} />
                            <TbGridDots onClick={() => setCurrentView("grid")} className={`text-white h-full w-[2rem] p-2 cursor-pointer ${currentView === "grid" && ' bg-lightOrange'}`} />
                        </div>
                    </div>
                </div>

                <div className='flex justify-between items-start gap-x-[2rem] mt-5 md:flex-row flex-col'>

                    {
                        currentView === "grid" ?
                            <div className='flex-1 flex justify-between items-center flex-wrap md:order-1 order-2'>
                                {
                                    data.map((i) => (
                                        <div onClick={()=>{nav("/game/single")}} key={i} className='min-w-full sm:min-w-[15rem] max-w-full sm:max-w-[15rem] h-[18rem] cursor-pointer rounded-md bg-[#0D2539] mx-2 my-2'>
                                            <img src={ConventionImage} alt="" className='w-full sm:w-[15rem] h-[11rem]' />
                                            <p className='py-2 mx-2 text-white text-sm'>The Chameleon Board Game Big Potato Box Opened Contents Sealed Unused</p>
                                            <div className='flex gap-x-2 items-center mx-2'>
                                                <p className='text-white'>£14.99</p>
                                                <div className='w-[1px] h-[1rem] bg-white'></div>
                                                <p className='text-white'>Used</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div> :
                            <div className='flex-1 md:order-1 order-2'>
                                {
                                    data.map((i) => (
                                        <div onClick={()=>{nav("/game/single")}} key={i} className='rounded-md bg-[#0D2539] cursor-pointer flex gap-x-5 items-left mb-2 p-3'>
                                            <img src={ConventionImage} alt="" className='w-[3rem] h-[3rem]' />
                                            <div>
                                                <p className='py-2 mx-2 text-white text-sm'>The Chameleon Board Game Big Potato Box Opened Contents Sealed Unused</p>
                                                <div className='flex gap-x-2 items-center mx-2'>
                                                    <p className='text-white'>£14.99</p>
                                                    <div className='w-[1px] h-[1rem] bg-white'></div>
                                                    <p className='text-white'>Used</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                    }

                    <div className='bg-[#0D2539] w-full md:w-[15rem] px-2 py-4 rounded-md md:mb-0 mb-4 md:order-2 order-1'>
                        <Input name={"search"} placeholder={"Game Search..."} className={"w-full h-[2.3rem] rounded-md px-2 bg-darkBlue outline-none text-white"} />
                        <h1 className=' text-white font-semibold mt-2 mb-2'>Show By Convention</h1>
                            <div className='flex justify-between px-2 items-center h-[2.3rem] rounded-md border border-gray-300 cursor-pointer'>
                                <p className='text-white'>UK Games Expo</p>
                                <BsFillCaretDownFill className='text-white ' />
                            </div>
                        
                        <h1 className=' text-white font-semibold mt-2 mb-2'>Condition</h1>
                        {
                                dummyList.map((item, index) => (
                                <div key={index} className='flex items-center gap-x-3 mb-1'>
                                    <input type="checkbox" />
                                    <p className='text-white'>{item}</p>
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
