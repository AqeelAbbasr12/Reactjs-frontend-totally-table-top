import React, { useState } from 'react'
import Button from './Button'
import Input from './Input'
import { Link, useNavigate } from 'react-router-dom'
import { FaBell } from 'react-icons/fa'
import { BiSolidMessage } from 'react-icons/bi'
import FaceImage from '../assets/face.avif'
import { BsFillCaretDownFill } from 'react-icons/bs'
import logoImage from '../assets/logo.png'
const Navbar = ({ type }) => {
    const nav = useNavigate()
    const [showMenu, setshowMenu] = useState(false)
    const [showSuggestion, setshowSuggestion] = useState(false)
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        nav("/"); // Redirect to the login page
    };
    return (

        <>
            {
                type === "verified" ?

                    <div className='w-[100%] min-h-[10vh] md:h-[10vh] bg-[#0d2539] px-[1rem] md:px-[2rem] flex justify-between items-center border-b-4 border-lightYellow'>

                        <div className='flex gap-x-[1rem] items-center'>
                            <div onClick={() => nav("/home")} className='md:w-[5rem] cursor-pointer w-[2.4rem] md:h-[3rem] h-[2.4rem]  flex justify-center items-center'>
                                <img src={logoImage} alt='' />
                            </div>
                            <div className='relative w-[18rem] sm:block hidden '>
                                <Input onChangeFunc={(e) => setshowSuggestion(true)} type={"text"} name={"search"} placeholder={"Search for conventions or people"} className={"w-[18rem] outline-none h-[2.3rem] px-3 bg-darkBlue rounded-md text-white"} />
                                {
                                    showSuggestion && (
                                        <div className=' absolute left-0 top-[3.4rem] w-full h-[fit] p-2 rounded-md bg-[#0d2539] z-50 border border-gray-300'>
                                            <Link to={"/search/marry/user"} className='text-white text-sm mb-2 cursor-pointer block'>Search for user named "Marry"</Link>
                                            <Link to={"/search/marry/convention"} className='text-white text-sm cursor-pointer block '>Search for convention called "Marry"</Link>
                                        </div>
                                    )
                                }
                            </div>
                        </div>

                        <div className='flex gap-x-[1rem] items-center w-fit'>
                            <Link to={"/messages"} className='w-[2.3rem] h-[2.3rem] rounded-full flex justify-center items-center bg-darkBlue'>
                                <BiSolidMessage className='text-lg text-white' />
                            </Link>
                            <Link to={"/notification"} className='w-[2.3rem] h-[2.3rem] rounded-full flex justify-center items-center bg-darkBlue'>
                                <FaBell className='text-lg text-white' />
                            </Link>
                            <div className=' relative flex justify-between items-center px-2 rounded-xl py-1 bg-darkBlue w-[10rem] cursor-pointer'>
                                <div onClick={() => setshowMenu(!showMenu)} className='flex gap-x-3 items-center'>
                                    <p className='text-white'>Helen</p>
                                    <BsFillCaretDownFill className='text-white' />
                                </div>
                                <img onClick={() => setshowMenu(!showMenu)} src={FaceImage} alt="" className='w-[2rem] h-[2rem] rounded-full' />
                                {
                                    showMenu && (
                                        <div className=' absolute left-0 top-[3.4rem] w-full h-[fit] p-2 rounded-md bg-[#0d2539] z-50'>
                                            <Link to={"/profile"} className='text-white mb-2 cursor-pointer block'>View profile</Link>
                                            <Link
                                                to="#" // Prevent the default link behavior
                                                onClick={(e) => {
                                                    e.preventDefault(); // Prevent the default link action
                                                    handleLogout();
                                                }}
                                                className='text-white cursor-pointer block'>
                                                Logout
                                            </Link>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    :

                    <div className='w-[100%] h-[10vh] md:h-[14vh] bg-[#0d2539] px-[1rem] md:px-[2rem] flex justify-between items-center border-b-4 border-lightYellow'>

                        <div className='flex gap-x-[1rem] items-center'>
                            <div className='md:w-[3rem] w-[2.4rem] md:h-[3rem] h-[2.4rem]flex justify-center items-center'>
                                <img src={logoImage} alt='' />
                            </div>
                            <h1 className='sm:block hidden md:text-3xl text-white font-semibold'>Totally Table Top</h1>
                        </div>

                        <div className='flex gap-x-[1rem] items-center w-fit'>
                            <p className='text-white text-nowrap'>Need help ?</p>
                            <Button onClickFunc={() => nav("/register-form")} title={"Create an account"} className={"md:px-0 px-1 w-fit text-sm md:w-[12rem] h-[2.3rem] rounded-md text-white bg-lightOrange"} />
                        </div>
                    </div>

            }
        </>
    )
}

export default Navbar
