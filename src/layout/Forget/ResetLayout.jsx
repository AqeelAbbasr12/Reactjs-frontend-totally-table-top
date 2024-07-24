import React from 'react'
import Navbar from '../../components/Navbar'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'

const ResetLayout = () => {
    const nav = useNavigate()
    return (
        <div className='w-screen h-screen flex flex-col'>
            <Navbar />

            <div className='bg-darkBlue md:px-[2rem] flex-1 h-[90vh] md:h-[86rem] w-[100vw] flex justify-center items-center flex-col'>
                <div className='w-[80%] md:w-[50%] lg:w-[35%]  p-4 bg-[#0d2539] rounded-md'>
                    <h1 className='text-white text-lg font-semibold text-center'>Create a new password?</h1>
                    <p className='text-white mt-3'>Thanks for verifying your password. Create a new password below</p>
                    <Input placeholder={"New Password"} name={"pass"} type={"password"} className={"w-[100%] mt-3 h-[2.3rem] px-3 rounded-md bg-darkBlue text-white"} />
                    <Input placeholder={"Confirm New Password"} name={"pass"} type={"password"} className={"w-[100%] mt-3 h-[2.3rem] px-3 rounded-md bg-darkBlue text-white"} />
                    <Button onClickFunc={() => nav("/")} title={"Set new password & login"} className={"mt-3 bg-lightOrange text-white rounded-md h-[2.3rem] w-full"} />
                </div>
            </div>


        </div>
    )
}

export default ResetLayout
