import React from 'react'
import { Link } from 'react-router-dom'


const Left = () => {

    return (

        <div className='bg-[#0d2539] w-[97%] md:w-[15rem] h-fit rounded-md p-2 md:mx-0 mx-2' >
            <h1 className='text-white text-center text-lg mt-2'>Your turn, Helen</h1>
            <div className='w-[100%] h-[1px] bg-lightGray mt-4 mb-4'></div>
            <Link className='block mb-2 text-white cursor-pointer' to={"/home"}>Home</Link>
            <Link className='block mb-2 text-white cursor-pointer' to={"/activity"}>Activity</Link>
            <Link className='block mb-2 text-white cursor-pointer' to={"/user/convention"}>Your conventions</Link>
            <Link className='block mb-2 text-white cursor-pointer' to={"/user/announcements"}>Announcements</Link>
            <Link className='block mb-2 text-white cursor-pointer' to={"/friends"}>Friends</Link>
            <Link className='block mb-2 text-white cursor-pointer' to={"/profile"}>Profile</Link>
            <Link className='block mb-2 text-white cursor-pointer' to={"/settings"}>Settings</Link>
            <div className='w-[100%] h-[1px] bg-lightGray mt-4 mb-4'></div>
            <Link className='block mb-2 text-white cursor-pointer' to={"/home"}>Quick Links</Link>
            <Link className='block mb-2 text-white cursor-pointer' to={"/home"}>All conventions</Link>
            <Link className='block mb-2 text-white cursor-pointer' to={"/sales"}>Game for sale</Link>

        </div >
    )
}

export default Left
