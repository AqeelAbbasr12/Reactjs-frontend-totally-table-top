import React, { useRef } from 'react'
import Navbar from '../../components/Navbar'
import PCImage from '../../assets/Pc.png'
import info from '../../assets/info.png'
import Calendar from '../../assets/calendar.svg'
import Bag from '../../assets/bag.svg'
import Sell from '../../assets/sell.svg'
import Connect from '../../assets/root.svg'
import Agenda from '../../assets/agenda.svg'
import Share from '../../assets/share.svg'
import Clock from '../../assets/clock.svg'
import FaceImage from '../../assets/profile.jpeg'
import { FaChevronDown } from 'react-icons/fa'
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'
import Bottom from '../../layout/Footer/Bottom';

const Info = () => {
    const nav = useNavigate()
    const data = [
        { image: Calendar, heading: "Manage conventions", desc: "Plan and manage your board game convention attendance throughout the year." },
        { image: Sell, heading: "Sell Games", desc: "Advertise board games for sale at the conventions you attend" },
        { image: Bag, heading: "Buy Games", desc: "Search our market of games available to buy from other users who are attending." },
        { image: Connect, heading: "Connect", desc: "Instantly message and invite friends to game with you at the perfect time." },
        { image: Agenda, heading: "Agenda", desc: "Create a handy list of stands and events you wish to visit at the convention." },
        { image: Share, heading: "Share", desc: "Optionally create social media posts to send to your friends or public activity feeds." },

    ]

    // Create a reference to the section you want to scroll to
    const sectionRef = useRef(null);

    // Function to handle scroll on click
    const scrollToSection = () => {
        sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <Navbar />
            <header className='flex justify-center items-center md:flex-row flex-col bg-darkBlue p-[1rem] md:p-[2rem] gap-x-[4rem]'>
                <div className=''>
                    <h1 className='text-3xl font-semibold text-white'>Why Create An Account ?</h1>
                    <p className='text-white mt-4 w-[100%] md:w-[60%]'>Effectively organize your time at conventions so you can get the most out of each day </p>
                    <p className='text-white mt-4 w-[100%] md:w-[60%]'>Show your friends which conventions your are attending for next 12 months </p>
                    <p className='text-white mt-4 w-[100%] md:w-[60%]'>Advertise weeks in advance the list of games you have for sale at an upcoming convention</p>
                    <p className='text-white mt-4 w-[100%] md:w-[60%]'>Create a personalized agenda for all the stands and events you wish to visit </p>
                    <p className='text-white mt-4 w-[100%] md:w-[60%]'>Quickly and easily find a games table to join or host</p>
                    <p className='text-white mt-4 w-[100%] md:w-[60%]'>Totally TableTop is completely free to use! </p>
                    <div className='flex gap-x-[1rem] md:gap-x-[2rem] items-center mt-4'>
                        <div>
                            <Button onClickFunc={() => nav("/register-form")} title={"Create an account"} className={"w-[10rem] text-sm md:w-[13rem] h-[2.3rem] rounded-md text-white bg-lightOrange"} />
                        </div>

                        <div className='flex items-center gap-x-1 md:gap-x-4' onClick={scrollToSection}>
                            <p className='text-white cursor-pointer'>Account features</p>
                            <FaChevronDown className='text-white cursor-pointer' />
                        </div>

                    </div>
                </div>
                <div className='md:mt-0 mt-4'>
                    <img
                        src={info}
                        alt=""
                        className='w-full max-w-[33rem] h-auto max-h-[25rem] object-contain mx-auto'
                    />
                </div>

            </header>

            <div ref={sectionRef} className='bg-[#0d2539] w-[100%] p-[1rem] md:p-[2rem]'>
                <h1 className='text-3xl font-semibold text-white text-center mb-[2rem]'>What can you do with an account ?</h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[4rem] justify-center items-center py-10 px-[8rem]'>
                    {
                        data.map((i, index) => (
                            <div key={index} className='flex justify-center items-center flex-col mb-[1.5rem]'>
                                <div className='w-[4rem] h-[4rem] rounded-full bg-lightYellow flex justify-center items-center'>
                                    <img src={i.image} alt="" />
                                </div>
                                <h1 className='mt-2 text-white text-3xl'>{i.heading}</h1>
                                <p className='mt-2 text-white w-[20rem] h-[100px]'>{i.desc}</p>
                            </div>
                        ))
                    }
                </div>

                <div className='flex justify-center items-center mt-[0.5rem]'>
                    <Button onClickFunc={() => nav("/register-form")} title={"Create an account"} className={"w-[10rem] text-sm md:w-[13rem] h-[2.3rem] rounded-md text-white bg-lightOrange"} />
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
