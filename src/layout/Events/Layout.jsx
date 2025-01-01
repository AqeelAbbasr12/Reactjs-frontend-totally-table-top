import React, { useState, useEffect } from "react";
import Navbar from '../../components/Navbar'
import ConventionImage from '../../assets/traditional.png'
import { FaCalendarAlt, FaDiceFive, FaList } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { BsFillCaretDownFill } from 'react-icons/bs'
import Button from '../../components/Button'
import { FaLocationDot } from 'react-icons/fa6'
import { fetchWithAuth } from "../../services/apiService";
import toastr from 'toastr';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Layout = () => {
    const data = [1, 2, 3, 4, 5]
    const nav = useNavigate()
    const [events, setEvents] = useState([]);
    const [convention, setConvention] = useState([]);
    const { convention_id } = useParams();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents(convention_id);
        fetchConventions(convention_id);
    }, []);

    const fetchEvents = async () => {
        setLoading(true); // Show loading spinner while fetching
        try {
            const response = await fetchWithAuth(`/user/convention_event/${convention_id}`, {
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
            // Transform data into the format required by react-select
            // console.log(data);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching Events data:', error);
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };

    const fetchConventions = async (convention_id) => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/convention/${convention_id}`, {
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
            setConvention(data);
            // console.log(data);
        } catch (error) {
            console.error('Error fetching conventions data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
        const day = date.getDate();
        const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
        const year = date.getFullYear();

        // Add the 'st', 'nd', 'rd', 'th' suffix
        const suffix = day % 10 === 1 && day !== 11 ? 'st' :
            day % 10 === 2 && day !== 12 ? 'nd' :
                day % 10 === 3 && day !== 13 ? 'rd' : 'th';

        return `${weekday}, ${day}${suffix}, ${month}, ${year}`;
    };

    const handleDelete = async (id) => {
        // Show confirmation dialog
        const confirmed = window.confirm("Are you sure you want to delete this event? This action cannot be undone.");

        if (!confirmed) {
            return; // Exit the function if the user cancels
        }

        try {
            const response = await fetch(`${API_BASE_URL}/user/convention_event/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            if (response.ok) {
                // Show success message
                toastr.success('Event deleted successfully!');
                fetchEvents(convention_id); // Refresh the events list
            } else {
                console.error('Failed to delete event', response.statusText);
                // Optionally show an error message
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            // Optionally show an error message
        }
    };

    return (
        <div className='flex flex-col w-[100vw] h-[100vh] overflow-y-auto'>
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
                </div>
            )}
            <Navbar type={"verified"} />

            <div className='bg-black md:px-[2rem] px-[1rem] flex items-center gap-x-4 py-3'>
                <a href="/profile" className='text-white'>
                    Account
                </a>
                <BsFillCaretDownFill className=' text-lightOrange -rotate-90' />

                <a href="/user/convention" className='text-white'>
                    Your conventions
                </a>
                <BsFillCaretDownFill className=' text-lightOrange -rotate-90' />

                <a href="#" className='text-white'>
                    Your Tables
                </a>
            </div>


            <div className='md:px-[2rem] px-[1rem] bg-darkBlue h-[86vh] w-[100vw] pt-3 overflow-y-auto'>

                <div className='flex justify-between items-start sm:items-center flex-wrap w-[100%] sm:flex-row flex-col'>
                    <div className='flex items-center gap-x-4'>
                        <div className='min-w-[3rem] min-h-[3rem] rounded-full bg-lightOrange  flex justify-center items-center'><img src={convention.convention_logo || ConventionImage} alt="" className='w-[3rem] h-[3rem] rounded-full object-cover' /></div>
                        <h1 className='text-3xl font-bold text-white'>{convention.convention_name} Tables</h1>
                    </div>
                    <Button onClickFunc={() => { nav(`/new/event/${convention_id}`) }} title={"Add New"} className={`w-[8rem] h-[2.3rem] rounded-md border border-lightOrange text-white sm:mt-0 mt-3`} />
                </div>


                <div className='mt-6'>
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="w-full sm:h-[12rem] bg-[#0d2539] p-3 rounded-md flex justify-between items-start relative sm:flex-row flex-col mt-4"
                        >
                            <div className="w-full sm:w-auto">
                                <h1 className="text-lg font-semibold text-white break-all">
                                    {event.event_name} on {formatDate(event.event_date).split(',')[0]}
                                </h1>

                                <div className="flex flex-wrap items-center gap-4 mt-4">
                                    <div className="flex items-center gap-x-2">
                                        <FaCalendarAlt className="text-lightOrange" />
                                        <p className="text-white">{event.event_time}  {formatDate(event.event_date)}</p>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <FaLocationDot className="text-lightOrange" />
                                        <p className="text-white">{event.event_location}</p>
                                    </div>
                                </div>

                                {/* Mapping through invitations */}
                                <div className="flex items-center mt-4">
                                    {event.invitations.map((invitation) => (
                                        <img
                                            key={invitation.invite_receiver_image} // Add key for each image
                                            src={invitation.invite_receiver_image}
                                            className="w-[2rem] h-[2rem] rounded-full object-cover"
                                            alt="Invitation"
                                        />
                                    ))}
                                </div>

                                {/* Buttons Section */}
                                <div className="flex flex-wrap items-center gap-3 mt-4 w-full">
                                    <Button
                                        onClickFunc={() => nav(`/edit/event/${event.id}/convention/${convention_id}`)}
                                        title={"Edit"}
                                        className="w-full sm:w-[8rem] h-[2.3rem] rounded-md border border-lightOrange text-white"
                                    />
                                    <Button
                                        onClickFunc={() => handleDelete(event.id)}
                                        title={"Delete"}
                                        className="w-full sm:w-[8rem] h-[2.3rem] rounded-md border border-red text-white"
                                    />
                                </div>
                            </div>

                            {/* Image Section */}
                            <div className="sm:mt-0 mt-4 w-full sm:w-auto">
                                <img
                                    src={event.event_image || ConventionImage}
                                    alt=""
                                    className="h-[10rem] w-full sm:w-auto object-cover"
                                />
                            </div>
                        </div>

                    ))}
                </div>



            </div>




        </div>
    )
}

export default Layout
