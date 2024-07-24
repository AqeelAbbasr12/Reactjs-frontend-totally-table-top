import React from 'react'
import Navbar from '../../components/Navbar'
import FaceImage from '../../assets/face.avif'
import ConventionImage from '../../assets/convention.jpeg'
import { FaCalendarAlt} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { BsFillCaretDownFill } from 'react-icons/bs'
import Button from '../../components/Button'
import { FaLocationDot } from 'react-icons/fa6'

const Layout = () => {
    const data = [1, 2, 3, 4, 5]
    const nav = useNavigate()
    return (
        <div className='flex flex-col w-[100vw] h-[100vh] overflow-y-auto'>
            <Navbar type={"verified"} />

            <div className='bg-black md:px-[2rem] px-[1rem] flex items-center gap-x-4 py-3 '>
                <span className='text-white'>Account</span>
                <BsFillCaretDownFill className=' text-lightOrange -rotate-90' />
                <span className='text-white'>Your conventions</span>
                <BsFillCaretDownFill className=' text-lightOrange -rotate-90' />
                <span className='text-white'>UK Games Expo 2024</span>
            </div>


            <div className='md:px-[2rem] px-[1rem] bg-darkBlue h-[86vh] w-[100vw] pt-3 overflow-y-auto'>

                <div className='flex justify-between items-start sm:items-center flex-wrap w-[100%] sm:flex-row flex-col'>
                    <div className='flex items-center gap-x-4'>
                        <div className='min-w-[3rem] min-h-[3rem] rounded-full bg-lightOrange  flex justify-center items-center'>UKGE</div>
                        <h1 className='text-3xl font-bold text-white'>Your UK Games Expo Games</h1>
                    </div>

                    <div class="flex items-center gap-x-4 sm:mt-0 mt-2">
                        <div className='flex justify-between px-2 items-center h-[2.3rem] rounded-md border border-gray-300 cursor-pointer'>
                            <p className='text-white'>Filter games by…</p>
                            <BsFillCaretDownFill className='text-white ' />
                        </div>
                            <Button onClickFunc={() => nav("/new/game")} title={"Add New"} className={`w-[8rem] h-[2.3rem] rounded-md border border-lightOrange text-white sm:mt-0 mt-3`} />
                    </div>
                </div>


                <div className='mt-6'>
                    {
                        data.map((i) => (
                            <div onClick={()=>nav("/game/single")} key={i} className='w-[100%] sm:h-[13rem] bg-[#0d2539] p-3 rounded-md flex justify-between items-start relative sm:flex-row flex-col mt-4'>
                                <div className=''>
                                    <h1 className='text-lg font-semibold text-white'>4 Play Catan on Saturday</h1>

                                    <div className='flex items-center gap-x-4'>
                                        <div className='flex items-center gap-x-3 mt-4'>
                                            <FaCalendarAlt className='text-lightOrange' />
                                            <p className='text-white'>Friday 31st May 2024</p>
                                        </div>
                                        <div className='flex items-center gap-x-3 mt-4'>
                                            <FaLocationDot className='text-lightOrange' />
                                            <p className='text-white'>Hall 2, NEC</p>
                                        </div>

                                    </div>
                                    {/* <div className='flex items-center mt-4'>
                                        <img src={FaceImage} alt="" className='w-[2rem] h-[2rem] rounded-full' />
                                        <img src={FaceImage} alt="" className='w-[2rem] h-[2rem] rounded-full' />
                                        <img src={FaceImage} alt="" className='w-[2rem] h-[2rem] rounded-full' />
                                        <img src={FaceImage} alt="" className='w-[2rem] h-[2rem] rounded-full' />
                                    </div> */}

                                    <div className='flex gap-x-2 items-center mt-4'>
                                        <p className='text-white'>£14.99</p>
                                        <div className='w-[1px] h-[1rem] bg-white'></div>
                                        <p className='text-white'>Good</p>
                                    </div>

                                    <div className='sm:absolute bottom-6 flex items-center gap-x-3 mt-4 '>
                                        <Button onClickFunc={() => nav("/game/sale")} title={"Mark as sold"} className={`w-[8rem] h-[2.3rem] rounded-md bg-lightOrange text-white`} />
                                        <Button onClickFunc={() => nav("/game/sale")} title={"Edit"} className={`w-[8rem] h-[2.3rem] rounded-md border border-lightOrange text-white`} />
                                        <Button onClickFunc={() => nav("/game/sale")} title={"Delete"} className={`w-[8rem] h-[2.3rem] rounded-md border border-red text-white`} />
                                    </div>
                                </div>

                                {/* <div className='sm:mt-0 mt-4'>
                                    <img src={ConventionImage} alt="" className='h-[10rem] sm:absolute top-0 right-0' />
                                </div> */}
                            </div>
                        ))
                    }



                </div>


            </div>




        </div>
    )
}

export default Layout
