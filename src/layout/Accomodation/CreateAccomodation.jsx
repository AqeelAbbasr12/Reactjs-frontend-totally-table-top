import React from 'react'
import Navbar from '../../components/Navbar'
import { FaExpand, FaList } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { BsDownload, BsFillCaretDownFill, BsLine, BsPrinterFill } from 'react-icons/bs'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { BiSolidDownload } from 'react-icons/bi'


const CreateAccomodation = () => {
    const nav = useNavigate()

    return (
        <div className='flex flex-col w-[100vw] h-[100vh] overflow-y-auto'>
            <Navbar type={"verified"} />

            <div className='bg-black md:px-[2rem] px-[1rem] flex items-center gap-x-4 py-3 '>
                <span className='text-white'>Account</span>
                <BsFillCaretDownFill className=' text-lightOrange -rotate-90' />
                <span className='text-white'>Your conventions</span>
            </div>


            <div className='md:px-[2rem] px-[1rem] bg-darkBlue h-[86vh] w-[100vw] pt-3 flex justify-center items-center'>

                <div className='sm:w-[50%] w-[100%] bg-[#0d2539]  px-3 py-5 rounded-md mt-6'>
                    <div className='flex justify-center items-center'>
                        <div className='w-[3rem] h-[3rem] rounded-full bg-lightOrange flex justify-center items-center'>UKGE</div>
                        <div className='w-[3rem] h-[3rem] rounded-full bg-lightOrange flex justify-center items-center'><FaList className='text-white' /></div>
                    </div>
                    <h1 className='text-3xl mt-3 text-center text-white font-semibold'>Add new accommodation</h1>

                    <Input name={"name"} placeholder={"Location Name"} type={"text"} onChangeFunc={(e) => console.log(e)} className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`} />

                    <div className='flex justify-center items-center md:flex-row flex-col mt-2 gap-x-4'>
                        <Input name={"name"} placeholder={"Date From"} type={"text"} onChangeFunc={(e) => console.log(e)} className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 outline-none bg-darkBlue`} />
                        <Input name={"name"} placeholder={"Date To"} type={"text"} onChangeFunc={(e) => console.log(e)} className={`w-[100%] md:mt-0  h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`} />
                    </div>

                    <Input name={"name"} placeholder={"Location Address"} type={"text"} onChangeFunc={(e) => console.log(e)} className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`} />

                    <Input name={"name"} placeholder={"Location Website"} type={"text"} onChangeFunc={(e) => console.log(e)} className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`} />

                    <Input name={"name"} placeholder={"Location Phone Number"} type={"text"} onChangeFunc={(e) => console.log(e)} className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`} />


                    <div className='flex justify-center items-center mt-4'>
                        <Button onClickFunc={() => nav("/accomodation")} title={"Save Accomodation"} className={`w-[12rem] h-[2.3rem] rounded-md text-white bg-lightOrange`} />
                    </div>
                </div>

            </div>




        </div>
    )
}

export default CreateAccomodation
