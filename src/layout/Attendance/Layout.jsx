import React, { useState, useEffect } from 'react';

import Navbar from '../../components/Navbar'
import FaceImage from '../../assets/profile.jpeg'
import ConventionImage from '../../assets/traditional.png'
import { FaBuilding, FaCalendarAlt, FaDiceFive, FaList } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { BsFillCaretDownFill } from 'react-icons/bs'
import Button from '../../components/Button'
import { useParams } from 'react-router-dom';
import { TiTick } from 'react-icons/ti'
import toastr from 'toastr';
import { fetchWithAuth } from '../../services/apiService';




const Layout = () => {
    // const data = [1, 2, 3, 4, 5]
    const [loading, setLoading] = useState(true);
    const nav = useNavigate()
    const [convention, setConvention] = useState([]);
    const [attendance, setAttendance] = useState();
    const { convention_id } = useParams();
    const [AgendaItems, setItems] = useState([]);
    const [events, setEvents] = useState([]);
    const [accommodations, setAccommodation] = useState([]);
    const [games, setGames] = useState([]);
    const [showSub, setShowSub] = useState({ show: false, conventionId: null });

    useEffect(() => {
        fetchConventions(convention_id);
        fetchAttendanceData(convention_id);
        fetchAgendas(convention_id);
        fetchEvents(convention_id);
        fetchAccommodation(convention_id);
        fetchGames(convention_id);
    }, []);

    const handleShowSub = (id) => {
        setShowSub((prev) => ({
            show: prev.conventionId === id ? !prev.show : true,
            conventionId: id
        }));
        fetchAttendanceData(id);
        fetchAgendas(id);
    };

    //Fetch Convention
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

            if (data.convention_is_private === '1') {
                const storedPassword = localStorage.getItem('ConventionPassword');

                // If storedPassword doesn't exist or doesn't match, redirect to the specific convention page
                if (!storedPassword || storedPassword !== data.convention_password) {
                    toastr.error('Incorrect password or password is missing. Redirecting...');
                    window.location.href = `/single-upcoming-convention/${data.id}`;
                }
                localStorage.removeItem('ConventionPassword');
            }

            // console.log('convention', data);
        } catch (error) {
            // console.error('Error fetching conventions data:', error);
        } finally {
            setLoading(false);
        }
    };


    // Fetch saved attendance data
    const fetchAttendanceData = async (convention_id) => {
        try {
            const response = await fetchWithAuth(`/user/convention_attendance/${convention_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                const data = await response.json();
                toastr.error(data.message);
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            // console.log(data);
            setAttendance(data); // Expecting data to be an array of attendance records
        } catch (error) {
            // console.error('Error fetching attendance data:', error);
        }
    };

    const fetchAgendas = async (convention_id) => {
        try {
            const response = await fetchWithAuth(`/user/convention_agenda/${convention_id}`);
            if (!response.ok) throw new Error('Failed to fetch agendas');

            const data = await response.json();
            // console.log('Agenda Items', data);
            if (Array.isArray(data)) {
                setItems(data);  // Only set if the response is an array
            } else {
                // console.error('Invalid data structure:', data);
                setItems([]);
            }
        } catch (error) {
            // console.error('Error fetching agendas:', error);
            setItems([]);
        }
    };

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
            // console.error('Error fetching Events data:', error);
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };

    const fetchAccommodation = async (convention_id) => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/convention_accommodation/${convention_id}`, {
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

            // console.log(data);
            setAccommodation(data);
        } catch (error) {
            // console.error('Error fetching conventions data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGames = async () => {
        setLoading(true); // Show loading spinner while fetching
        try {
            const response = await fetchWithAuth(`/user/convention_game/${convention_id}`, {
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
            setGames(data);
        } catch (error) {
            // console.error('Error fetching Events data:', error);
        } finally {
            setLoading(false); // Hide loading spinner
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


            </div>


            <div className='md:px-[2rem] h-[50rem] px-[1rem] bg-darkBlue md:h-[86vh] w-[100vw] pt-3'>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full flex-wrap p-4">
                    {/* Convention Logo and Name */}
                    <div className="flex items-center gap-x-4 mb-3 sm:mb-0">
                        <div className="min-w-[3rem] min-h-[3rem] rounded-full bg-lightOrange flex justify-center items-center">
                            <img
                                src={convention.convention_logo || ConventionImage}
                                alt=""
                                className="w-[3rem] h-[3rem] rounded-full object-cover"
                            />
                        </div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white truncate">
                            {convention.convention_name}
                        </h1>
                    </div>

                    {/* Actions Dropdown */}
                    <div className="relative flex items-center gap-x-3 mt-3 sm:mt-0">
                        <p
                            onClick={() => handleShowSub(convention.id)}
                            className="text-white cursor-pointer"
                        >
                            Actions
                        </p>
                        <BsFillCaretDownFill className="text-lightOrange rotate-360" />

                        {/* Dropdown Menu */}
                        {showSub.show && showSub.conventionId === convention.id && (
                            <div className="absolute top-10 left-0 sm:left-auto sm:right-0 bg-black p-4 w-48 z-50 rounded-md shadow-lg">
                                <Link
                                    to={`/convention/attendance/${convention.id}`}
                                    className="block mb-1 cursor-pointer text-white text-sm"
                                >
                                    Your attendance
                                </Link>
                                {attendance && attendance.length > 0 && (
                                    <>
                                        <Link
                                            to={`/next/agenda/${convention.id}`}
                                            className="block mb-1 cursor-pointer text-white text-sm"
                                        >
                                            Agenda
                                        </Link>
                                        <Link
                                            to={`/accomodation/${convention.id}`}
                                            className="block mb-1 cursor-pointer text-white text-sm"
                                        >
                                            Accommodations
                                        </Link>
                                        <Link
                                            to={`/event/${convention.id}`}
                                            className="block mb-1 cursor-pointer text-white text-sm"
                                        >
                                            Tables
                                        </Link>
                                        <Link
                                            to={`/game/sale/${convention.id}`}
                                            className="block mb-1 cursor-pointer text-white text-sm"
                                        >
                                            Games for sale
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>


                <div className='w-[100%] bg-[#0d2539]  px-3 py-5 rounded-md mt-6'>

                    <div className='flex justify-between items-center'>
                        <div className='flex gap-x-3 items-center'>
                            {/* Conditional Rendering */}
                            <div className='w-[2rem] h-[2rem] flex justify-center items-center rounded-full bg-lightOrange'>
                                {attendance && attendance.length > 0 ? (
                                    <TiTick className='text-[#0d2539]' />
                                ) : (
                                    <span className='text-[#0d2539] text-xl font-bold'>?</span>
                                )}
                            </div>

                            <p className='text-white'>
                                {attendance && attendance.length > 0 ? "You’re going!" : "Do you wish to attend?"}
                            </p>
                        </div>

                        <div>
                            <Button
                                onClickFunc={() => { nav(`/conventionAttendance/${convention.id}`); }}
                                title={attendance && attendance.length > 0 ? "Change" : "Confirm here"}
                                className='w-[8rem] h-[2.3rem] rounded-md border border-lightOrange text-white'
                            />
                        </div>
                    </div>

                    {attendance && attendance.length > 0 ? (
                        <p className='text-white mt-2'>
                            Marked attending{' '}
                            {/* {attendance.map((record, index) => (
                                <span key={index}>
                                    {record.attendance_date}
                                    {index < attendance.length - 1 && (
                                        <span>{' and maybe on  '}</span>
                                    )}
                                    {index === attendance.length - 1 && attendance.length > 1}
                                </span>
                            ))} */}
                        </p>
                    ) : (
                        <p className='text-white mt-2'>
                            Please Mark Your Attendance First
                        </p>
                    )}


                </div>

                {attendance && attendance.length > 0 && (
                    <div className='sm:flex justify-center items-center gap-x-8 mt-6'>
                        <div className='flex-1 bg-[#0d2539] p-3 rounded-md'>
                            <div className='flex items-center gap-x-4'>
                                <FaList className='text-white' />
                                <p className='text-white'>Agenda</p>
                            </div>
                            <div className='flex justify-between items-center mt-3'>
                                {/* Conditionally render text based on the length of AgendaItems */}
                                <p className='text-white'>
                                    {AgendaItems.length > 0
                                        ? `Started, you have created ${AgendaItems.length} Agenda`
                                        : 'Not Started'}
                                </p>

                                <Button
                                    onClickFunc={() => { nav(`/next/agenda/${convention_id}`) }}
                                    title={"Create"}
                                    className={`w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange`}
                                />
                            </div>
                        </div>
                        <div className='flex-1 bg-[#0d2539] p-3 rounded-md sm:mt-0 mt-3'>
                            <div className='flex items-center gap-x-4'>
                                <FaBuilding className='text-white' />
                                <p className='text-white'>Accommodation</p>
                            </div>
                            <div className='flex justify-between items-center mt-3'>
                                <p className='text-white'>
                                    {accommodations.length > 0
                                        ? `${accommodations.length} Stay`
                                        : '0 Stay'}
                                </p>
                                <Button
                                    onClickFunc={() => { nav(`/accomodation/${convention_id}`) }}
                                    title={"Edit"}
                                    className={`w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange`}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {attendance && attendance.length > 0 && (
                    <div className='sm:flex justify-center items-center gap-x-8 mt-6'>
                        <div className='flex-1 bg-[#0d2539] p-3 rounded-md'>
                            <div className='flex items-center gap-x-4'>
                                <FaCalendarAlt className='text-white' />
                                <p className='text-white'>Tables</p>

                            </div>
                            <div className='flex justify-between items-center mt-3'>

                                <p className='text-white'>
                                    {events.length > 0
                                        ? `Started, you have created ${events.length} Table(s)`
                                        : 'Not Started'}
                                </p>
                                <Button
                                    onClickFunc={() => { nav(`/event/${convention_id}`) }}
                                    title={"Create"}
                                    className={`w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange`}
                                />
                            </div>
                        </div>
                        <div className='flex-1 bg-[#0d2539] p-3 rounded-md sm:mt-0 mt-3'>
                            <div className='flex items-center gap-x-4'>
                                <FaDiceFive className='text-white' />
                                <p className='text-white'>Games</p>
                            </div>
                            <div className='flex justify-between items-center mt-3'>

                                <p className='text-white'>
                                    {games.length > 0
                                        ? `${games.length} For Sale`
                                        : '0 For Sale'}
                                </p>
                                <Button
                                    onClickFunc={() => { nav(`/game/sale/${convention_id}`) }}
                                    title={"Games"}
                                    className={`w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange`}
                                />
                            </div>
                        </div>
                    </div>
                )}



            </div>




        </div>
    )
}

export default Layout
