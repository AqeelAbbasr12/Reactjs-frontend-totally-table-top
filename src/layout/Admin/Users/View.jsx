import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navbar from '../../../components/Admin/Navbar';
import Swal from "sweetalert2";
import { fetchWithAuth } from '../../../services/apiService';
import ConventionImage from '../../../assets/traditional.png'
import FaceImage from '../../../assets/profile.jpeg'
import { FaCalendarAlt } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { formatDistanceToNow, parseISO } from 'date-fns';
import { FaMessage } from 'react-icons/fa6'

import { FaRegStar } from 'react-icons/fa'



function View() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [conventions, setConvention] = useState([]);
  const [games, setGame] = useState([]);
  const [events, setEvents] = useState([]);
  const [ownFeeds, setOwnFeed] = useState([]);
  const nav = useNavigate();
  const [selectedConvention, setSelectedConvention] = useState(null);
  const { user_id } = useParams();
  useEffect(() => {
    fetchUser(user_id);
  }, [user_id]);


  const fetchUser = async (user_id) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/admin/users/${user_id}`, {
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

      if (data.user) {
        setUser(data.user); // Set user data
      }

      if (data.conventions) {
        setConvention(data.conventions); // Set user data
      }

      if (data.games) {
        setGame(data.games); // Set user data
      }

      if (data.events) {
        setEvents(data.events); // Set user data
      }

      if (data.ownfeed) {
        setOwnFeed(data.ownfeed); // Set user data
      }



      console.log(data.user);
    } catch (error) {
      console.error('Error fetching Sponser data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle delete attendance
  const handleDeleteAttendance = async (conventionId, userId) => {
    // Show Swal confirmation
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will permanently delete the convention attendance with associated data of this convention!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Call the DELETE API
          const response = await fetchWithAuth(`/admin/delete_attendance/${conventionId}/user/${userId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Assuming JWT Auth
            },
          });

          // Handle Response
          if (response.ok) {
            Swal.fire('Deleted!', 'Attendance has been deleted.', 'success');
            fetchUser(user_id);
          } else {
            const data = await response.json();
            Swal.fire('Error!', data.message || 'Failed to delete attendance.', 'error');
          }
        } catch (error) {
          Swal.fire('Error!', 'An error occurred. Please try again later.', 'error');
        }
      }
    });
  };

  const handleDeleteGame = async (gameId) => {
    // Show Swal confirmation dialog
    Swal.fire({
        title: 'Are you sure?',
        text: 'This action will permanently delete the game!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                // API call to delete the game
                const response = await fetchWithAuth(`/admin/delete_game/${gameId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Assuming JWT token
                    },
                });

                // Handle API response
                if (response.ok) {
                    Swal.fire('Deleted!', 'Game has been successfully deleted.', 'success');
                    fetchUser(user_id);
                } else {
                    const data = await response.json();
                    Swal.fire('Error!', data.message || 'Failed to delete the game.', 'error');
                }
            } catch (error) {
                Swal.fire('Error!', 'An error occurred. Please try again later.', 'error');
            }
        }
    });
};

const handleDeleteEvent = async (eventId) => {
  // Show Swal confirmation dialog
  Swal.fire({
      title: 'Are you sure?',
      text: 'This action will permanently delete the table!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
  }).then(async (result) => {
      if (result.isConfirmed) {
          try {
              // API call to delete the event
              const response = await fetchWithAuth(`/admin/delete_event/${eventId}`, {
                  method: 'DELETE',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Assuming JWT token
                  },
              });

              // Handle API response
              if (response.ok) {
                  Swal.fire('Deleted!', 'Table has been successfully deleted.', 'success');
                  fetchUser(user_id);
              } else {
                  const data = await response.json();
                  Swal.fire('Error!', data.message || 'Failed to delete the table.', 'error');
              }
          } catch (error) {
              Swal.fire('Error!', 'An error occurred. Please try again later.', 'error');
          }
      }
  });
};

const handleBlock = async (userId, status) => {
  // Show confirmation popup using SweetAlert2
  const action = status === 'blocked' ? 'block' : 'unblock'; // Dynamic action text

  Swal.fire({
    title: `Are you sure?`,
    text: `Do you want to ${action} this user?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: status === 'blocked' ? '#d33' : '#28a745', // Red for block, green for unblock
    cancelButtonColor: '#3085d6',
    confirmButtonText: `Yes, ${action.charAt(0).toUpperCase() + action.slice(1)}!`,
    cancelButtonText: 'Cancel',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        // API call to update user status
        const response = await fetchWithAuth(`/admin/block_user/${userId}`, {
          method: 'PUT', // Use PUT since you're updating the status
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({ status: status }), // Send the updated status ('blocked' or 'active')
        });

        const data = await response.json();

        if (response.ok) {
          fetchUser(userId); // Refresh the user data
          // Success message
          Swal.fire(
            `${action.charAt(0).toUpperCase() + action.slice(1)}ed!`,
            `The user has been ${action}ed successfully.`,
            'success'
          );
        } else {
          // Error message
          Swal.fire('Error!', data.message || `Failed to ${action} the user.`, 'error');
        }
      } catch (error) {
        // Handle network errors
        Swal.fire('Error!', 'Something went wrong. Please try again later.', 'error');
      }
    }
  });
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
    <div className="bg-[#102F47] w-full min-h-screen text-white">
      {/* Loading Spinner Placeholder */}
      <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50 hidden">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
      </div>

      {/* Navbar Placeholder */}
      <Navbar />

      <div className="w-11/12 max-w-screen-2xl mx-auto pt-48 text-white">
        {/* Page Title */}
        <div className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">User Details</h1>
            <p className="text-lg md:text-xl mt-2 text-gray-300">
              Comprehensive information about the User.
            </p>
          </div>
         
        </div>



        {/* user Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-4">User Overview</h2>

            {/* User Name */}
            <p className="text-lg mb-2">
              <span className="font-semibold">User Name:</span>{" "}
              <span className="text-lightOrange">{user?.name || ""}</span>
              {user?.name && (
                <button
                  className="ml-4 px-3 py-1 text-sm bg-red text-white rounded hover:bg-red-600 transition"
                 
                  onClick={() => {
                    nav(`/admin/messages/${user?.id}`);  // Removed the extra curly brace here
                }}
                >
                  
                  Send Warning Message
                </button>
              )}
              {user?.status !== 'blocked' ? (
  <button
    className="ml-4 px-3 py-1 text-sm bg-red text-white rounded hover:bg-red-600 transition"
    onClick={() => handleBlock(user?.id, 'blocked')}
  >
    Block User
  </button>
) : (
  <button
    className="ml-4 px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition"
    onClick={() => handleBlock(user?.id, 'active')}
  >
    Unblock User
  </button>
)}

            </p>
            {/* First Name */}
            <p className="text-lg mb-2">
              <span className="font-semibold">First Name:</span>{" "}
              <span className="text-lightOrange">{user?.first_name || ""}</span>
            </p>
            {/* Last Name */}
            <p className="text-lg mb-2">
              <span className="font-semibold">Last Name:</span>{" "}
              <span className="text-lightOrange">{user?.last_name || ""}</span>
            </p>

            {/* Email */}
            <p className="text-lg mb-2">
              <span className="font-semibold">Email Address:</span>{" "}
              <span className="text-lightOrange">{user?.email || ""}</span>
            </p>

            {/* Joining Date */}
            <p className="text-lg mb-2">
              <span className="font-semibold">Joining Date:</span>{" "}
              <span className="text-lightOrange">{user?.created_at || ""}</span>
            </p>

          </div>
          <div className="bg-darkBlue p-6 rounded-lg shadow-lg">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Additional Information</h2>
            <ul className="space-y-2">

              {/* status */}
              <p className="text-lg mb-2">
  <span className="font-semibold">Status:</span>{" "}
  {user?.status === "blocked" ? (
    <button
      className="ml-4 px-3 py-1 text-sm bg-red text-white rounded hover:bg-red transition"
     
    >
      Blocked
    </button>
  ) : (
    <button
      className="ml-4 px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition"
      
    >
      Active
    </button>
  )}
</p>


              {/* Location */}
              <p className="text-lg mb-2">
                <span className="font-semibold">Location:</span>{" "}
                <span className="text-lightOrange">
                  {user?.location || ""}
                </span>

              </p>
              {/* Country */}
              <p className="text-lg mb-2">
                <span className="font-semibold">Country:</span>{" "}
                <span className="text-lightOrange">
                  {user?.country || ""}
                </span>

              </p>

              {/* newsletter_info */}
              <p className="text-lg mb-2">
                <span className="font-semibold">Newsletter Subscription:</span>{" "}
                <span className="text-lightOrange">
                  {user?.newsletter_info || ""}
                </span>

              </p>

              {/* promotional_info */}
              <p className="text-lg mb-2">
                <span className="font-semibold">Promotional Subscription:</span>{" "}
                <span className="text-lightOrange">
                  {user?.promotional_info || ""}
                </span>

              </p>

              {/* Bio */}
              <p className="text-lg mb-2">
                <span className="font-semibold">Bio:</span>{" "}
                <span className="text-lightOrange">
                  {user?.bio || ""}
                </span>

              </p>

            </ul>
          </div>
        </div>

        {/* Show Conventions */}

        {/* Only show heading if conventions exist */}
        {conventions.length > 0 && (
          <div className='flex justify-between items-center flex-wrap'>
            <h1 className='text-white text-2xl font-semibold'>Attending Conventions</h1>
            {/* Add Button or other elements here */}
          </div>
        )}

        {/* Listing Conventions */}
        {conventions.length > 0 ? (
          <div className="bg-[#0d2539] p-3 w-full md:max-h-fit rounded-md mt-6 overflow-y-auto overflow-x-hidden">
            {conventions.map((convention) => (
              <div key={convention.id} className='flex flex-col md:flex-row justify-between items-start mb-4 p-2 bg-[#1a2a3a] rounded-md'>

                {/* 1st Column */}
                <div className='flex items-center gap-x-2 flex-1 mb-2 md:mb-0'>
                  <img src={convention.convention_logo || ConventionImage} alt="" className='w-[3rem] h-[3rem] rounded-full object-cover' />
                  <Link to={`/admin/edit/convention/${convention.id}`}>
                    <p className='text-lightOrange font-semibold text-lg break-words'>{convention.convention_name}</p>
                  </Link>
                </div>

                {/* 2nd Column */}
                <div className='flex-1 mb-2 md:mb-0'>
                  <p className='text-[#F3C15F] text-sm break-words'>{convention.attendance_dates.join(', ')}</p>
                </div>

                {/* Delete Attendacnce */}
                <div className='relative flex items-center gap-x-2'>
                  {/* Delete Attendance Button */}
                  <button
                    onClick={() => handleDeleteAttendance(convention.id, user.id)} // Pass IDs dynamically
                    className='px-4 py-2 bg-red text-white text-sm font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'>
                    Remove Attendance
                  </button>

                  
                </div>


              </div>
            ))}
          </div>
        ) : (
          // No empty state is shown here
          null
        )}

        {/* Listing Games  */}

        {/* Only show heading if games exist */}
        {games.length > 0 && (
          <div className='flex justify-between pt-8 pb-6 items-center flex-wrap'>
            <h1 className='text-white text-2xl font-semibold'>Listing Games</h1>
            {/* Add Button or other elements here */}
          </div>
        )}

        {/* Listing Games */}
        {games.length > 0 ? (
          <div className='flex-1 md:order-1 order-2'>
            {games.map((game) => (
              <div
                
                className='rounded-md bg-[#0D2539] cursor-pointer flex gap-x-5 items-left mb-2 p-3'
              >
                <img
                  src={game.game_image || ConventionImage}
                  alt=""
                  className='w-[3rem] h-[3rem] object-cover'
                />
                <div>
                  <p className='py-2 mx-2 text-white text-sm'
                  onClick={() => window.open(`/admin/game/single/${game.id}`, '_blank')}
                  >
                    {game.game_name}
                    <span className="py-2 mx-2 text-white font-bold">
                      Sold By: {game.user_name}
                      {game.game_status === "sold" && (
                        <span className="text-red font-bold ml-2">(SOLD)</span>
                      )}
                    </span>
                    <span className="py-2 mx-2 text-lightOrange font-bold">
                      Convention Name ({game.convention_name})
                    </span>
                  </p>
                  <div className='flex gap-x-2 items-center mx-2'>
                    <p className='text-white'>
                      {game.game_currency_symbol}
                      {game.game_price}
                    </p>
                    <div className='w-[1px] h-[1rem] bg-white'></div>
                    <p className='text-white'>{game.game_condition}</p>
                  </div>
                  <div className='relative pt-2 flex items-center gap-x-2'>

                  <button
                    onClick={() => handleDeleteGame(game.id)} // Pass game ID dynamically
                    className='px-4 py-2 bg-red text-white text-sm font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'>
                    Remove Game
                  </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // No games available section has been removed
          null
        )}


        {/* Listing Tables  */}

        {events.length > 0 && (
          <div className='flex justify-between pt-8 pb-6 items-center flex-wrap'>
            <h1 className='text-white text-2xl font-semibold'>Listing Tables</h1>
            {/* Add Button or other elements here */}
          </div>
        )}

        {events
          
          .map((event) => (
            <div
              key={event.id}
              className="w-full sm:h-[13rem] bg-[#0d2539] p-3 rounded-md flex justify-between items-start relative sm:flex-row flex-col mt-4"
            >
              {/* Event Details */}
              <div className="w-full sm:w-auto" >
                <h1 className="text-lg font-semibold text-white cursor-pointer break-all flex items-center gap-2"
                onClick={() => window.open(`/admin/event/single/${event.id}`, '_blank')}
                >
                  {event.event_name} on {formatDate(event.event_date).split(",")[0]}{" "}
                  <span className="text-lightOrange">Space ({event.event_space})</span>
                  <span className="text-lightOrange">Convention Name ({event.convention_name})</span>

                </h1>



                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <div className="flex items-center gap-x-2">
                    <FaCalendarAlt className="text-lightOrange" />
                    <p className="text-white">
                      {event.event_time} {formatDate(event.event_date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <FaLocationDot className="text-lightOrange" />
                    <p className="text-white">{event.event_location}</p>
                  </div>
                </div>

                {/* Invitations */}
                <div className="flex items-center mt-4">
                  {event.invitations.map((invitation) => (
                    <img
                      key={invitation.invite_receiver_image}
                      src={invitation.invite_receiver_image}
                      className="w-[2rem] h-[2rem] rounded-full object-cover"
                      alt="Invitation"
                    />
                  ))}
                </div>

                {/* Action Buttons */}
                <div className='relative pt-2 flex items-center gap-x-2'>
                    {/* Delete Attendance Button */}
                    <button
                      onClick={() => handleDeleteEvent(event.id)} // Pass IDs dynamically
                      className='px-4 py-2 bg-red text-white text-sm font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'>
                      Remove Table
                    </button>

                  </div>
              </div>

              {/* Event Image */}
              <div className="sm:mt-0 mt-4 w-full sm:w-auto">
                <img
                  src={event.event_image || ConventionImage}
                  alt=""
                  className="h-[10rem] w-full sm:w-auto object-cover"
                />
              </div>
            </div>
          ))}

        {/* Activity  */}

        {ownFeeds && ownFeeds.length > 0 && (
          <div className='flex justify-between pt-8 pb-6 items-center flex-wrap'>
            <h1 className='text-white text-2xl font-semibold'>
              Activity of the <span className='text-lightOrange'> {user?.name || ""} </span>
            </h1>
            {/* <Button onClickFunc={() => nav("/complete")} title={"Add convention"} className={"min-w-[10rem] min-h-[2.3rem] rounded-md bg-transparent text-white border border-lightOrange sm:mt-0 mt-2"} /> */}
          </div>
        )}


        {ownFeeds.map((feedItem) => (
          <div key={feedItem.id} className='w-[100%] bg-[#0d2539] py-3 px-4 mt-0 rounded-md mb-2'>
            {(() => {
              switch (feedItem.type) {
                case 'convention_attendance':
                  return (
                    <>
                      <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
                        <div className='flex items-center gap-x-3'>
                          <div className='flex items-center'>
                            <img src={user.profile_picture || FaceImage} alt="" className='w-[3rem] h-[3rem] rounded-full object-cover' />
                            <div className='w-[3rem] h-[3rem] rounded-full flex justify-center items-center bg-lightOrange'>
                              <img
                                src={feedItem.convention_attendance?.convention_logo || FaceImage}
                                alt=""
                                className='w-[3rem] h-[3rem] rounded-full object-cover'
                              />
                            </div>
                          </div>
                          <div>
                            <p className='text-white'>
                              <span className='text-lightOrange'>{user?.name || ""}</span> will attending <span
                                
                                className='text-lightOrange  ml-1 cursor-pointer'
                              >
                                {feedItem.convention_attendance?.convention_name}
                              </span>
                            </p>
                          </div>
                        </div>
                        <p className='text-white mt-2 md:mt-0'>{formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}</p>
                      </div>
                      <p className='text-white mt-2 md:mt-3'>
                        {user?.name || ""} will attend {feedItem.convention_attendance?.convention_name} on {feedItem.convention_attendance?.attendance_date}
                      </p>
                      <div className='flex items-center gap-x-4 mt-2 md:mt-4'>
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
                      <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
                        <div className='flex items-center gap-x-3'>
                          <img src={user.profile_picture || FaceImage} alt="" className='w-[3rem] h-[3rem] rounded-full object-cover' />
                          <div>
                            <p className='text-white'>
                              <span className='text-lightOrange'>{user?.name || ""} </span> posted an update:
                            </p>
                          </div>
                        </div>
                        <p className='text-white mt-2 md:mt-0'>{formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}</p>
                      </div>
                      <p className='text-white mt-2 md:mt-3 break-words whitespace-pre-wrap'>{formatDescription(feedItem.post.content)}</p>
                      <div className='flex items-center gap-x-4 mt-2 md:mt-4'>
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
                      <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
                        <div className='flex items-center gap-x-3'>
                          <div className='flex items-center'>
                            <img src={user.profile_picture || FaceImage} alt="" className='w-[3rem] h-[3rem] rounded-full object-cover' />
                            <div className='w-[3rem] h-[3rem] rounded-full flex justify-center items-center bg-lightOrange'>
                              <img
                                src={feedItem.convention_accommodation?.convention_logo || FaceImage}
                                alt=""
                                className='w-[3rem] h-[3rem] rounded-full object-cover'
                              />
                            </div>
                          </div>
                          <div>
                            <p className='text-white break-all'>
                              <span className='text-lightOrange'>You</span> are staying at
                              <span className='text-lightOrange ml-1 cursor-pointer'>
                                {feedItem.convention_accommodation?.location_name}
                              </span>
                            </p>
                          </div>
                        </div>
                        <p className='text-white mt-2 md:mt-0'>{formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}</p>
                      </div>
                      <p className='text-white mt-2 md:mt-3'>
                        From <span className='text-lightOrange'>{formatDate(feedItem.convention_accommodation?.from_date)}</span> To
                        <span className='text-lightOrange'> {formatDate(feedItem.convention_accommodation?.to_date)}</span> for
                        <span className='text-lightOrange ml-1 cursor-pointer'>
                          {feedItem.convention_accommodation?.convention_name}
                        </span>
                      </p>
                      <div className='flex items-center gap-x-4 mt-2 md:mt-4'>
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
                      <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
                        <div className='flex items-center gap-x-3'>
                          <img src={user.profile_picture || FaceImage} alt="" className='w-[3rem] h-[3rem] rounded-full object-cover' />
                          <div>
                            <p className='text-white'>
                              <span className='text-lightOrange'>{user?.name || ""} </span> updated their
                              <span className='text-lightOrange'> Profile</span>
                            </p>
                          </div>
                        </div>
                        <p className='text-white mt-2 md:mt-0'>{formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}</p>
                      </div>
                      <div className='flex items-center gap-x-4 mt-3 md:mt-4'>
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
                      <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
                        <div className='flex items-center gap-x-3'>
                          <img src={user.profile_picture || FaceImage} alt="" className='w-[3rem] h-[3rem] rounded-full object-cover' />
                          <div>
                            <p className='text-white'>
                              <span className='text-lightOrange'>{user?.name || ""} </span> is selling
                              <span
                                className='text-lightOrange  ml-1 cursor-pointer'>
                                {feedItem.convention_game.game_name}
                              </span>
                              under
                              <span
                                className='text-lightOrange  ml-1 cursor-pointer'>
                                {feedItem.convention_game.convention_name}
                              </span>
                            </p>
                          </div>
                        </div>
                        <p className='text-white mt-2 md:mt-0'>{formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}</p>
                      </div>
                      <p className='text-white mt-3'>
                        <b>{feedItem.convention_game.game_currency_tag}{feedItem.convention_game.game_price}</b>
                        ({feedItem.convention_game.game_condition})
                      </p>
                      <p className='text-white mt-3 break-words whitespace-pre-wrap max-w-full'>{formatDescription(feedItem.convention_game.game_desc)}</p>
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
  );
}

export default View;