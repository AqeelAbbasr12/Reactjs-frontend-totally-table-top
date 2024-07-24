import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Left from '../../components/Left'
import FaceImage from '../../assets/face.avif'
import Input from '../../components/Input'
import { FaCaretDown } from 'react-icons/fa'

const Layout = () => {
    const nav = useNavigate()
    const [settingType, setsettingType] = useState("privacy")
    return (
        <div className='flex flex-col w-[100vw] h-[100vh]'>
            <Navbar type={"verified"} />
            <div className='pt-[2.3rem] flex  justify-between items-start md:flex-row flex-col bg-darkBlue md:px-[2rem] flex-1 h-[fit] md:h-[86rem] w-[100vw] gap-x-6'>

                {/* LEFT  */}
                <Left />

                {/* RIGHT  */}
                <div className='flex-1 rounded-md px-2 mb-2 w-full md:mt-0 mt-4'>
                    <div className='sm:flex justify-between items-center'>
                        <h1 className='text-white text-2xl font-semibold'>Settings</h1>
                        <Button onClickFunc={() => nav("/ownFeed")} title={"Save all changes"} className={'w-[11rem] h-[2.3rem] rounded-md text-white border border-lightOrange sm:mt-0 mt-2'} />
                    </div>

                    <div className='w-[100%] h-[fit] mt-4 rounded-md'>
                        <div className='flex items-center'>
                            <p onClick={() => setsettingType("privacy")} className={`text-white cursor-pointer p-3 ${settingType === "privacy" && "bg-[#0d2539]"}`}>Privacy</p>
                        </div>

                        <div className='bg-[#0d2539] p-3'>
                            <p className='text-white text-wrap'>We take your privacy seriously, and put control in your hands. Use the options below to control who can see your different actions and updates on Totally TableTop. Please refer to our privacy policy for more information about how your data is used.</p>
                            <p className='text-white text-lg font-semibold mt-2'>Who can see ?</p>

                            <div className='flex justify-between items-center flex-wrap'>
                                <h1 className='text-white text-md font-semibold'>Changes to your profile</h1>
                                <div className='flex justify-between items-center w-[12rem] px-2 rounded-md h-[2.3rem] text-white border border-gray-500 bg-darkBlue mb-2'>
                                    <p>Your friends only</p>
                                    <FaCaretDown />
                                </div>
                            </div>

                            <div className='flex justify-between items-center flex-wrap'>
                                <h1 className='text-white text-md font-semibold'>Your updated</h1>
                                <div className='flex justify-between items-center w-[12rem] px-2 rounded-md h-[2.3rem] text-white border border-gray-500 bg-darkBlue mb-2'>
                                    <p>Your friends only</p>
                                    <FaCaretDown />
                                </div>
                            </div>

                            <div className='flex justify-between items-center flex-wrap'>
                                <h1 className='text-white text-md font-semibold'>Your new friendships</h1>
                                <div className='flex justify-between items-center w-[12rem] px-2 rounded-md h-[2.3rem] text-white border border-gray-500 bg-darkBlue mb-2'>
                                    <p>Your friends only</p>
                                    <FaCaretDown />
                                </div>
                            </div>
                            <div className='flex justify-between items-center flex-wrap'>
                                <h1 className='text-white text-md font-semibold'>Your convention attendance</h1>
                                <div className='flex justify-between items-center w-[12rem] px-2 rounded-md h-[2.3rem] text-white border border-gray-500 bg-darkBlue mb-2'>
                                    <p>Your friends only</p>
                                    <FaCaretDown />
                                </div>
                            </div>
                            <div className='flex justify-between items-center flex-wrap'>
                                <h1 className='text-white text-md font-semibold'>Your accomodation</h1>
                                <div className='flex justify-between items-center w-[12rem] px-2 rounded-md h-[2.3rem] text-white border border-gray-500 bg-darkBlue mb-2'>
                                    <p>No one</p>
                                    <FaCaretDown />
                                </div>
                            </div>
                            <div className='flex justify-end mt-2'>
                                <Button title={"Save Changes"} className={"w-[8rem] h-[2.3rem] rounded-md text-white bg-[#F77F00]"} />
                            </div>



                            <p className='text-white text-lg font-semibold mt-2'>All other user to find by ?</p>

                            <div className='flex justify-between items-center flex-wrap'>
                                <h1 className='text-white text-md font-semibold'>Username</h1>
                                <div className='flex justify-between items-center w-[12rem] px-2 rounded-md h-[2.3rem] text-white border border-gray-500 bg-darkBlue mb-2'>
                                    <p>Yes</p>
                                    <FaCaretDown />
                                </div>
                            </div>

                            <div className='flex justify-between items-center flex-wrap'>
                                <h1 className='text-white text-md font-semibold'>Real Name</h1>
                                <div className='flex justify-between items-center w-[12rem] px-2 rounded-md h-[2.3rem] text-white border border-gray-500 bg-darkBlue mb-2'>
                                    <p>No</p>
                                    <FaCaretDown />
                                </div>
                            </div>

                            <div className='flex justify-between items-center flex-wrap'>
                                <h1 className='text-white text-md font-semibold'>Your email</h1>
                                <div className='flex justify-between items-center w-[12rem] px-2 rounded-md h-[2.3rem] text-white border border-gray-500 bg-darkBlue mb-2'>
                                    <p>Yes</p>
                                    <FaCaretDown />
                                </div>
                            </div>
                            <div className='flex justify-end mt-2'>
                                <Button title={"Save Changes"} className={"w-[8rem] h-[2.3rem] rounded-md text-white bg-[#F77F00]"} />
                            </div>
                        </div>
                    </div>


                </div>


            </div>

        </div>
    )
}

export default Layout
