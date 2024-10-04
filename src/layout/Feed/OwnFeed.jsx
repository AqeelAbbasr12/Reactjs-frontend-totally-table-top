
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom';
import { FaCaretDown, FaRegStar } from 'react-icons/fa'
import FaceImage from '../../assets/face.avif'
import Button from '../../components/Button'
import { FaMessage } from 'react-icons/fa6'
import { IoIosAlert } from 'react-icons/io'
import { useParams, useLocation } from 'react-router-dom';
import Input from '../../components/Input'
import { fetchWithAuth } from '../../services/apiService';
import toastr from 'toastr';
import { formatDistanceToNow, parseISO } from 'date-fns';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OwnFeed = () => {
    const data = [1, 2, 3, 4, 5, 6, 7]
    const currentLocation = useLocation().pathname
    const [loading, setLoading] = useState();
    const [user, setUser] = useState([]);
    const nav = useNavigate();
    const [ownFeeds, setOwnFeed] = useState([]);
    const [content, setContent] = useState('');


    useEffect(() => {
        fetchUser();
        fetchOwnFeed();
    }, []);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/get`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            // console.log(data);
            setUser(data);

        } catch (error) {
            console.error('Error fetching friends data:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const handlePost = async (e) => {
        e.preventDefault(); // Prevent the default form submission

        // Validate input
        if (!content.trim()) {
            toastr.error('Please enter some content.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/user/post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Include your token if needed
                },
                body: JSON.stringify({ content }), // Send the content as JSON
            });

            if (!response.ok) {
                const result = await response.json();
                toastr.error('Failed to create post.');
                throw new Error('Failed to create post'); // Handle error response
            }

            if (response.ok) {
                fetchOwnFeed();
                toastr.success('Post created successfully!');
            }

            // Reset content after successful post
            setContent('');
        } catch (error) {
            console.error('Error creating post:', error);
            alert('There was an error creating the post.'); // Handle error appropriately
        }
    };

    const fetchOwnFeed = async () => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/ownfeed`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setOwnFeed(data);
            }

        } catch (error) {
            console.error('Error fetching friends data:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const formatDescription = (content) => {
        if (!content) return null; // Handle case where content is undefined or null

        // Regex to detect URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        // Split the content into lines and map over them
        return content.split(/[\r\n]+/).map((line, index) => {
            // Replace URLs with clickable links
            const formattedLine = line.split(urlRegex).map((part, i) => {
                if (urlRegex.test(part)) {
                    return (
                        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-lightOrange underline">
                            {part}
                        </a>
                    );
                }
                return part;
            });

            // Return the formatted line with <br /> at the end
            return (
                <React.Fragment key={index}>
                    {formattedLine}
                    <br />
                </React.Fragment>
            );
        });
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

    return (
        <div className='flex flex-col w-[100vw] min-h-[100vh] max-h-fit overflow-y-auto bg-darkBlue'>
            {/* Loading Spinner */}
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
                </div>
            )}
            <Navbar type={"verified"} />
            {
                currentLocation.includes("ownFeed") && (
                    <div className='bg-white p-2 flex items-center gap-x-3'>
                        <IoIosAlert className='text-red' />
                        <p>You are viewing your own profile</p>
                    </div>
                )
            }

            <div className='flex justify-between items-center md:px-[2rem] px-[1rem] mt-4'>
                <h1 className='text-xl text-white font-semibold'>{user.username}'s feed</h1>
                <div className='flex items-center gap-x-4'>
                    {
                        currentLocation.includes("ownFeed") && (
                            <Button title={"Post update"} className={`w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange`} />
                        )
                    }

                    <div className='border border-[#707070] w-[13rem] h-[2.3rem] rounded-md bg-transparent flex justify-center items-center gap-x-4 cursor-pointer'>
                        <p className='text-white'>Showing all updates</p>
                        <FaCaretDown className='text-white' />
                    </div>
                </div>
            </div>

            <div className='flex items-start md:flex-row flex-col mt-[5rem] md:px-[2rem] px-[1rem] gap-x-[2rem]'>
                <div className='bg-[#0d2539] relative min-w-full md:min-w-[13rem] p-2 rounded-md h-[fit] md:mb-0 mb-3'>
                    <img src={user.profile_picture || FaceImage} alt="" className=' absolute top-[-3rem] left-[40%] md:left-[27%] w-[6rem] h-[6rem] rounded-full' />
                    <p className='text-center text-white font-semibold mt-[2.5rem] text-lg'>{user.first_name} {user.last_name}</p>
                    <p className='text-center text-white mt-2'>@{user.username}</p>
                    {/* {
                        !currentLocation.includes("ownFeed") && (
                            <Button title={"Add as friend"} className={`w-full h-[2.3rem] text-white rounded-md bg-lightOrange my-2`} />
                        )
                    } */}
                    <Button onClickFunc={() => nav("/profile")} title={currentLocation.includes("ownFeed") ? "Edit Profile" : "Message"} className={`w-full h-[2.3rem] border border-white text-white rounded-md my-2`} />
                    <p className='text-center text-white mt-2'>{user.total_friends} friends</p>
                    <p className='text-center text-white my-2'>Member since {user.member_since}</p>

                </div>
                <div className='flex-1'>
                    {
                        currentLocation.includes("ownFeed") && (
                            <div className='w-[100%] bg-[#0d2539] py-5 px-5 mt-0 rounded-md mb-2'>
                                <form onSubmit={handlePost}> {/* Use form element */}
                                    <div className='flex items-start gap-x-4'>
                                        <img src={user.profile_picture || FaceImage} alt="Profile" className='w-[2.5rem] h-[2.5rem] rounded-full' />
                                        <textarea
                                            type={"text"}
                                            name={"content"}
                                            placeholder={"Tell your friend what's happening...."}
                                            className={"flex-1 bg-[#102F47] text-white h-[10rem] px-3 placeholder:text-start"}
                                            value={content} // Bind input value
                                            onChange={(e) => setContent(e.target.value)} // Handle input change
                                        />
                                    </div>
                                    <div className='flex justify-between items-center mt-4'>
                                        <p className='text-white'>Updates are visible to your friends.</p>
                                        <Button
                                            title={loading ? "Posting..." : "Post update"}
                                            type="submit" // Set button type to submit
                                            disabled={loading}
                                            className={"w-[8rem] h-[2.3rem] rounded-md bg-[#E78530] text-white"}
                                        />
                                    </div>
                                </form>
                            </div>
                        )
                    }
                    {ownFeeds.map((feedItem) => (
                        <div key={feedItem.id} className='w-[100%] bg-[#0d2539] py-3 px-4 mt-0 rounded-md mb-2'>
                            {(() => {
                                switch (feedItem.type) {
                                    case 'convention_attendance':
                                        return (
                                            <>
                                                <div className='flex justify-between items-center'>
                                                    <div className='flex items-center gap-x-4'>
                                                        <div className='flex items-center'>
                                                            <img src={user.profile_picture || FaceImage} alt="" className='w-[3rem] h-[3rem] rounded-full' />
                                                            <div className='w-[3rem] h-[3rem] rounded-full flex justify-center items-center bg-lightOrange'>UKGE</div>
                                                        </div>
                                                        <div>
                                                            <p className='text-white'>
                                                                <span className='text-lightOrange'>You</span> are attending <span
                                                                    onClick={() => nav(`/convention/attendance/${feedItem.convention_attendance.convention_id}`)}
                                                                    className='text-lightOrange underline ml-1 cursor-pointer'
                                                                >
                                                                    {feedItem.convention_attendance.convention_name}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className='text-white'>{formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}</p>
                                                </div>
                                                <p className='text-white mt-3'>
                                                    You will attend {feedItem.convention_attendance.convention_name} on {feedItem.convention_attendance.attendance_date}
                                                </p>
                                                <div className='flex items-center gap-x-4 mt-4'>
                                                    <div className='flex items-center gap-x-2'>
                                                        <FaMessage className='text-white' />
                                                        <p className='text-white'>0</p>
                                                    </div>
                                                    <FaRegStar className='text-white' />
                                                </div>
                                            </>
                                        );

                                    case 'post_creation':
                                        return (
                                            <>
                                                <div className='flex justify-between items-center'>
                                                    <div className='flex items-center gap-x-4'>
                                                        <img src={user.profile_picture || FaceImage} alt="" className='w-[3rem] h-[3rem] rounded-full' />
                                                        <div>
                                                            <p className='text-white'>
                                                                <span className='text-lightOrange'>You </span> posted on update:
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className='text-white'>{formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}</p>
                                                </div>
                                                <p className='text-white mt-3'>{formatDescription(feedItem.post.content)}</p>
                                                <div className='flex items-center gap-x-4 mt-4'>
                                                    <div className='flex items-center gap-x-2'>
                                                        <FaMessage className='text-white' />
                                                        <p className='text-white'>0</p>
                                                    </div>
                                                    <FaRegStar className='text-white' />
                                                </div>
                                            </>
                                        );

                                    case 'convention_accommodation':
                                        return (
                                            <>
                                                <div className='flex justify-between items-center'>
                                                    <div className='flex items-center gap-x-4'>
                                                        <div className='flex items-center'>
                                                            <img src={user.profile_picture || FaceImage} alt="" className='w-[3rem] h-[3rem] rounded-full' />
                                                            <div className='w-[3rem] h-[3rem] rounded-full flex justify-center items-center bg-lightOrange'>UKGE</div>
                                                        </div>
                                                        <div>
                                                            <p className='text-white'>
                                                                <span className='text-lightOrange'>You</span> are staying at <span onClick={() => nav(`/accomodation/${feedItem.convention_id}`)} className='text-lightOrange underline ml-1 cursor-pointer'>{feedItem.convention_accommodation.location_name}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className='text-white'>{formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}</p>
                                                </div>
                                                <p className='text-white mt-3'>
                                                    From  <span className='text-lightOrange'>{formatDate(feedItem.convention_accommodation.from_date)}</span> To <span className='text-lightOrange'>{formatDate(feedItem.convention_accommodation.to_date)}</span> for 
                                                    <span onClick={() => nav(`/convention/attendance/${feedItem.convention_id}`)} className='text-lightOrange underline ml-1 cursor-pointer'>{feedItem.convention_accommodation.convention_name}</span>
                                                </p>
                                                <div className='flex items-center gap-x-4 mt-4'>
                                                    <div className='flex items-center gap-x-2'>
                                                        <FaMessage className='text-white' />
                                                        <p className='text-white'>0</p>
                                                    </div>
                                                    <FaRegStar className='text-white' />
                                                </div>
                                            </>
                                        );

                                    case 'profile_update':
                                        return (
                                            <>
                                                <div className='flex justify-between items-center'>
                                                    <div className='flex items-center gap-x-4'>
                                                        <img src={user.profile_picture || FaceImage} alt="" className='w-[3rem] h-[3rem] rounded-full' />
                                                        <div>
                                                            <p className='text-white'>
                                                                <span className='text-lightOrange'>You </span> updated your <span className='text-lightOrange'> Profile</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className='text-white'>{formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}</p>
                                                </div>
                                                <div className='flex items-center gap-x-4 mt-4'>
                                                    <div className='flex items-center gap-x-2'>
                                                        <FaMessage className='text-white' />
                                                        <p className='text-white'>0</p>
                                                    </div>
                                                    <FaRegStar className='text-white' />
                                                </div>
                                            </>
                                        );

                                    case 'convention_game':
                                        return (
                                            <>
                                                <div className='flex justify-between items-center'>
                                                    <div className='flex items-center gap-x-4'>
                                                        <img src={user.profile_picture || FaceImage} alt="" className='w-[3rem] h-[3rem] rounded-full' />
                                                        <div>
                                                            <p className='text-white'>
                                                                <span className='text-lightOrange'>You </span> are selling 
                                                                <span onClick={() => nav(`/game/single/${feedItem.convention_game.id}`)} className='text-lightOrange underline ml-1 cursor-pointer'> {feedItem.convention_game.game_name}</span> under 
                                                                <span onClick={() => nav(`/convention/attendance/${feedItem.convention_id}`)} className='text-lightOrange underline ml-1 cursor-pointer'> {feedItem.convention_game.convention_name}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className='text-white'>{formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}</p>
                                                </div>
                                                <p className='text-white mt-3'><b>{feedItem.convention_game.game_currency_tag}{feedItem.convention_game.game_price}</b> ({feedItem.convention_game.game_condition})</p>
                                                <p className='text-white mt-3'>{formatDescription(feedItem.convention_game.game_desc)}</p>
                                                <div className='flex items-center gap-x-4 mt-4'>
                                                    <div className='flex items-center gap-x-2'>
                                                        <FaMessage className='text-white' />
                                                        <p className='text-white'>0</p>
                                                    </div>
                                                    <FaRegStar className='text-white' />
                                                </div>

                                            </>
                                        );

                                    // Handle other types (like 'convention_game', 'convention_accommodation', etc.) similarly.

                                    default:
                                        return null;
                                }
                            })()}

                            {/* This part stays the same across all feed types */}

                        </div>
                    ))}
                    

                </div>
            </div>
        </div>
    )
}

export default OwnFeed
