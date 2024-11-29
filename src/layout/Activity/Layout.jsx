import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Left from '../../components/Left'
import FaceImage from '../../assets/face.avif'
import { FaRegStar } from 'react-icons/fa'
import { FaMessage } from 'react-icons/fa6'
import ImageCross from '../../assets/red-cross.png'
import { fetchWithAuth } from '../../services/apiService';
import { formatDistanceToNow, parseISO } from 'date-fns';


const Layout = () => {
    const nav = useNavigate()
    const [showData, setshowData] = useState(true)
    const [loading, setLoading] = useState();
    const [activityFeeds, setActivityFeed] = useState([]);
    const data = [1, 2, 3, 4, 5, 6, 7]

    useEffect(() => {
        fetchActivityFeed();

    }, []);

    const fetchActivityFeed = async () => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/activityfeed`, {
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
                setActivityFeed(data);
            }

        } catch (error) {
            // console.error('Error fetching friends data:', error);
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
                        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-lightOrange underline break-all">
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
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
                </div>
            )}
            <Navbar type={"verified"} />
            <div className='pt-[2.3rem] flex  justify-between items-start md:flex-row flex-col bg-darkBlue md:px-[2rem] flex-1 h-[fit] w-[100vw] gap-x-6'>

                {/* LEFT  */}
                <Left />

                {/* RIGHT  */}
                <div className='flex-1 rounded-md px-2 mb-2 w-full md:mt-0 mt-4'>
                    {/* <div className='sm:flex pb-7 justify-between items-center'>
                        <h1 className='text-white text-2xl font-semibold'>Your activity feed</h1>
                        <div className='flex items-center gap-x-4 sm:mt-0 mt-2'>
                            <div onClick={() => setshowData(!showData)} className='flex justify-between px-2 items-center w-[11rem] h-[2.3rem] rounded-md border border-gray-300 cursor-pointer'>
                                <p className='text-white'>Show everything</p>
                                <BsFillCaretDownFill className='text-white ' />
                            </div>
                            <Button title={"Post update"} className={'w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange'} />

                        </div>
                    </div> */}

                    {
                        !showData ?
                            <div className='w-[100%] h-[52.5vh] mt-4 bg-[#0d2539] rounded-md flex justify-center items-center flex-col'>
                                {/* <ImCross className='text-red text-6xl border border-red rounded-full' /> */}
                                <img className='justify-center' src={ImageCross} alt="" />
                                <h1 className='text-lg text-center font-semibold mt-3 mb-5 text-white'>No activity</h1>
                                <p className='text-white mb-0'>Important updates notification and</p>
                                <p className='text-white mb-4'>more from friends will appear here</p>
                                <Button title={"Find friends"} className={'w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange'} />
                            </div> :
                            activityFeeds.map((feedItem) => (
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
                                                            <div className='flex items-center gap-x-3'>
                                                                <div className='flex items-center'>
                                                                    <img src={feedItem.convention_attendance.profile_picture || FaceImage} alt="" className='w-[3rem] h-[3rem] rounded-full object-cover' />
                                                                    <div className='w-[3rem] h-[3rem] rounded-full flex justify-center items-center bg-lightOrange'><img src={feedItem.convention_attendance.convention_logo || FaceImage} alt="" className='w-[3rem] h-[3rem] rounded-full object-cover' /></div>
                                                                </div>
                                                                <div>
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
                                                            <p className='text-white mt-2 md:mt-0'>{formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}</p>
                                                        </div>
                                                        <p className='text-white mt-3'>
                                                            {feedItem.convention_attendance.user_name} will attend {feedItem.convention_attendance.convention_name} on {feedItem.convention_attendance.attendance_date}
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
                                                            <div className='flex items-center gap-x-3'>
                                                                <img src={feedItem.post.profile_picture || FaceImage} alt="" className='w-[3rem] h-[3rem] rounded-full object-cover' />
                                                                <div>
                                                                    <p className='text-white'>
                                                                        <span className='text-lightOrange'>{feedItem.post.user_name}</span> posted on update:
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <p className='text-white mt-2 md:mt-0'>{formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}</p>
                                                        </div>
                                                        <p className='text-white mt-3'>{formatDescription(feedItem.post.content)}</p>
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


                                                case 'convention_accommodation':
                                                    return (
                                                      <>
                                                        {/* Check accommodation privacy */}
                                                        {feedItem.convention_accommodation.accommodation_privacy === 'friends_only' && (
                                                          <>
                                                          <div className='w-[100%] bg-[#0d2539] py-3 px-4 mt-0 rounded-md mb-2'>

                                                            <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
                                                              <div className='flex items-start md:items-center gap-x-3'>
                                                                <div className='flex items-center'>
                                                                  {/* Profile Picture or Default Image */}
                                                                  <img 
                                                                    src={feedItem.convention_accommodation.profile_picture || FaceImage} 
                                                                    alt="" 
                                                                    className='w-[3rem] h-[3rem] rounded-full object-cover' 
                                                                  />
                                                                  {/* UKGE Placeholder */}
                                                                  <div className='w-[3rem] h-[3rem] rounded-full flex justify-center items-center bg-lightOrange'>
                                                                  <img 
                                                                    src={feedItem.convention_accommodation.convention_logo || FaceImage} 
                                                                    alt="" 
                                                                    className='w-[3rem] h-[3rem] rounded-full object-cover' 
                                                                  />
                                                                  </div>
                                                                </div>
                                                
                                                                {/* User & Location Info */}
                                                                <div className='mt-2 md:mt-0'>
                                                                  <p className='text-white'>
                                                                    <span className='text-lightOrange'>
                                                                      {feedItem.convention_accommodation.user_name}
                                                                    </span> is staying at{' '}
                                                                    <span className='text-lightOrange'>
                                                                      {feedItem.convention_accommodation.location_name}
                                                                    </span>
                                                                  </p>
                                                                </div>
                                                              </div>
                                                
                                                              {/* Timestamp */}
                                                              <p className='text-white mt-2 md:mt-0'>
                                                                {formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}
                                                              </p>
                                                            </div>
                                                
                                                            {/* Date Range and Convention Name */}
                                                            <p className='text-white mt-3'>
                                                              From{' '}
                                                              <span className='text-lightOrange'>
                                                                {formatDate(feedItem.convention_accommodation.from_date)}
                                                              </span>{' '}
                                                              To{' '}
                                                              <span className='text-lightOrange'>
                                                                {formatDate(feedItem.convention_accommodation.to_date)}
                                                              </span>{' '}
                                                              for
                                                              <span
                                                                onClick={() => nav(`/convention/attendance/${feedItem.convention_id}`)}
                                                                className='text-lightOrange underline ml-1 cursor-pointer'
                                                              >
                                                                {feedItem.convention_accommodation.convention_name}
                                                              </span>
                                                            </p>
                                                
                                                            {/* Location Website */}
                                                            <p className='text-white'>
                                                              {formatDescription(feedItem.convention_accommodation.location_website)}
                                                            </p>
                                                
                                                            {/* Icons and Interactions */}
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
                                                

                                                    case 'profile_update':
                                                        return (
                                                            <>
                                                            {feedItem.user.profile_privacy === 'friends_only' && (
                                                          <>
                                                            <div className='w-[100%] bg-[#0d2539] py-3 px-4 mt-0 rounded-md mb-2'>
                                                                <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
                                                                    <div className='flex items-start md:items-center gap-x-3'>
                                                                        <img src={feedItem.user.profile_picture || FaceImage} alt="" className='w-[3rem] h-[3rem] rounded-full object-cover' />
                                                                        <div className='mt-2 md:mt-0'>
                                                                            <p className='text-white'>
                                                                                <span className='text-lightOrange'>{feedItem.user.user_name} </span> updated their <span className='text-lightOrange'>Profile</span>
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <p className='text-white mt-2 md:mt-0'>{formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}</p>
                                                                </div>
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
                                                    

                                                        case 'convention_game':
                                                            return (
                                                                <>
                                                                <div className='w-[100%] bg-[#0d2539] py-3 px-4 mt-0 rounded-md mb-2'>
                                                                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
                                                                        <div className='flex items-start md:items-center gap-x-3'>
                                                                            <img src={feedItem.convention_game.profile_picture || FaceImage} alt="" className='w-[3rem] h-[3rem] rounded-full object-cover' />
                                                                            <div className='mt-2 md:mt-0'>
                                                                                <p className='text-white'>
                                                                                    <span className='text-lightOrange'>{feedItem.convention_game.user_name} </span> is selling
                                                                                    <span 
                                                                                        onClick={() => nav(`/game/single/${feedItem.convention_game.id}`)} 
                                                                                        className='text-lightOrange underline ml-1 cursor-pointer'
                                                                                    > 
                                                                                        {feedItem.convention_game.game_name}
                                                                                    </span> under
                                                                                    <span 
                                                                                        onClick={() => nav(`/convention/attendance/${feedItem.convention_id}`)} 
                                                                                        className='text-lightOrange underline ml-1 cursor-pointer'
                                                                                    >
                                                                                        {feedItem.convention_game.convention_name}
                                                                                    </span>
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <p className='text-white mt-2 md:mt-0'>
                                                                            {formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}
                                                                        </p>
                                                                    </div>
                                                                    <p className='text-white mt-3'>
                                                                        <b>{feedItem.convention_game.game_currency_tag}{feedItem.convention_game.game_price}</b> ({feedItem.convention_game.game_condition})
                                                                    </p>
                                                                    <p className='text-white mt-3'>
                                                                        {formatDescription(feedItem.convention_game.game_desc)}
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

export default Layout
