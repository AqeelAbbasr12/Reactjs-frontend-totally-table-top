import React from 'react'
import Navbar from '../../components/Navbar'
import { FaExpand, FaGripLines, FaList } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { BsFillCaretDownFill, BsLine, BsPrinterFill } from 'react-icons/bs'
import Button from '../../components/Button'
import Input from '../../components/Input'
import DraggableList from '../../components/DragAbleTodoList'
import { BiSolidDownload } from 'react-icons/bi'

const NextAgenda = () => {
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
                    <h1 className='text-3xl mt-3 text-center text-white font-semibold'>Your UK Games Expo Agenda</h1>

                   
                    < DraggableList/>

                    <Input name={"name"} placeholder={"Type here to add a new agenda item"} type={"text"} onChangeFunc={(e) => console.log(e)} className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-4 outline-none bg-darkBlue`} />

                    <div className='flex justify-between items-center mt-4'>
                        <div className='flex items-center gap-x-4'>
                            <BsPrinterFill className='text-white text-lg cursor-pointer' />
                            <BiSolidDownload className='text-white text-lg cursor-pointer' />
                        </div>
                        <Button onClickFunc={() => nav("/final/agenda")} title={"Save Agenda"} className={`w-[8rem] h-[2.3rem] rounded-md text-white bg-lightOrange`} />
                    </div>
                </div>

            </div>




        </div>
    )
}

export default NextAgenda
