import React, {useState} from 'react'
import Navbar from '../../components/Navbar'
import { FaList } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/bs'
import Button from '../../components/Button'
import Input from '../../components/Input'

const CreateGame = () => {
    const nav = useNavigate()
    const CONDITIONS = [
    'Brand new',
    'Excellent',
    'Good',
    'Fair',
    'Below Average'
    ];

  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

    return (
        <div className='flex flex-col w-[100vw] h-[100vh] overflow-y-auto'>
            <Navbar type={"verified"} />

            <div className='bg-black md:px-[2rem] px-[1rem] flex items-center gap-x-4 py-3 '>
                <span className='text-white'>Account</span>
                <BsFillCaretDownFill className=' text-lightOrange -rotate-90' />
                <span className='text-white'>Your conventions</span>
                <BsFillCaretDownFill className=' text-lightOrange -rotate-90' />
                <span className='text-white'>Uk Games Expo 2024</span>
            </div>


            <div className='md:px-[2rem] px-[1rem] bg-darkBlue h-[86vh] w-[100vw] py-3 flex justify-center items-center overflow-y-auto'>

                <div className='sm:w-[50%] w-[100%] bg-[#0d2539]  px-3 py-5 rounded-md mt-6'>
                    <div className='flex justify-center items-center'>
                        <div className='w-[3rem] h-[3rem] rounded-full bg-lightOrange flex justify-center items-center'>UKGE</div>
                        <div className='w-[3rem] h-[3rem] rounded-full bg-lightOrange flex justify-center items-center'><FaList className='text-white' /></div>
                    </div>

                    <div className='pb-4'>
                        <h1 className='text-3xl mt-3 text-center text-white font-semibold'>Add new game</h1>
                    </div>

                    <div className='pb-2'>
                        <Input name={"name"} placeholder={"Game Name"} type={"text"} onChangeFunc={(e) => console.log(e)} className={`w-[100%] h-[3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`} />
                    </div>

                    <div className='flex justify-center items-center md:flex-row flex-col mt-2 gap-x-4 pb-2'>
                        <div className='flex justify-between px-2 items-center h-[3rem] w-[100%] cursor-pointer rounded-md text-white px-4 outline-none bg-darkBlue'>
                            <div>
                            <p className='text-white'>Select Price</p>
                            </div>
                            <div className='flex item-end gap-x-2'>
                                <span className='text-white'>USD</span>
                                <BsFillCaretDownFill className='text-white ' />
                            </div>

                            
                        </div>

                    
                    <div
                        className='flex justify-between px-2 items-center h-[3rem] w-[100%] cursor-pointer rounded-md text-white px-4 outline-none bg-darkBlue'
                        onClick={handleToggle} >
                        <p className='text-white'>Select Condition</p>
                        {isOpen ? (
                        <BsFillCaretUpFill className='text-white' />
                        ) : (
                        <BsFillCaretDownFill className='text-white' />
                        )}

                    {isOpen && (
                        <ul className='mt-2 bg-darkBlue top-[415px] rounded-md text-white absolute z-10 origin-top-right' tabindex="-1">
                        {CONDITIONS.map((condition, index) => (
                            <li
                            key={index}
                            className='px-4 py-2 cursor-pointer hover:bg-gray-700'
                            >
                            {condition}
                            </li>
                        ))}
                        </ul>
                    )}
                    </div>

                    </div>

                    <div className='pb-2'>
                        <Input name={"name"} placeholder={"Category"} type={"text"} onChangeFunc={(e) => console.log(e)} className={`w-[100%] h-[3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`} />
                    </div>

                    <div className='pb-2'>
                        <Input name={"name"} placeholder={"Description"} type={"text"} onChangeFunc={(e) => console.log(e)} className={`w-[100%] h-[3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`} />
                    </div>

                    <div className='pb-2'>
                        <Input name={"name"} placeholder={"Upload Image"} type={"text"} onChangeFunc={(e) => console.log(e)} className={`w-[100%] h-[3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`} />
                    </div>

                    <div className='flex justify-center items-center mt-4'>
                        <Button onClickFunc={() => nav("/game/sale")} title={"List Game"} className={`w-[12rem] h-[3rem] rounded-md text-white bg-lightOrange`} />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default CreateGame
