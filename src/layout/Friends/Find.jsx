import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Left from "../../components/Left";
import FaceImage from "../../assets/Icon-user-circle.png";
import IconMessage from "../../assets/Icon-message.png";
import IconUsrCircle from "../../assets/Icon-user-circle.png";
import { TbGridDots } from "react-icons/tb";
import { IoListSharp } from "react-icons/io5";
import toastr from 'toastr';
import { fetchWithAuth } from "../../services/apiService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Layout = () => {
  const nav = useNavigate();
  const [currentView, setCurrentView] = useState("grid");
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null); // Track which user is being processed

  useEffect(() => {
    fetchUserData(); // Fetch user data on component mount
  }, []);

  const fetchUserData = async () => {
    setLoading(true); // Show loading spinner while fetching
    try {
      const response = await fetchWithAuth(`/user/findfriend`, {
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
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  const sendFriendRequest = async (friendId) => {
    setLoadingId(friendId); // Set loading for the specific button
    try {
      const response = await fetchWithAuth(`/user/friend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ friend_id: friendId }),
      });

      if (!response.ok) {
        const result = await response.json();
        toastr.error(result.message); // Show the error message from the backend
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      toastr.success(result.message);

      // Fetch updated user data
      fetchUserData();
    } catch (error) {
      console.error('Error sending friend request:', error);
      toastr.error('An error occurred while sending the friend request.');
    } finally {
      setLoadingId(null); // Reset loading state
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen overflow-y-auto">
      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
        </div>
      )}
      <Navbar type={"verified"} />
      <div className="pt-[2.3rem] flex justify-between items-start md:flex-row flex-col bg-darkBlue md:px-[2rem] flex-1 h-[fit] md:h-[86rem] w-[100vw] gap-x-6">
        {/* LEFT  */}
        <Left />

        {/* RIGHT  */}
        <div className="flex-1 rounded-md px-2 mb-2 w-full md:mt-0 mt-4">
          <div className="sm:flex justify-between items-center">
            <h1 className="text-white text-2xl font-semibold"></h1>
            <div className="flex items-center gap-x-4 sm:mt-0 mt-2">
              <div className="border border-lightOrange flex items-center w-[fit] justify-center h-[2rem]">
                <IoListSharp
                  onClick={() => setCurrentView("list")}
                  className={`text-white h-full w-[2rem] p-2 cursor-pointer ${currentView === "list" && "bg-lightOrange"
                    }`}
                />
                <TbGridDots
                  onClick={() => setCurrentView("grid")}
                  className={`text-white h-full w-[2rem] p-2 cursor-pointer ${currentView === "grid" && "bg-lightOrange"
                    }`}
                />
              </div>
            </div>
          </div>

          {currentView === "grid" ? (
            <div className="flex justify-between items-center gap-[2rem] flex-wrap mt-6">
              {userData.map((user) => (
                <div
                  key={user.id}
                  className="bg-[#0d2539] w-[15rem] h-[18rem] rounded-md p-3 flex justify-center items-center flex-col"
                >
                  <div className="flex justify-center items-center">
                    <img
                      src={user.profile_image || FaceImage} // Use user.profile_image if available, else fallback to FaceImage
                      alt={`${user.first_name} ${user.last_name}`}
                      className="w-[6rem] h-[6rem] rounded-full"
                    />
                  </div>
                  <p className="text-white mt-3 font-bold">{user.first_name} {user.last_name}</p>
                  <p className="text-white mt-1 font-thin">@{user.user_name}</p>
                  <div className="flex justify-center items-center gap-x-4 mt-4">
                    {
                      user.friend_status === 'pending' ? (
                        <Button
                          title={'Request Sent'}
                          className={'w-[8rem] h-[2.3rem] rounded-md border border-lightOrange text-white sm:mt-0 mt-2'}
                        />
                      ) : (
                        <Button
                          title={loadingId === user.id ? 'Sending...' : 'Add As Friend'}
                          className={'w-[8rem] h-[2.3rem] rounded-md text-white bg-lightOrange sm:mt-0 mt-2'}
                          onClickFunc={() => sendFriendRequest(user.id)} // Attach click handler
                          loading={loadingId === user.id} // Show loading indicator for the specific button
                        />
                      )
                    }
                  </div>
                  <div className="flex justify-center items-center gap-x-4 mt-4">
                    {/* <img className="w-[20px] h-[20px]" src={IconUsrCircle} alt="" /> */}
                    <Link to={`/viewprofile/${user.id}`}>
                      <img className="w-[20px] h-[20px]" src={IconUsrCircle} alt="Profile" />
                    </Link>
                    {/* Link to messages */}
                    <Link to={`/messages/${user.id}`}>
                      <img className="w-[20px] h-[20px]" src={IconMessage} alt="Send Message" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 md:order-1 order-2 mt-6">
              {userData.map((user) => (
                <div
                  onClick={() => {
                    console.log(user.id); // Example action on click
                  }}
                  key={user.id}
                  className="rounded-md bg-[#0D2539] cursor-pointer flex flex-col md:flex-row justify-between gap-4 mb-2 p-3"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={user.profile_image || FaceImage} // Use user.profile_image if available, else fallback to FaceImage
                      alt={`${user.first_name} ${user.last_name}`}
                      className="w-[6rem] h-[6rem] rounded-full"
                    />
                    <div>
                      <p className="text-white mt-1 font-bold">{user.first_name} {user.last_name}</p>
                      <p className="text-white mt-1 font-thin">@{user.user_name}</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-4 mt-2 md:mt-0">
                    <Button
                      title={loadingId === user.id ? 'Sending...' : 'Add As Friend'}
                      className={'w-full md:w-[8rem] h-[2.3rem] rounded-md text-white bg-lightOrange'}
                      onClickFunc={() => sendFriendRequest(user.id)} // Attach click handler
                      loading={loadingId === user.id} // Show loading indicator for the specific button
                    />

                    <div className="flex gap-4 justify-center items-center mt-2 md:mt-0">
                      <Link to={`/viewprofile/${user.id}`} className="flex justify-center items-center">
                        <img className="w-[20px] h-[20px]" src={IconUsrCircle} alt="Profile" />
                      </Link>
                      <Link to={`/messages`} className="flex justify-center items-center">
                        <img className="w-[20px] h-[20px]" src={IconMessage} alt="Send Message" />
                      </Link>
                    </div>
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
