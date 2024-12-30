import React from 'react'
import Navbar from '../../components/Navbar'
import FaceImage from '../../assets/profile.jpeg'
import ConventionImage from '../../assets/convention.jpeg'
import { FaLocationDot, FaMessage } from 'react-icons/fa6'
import { FaCalendarAlt, FaUser } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom'
import { BsFillCaretDownFill } from 'react-icons/bs'
import Button from '../../components/Button'
const Layout = () => {
    const data = [1, 2, 3, 4, 5]

    const searchType = useLocation().pathname.split("/")[3]
    const nav = useNavigate()
    return (
        <div className='flex flex-col w-[100vw] h-[100vh] overflow-y-auto'>
            <Navbar type={"verified"} />

            <div className='pt-5  md:flex-row flex-col bg-darkBlue md:px-[2rem] px-[1rem] flex-1 h-[90vh] md:h-[86rem] w-[100vw] gap-x-6'>
                <div className='flex justify-between items-center'>
                    <h1 className='text-2xl font-bold text-white'>{searchType == "user" ? "User" : "Convention"} Search "Marry"</h1>

                    <div className='flex justify-between items-center'>
                        <p className='text-white'>3 results</p>
                        {searchType !== "user" && (
                            <div className='flex justify-between px-2 items-center w-[11rem] h-[2.3rem] ml-3 rounded-md border border-gray-300 cursor-pointer'>
                                <p className='text-white'>Soonest first</p>
                                <BsFillCaretDownFill className='text-white ' />
                            </div>
                        )}
                    </div>
                </div>
                {
                    searchType === "user" ?
                        <div className='flex justify-between items-center gap-[2rem] flex-wrap mt-6'>
                            {
                                data.map((i) => (
                                    <div key={i} className='bg-[#0d2539] w-[15rem] h-[15rem] rounded-md p-3 flex justify-center items-center flex-col'>
                                        <div className='flex justify-center items-center'>
                                            <img src={FaceImage} alt="" className='w-[6rem] h-[6rem] rounded-full' />
                                        </div>
                                        <p className='text-white mt-3 font-bold '>Marry Cane</p>
                                        <p className='text-white mt-1 font-thin '>@marry-cane</p>
                                        <div className='flex justify-center items-center gap-x-4 mt-4'>
                                            <FaUser className='text-white' />
                                            <FaMessage className='text-white' />
                                        </div>
                                    </div>
                                ))
                            }
                        </div> :

                        <div className='mt-6'>
                            {
                                data.map((i) => (
                                    <div key={i} className='w-[100%] h-[fit] bg-[#0d2539] rounded-md p-3 mb-3'>
                                        <div className='sm:flex justify-between items-center'>
                                            <div className='sm:flex gap-[1rem] items-center'>
                                                <div className='sm:mb-0 mb-2'>
                                                    <img src={ConventionImage} alt="" className='w-[4rem] h-[4rem] rounded-full' />
                                                </div>
                                                <div>
                                                    <h1 className='text-lg font-semibold text-white'>Uk Games Expo</h1>
                                                    <div className='flex items-center gap-x-[1rem]'>
                                                        <div className='flex items-center gap-x-4'>
                                                            <FaCalendarAlt className='text-lightOrange' />
                                                            <p className='text-white'>31 May - 2 June</p>
                                                        </div>
                                                        <div className='flex items-center gap-x-4'>
                                                            <FaLocationDot className='text-lightOrange' />
                                                            <p className='text-white'>XYZ Location</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='sm:mt-0 mt-2'>
                                                <Button onClickFunc={()=>nav(`/single/conv/${1}`)} title={"More details"} className={"text-white w-[8rem] h-[2.3rem] rounded-md border border-lightOrange"}/>
                                            </div>
                                        </div>
                                        <p className='text-white mt-[1.3rem]'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse, error, nostrum magni exercitationem dolorem aut, ut hic distinctio repudiandae incidunt nisi facere necessitatibus ullam nobis. Inventore accusantium consectetur quae quasi harum, voluptatum modi recusandae dolorum beatae cum, placeat, ullam asperiores?</p>
                                    </div>

                                ))
                            }
                        </div>

                }


            </div>
        </div>
    )
}

export default Layout
