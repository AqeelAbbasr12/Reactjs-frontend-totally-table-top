import React, { useEffect, useState } from 'react'
import Button from './Button'
import Input from './Input'
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom'
import { FaBell } from 'react-icons/fa'
import { BiSolidMessage } from 'react-icons/bi'
import FaceImage from '../assets/face.avif'
import { BsFillCaretDownFill } from 'react-icons/bs'
import logoImage from '../assets/logo.png'
import toastr from 'toastr';
import NotificationComponent from './NotificationComponent';
import MessageComponent from './MessageComponent';
import { fetchWithAuth } from '../services/apiService';
import { FaRegStar } from 'react-icons/fa'
import { FaMessage } from 'react-icons/fa6'
import { FaLocationDot } from 'react-icons/fa6'
import { formatDistanceToNow, parseISO } from 'date-fns';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Navbar = ({ type }) => {
    const navigate = useNavigate();
    const [showMenu, setshowMenu] = useState(false)
    const [user, setUser] = useState(null);
    const [showNotificationDot, setShowNotificationDot] = useState(false);
    const notification_user_id = localStorage.getItem('notification');
    // console.log('Notification User ID', notification_user_id);

    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState({ users: [], conventions: [] });
    const [showSuggestion, setShowSuggestion] = useState(false);


    const handleNewMessage = () => {
        // Update message count
        setUser(prevUser => ({
            ...prevUser,
            message_count: (prevUser?.message_count || 0) + 1
        }));
    };

    useEffect(() => {
        // Get current user ID from token
        const token = localStorage.getItem('authToken');
        let currentUserId = null;
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                currentUserId = decodedToken.sub || decodedToken.sub;
            } catch (error) {
                // console.error('Error decoding JWT:', error);
            }
        }
        // Function to handle new message

        // Get notification user ID from localStorage
        const notificationUserId = localStorage.getItem('notification');

        // Check if currentUserId and notificationUserId match
        if (currentUserId === notificationUserId) {
            setShowNotificationDot(true);
        } else {
            setShowNotificationDot(false);
        }


        const fetchUserData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/user/get`, {
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

                setUser(data);
            } catch (error) {
                // console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/user/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                throw new Error('Failed to log out');
            }

            // Remove authToken from localStorage
            localStorage.removeItem('authToken');

            // Show success message
            toastr.success('Log out successfully');

            // Navigate to the home page
            navigate('/');
        } catch (error) {
            // console.error('Error during logout:', error);
            toastr.error('Error logging out');
        }
    };

    const removeNotificationUserId = () => {
        localStorage.removeItem('notification');
        setShowNotificationDot(false); // Hide the notification dot
    };

    // search 

    // Handle search input change
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setShowSuggestion(true);
        if (query.length > 0) {
            fetchSuggestions(query);
        } else {
            setSuggestions({ users: [], conventions: [] }); // Clear suggestions when query is empty
        }
    };


    // Fetch search suggestions
    const fetchSuggestions = async (query) => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/search?query=${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch suggestions');
            }

            const data = await response.json();
            console.log(data); // To check structure and content of response
            // Update suggestions state with both users and conventions
            setSuggestions({
                users: data.users || [],
                conventions: data.conventions || []
            });
        } catch (error) {
            // console.error('Error fetching suggestions:', error);
        } finally {
            setLoading(false);
        }
    };

    return (

        <>
            {
                type === "verified" ?

                    <div className='w-[100%] min-h-[10vh] md:h-[10vh] bg-[#0d2539] px-[1rem] md:px-[2rem] flex justify-between items-center border-b-4 border-lightYellow'>

                        <div className='flex gap-x-[1rem] items-center'>
                            <div onClick={() => navigate("/home")} className='md:w-[5rem] cursor-pointer w-[2.4rem] md:h-[3rem] h-[2.4rem]  flex justify-center items-center'>
                                <img src={logoImage} alt='' />
                            </div>
                            <div className='relative w-[18rem] sm:block hidden'>
                                <Input
                                    onChange={handleSearchChange}
                                    type={"text"}
                                    name={"search"}
                                    value={searchQuery}
                                    placeholder={"Search for conventions or people"}
                                    className={"w-[18rem] outline-none h-[2.3rem] px-3 bg-darkBlue rounded-md text-white"}
                                />

                                {showSuggestion && searchQuery.length > 0 && (
                                    <div className="absolute top-[2.5rem] left-0 right-0 bg-[#102f47] text-white rounded-md shadow-lg max-h-[40rem] overflow-y-auto w-screen sm:w-[95rem] mx-auto">
                                        {loading ? (
                                            <p className="p-2">Loading...</p>
                                        ) : (
                                            <>
                                                {suggestions.users.length > 0 && (
                                                    <>
                                                        <p className="p-2 font-bold">Users</p>
                                                        <div className="flex flex-wrap gap-4 p-2">
                                                            {suggestions.users.map((user, index) => (
                                                                <Link
                                                                    key={index}
                                                                    to={user.is_friend ? `/feed/${user.id}` : `/viewprofile/${user.id}`}
                                                                    className="p-1 hover:bg-[#F3C15F] cursor-pointer"
                                                                >
                                                                    <div className="bg-[#0d2539] w-[15rem] h-[18rem] rounded-md p-3 flex justify-center items-center flex-col">
                                                                        <div className="flex justify-center items-center">
                                                                            <img
                                                                                src={user.profile_picture || FaceImage}
                                                                                alt={`${user.first_name} ${user.last_name}`}
                                                                                className="w-[6rem] h-[6rem] rounded-full"
                                                                            />
                                                                        </div>
                                                                        <p className="text-white mt-3 font-bold">
                                                                            {user.first_name} {user.last_name}
                                                                        </p>
                                                                        <p className="text-white mt-1 font-thin">@{user.username}</p>
                                                                    </div>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}

                                                {suggestions.conventions.length > 0 && (
                                                    <>
                                                        <p className="p-2 font-bold">Conventions</p>


                                                        {suggestions.conventions.map((convention, index) => (
                                                            <Link
                                                                key={index}
                                                                to={`/convention/attendance/${convention.id}`}
                                                                className='block mx-auto max-w-[90rem] bg-[#0d2539] py-3 px-4 mt-4 mb-4 rounded-md border border-transparent hover:border-[#F3C15F] transition-colors duration-300'
                                                            >
                                                                <div className='flex justify-between items-center'>
                                                                    <div className='flex items-center gap-x-4'>
                                                                        <div className='flex items-center'>
                                                                            <img
                                                                                src={FaceImage}
                                                                                alt=""
                                                                                className='w-[3rem] h-[3rem] rounded-full'
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <h1 className='text-lg font-semibold text-white'>{convention.name}</h1>
                                                                        </div>
                                                                    </div>
                                                                    <p className='text-white'>{formatDistanceToNow(parseISO(convention.created_at), { addSuffix: true })}</p>
                                                                </div>
                                                                <div className='flex items-center gap-x-3 mt-4'>
                                                                    <FaLocationDot className='text-lightOrange' />
                                                                    <p className='text-white'>{convention.location}</p>
                                                                </div>
                                                                <p className='text-white mt-3'>{convention.description}</p>

                                                                <div className='flex items-center gap-x-4 mt-4'>
                                                                    <div className='flex items-center gap-x-2'>
                                                                        <FaMessage className='text-white' />
                                                                        <p className='text-white'>0</p>
                                                                    </div>
                                                                    <FaRegStar className='text-white' />
                                                                </div>
                                                            </Link>
                                                        ))}

                                                    </>
                                                )}


                                                {suggestions.users.length === 0 && suggestions.conventions.length === 0 && (
                                                    <p className="p-2">No results found</p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                        </div>

                        <div className='flex gap-x-[1rem] items-center w-fit'>
                            <Link to={"/messages"} className='relative w-[2.3rem] h-[2.3rem] rounded-full flex justify-center items-center bg-darkBlue'>
                                <BiSolidMessage className='text-lg text-white' />

                                {/* Only display the counter if message_count is greater than 0 */}
                                {user && user.message_count > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red text-white text-xs font-bold w-[1.2rem] h-[1.2rem] rounded-full flex justify-center items-center">
                                        {user.message_count}
                                    </span>
                                )}
                            </Link>
                            <div className='relative'>
                                <Link to={"/notification"} className='w-[2.3rem] h-[2.3rem] rounded-full flex justify-center items-center bg-darkBlue' onClick={removeNotificationUserId}>
                                    <FaBell className='text-lg text-white' />
                                    {/* Show red dot if notification should be displayed */}
                                    {showNotificationDot && (
                                        <span className='absolute top-0 right-0 h-[0.8rem] w-[0.8rem] rounded-full bg-red'></span>
                                    )}
                                </Link>
                            </div>
                            <div className=' relative flex justify-between items-center px-2 rounded-xl py-1 bg-darkBlue w-[10rem] cursor-pointer'>
                                <div onClick={() => setshowMenu(!showMenu)} className='flex gap-x-3 items-center'>
                                    <p className='text-white'>{user ? user.username : 'Loading...'}</p>
                                    <BsFillCaretDownFill className='text-white' />
                                </div>
                                <img onClick={() => setshowMenu(!showMenu)} src={user ? user.profile_picture : FaceImage} alt="" className='w-[2rem] h-[2rem] rounded-full' />
                                {
                                    showMenu && (
                                        <div className=' absolute left-0 top-[3.4rem] w-full h-[fit] p-2 rounded-md bg-[#0d2539] z-50'>
                                            <Link to={"/profile"} className='text-white mb-2 cursor-pointer block'>View profile</Link>
                                            <Link onClick={handleLogout} className='text-white cursor-pointer block '>Logout</Link>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    :

                    <div className='w-[100%] h-[10vh] md:h-[14vh] bg-[#0d2539] px-[1rem] md:px-[2rem] flex justify-between items-center border-b-4 border-lightYellow'>

                        <div className='flex gap-x-[1rem] items-center'>
                            <div className='md:w-[3rem] w-[2.4rem] md:h-[3rem] h-[2.4rem]flex justify-center items-center'>
                                <img src={logoImage} alt='' />
                            </div>
                            <h1 className='sm:block hidden md:text-3xl text-white font-semibold'>Totally Table Top</h1>
                        </div>

                        <div className='flex gap-x-[1rem] items-center w-fit'>
                            <p className='text-white text-nowrap'>Need help ?</p>
                            <Button onClickFunc={() => nav("/register-form")} title={"Create an account"} className={"md:px-0 px-1 w-fit text-sm md:w-[12rem] h-[2.3rem] rounded-md text-white bg-lightOrange"} />
                        </div>
                    </div>

            }
            <MessageComponent onNewMessage={handleNewMessage} />
            <NotificationComponent />
        </>
    )
}

export default Navbar
