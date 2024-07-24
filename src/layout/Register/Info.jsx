import React from 'react'
import Navbar from '../../components/Navbar'
import PCImage from '../../assets/Pc.png'
import Calendar from '../../assets/calendar.svg'
import Bag from '../../assets/bag.svg'
import Sell from '../../assets/sell.svg'
import Connect from '../../assets/root.svg'
import Agenda from '../../assets/agenda.svg'
import Share from '../../assets/share.svg'
import Clock from '../../assets/clock.svg'
import FaceImage from '../../assets/face.avif'
import { FaChevronDown } from 'react-icons/fa'
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'
import Bottom from '../../layout/Footer/Bottom';

const Info = () => {
    const nav = useNavigate()
    const data = [
        { image: Calendar, heading: "Manage conventions", desc: "Plan and manage your board game convention attendance throughout the year." },
        { image: Sell, heading: "Sell Games", desc: "Advertise board games for sale at the conventions you attend, and get great deals on games." },
        { image: Bag, heading: "Buy Games", desc: "search our market of games available to buy from other users who are attending." },
        { image: Connect, heading: "Connect", desc: "instantly message and invite friends to game with you at the perfect time." },
        { image: Agenda, heading: "Agenda", desc: "Create a handy list of stands and events you wish to visit at the convention." },
        { image: Share, heading: "Share", desc: "optionally create social media posts to send to your friends or public activity feeds." },

    ]
    return (
        <>
            <Navbar />
            <header className='flex justify-center items-center md:flex-row flex-col bg-darkBlue p-[1rem] md:p-[2rem] gap-x-[4rem]'>
                <div className=''>
                    <h1 className='text-3xl font-semibold text-white'>Why Create An Account ?</h1>
                    <p className='text-white mt-4 w-[100%] md:w-[60%]'>Effectively organize your time at conventions so you can get the most out of each day </p>
                    <p className='text-white mt-4 w-[100%] md:w-[60%]'>Shows your friends which conventions your are attending for next 12 months </p>
                    <p className='text-white mt-4 w-[100%] md:w-[60%]'>Show weeks in advance the list of games you have for sale at an upcoming convention</p>
                    <p className='text-white mt-4 w-[100%] md:w-[60%]'>Create a personalized agenda for all the stands you wish to visit a convention </p>
                    <p className='text-white mt-4 w-[100%] md:w-[60%]'>Directly connect with friends at the convention and set a time to play games together</p>
                    <p className='text-white mt-4 w-[100%] md:w-[60%]'>Share your accomodation information with your friends too keep the gaming going till late </p>
                    <div className='flex gap-x-[1rem] md:gap-x-[2rem] items-center mt-4'>
                        <div>
                            <Button onClickFunc={() => nav("/register-form")} title={"Create an account"} className={"w-[10rem] text-sm md:w-[13rem] h-[2.3rem] rounded-md text-white bg-lightOrange"} />
                        </div>

                        <div className='flex items-center gap-x-1 md:gap-x-4'>
                            <p className='text-white'>Account features</p>
                            <FaChevronDown className='text-white cursor-pointer' />
                        </div>

                    </div>
                </div>
                <div className='md:mt-0 mt-4'>
                    <img src={PCImage} alt="" className='min-h-[20rem]' />
                </div>
            </header>

            <div className='bg-[#0d2539] w-[100%] p-[1rem] md:p-[2rem]'>
                <h1 className='text-3xl font-semibold text-white text-center mb-[2rem]'>What can we do with an account ?</h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[4rem] justify-center items-center py-10 px-[8rem]'>
                    {
                        data.map((i, index) => (
                            <div key={index} className='flex justify-center items-center flex-col mb-[1.5rem]'>
                                <div className='w-[4rem] h-[4rem] rounded-full bg-lightYellow flex justify-center items-center'>
                                    <img src={i.image} alt="" />
                                </div>
                                <h1 className='mt-2 text-white text-3xl'>{i.heading}</h1>
                                <p className='mt-2 text-white w-[20rem]'>{i.desc}</p>
                            </div>
                        ))
                    }
                </div>

                <div className='flex justify-center items-center mt-[0.5rem]'>
                    <Button onClickFunc={() => nav("/register-form")} title={"Create an account"} className={"w-[10rem] text-sm md:w-[13rem] h-[2.3rem] rounded-md text-white bg-lightOrange"} />
                </div>

            </div>

            <div className='bg-darkBlue w-[100%] p-[1rem] md:p-[2rem] flex justify-center items-center gap-x-[4rem] md:flex-row flex-col'>
                <div className='w-[100%] md:mb-0 mb-2 md:w-[40%] bg-[#0d2539] p-2 rounded-md flex items-center gap-x-[1rem]'>
                    <img src={FaceImage} alt="" className='min-w-[4rem] min-h-[4rem] max-w-[4rem] max-h-[4rem] rounded-full' />
                    <p className='text-white'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorum beatae atque optio ducimus consequatur nulla natus repellat itaque quisquam, doloribus delectus magnam eaque. Numquam cupiditate reprehenderit, id quis commodi maxime.</p>
                </div>
                <div className='w-[100%] md:mb-0 mb-2 md:w-[40%] bg-[#0d2539] p-2 rounded-md flex items-center gap-x-[1rem]'>
                    <img src={FaceImage} alt="" className='min-w-[4rem] min-h-[4rem] max-w-[4rem] max-h-[4rem] rounded-full' />
                    <p className='text-white'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorum beatae atque optio ducimus consequatur nulla natus repellat itaque quisquam, doloribus delectus magnam eaque. Numquam cupiditate reprehenderit, id quis commodi maxime.</p>
                </div>
            </div>

            <div className='bg-lightOrange w-[100%] p-[1rem] md:p-[2rem] flex justify-between items-center flex-wrap'>
                <h1 className='text-3xl font-bold text-white text-nowrap'>Ready to join?</h1>
                <Button onClickFunc={() => nav("/register-form")} title={"Create an account"} className={"w-[10rem] text-sm md:w-[13rem] h-[2.3rem] rounded-md text-black bg-lightGray"} />

            </div>

            <Bottom />
        </>
    )
}

export default Info
