import React, { useState, useEffect } from "react";
import Navbar from '../../../components/Admin/Navbar';
import FaceImage from '../../../assets/profile.jpeg'
import ConventionImage from '../../../assets/traditional.png'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';
import { IoMdFlag } from 'react-icons/io';
import { useParams } from 'react-router-dom';
import { BsFillCaretDownFill } from 'react-icons/bs'
import Button from '../../../components/Button'
import { fetchWithAuth } from "../../../services/apiService";


const SingleEvent = () => {
    const { event_id } = useParams();
    const nav = useNavigate()

    const [event, setEvent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvent();
    }, []);



    const fetchEvent = async () => {
        setLoading(true); // Show loading spinner while fetching
        try {
            const response = await fetchWithAuth(`/user/events/${event_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
            setEvent(data);
        } catch (error) {
            // console.error('Error fetching Events data:', error);
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };

    const formatGameDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: 'long', year: 'numeric' }; // Options for formatting
        return date.toLocaleDateString('en-US', options); // Format the date
    };

    const formatDescription = (desc) => {
        if (!desc) return null; // Handle case where desc is undefined or null

        return desc.split(/[\r\n]+/).map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };



    return (
        <div className='bg-[#102F47] w-full opacity-100 min-h-screen'>
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
                </div>
            )}
            <Navbar />

            

            <div className='md:px-[2rem] px-[1rem] pt-48 bg-darkBlue w-[100vw] overflow-y-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-y-6 md:gap-x-6'>


                {/* Left Section */}
                <div className='flex-1'>
                    <h1 className='text-white text-3xl font-semibold'>{event.event_name}</h1>
                    <p className='text-white mt-2'>{formatGameDate(event.event_date)} {event.event_time}  Table</p>
                    <p className='text-white mt-3'>{event.event_location}</p>
                    <p className='text-white mt-3'>{formatDescription(event.event_description)}</p>

                    <div className='flex items-center gap-x-4 mt-4'>
                        <img src={event.user_image || FaceImage} alt="" className='w-[3rem] h-[3rem] rounded-full object-cover' />
                        <p className='text-white'>Listed by <span className='text-lightOrange'>{event.user_name}</span></p>
                    </div>
                    {/* Flag Icon Section */}
                     {/* Invitations */}
                
                    
                </div>

                {/* Right Section */}
                <div className='h-fit bg-[#0d2539] rounded-md relative md:mt-0 mt-4 mb-4 md:mb-0 md:w-[30rem]'>
                    {event.game_status === 'sold' && (
                        <div className="absolute top-0 right-0 w-0 h-0 border-t-[100px] border-t-red border-l-[100px] border-l-transparent">
                            <p className="absolute top-[-85px] right-[0px] rotate-45 text-white font-bold text-lg">
                                SOLD
                            </p>
                        </div>
                    )}

                    <img src={event.event_image || ConventionImage} alt="" className='w-full md:w-[54rem] object-cover' />

              
                 
                </div>

            </div>

            {/* Game Images Grid */}



        </div>

    )
}

export default SingleEvent
