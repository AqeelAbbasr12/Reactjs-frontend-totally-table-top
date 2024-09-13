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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Layout = () => {
  const nav = useNavigate();
  const [friends, setFriends] = useState([]);
  const [currentView, setCurrentView] = useState("grid");
  const [filter, setFilter] = useState("all"); // State to manage filter
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

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
      console.error('Error fetching friends data:', error);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  fetchFriends();
}, [currentUserId]); // Re-run the effect when currentUserId changes

  // Apply filtering logic
  const filteredFriends = friends.filter(friend => {
    if (filter === "online") {
      return friend.sender_is_online === "1" && friend.receiver_is_online === "1";
    } else if (filter === "offline") {
      return friend.sender_is_online === "0" || friend.receiver_is_online === "0";
    }
    return true; // Show all for "all" filter
  });

  return (
    <div className="flex flex-col w-[100vw] overflow-y-auto">
      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
        </div>
      )}
      <Navbar type={"verified"} />
      <div className="pt-[2.3rem] flex justify-between items-start md:flex-row flex-col bg-darkBlue md:px-[2rem] flex-1 h-[fit] md:h-[86rem] w-[100vw] gap-x-6">
        <Left />
        <div className="flex-1 rounded-md px-2 mb-2 w-full md:mt-0 mt-4">
          <div className="sm:flex justify-between items-center">
            <h1 className="text-white text-2xl font-semibold">Friends ({filteredFriends.length})</h1>
            <div className="flex items-center gap-x-4 sm:mt-0 mt-2">
              {/* All Friends Button */}
              <Button
                title={"All"}
                className={`w-[8rem] h-[2.3rem] rounded-md text-white border ${filter === 'all' ? 'bg-lightOrange' : 'border-lightOrange'}`}
                onClickFunc={() => setFilter("all")} // Set filter to all
              />
              {/* Online Friends Button */}
              <Button
                title={"Online"}
                className={`w-[8rem] h-[2.3rem] rounded-md text-white border ${filter === 'online' ? 'bg-lightOrange' : 'border-lightOrange'}`}
                onClickFunc={() => setFilter("online")} // Set filter to online
              />
              {/* Offline Friends Button */}
              <Button
                title={"Offline"}
                className={`w-[8rem] h-[2.3rem] rounded-md text-white border ${filter === 'offline' ? 'bg-lightOrange' : 'border-lightOrange'}`}
                onClickFunc={() => setFilter("offline")} // Set filter to offline
              />
              <div className="border border-lightOrange flex items-center w-[fit] justify-center h-[2rem]">
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
          </div>

          {currentView === "grid" ? (
            <div className="flex justify-between items-center gap-[2rem] flex-wrap mt-6">
              {filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="bg-[#0d2539] w-[15rem] h-[15rem] rounded-md p-3 flex justify-center items-center flex-col"
                >
                  <div className="relative flex justify-center items-center">
                    <img
                      src={friend.sender_id === currentUserId ? friend.receiver_profile_image : friend.sender_profile_image}
                      alt={friend.sender_id === currentUserId ? friend.receiver_user_name : friend.sender_user_name}
                      className="w-[6rem] h-[6rem] rounded-full"
                    />
                    {/* Online/Offline Dot */}
                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${friend.sender_is_online === "1" && friend.receiver_is_online === "1" ? 'bg-green-500' : 'bg-gray-500'} border-2 border-white`} />
                  </div>
                  <p className="text-white mt-3 font-bold ">{friend.sender_id === currentUserId ? friend.receiver_first_name : friend.sender_first_name} {friend.sender_id === currentUserId ? friend.receiver_last_name : friend.sender_last_name}</p>
                  <p className="text-white mt-1 font-thin ">@{friend.sender_id === currentUserId ? friend.receiver_user_name : friend.sender_user_name}</p>
                  <div className="flex justify-center items-center gap-x-4 mt-4">
                    {/* <img className="w-[20px] h-[20px]" src={IconUsrCircle} alt="" /> */}
                    <Link to={`/feed/${friend.sender_id === currentUserId ? friend.receiver_id : friend.sender_id}`}>
                      <img className="w-[20px] h-[20px]" src={IconUsrCircle} alt="Profile" />
                    </Link>
                    {/* Link to messages */}
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
                  className="rounded-md bg-[#0D2539] cursor-pointer flex justify-between gap-x-5 items-left mb-2 p-3"
                >
                  <div className="flex gap-x-12">
                    <div className="relative">
                      <img
                        src={friend.sender_id === currentUserId ? friend.receiver_profile_image : friend.sender_profile_image}
                        alt={friend.sender_id === currentUserId ? friend.receiver_user_name : friend.sender_user_name}
                        className="w-[6rem] h-[6rem] rounded-full"
                      />
                      {/* Online/Offline Dot */}
                      <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${friend.sender_is_online === "1" && friend.receiver_is_online === "1" ? 'bg-green-500' : 'bg-gray-500'} border-2 border-white`} />
                    </div>
                    <div>
                      <p className="text-white mt-3 font-bold">
                        {friend.sender_id === currentUserId ? friend.receiver_first_name : friend.sender_first_name} {friend.sender_id === currentUserId ? friend.receiver_last_name : friend.sender_last_name}
                      </p>
                      <p className="text-white mt-1 font-thin">
                        @{friend.sender_id === currentUserId ? friend.receiver_user_name : friend.sender_user_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-x-4 mr-4">
                    <img className="w-[20px] h-[20px]" src={IconUsrCircle} alt="" />
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
