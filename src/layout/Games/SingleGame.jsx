import React from 'react'
import Navbar from '../../components/Navbar'
import FaceImage from '../../assets/face.avif'
import ConventionImage from '../../assets/convention.jpeg'
import { FaCalendarAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { BsFillCaretDownFill } from 'react-icons/bs'
import Button from '../../components/Button'
import { FaLocationDot } from 'react-icons/fa6'


const SingleGame = () => {
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


            <div className='md:px-[2rem] px-[1rem] bg-darkBlue h-[86vh] w-[100vw] overflow-y-auto flex justify-between items-center md:flex-row flex-col pt-4 gap-x-6'>

                <div>
                    <h1 className='text-white text-3xl font-semibold'>Peaky Blinders Under New</h1>
                    <h1 className='text-white text-3xl font-semibold mt-0'>Management Board Game</h1>
                    <p className='text-white mt-2'>June Game 2024 </p>
                    <p className='text-white mt-3'>Box is a little Scuffed in places. Contents are In Very Good Pre-Loved Clean Condition. Can send more photo’s if required and please feel free to ask any questions.</p> 
                    <p className='text-white mt-3'>All my items are sold as “Pre-loved” unless otherwise stated - and as such may come with some age commensurate marks etc We do our best to describe any such marks and will highlight any that are noticeable etc — but we are human and mistakes are sometimes made — with that in mind we DO offer a money back no quibble guarantee, if for ANY reason you are not happy with your purchase — please simply message us and we will be happy to help</p>

                    <div className='flex items-center gap-x-4 mt-4'>
                        <img src={FaceImage} alt="" className='w-[3rem] h-[3rem] rounded-full' />
                        <p className='text-white'>Listed for sale by <span className='text-lightOrange'>Marry</span></p>
                    </div>
                </div>

                <div className='h-[fit] bg-[#0d2539] rounded-md md:mt-0 mt-4 mb-4 md:mb-0'>
                    <img src={ConventionImage} alt="" className='w-[54rem]' />
                    <div className='flex justify-between items-center m-2'>
                        <div>
                            <p className='text-white font-semibold'>£13.95</p>
                            <p className='text-white'>Used</p>
                        </div>
                        <div>
                            <Button title={"Enquire Now"} className={`text-white bg-lightOrange w-[7rem] h-[2.3rem] rounded-md`}/>
                        </div>
                    </div>
                </div>

            </div>


            <div className='mt-4 p-3'>
                <p>All games are listed for sale by other members of Totally TableTop. Any arrangement is directly between users, and Totally TableTop takes no responsibility for the quality of games or accuracy of listings. Follow our <span className='text-lightOrange'>tips for staying safe when buying and selling.</span></p>
            </div>




        </div>
    )
}

export default SingleGame
