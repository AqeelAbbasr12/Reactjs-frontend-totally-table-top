
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar'
import { FaCaretDown, FaRegStar } from 'react-icons/fa'
import FaceImage from '../../assets/profile.jpeg'
import Button from '../../components/Button'
import { FaMessage } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import { IoIosAlert } from 'react-icons/io'
import { useParams, useLocation } from 'react-router-dom';
import Input from '../../components/Input'
import { fetchWithAuth } from '../../services/apiService';
import { formatDistanceToNow, parseISO } from 'date-fns';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FriendFeed = () => {
    const data = [1, 2, 3, 4, 5, 6, 7]
    const [friendDetail, setFriendDetail] = useState([]);
    const currentLocation = useLocation().pathname
    const [loading, setLoading] = useState();
    const [friendFeeds, setFriendFeed] = useState([]);
    const { friendId } = useParams();
    const nav = useNavigate()

    useEffect(() => {
        if (friendId) {
            fetchFriendDetail(friendId);  // Pass the friendId to fetchFriendDetail
            fetchFriendFeed(friendId);
        }
    }, [friendId]);

    const fetchFriendDetail = async (friendId) => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/frienddetail/${friendId}`, {
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
            setFriendDetail(data);
        } catch (error) {
            console.error('Error fetching friends data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFriendFeed = async () => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/friendfeed/${friendId}`, {
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
                // console.log(data);
                setFriendFeed(data);
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

            {/* <div className='flex justify-between items-center md:px-[2rem] px-[1rem] mt-4'>
                <h1 className='text-xl text-white font-semibold'>{friendDetail.username}’s feed</h1>
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
            </div> */}

            <div className='flex items-start md:flex-row flex-col mt-[5rem] md:px-[2rem] px-[1rem] gap-x-[2rem]'>
                <div className='bg-[#0d2539] relative min-w-full md:min-w-[13rem] p-2 rounded-md h-[fit] md:mb-0 mb-3'>
                    <img src={friendDetail.profile_picture || FaceImage} alt="" className=' absolute top-[-3rem] left-[34%] md:left-[27%] w-[6rem] h-[6rem] rounded-full object-cover' />
                    <p className='text-center text-white font-semibold mt-[2.5rem] text-lg'>{friendDetail.first_name} {friendDetail.last_name}</p>
                    <p className='text-center text-white mt-2'>{friendDetail.username}</p>
                    {/* {
                        !currentLocation.includes("ownFeed") && (
                            <Button title={"Add as friend"} className={`w-full h-[2.3rem] text-white rounded-md bg-lightOrange my-2`} />
                        )
                    } */}
                    <Button
                        onClickFunc={() => {
                            nav(`/messages/${friendId}`);  // Removed the extra curly brace here
                        }}
                        title={currentLocation.includes("ownFeed") ? "Edit Profile" : "Message"}
                        className="w-full h-[2.3rem] border border-white text-white rounded-md my-2"
                    />
                    <p className='text-center text-white mt-2'>{friendDetail.total_friends} friends</p>
                    <p className='text-center text-white my-2'>Member since {friendDetail.member_since}</p>

                </div>
                <div className='flex-1 rounded-md px-2 mb-2 w-full md:mt-0 mt-4'>
                    {
                        currentLocation.includes("ownFeed") && (
                            <div className='w-[100%] bg-[#0d2539] py-3 px-4 mt-0 rounded-md mb-2'>
                                <div className='flex items-start gap-x-4'>
                                    <img src={FaceImage} alt="" className='w-[2.5rem] h-[2.5rem] rounded-full object-cover' />
                                    <Input type={"text"} name={"name"} placeholder={"Tell your friend whats happening...."} className={"flex-1 bg-[#102F47] text-white h-[10rem] px-3 placeholder:text-start"} />
                                </div>
                                <div className='flex justify-between items-center mt-2'>
                                    <p className='text-white'>Updates are visible to your friends.</p>
                                    <Button title={"Post update"} className={"w-[8rem] h-[2.3rem] rounded-md bg-[#E78530] text-white"} />
                                </div>
                            </div>
                        )
                    }
                    {
                        friendFeeds.map((feedItem) => (
                            <div key={feedItem.id} className=''>
                                {(() => {
                                    switch (feedItem.type) {
                                        case 'convention_attendance':
                                            return (
                                                <>
                                                 {feedItem.convention_attendance.attendance_privacy === 'friends_only' && (
                                                          <>
                                                          <div className='w-[100%] bg-[#0d2539] py-3 px-4 mt-0 rounded-md mb-2'>
                                                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
                                                        <div className='flex items-start md:items-center gap-x-3'>
                                                            <div className='flex items-center'>
                                                                <img src={feedItem.convention_attendance.profile_picture || FaceImage} alt="" className='w-[3rem] h-[3rem] rounded-full object-cover' />
                                                                <div className='w-[3rem] h-[3rem] rounded-full flex justify-center items-center bg-lightOrange'>
                                                                <img 
                                                                    src={feedItem.convention_attendance.convention_logo || FaceImage} 
                                                                    alt="" 
                                                                    className='w-[3rem] h-[3rem] rounded-full object-cover' 
                                                                  />
                                                                </div>
                                                            </div>
                                                            <div className='mt-2 md:mt-0'>
                                                                <p className='text-white'>
                                                                    <span className='text-lightOrange'>{feedItem.convention_attendance.user_name}</span> is attending
                                                                    <span
                                                                        onClick={() => nav(`/convention/attendance/${feedItem.convention_attendance.convention_id}`)}
                                                                        className='text-lightOrange underline ml-1 cursor-pointer'
                                                                    >
                                                                        {feedItem.convention_attendance.convention_name}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p className='text-white mt-2 md:mt-0'>
                                                            {formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}
                                                        </p>
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
                                                    </div>
                                                </>
                                                 )}
                                                      </>
                                            );


                                        case 'post_creation':
                                            return (
                                                <>
                                                 {feedItem.post.post_privacy === 'friends_only' && (
                                                          <>
                                                <div className='w-[100%] bg-[#0d2539] py-3 px-4 mt-0 rounded-md mb-2'>
                                                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
                                                        <div className='flex items-start md:items-center gap-x-3'>
                                                            <img src={feedItem.post.profile_picture || FaceImage} alt="" className='w-[2.5rem] h-[2.5rem] md:w-[3rem] md:h-[3rem] rounded-full object-cover' />
                                                            <div className='mt-2 md:mt-0'>
                                                                <p className='text-white text-sm md:text-base'>
                                                                    <span className='text-lightOrange'>{feedItem.post.user_name}</span> posted an update:
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p className='text-white text-xs md:text-sm mt-2 md:mt-0'>
                                                            {formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}
                                                        </p>
                                                    </div>
                                                    <p className='text-white text-sm md:text-base mt-3'>{formatDescription(feedItem.post.content)}</p>
                                                    <div className='flex items-center gap-x-4 mt-4'>
                                                        <div className='flex items-center gap-x-2'>
                                                            <FaMessage className='text-white text-sm md:text-base' />
                                                            <p className='text-white text-sm md:text-base'>0</p>
                                                        </div>
                                                        <FaRegStar className='text-white text-sm md:text-base' />
                                                    </div>
                                                    </div>
                                                </>
                                                )}
                                                      </>
                                            );


                                        case 'convention_accommodation':
                                            return (
                                                <>
                                                {feedItem.convention_accommodation.accommodation_privacy === 'friends_only' && (
                                                          <>
                                                <div className='w-[100%] bg-[#0d2539] py-3 px-4 mt-0 rounded-md mb-2'>
                                                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
                                                        <div className='flex items-start md:items-center gap-x-3'>
                                                            <div className='flex items-start md:items-center gap-x-2'>
                                                                <img src={feedItem.convention_accommodation.profile_picture || FaceImage} alt="" className='w-[2.5rem] h-[2.5rem] md:w-[3rem] md:h-[3rem] rounded-full object-cover' />
                                                                <div className='w-[2.5rem] h-[2.5rem] md:w-[3rem] md:h-[3rem] rounded-full flex justify-center items-center bg-lightOrange'>
                                                                <img 
                                                                    src={feedItem.convention_accommodation.convention_logo || FaceImage} 
                                                                    alt="" 
                                                                    className='w-[3rem] h-[3rem] rounded-full object-cover' 
                                                                  />
                                                                </div>
                                                            </div>
                                                            <div className='mt-2 md:mt-0'>
                                                                <p className='text-white text-sm md:text-base'>
                                                                    <span className='text-lightOrange'>{feedItem.convention_accommodation.user_name}</span> is staying at
                                                                    <span className='text-lightOrange ml-1'>{feedItem.convention_accommodation.location_name}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p className='text-white text-xs md:text-sm mt-2 md:mt-0'>
                                                            {formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}
                                                        </p>
                                                    </div>
                                                    <p className='text-white text-sm md:text-base mt-3'>
                                                        From <span className='text-lightOrange'>{formatDate(feedItem.convention_accommodation.from_date)}</span> To
                                                        <span className='text-lightOrange ml-1'>{formatDate(feedItem.convention_accommodation.to_date)}</span> for
                                                        <span onClick={() => nav(`/convention/attendance/${feedItem.convention_id}`)} className='text-lightOrange underline cursor-pointer ml-1'>
                                                            {feedItem.convention_accommodation.convention_name}
                                                        </span>
                                                    </p>
                                                    <div className='flex items-center gap-x-4 mt-4'>
                                                        <div className='flex items-center gap-x-2'>
                                                            <FaMessage className='text-white text-sm md:text-base' />
                                                            <p className='text-white text-sm md:text-base'>0</p>
                                                        </div>
                                                        <FaRegStar className='text-white text-sm md:text-base' />
                                                    </div>
                                                    </div>
                                                </>
                                                )}
                                                      </>
                                            );


                                        case 'profile_update':
                                            return (
                                                <>
                                                {feedItem.user.profile_privacy === 'friends_only' && (
                                                          <>
                                                <div className='w-[100%] bg-[#0d2539] py-3 px-4 mt-0 rounded-md mb-2'>
                                                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
                                                        <div className='flex items-start md:items-center gap-x-3'>
                                                            <img src={feedItem.user.profile_picture || FaceImage} alt="" className='w-[2.5rem] h-[2.5rem] md:w-[3rem] md:h-[3rem] rounded-full object-cover' />
                                                            <div className='mt-2 md:mt-0'>
                                                                <p className='text-white text-sm md:text-base'>
                                                                    <span className='text-lightOrange'>{feedItem.user.user_name}</span> updated their
                                                                    <span className='text-lightOrange ml-1'>Profile</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p className='text-white text-xs md:text-sm mt-2 md:mt-0'>
                                                            {formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}
                                                        </p>
                                                    </div>
                                                    <div className='flex items-center gap-x-4 mt-4'>
                                                        <div className='flex items-center gap-x-2'>
                                                            <FaMessage className='text-white text-sm md:text-base' />
                                                            <p className='text-white text-sm md:text-base'>0</p>
                                                        </div>
                                                        <FaRegStar className='text-white text-sm md:text-base' />
                                                    </div>
                                                    </div>
                                                </>
                                                )}
                                                      </>
                                            );


                                        case 'convention_game':
                                            return (
                                                <>
                                                <div className='w-[100%] bg-[#0d2539] py-3 px-4 mt-0 rounded-md mb-2'>
                                                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
                                                        <div className='flex items-start md:items-center gap-x-3'>
                                                            <img src={feedItem.convention_game.profile_picture || FaceImage} alt="" className='w-[2.5rem] h-[2.5rem] md:w-[3rem] md:h-[3rem] rounded-full object-cover' />
                                                            <div className='mt-2 md:mt-0'>
                                                                <p className='text-white text-sm md:text-base'>
                                                                    <span className='text-lightOrange'>{feedItem.convention_game.user_name}</span> is selling
                                                                    <span onClick={() => nav(`/game/single/${feedItem.convention_game.id}`)} className='text-lightOrange underline ml-1 cursor-pointer'>{feedItem.convention_game.game_name}</span> under
                                                                    <span onClick={() => nav(`/convention/attendance/${feedItem.convention_id}`)} className='text-lightOrange underline ml-1 cursor-pointer'>{feedItem.convention_game.convention_name}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p className='text-white text-xs md:text-sm mt-2 md:mt-0'>
                                                            {formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}
                                                        </p>
                                                    </div>

                                                    <p className='text-white text-sm md:text-base mt-3'>
                                                        <b>{feedItem.convention_game.game_currency_tag}{feedItem.convention_game.game_price}</b> ({feedItem.convention_game.game_condition})
                                                    </p>

                                                    <p className='text-white text-sm md:text-base mt-3'>
                                                        {formatDescription(feedItem.convention_game.game_desc)}
                                                    </p>

                                                    <div className='flex items-center gap-x-4 mt-4'>
                                                        <div className='flex items-center gap-x-2'>
                                                            <FaMessage className='text-white text-sm md:text-base' />
                                                            <p className='text-white text-sm md:text-base'>0</p>
                                                        </div>
                                                        <FaRegStar className='text-white text-sm md:text-base' />
                                                    </div>
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
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default FriendFeed
