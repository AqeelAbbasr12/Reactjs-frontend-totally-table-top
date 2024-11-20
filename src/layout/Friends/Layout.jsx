import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Left from "../../components/Left";
import IconMessage from "../../assets/Icon-message.png";
import IconUsrCircle from "../../assets/Icon-user-circle.png";
import { IoListSharp } from "react-icons/io5";
import { TbGridDots } from "react-icons/tb";
import { fetchWithAuth } from "../../services/apiService";
import drop from '../../assets/icon-caret-down.svg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Layout = () => {
  const nav = useNavigate();
  const [friends, setFriends] = useState([]);
  const [currentView, setCurrentView] = useState("grid");
  const [filter, setFilter] = useState("all"); // State to manage filter
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedOption, setSelectedOption] = useState('Sort by A-Z...');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const storedUserId = parseInt(localStorage.getItem('current_user_id'));
    if (storedUserId) {
      setCurrentUserId(storedUserId);
    }
  }, []);
  // Fetch friends data when currentUserId is available
  useEffect(() => {
    if (!currentUserId) return;

    const fetchFriends = async () => {
      setLoading(true); // Show loading spinner while fetching
      try {
        const response = await fetchWithAuth(`/user/friend`, {
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

        const filteredFriends = data.filter(friend => {
          return friend.sender_id === currentUserId || friend.receiver_id === currentUserId;
        });

        setFriends(filteredFriends);
      } catch (error) {
        // console.error('Error fetching friends data:', error);
      } finally {
        setLoading(false); // Hide loading spinner
      }
    };

    fetchFriends();
  }, [currentUserId]); // Re-run the effect when currentUserId changes

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  
    let sortedFriends;
  
    if (option === 'Sort by A to Z') {
      sortedFriends = [...friends].sort((a, b) => {
        const nameA = a.sender_id === currentUserId ? a.receiver_user_name : a.sender_user_name;
        const nameB = b.sender_id === currentUserId ? b.receiver_user_name : b.sender_user_name;
        return nameA.localeCompare(nameB); // Sort A to Z
      });
    } else if (option === 'Sort by Z to A') {
      sortedFriends = [...friends].sort((a, b) => {
        const nameA = a.sender_id === currentUserId ? a.receiver_user_name : a.sender_user_name;
        const nameB = b.sender_id === currentUserId ? b.receiver_user_name : b.sender_user_name;
        return nameB.localeCompare(nameA); // Sort Z to A
      });
    } else if (option === 'Most Contacted') {
      // Sort by most contacted, combining sender and receiver friend counts
      sortedFriends = [...friends].sort((a, b) => {
        const totalA = (a.sender_friend_count || 0) + (a.receiver_friend_count || 0);
        const totalB = (b.sender_friend_count || 0) + (b.receiver_friend_count || 0);
        return totalB - totalA; // Sort by the total friend count (most to least)
      });
    } else {
      sortedFriends = friends; // Default sorting (no filter)
    }
  
    setFilteredFriends(sortedFriends);
  };
  

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  // Apply filtering logic
  const filteredFriends = friends
  .filter(friend => {
    // Apply online/offline filter
    if (filter === "online") {
      return friend.sender_is_online === "1" && friend.receiver_is_online === "1";
    } else if (filter === "offline") {
      return friend.sender_is_online === "0" || friend.receiver_is_online === "0";
    }
    return true; // Show all if no filter
  })
  .sort((a, b) => {
    // Apply sorting based on selectedOption
    if (selectedOption === 'Sort by A to Z') {
      const nameA = a.sender_id === currentUserId ? a.receiver_user_name : a.sender_user_name;
      const nameB = b.sender_id === currentUserId ? b.receiver_user_name : b.sender_user_name;
      return nameA.localeCompare(nameB); // Sort A to Z
    } else if (selectedOption === 'Sort by Z to A') {
      const nameA = a.sender_id === currentUserId ? a.receiver_user_name : a.sender_user_name;
      const nameB = b.sender_id === currentUserId ? b.receiver_user_name : b.sender_user_name;
      return nameB.localeCompare(nameA); // Sort Z to A
    } else if (selectedOption === 'Most Contacted') {
      // Combine sender and receiver friend counts and sort by total
      const totalA = (a.sender_friend_count || 0) + (a.receiver_friend_count || 0);
      const totalB = (b.sender_friend_count || 0) + (b.receiver_friend_count || 0);
      return totalB - totalA; // Sort by most contacted
    }
    return 0; // No sorting if no option is selected
  });



  return (
    <div className="flex flex-col w-full min-h-screen overflow-y-auto bg-darkBlue">
      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
        </div>
      )}
      <Navbar type={"verified"} />
      <div className="flex-1 pt-[2.3rem] flex flex-col md:flex-row md:px-[2rem] gap-x-6">
        <Left />
        <div className="flex-1 rounded-md px-2 mb-2 mt-4">
          <div className="sm:flex justify-between items-center">
            <h1 className="text-white text-2xl font-semibold">Friends ({filteredFriends.length})</h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-x-4 sm:mt-0 mt-2">
              {/* All Friends Button */}
              <Button
                title={"All"}
                className={`w-full sm:w-[8rem] h-[2.3rem] rounded-md text-white border ${filter === 'all' ? 'bg-lightOrange' : 'border-lightOrange'}`}
                onClickFunc={() => setFilter("all")} // Set filter to all
              />

              {/* Online Friends Button */}
              <Button
                title={"Online"}
                className={`w-full sm:w-[8rem] h-[2.3rem] rounded-md text-white border ${filter === 'online' ? 'bg-lightOrange' : 'border-lightOrange'}`}
                onClickFunc={() => setFilter("online")} // Set filter to online
              />

              {/* Offline Friends Button */}
              <Button
                title={"Offline"}
                className={`w-full sm:w-[8rem] h-[2.3rem] rounded-md text-white border ${filter === 'offline' ? 'bg-lightOrange' : 'border-lightOrange'}`}
                onClickFunc={() => setFilter("offline")} // Set filter to offline
              />

              <div className="border border-lightOrange flex items-center w-fit justify-center h-[2rem]">
                <IoListSharp
                  onClick={() => setCurrentView("list")}
                  className={`text-white h-full w-[2rem] p-2 cursor-pointer ${currentView === "list" && "bg-lightOrange"}`}
                />
                <TbGridDots
                  onClick={() => setCurrentView("grid")}
                  className={`text-white h-full w-[2rem] p-2 cursor-pointer ${currentView === "grid" && "bg-lightOrange"}`}
                />
              </div>
            </div>

            <div className='relative mt-4'>
              <button
                type='button'
                className='w-full lg:w-72 text-white border-2 px-5 border-[#707070] text-lg md:text-xl py-2 md:py-3 flex items-center justify-between'
                onClick={toggleDropdown}
              >
                {selectedOption}
                <img src={drop} alt="" />
              </button>

              {isDropdownOpen && (
                <div className='absolute text-white w-full lg:w-72 mt-2 bg-[#102F47] border border-gray-300 shadow-lg text-lg md:text-xl z-50'>
                  <ul>
                    <li
                      className='p-2 hover:bg-gray-100 cursor-pointer hover:text-black'
                      onClick={() => handleOptionClick('Sort by A to Z')}
                    >
                      Sort by A to Z
                    </li>
                    <li
                      className='p-2 hover:bg-gray-100 cursor-pointer hover:text-black'
                      onClick={() => handleOptionClick('Sort by Z to A')}
                    >
                      Sort by Z to A
                    </li>
                    <li
                      className='p-2 hover:bg-gray-100 cursor-pointer hover:text-black'
                      onClick={() => handleOptionClick('Most Contacted')}
                    >
                      Most Contacted
                    </li>
                  </ul>
                </div>
              )}
            </div>


          </div>


          {currentView === "grid" ? (
            <div className="flex justify-center sm:justify-between items-center gap-[2rem] flex-wrap mt-6">
              {filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="bg-[#0d2539] w-[15rem] h-[15rem] rounded-md p-3 flex justify-center items-center flex-col"
                >
                  <div className="relative flex justify-center items-center">
                    <img
                      src={friend.sender_id === currentUserId ? friend.receiver_profile_image : friend.sender_profile_image}
                      alt={friend.sender_id === currentUserId ? friend.receiver_user_name : friend.sender_user_name}
                      className="w-[6rem] h-[6rem] rounded-full object-cover"
                    />
                    {/* Online/Offline Dot */}
                    <div
                      className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${friend.sender_is_online === "1" && friend.receiver_is_online === "1"
                        ? 'bg-green-500'
                        : 'bg-gray-500'
                        } border-2 border-white`}
                    />
                  </div>
                  <p className="text-white mt-3 font-bold">
                    {friend.sender_id === currentUserId ? friend.receiver_first_name : friend.sender_first_name}{" "}
                    {friend.sender_id === currentUserId ? friend.receiver_last_name : friend.sender_last_name}
                  </p>
                  <p className="text-white mt-1 font-thin">
                    {friend.sender_id === currentUserId ? friend.receiver_user_name : friend.sender_user_name}
                  </p>
                  <div className="flex justify-center items-center gap-x-4 mt-4">
                    <Link to={`/feed/${friend.sender_id === currentUserId ? friend.receiver_id : friend.sender_id}`}>
                      <img className="w-[20px] h-[20px]" src={IconUsrCircle} alt="Profile" />
                    </Link>
                    <Link to={`/messages/${friend.sender_id === currentUserId ? friend.receiver_id : friend.sender_id}`}>
                      <img className="w-[20px] h-[20px]" src={IconMessage} alt="Send Message" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          ) : (
            <div className="flex-1 md:order-1 order-2 mt-6">
              {filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="rounded-md bg-[#0D2539] cursor-pointer flex flex-col md:flex-row justify-between gap-x-5 items-start mb-2 p-3"
                >
                  <div className="flex gap-x-4 md:gap-x-12 items-center">
                    <div className="relative">
                      <img
                        src={friend.sender_id === currentUserId ? friend.receiver_profile_image : friend.sender_profile_image}
                        alt={friend.sender_id === currentUserId ? friend.receiver_user_name : friend.sender_user_name}
                        className="w-[6rem] h-[6rem] md:w-[6rem] md:h-[6rem] rounded-full object-cover"
                      />
                      {/* Online/Offline Dot */}
                      <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${friend.sender_is_online === "1" && friend.receiver_is_online === "1" ? 'bg-green-500' : 'bg-gray-500'} border-2 border-white`} />
                    </div>
                    <div>
                      <p className="text-white mt-3 font-bold">
                        {friend.sender_id === currentUserId ? friend.receiver_first_name : friend.sender_first_name} {friend.sender_id === currentUserId ? friend.receiver_last_name : friend.sender_last_name}
                      </p>
                      <p className="text-white mt-1 font-thin">
                        {friend.sender_id === currentUserId ? friend.receiver_user_name : friend.sender_user_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-x-2 md:gap-x-4 mr-4 mt-2 md:mt-0">
                    <Link to={`/feed/${friend.sender_id === currentUserId ? friend.receiver_id : friend.sender_id}`}>
                      <img className="w-[20px] h-[20px]" src={IconUsrCircle} alt="Profile" />
                    </Link>
                    <Link to={`/messages/${friend.sender_id === currentUserId ? friend.receiver_id : friend.sender_id}`}>
                      <img className="w-[20px] h-[20px]" src={IconMessage} alt="Send Message" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          )}
        </div>
      </div>
    </div>
  );

};

export default Layout;
