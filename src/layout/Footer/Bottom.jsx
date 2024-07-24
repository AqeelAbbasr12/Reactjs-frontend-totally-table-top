import React from 'react'
import logo from '../../assets/logo.png'
const Bottom = () => {
    return (
        
            <div className='bg-[#0d2539] w-[100%] p-[1rem] md:p-[2rem] flex justify-between items-center flex-wrap'>
                <div className='w-[3rem] h-[3rem] rounded-full flex justify-center items-center mt-2'>
                    <img src={logo} alt="" />
                </div>
                <div className='flex gap-x-3 items-center overflow-x-auto mt-2'>
                    <a href='/feedback' className='text-lightGray cursor-pointer text-nowrap'>Feedback form</a>
                    <a href='/contactus' className='text-lightGray cursor-pointer text-nowrap'>Contact us</a>
                    <a href='/staying-safe' className='text-lightGray cursor-pointer text-nowrap'>Staying safe</a>
                    <a href='/terms' className='text-lightGray cursor-pointer text-nowrap'>Terms</a>
                    <a href='/cookies' className='text-lightGray cursor-pointer text-nowrap'>Cookies</a>
                    <a href='/privacy' className='text-lightGray cursor-pointer text-nowrap'>Privacy</a>
                </div>
            </div>
        
    )
}

export default Bottom
