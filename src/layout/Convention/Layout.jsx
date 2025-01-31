import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Left from '../../components/Left';
import ConventionImage from '../../assets/traditional.png'
import { FaBuilding, FaCalendarAlt, FaDiceFive, FaList } from 'react-icons/fa';
import { BsFillCaretDownFill } from 'react-icons/bs';
import { fetchWithAuth } from '../../services/apiService';
import ImageCross from '../../assets/red-cross.png'
import circel1Image from '../../assets/circel1.svg'
import circel2Image from '../../assets/circel2.svg'
import circel3Image from '../../assets/circel3.svg'
import circel4Image from '../../assets/circel4.svg'

const Layout = () => {
  const [loading, setLoading] = useState(true);
  const [conventions, setConvention] = useState([]);
  const [attendance, setAttendance] = useState();
  const [AgendaItems, setItems] = useState([]);
  const [AccommodationItem, setAccommodation] = useState([]);
  const [EventItem, setEvent] = useState([]);
  const [GameItem, setGame] = useState([]);
  const [hasVisitedSales, setHasVisitedSales] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [userData, setUserData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSub, setShowSub] = useState({ show: false, conventionId: null });
  const nav = useNavigate();

  useEffect((id) => {
    fetchConventions();
    fetchAgendas();
    fetchAccommodation();
    fetchEvent();
    fetchGame();
    fetchAnnouncements();
    fetchProfile();

    // Load hasVisitedSales from localStorage
    const visitedSales = localStorage.getItem("hasVisitedSales");
    if (visitedSales) {
      setHasVisitedSales(JSON.parse(visitedSales));
    }
  }, []);


  // Update the current step based on user data and sales visit
  useEffect(() => {
    if (!userData) return;


    if (userData.is_visited_sale_game === '1') {
      setCurrentStep(5); // Sales visited - move to Step 5
    } else if (userData.is_steps_complete === '1') {
      setCurrentStep(6); // Friends step
    } else if (userData.total_friends_for_step > 0) {
      setCurrentStep(4); // Friends step
    } else if (userData.total_attendance > 0) {
      setCurrentStep(3); // Attendance step
    } else if (userData.is_visited_profile_page === '1') {
      setCurrentStep(2); // Profile setup step
    } else {
      setCurrentStep(1); // Default step
    }

  }, [userData, hasVisitedSales]);

  const handleSalesVisit = async () => {
    try {
      // Prepare data for API request
      const requestBody = {
        is_visited_sale_game: true, // Update the required variable
      };

      // Call the API to update the profile
      const response = await fetchWithAuth("/user/update-game-visit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include auth token if required
        },
        body: JSON.stringify(requestBody), // Send the updated variable
      });

      // Handle API response
      const data = await response.json();
      if (response.ok) {
        // If API call is successful
        console.log("Profile updated successfully:", data);
        // Set the current step and navigate
        nav("/sales"); // Navigate to sales page
      } else {
        // Handle API errors
        console.error("Error updating profile:", data);
        Swal.fire("Error!", "Failed to update profile. Please try again.", "error");
      }
    } catch (error) {
      // Handle network errors
      console.error("Network error:", error);
      Swal.fire("Error!", "Something went wrong. Please try again.", "error");
    }
  };

  const handleProfileVisit = async () => {
    try {
      // Prepare data for API request
      const requestBody = {
        is_visited_profile_page: true, // Update the required variable
      };

      // Call the API to update the profile
      const response = await fetchWithAuth("/user/update-profile-visit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include auth token if required
        },
        body: JSON.stringify(requestBody), // Send the updated variable
      });

      // Handle API response
      const data = await response.json();
      if (response.ok) {
        // If API call is successful
        console.log("Profile updated successfully:", data);
        // Set the current step and navigate
        nav("/profile"); // Navigate to sales page
      } else {
        // Handle API errors
        console.error("Error updating profile:", data);
        Swal.fire("Error!", "Failed to update profile. Please try again.", "error");
      }
    } catch (error) {
      // Handle network errors
      console.error("Network error:", error);
      Swal.fire("Error!", "Something went wrong. Please try again.", "error");
    }
  };

  const handleStepComplete = async () => {
    try {
      // Prepare data for API request
      const requestBody = {
        is_steps_complete: true, // Update the required variable
      };

      // Call the API to update the profile
      const response = await fetchWithAuth("/user/steps-completed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include auth token if required
        },
        body: JSON.stringify(requestBody), // Send the updated variable
      });

      // Handle API response
      const data = await response.json();
      if (response.ok) {
        // If API call is successful
        console.log("Profile updated successfully:", data);
        // Set the current step and navigate
        setCurrentStep(6);
      } else {
        // Handle API errors
        console.error("Error updating profile:", data);
        Swal.fire("Error!", "Failed to update profile. Please try again.", "error");
      }
    } catch (error) {
      // Handle network errors
      console.error("Network error:", error);
      Swal.fire("Error!", "Something went wrong. Please try again.", "error");
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/user/get`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      // console.log('Profile',data);
      setUserData(data); // Store user data for step logic
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConventions = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/user/convention`, {
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
      // console.log('Convention', data);
    } catch (error) {
      // console.error('Error fetching conventions data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowSub = (id) => {
    setShowSub((prev) => ({
      show: prev.conventionId === id ? !prev.show : true,
      conventionId: id
    }));
    fetchAttendanceData(id);
    fetchAgendas(id);
  };

  // Fetch saved attendance data
  const fetchAttendanceData = async (id) => {
    try {
      const response = await fetchWithAuth(`/user/convention_attendance/${id}`, {
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
      // Extract and format the dates from the response
      // console.log(data);
      setAttendance(data);
    } catch (error) {
      // console.error('Error fetching attendance data:', error);
    }
  };
  const fetchAgendas = async () => {
    try {
      const response = await fetchWithAuth(`/user/convention_agenda`);
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

  const fetchAccommodation = async () => {
    try {
      const response = await fetchWithAuth(`/user/convention_accommodation`);
      if (!response.ok) throw new Error('Failed to fetch accommodation');

      const data = await response.json();
      // console.log('Agenda Items', data);
      if (Array.isArray(data)) {
        setAccommodation(data);  // Only set if the response is an array
      } else {
        // console.error('Invalid data structure:', data);
        setItems([]);
      }
    } catch (error) {
      // console.error('Error fetching agendas:', error);
      setItems([]);
    }
  };

  const fetchEvent = async () => {
    try {
      const response = await fetchWithAuth(`/user/convention_event`);
      if (!response.ok) throw new Error('Failed to fetch Event');

      const data = await response.json();
      // console.log('Agenda Event', data);
      if (Array.isArray(data)) {
        setEvent(data);  // Only set if the response is an array
      } else {
        // console.error('Invalid data structure:', data);
        setItems([]);
      }
    } catch (error) {
      // console.error('Error fetching agendas:', error);
      setItems([]);
    }
  };

  const fetchGame = async () => {
    try {
      const response = await fetchWithAuth(`/user/convention_game`);
      if (!response.ok) throw new Error('Failed to fetch Game');

      const data = await response.json();
      // console.log('Agenda Games', data);
      if (Array.isArray(data)) {
        setGame(data);  // Only set if the response is an array
      } else {
        // console.error('Invalid data structure:', data);
        setGame([]);
      }
    } catch (error) {
      // console.error('Error fetching games:', error);
      setGame([]);
    }
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/user/announcement`, {
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

      // console.log('announcement', data);
      // Filter and sort the data
      const pictureAnnouncements = data.filter(
        (item) => item.type === 'Picture' && item.position_of_picture
      );

      const sortedAnnouncements = pictureAnnouncements.sort((a, b) => {
        const positions = {
          '1st_position': 1,
          '2nd_position': 2,
          '3rd_position': 3,
        };
        return positions[a.position_of_picture] - positions[b.position_of_picture];
      });

      setAnnouncements(sortedAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col w-[100vw] h-[100vh] overflow-y-auto bg-darkBlue'>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
        </div>
      )}
      <Navbar type={"verified"} />
      <div className='pt-[2.3rem] flex justify-between items-start md:flex-row flex-col bg-darkBlue md:px-[2rem] flex-1 h-[fit] md:h-[86rem] w-[100vw] gap-x-6'>

        {/* LEFT */}
        <Left />

        {/* RIGHT */}
        <div className='flex-1 rounded-md px-2 mb-2 md:mt-0 mt-4 w-[100%]'>
          {userData?.is_steps_complete !== '1' && (
            <>
              {currentStep === 1 && (
                <div className='bg-[#0d2539] w-[100%] lg:w-[80%] rounded-md my-2 flex justify-between items-center p-5'>
                  <div className='flex'>
                    <img src={circel1Image} alt="" />
                    <div className='ml-5 mt-3'>
                      <p className='text-gray-400'>Step 1 of 4</p>
                      <p className='text-white my-2'>Complete your profile to get started</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-x-4'>
                    <Button onClickFunc={handleProfileVisit} title={"Complete Profile"} className={"w-[10rem] h-[2.3rem] rounded-md bg-transparent text-white border border-lightOrange"} />
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div className='bg-[#0d2539] w-[100%] lg:w-[80%] rounded-md my-2 flex justify-between items-center p-5'>
                  <div className='flex'>
                    <img src={circel2Image} alt="" />
                    <div className='ml-5 mt-3'>
                      <p className='text-gray-400'>Step 2 of 4</p>
                      <p className='text-white my-2'>Find conventions to attend</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-x-4'>
                    <Button onClickFunc={() => nav("/upcoming-convention")} title={"All conventions"} className={"w-[10rem] h-[2.3rem] rounded-md bg-transparent text-white border border-lightOrange"} />
                  </div>
                </div>
              )}
              {currentStep === 3 && (
                <div className='bg-[#0d2539] w-[100%] lg:w-[80%] rounded-md my-2 flex justify-between items-center p-5'>
                  <div className='flex'>
                    <img src={circel3Image} alt="" />
                    <div className='ml-5 mt-3'>
                      <p className='text-gray-400'>Step 3 of 4</p>
                      <p className='text-white my-2'>Find and connect with friends</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-x-4'>
                    <Button onClickFunc={() => nav("/findfriends")} title={"Find friends"} className={"w-[10rem] h-[2.3rem] rounded-md bg-transparent text-white border border-lightOrange"} />
                  </div>
                </div>
              )}
              {currentStep === 4 && (
                <div className='bg-[#0d2539] w-[100%] lg:w-[80%] rounded-md my-2 flex justify-between items-center p-5'>
                  <div className='flex'>
                    <img src={circel4Image} alt="" />
                    <div className='ml-5 mt-3'>
                      <p className='text-gray-400'>Step 4 of 4</p>
                      <p className='text-white my-2'>Take a look at available games</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-x-4'>
                    <Button onClickFunc={handleSalesVisit} title={"Games for sale"} className={"w-[10rem] h-[2.3rem] rounded-md bg-transparent text-white border border-lightOrange"} />
                  </div>
                </div>
              )}
            </>
          )}

          {currentStep === 5 && userData?.is_steps_complete !== '1' && (
            <div className='bg-[#0d2539] w-[100%] lg:w-[80%] rounded-md p-2 my-2 flex justify-between items-center'>
              <div className='ml-5 mt-3'>
                <p className='text-white'>Setup complete</p>
                <p className='text-white my-2'>You’ve completed the setup, enjoy your account!</p>
              </div>
              <div className='flex items-center gap-x-4'>
                <Button
                  onClickFunc={handleStepComplete}  // This will trigger handleStepComplete when clicked
                  title={"Mark as Complete"}  // Button label
                  className={"w-[10rem] h-[2.3rem] rounded-md bg-transparent text-white border border-lightOrange"} // Button styles
                />
              </div>
            </div>
          )}

          {currentStep === 6 && (
            // Display nothing or a message indicating the process is complete.
            <div className="hidden"></div> // Or you can use another way to indicate completion if necessary
          )}
          {/* Show loading spinner */}
          {loading ? (
            <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
              <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
            </div>
          ) : null}
          {/* Render 1st position at the top */}
          {announcements[0] && announcements[0].position_of_picture === '1st_position' && (
            <div
              className='flex items-center gap-x-[1rem] my-[1rem] w-full'
              onClick={() => window.open(announcements[0].url, '_blank')} // Open URL in new tab
            >
              <img
                src={announcements[0].advert_logo}
                alt={announcements[0].name}
                className='w-full lg:w-full md:h-[12rem] min-w-[300px] object-cover rounded-md cursor-pointer'
              />
            </div>
          )}


          {/* Title */}
          <div className='flex justify-between items-center flex-wrap'>
            <h1 className='text-white text-2xl font-semibold'>Your conventions</h1>
          </div>

          {/* Conventions */}
          {conventions.length > 0 ? (
            <div className="bg-[#0d2539] p-3 w-full min-h-[300px] md:max-h-fit rounded-md mt-6 overflow-y-auto overflow-x-hidden">
              {conventions.map((convention) => (
                <div key={convention.id} className='flex flex-col md:flex-row justify-between items-start mb-4 p-2 bg-[#1a2a3a] rounded-md'>

                  {/* 1st Column */}
                  <div className='flex items-center gap-x-2 flex-1 mb-2 md:mb-0'>
                    <img src={convention.convention_logo || ConventionImage} alt="" className='w-[3rem] h-[3rem] rounded-full object-cover' />
                    <Link to={`/convention/attendance/${convention.id}`}>
                      <p className='text-lightOrange font-semibold text-lg break-words'>{convention.convention_name}</p>
                    </Link>
                  </div>

                  {/* 2nd Column */}
                  <div className='flex-1 mb-2 md:mb-0'>
                    <p className='text-[#F3C15F] text-sm break-words'>{convention.convention_dates.join(', ')}</p>
                  </div>

                  {/* 3rd Column */}
                  <div className='flex items-center gap-x-2 flex-1 mb-2 md:mb-0'>
                    <Link to={`/next/agenda/${convention.id}`}>
                      <FaList
                        className='cursor-pointer'
                        color={AgendaItems.some(item => item.convention_id === convention.id) ? '#F3C15F' : '#FFFFFF'}
                      />
                    </Link>
                    <Link to={`/accomodation/${convention.id}`}>
                      <FaBuilding
                        className='cursor-pointer'
                        color={AccommodationItem.some(item => item.convention_id === convention.id) ? '#F3C15F' : '#FFFFFF'}
                      />
                    </Link>
                    <Link to={`/event/${convention.id}`} >
                      <FaCalendarAlt
                        className='cursor-pointer'
                        color={EventItem.some(item => item.convention_id === convention.id) ? '#F3C15F' : '#FFFFFF'}
                      />
                    </Link>
                    <Link to={`/game/sale/${convention.id}`} >
                      <FaDiceFive
                        className='cursor-pointer'
                        color={GameItem.some(item => item.convention_id === convention.id) ? '#F3C15F' : '#FFFFFF'}
                      />
                    </Link>
                  </div>


                  {/* 4th Column Button */}
                  <div className='flex items-center gap-x-2 flex-1 mb-2 md:mb-0'>
                    {convention.convention_game_total > 0 && (
                      <button
                        onClick={() => window.open(`/salesbyconvention/${convention.id}`, '_blank')}
                        className='px-4 py-2 rounded text-white bg-orange-500'
                      >
                        Game For Sale
                      </button>
                    )}
                  </div>


                  {/* 5th Column */}
                  <div className='relative flex items-center cursor-pointer'>
                    <p onClick={() => handleShowSub(convention.id)} className='text-[#F3C15F] text-sm mr-1'>Activity</p>
                    <BsFillCaretDownFill className='text-[#F3C15F]' onClick={() => handleShowSub(convention.id)} />

                    {showSub.show && showSub.conventionId === convention.id && (
                      <div className='absolute top-[2rem] left-0 md:left-[-4rem] bg-black p-4 w-48 z-50 rounded-md shadow-lg'>
                        <Link to={`/convention/attendance/${convention.id}`} className='block mb-1 cursor-pointer text-white text-sm'>Your attendance</Link>
                        {attendance && attendance.length > 0 && (
                          <>
                            <Link to={`/next/agenda/${convention.id}`} className='block mb-1 cursor-pointer text-white text-sm'>Agenda</Link>
                            <Link to={`/accomodation/${convention.id}`} className='block mb-1 cursor-pointer text-white text-sm'>Accommodations</Link>
                            <Link to={`/event/${convention.id}`} className='block mb-1 cursor-pointer text-white text-sm'>Tables</Link>
                            <Link to={`/game/sale/${convention.id}`} className='block mb-1 cursor-pointer text-white text-sm'>Games for sale</Link>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty State Component
            <div className='w-[100%] h-[52.5vh] mt-4 bg-[#0d2539] rounded-md flex justify-center items-center flex-col'>
              <img className='justify-center' src={ImageCross} alt="" />
              <h1 className='text-lg text-center font-semibold mt-3 mb-5 text-white'>
                No convention attendance marked by you.
              </h1>
            </div>
          )}

          {/* 3rd Position Advert Logo */}
          {announcements.length > 0 && announcements.find(a => a.position_of_picture === '3rd_position') && (
            <div
              className='mt-6 flex justify-center w-full'
              onClick={() => window.open(announcements.find(a => a.position_of_picture === '3rd_position').url, '_blank')} // Open URL in new tab
            >
              <img
                src={announcements.find(a => a.position_of_picture === '3rd_position').advert_logo}
                alt="3rd Position Ad"
                className='w-full sm:w-auto lg:w-full md:h-[12rem] sm:min-w-[300px] lg:min-w-[100%] object-cover rounded-md cursor-pointer'
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );

}

export default Layout;
