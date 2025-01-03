import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import annoucementImage from '../../assets/annoucement.jpg'
import featureImage from '../../assets/traditional.png'

import announceImage from '../../assets/announce.svg'

import Swal from "sweetalert2";
import circel1Image from '../../assets/circel1.svg'
import circel2Image from '../../assets/circel2.svg'
import circel3Image from '../../assets/circel3.svg'
import circel4Image from '../../assets/circel4.svg'
import Left from '../../components/Left'
import Bottom from '../../layout/Footer/Bottom'
import { fetchWithAuth } from "../../services/apiService";
const Layout = () => {

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [hasVisitedSales, setHasVisitedSales] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [userData, setUserData] = useState(null);
  const nav = useNavigate()


  useEffect(() => {
    // Fetch profile and announcements
    fetchProfile();
    fetchAnnouncements();

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
    } else if (userData.bio && userData.location && userData.profile_picture) {
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

  const onhandleView = (id) => {
    nav(`/single/announcement/${id}`); // Use the id to navigate to the specific edit page
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
      console.log(data);
      setUserData(data); // Store user data for step logic
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
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
      setAnnouncements(data);
      console.log('announcement', data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };





  return (
    <div className='flex flex-col w-[100vw] min-h-[100vh] max-h-fit overflow-y-auto bg-darkBlue'>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
        </div>
      )}
      <Navbar type={"verified"} />
      <div className='pt-[2.3rem] flex  justify-between items-start md:flex-row flex-col bg-darkBlue md:px-[2rem] flex-1 h-[fit] md:h-[86rem] w-[100vw] gap-x-6'>

        {/* LEFT  */}
        <Left />

        {/* RIGHT  */}
        <div className='flex-1 rounded-md px-2 mb-2'>
          <h1 className='text-white text-2xl font-semibold'>Welcome</h1>
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
                    <Button onClickFunc={() => nav("/profile")} title={"Complete Profile"} className={"w-[10rem] h-[2.3rem] rounded-md bg-transparent text-white border border-lightOrange"} />
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



          <div className='flex-1 rounded-md px-2 mb-2'>
            {/* Expo Announcements */}
            {/* <div className='flex items-center gap-x-[1rem] my-[1rem]'>
              <img src={announceImage} alt="" />
              <p className='text-white'>Expo Announcements</p>
            </div>
            {announcements.filter(a => a.type === 'Adverts').map((announcement) => (
              <div key={announcement.id} className="mb-3">
                <Link to={`/single/announcement/${announcement.id}`}>
                  {renderAnnouncementLogo(announcement)}
                </Link>
              </div>
            ))} */}

            <div className="my-4">
              {/* Feature Announcements Header */}
              <div className="flex items-center gap-x-[1rem] my-[1rem]">
                <img src={announceImage} alt="" />
              </div>

              {/* Announcements Table */}
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <tbody>
                    {announcements
                      .filter((a) => a.type === 'Announcement') // Filter by type 'Announcement'
                      .map((announcement, index) => (
                        <Link
                          key={announcement.id}
                          to={`/single/announcement/${announcement.id}`}
                          className="block w-full"
                        >
                          <tr
                            className={`w-full flex flex-wrap items-center py-4 px-4 ${index % 2 === 0 ? 'bg-[#0D2539]' : 'bg-[#102F47]'}`}
                          >
                            {/* Image and Name */}
                            <td className="flex items-center gap-x-4 w-full sm:w-1/4 mb-3 sm:mb-0">
                              {/* Image */}
                              <img
                                src={
                                  announcement.expo_logo && announcement.expo_logo !== null
                                    ? announcement.expo_logo
                                    : announcement.feature_logo && announcement.feature_logo !== null
                                      ? announcement.feature_logo
                                      : announcement.advert_logo && announcement.advert_logo !== null
                                        ? announcement.advert_logo
                                        : ConventionImage
                                }
                                className="w-10 h-10 rounded-full object-cover"
                                alt="Convention Logo"
                              />

                              {/* Name */}
                              <div className="flex flex-col justify-center">
                                <span className="font-mulish text-white text-sm leading-6">
                                  {announcement.name}
                                </span>
                              </div>
                            </td>

                            {/* Title */}
                            <td className="py-4 px-4 text-center text-white font-mulish text-sm leading-5 w-full sm:w-1/4 whitespace-nowrap">
                              {announcement.title}
                            </td>

                            {/* Date */}
                            <td className="text-center text-white font-mulish text-sm leading-5 w-full sm:w-1/4 mb-3 sm:mb-0">
                              {announcement.created_at}
                            </td>

                            {/* Status Buttons */}
                            <td className="flex justify-center sm:justify-end items-center gap-x-2 w-full sm:w-1/4">
                              {/* Feature Status */}
                              {announcement.feature === '1' && (
                                <button className="bg-[#F3C15F] text-black px-2 py-1 rounded text-xs">
                                  Featured
                                </button>
                              )}

                              {/* View Button */}
                              <span
                                className="cursor-pointer font-mulish text-white text-sm"
                                onClick={() => onhandleView(announcement.id)}
                              >
                                View
                              </span>
                            </td>
                          </tr>
                        </Link>
                      ))}
                  </tbody>
                </table>
              </div>

            </div>





            {/* Advert Announcements */}
            {/* <div className='flex items-center gap-x-[1rem] my-[1rem]'>
              <img src={announceImage} alt="" />
            </div>
            {announcements.filter(a => a.type === 'Picture').map((announcement) => (
              <div key={announcement.id} className="mb-3">
                <Link to={`/single/announcement/${announcement.id}`}>
                  {renderAnnouncementLogo(announcement)}
                </Link>
              </div>
            ))} */}

          </div>
        </div>


      </div>

      {/* footer  */}
      <Bottom />
    </div>
  )
}

export default Layout
