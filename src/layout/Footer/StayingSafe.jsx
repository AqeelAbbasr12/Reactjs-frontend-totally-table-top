import React from 'react'
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom'
import Bottom from '../../layout/Footer/Bottom';

const StayingSafe = () => {
    const nav = useNavigate()

    return (
        <>
            <Navbar />
            <div className='flex justify-center md:flex-row flex-col bg-darkBlue p-[1rem] md:p-[2rem] gap-x-[4rem] h-[100vh]'>
                <div className=''>
                    <h1 className='text-3xl font-semibold text-white mb-4'>Staying safe</h1>
                    <p className='text-white mb-2 w-[100%] md:w-[60%]'>Throughout our site ensure you check the profile of anyone who contacts you unsolicited before accepting a friends request.</p>
                    <p className='text-white mb-2 w-[100%] md:w-[60%]'>Use the search function to specifically find your friends through their email or handle. </p>
                    <p className='text-white mb-2 w-[100%] md:w-[60%]'>Review your <span className='text-f3c15f'>privacy settings</span> and configure according to your preference.</p>
                    <p className='text-white mb-2 w-[100%] md:w-[60%]'>When making a purchase of game only use <span className='text-f3c15f'>PayPal</span> goods and services which means you have some protection when transferring funds to any seller. You will not be able to make a claim for goods that are paid for through friends and family with PayPal.</p>
                    <p className='text-white mb-2 w-[100%] md:w-[60%]'>Collect or deliver the game in a public place and make someone is aware of where you will be.</p>
                    <p className='text-white mb-2 w-[100%] md:w-[60%]'><span className='text-f3c15f'>Report any abusive or rude behaviour</span> and a person will review your report. </p>
                    
                </div>
            </div>

            <Bottom />
        </>
    )
}

export default StayingSafe
