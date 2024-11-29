import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import annoucementImage from '../../assets/annoucement.jpg'
import featureImage from '../../assets/traditional.png'

import announceImage from '../../assets/announce.svg'

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
  const [announcements, setAnnouncements] = useState([]);
  const nav = useNavigate()


  useEffect(() => {
    fetchProfile();
    fetchAnnouncements();
  }, []);


  const fetchProfile = async () => {
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


      // Check profile properties to determine step visibility
      if (data.bio && data.location && data.profile_picture) {
        setCurrentStep(2); // Move to step 2 if all properties exist
      }
      // Attendance
      if (data.total_attendance > 0) {
        setCurrentStep(3); // Move to step 2 if all properties exist
      }
      // Friends
      if (data.total_friends_for_step > 0) {
        setCurrentStep(4); // Move to step 4 if all properties exist
      }

      if (data.total_games > 0) {
        setCurrentStep(5); // Move to step 5 if at least one game exists for the current user
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false); // Set loading to false even if there's an error
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
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };


  const renderAnnouncementLogo = (announcement) => {
    switch (announcement.type) {
      case 'Expo':
        return <img src={announcement.promo_logo || annoucementImage } alt="Expo Announcement" className="w-[100%] lg:w-[100%] h-[15rem] rounded-md cursor-pointer" />;
      case 'Feature':
        return <img src={announcement.feature_logo || featureImage} alt="Feature Announcement" className="w-[100%] lg:w-[100%] h-[15rem] rounded-md cursor-pointer" />;
      case 'Advert':
        return <img src={announcement.advert_logo || annoucementImage} alt="Advert Announcement" className="w-[100%] lg:w-[100%] h-[15rem] rounded-md cursor-pointer" />;
      default:
        return null;
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
          {currentStep === 1 && (
            <div className='bg-[#0d2539] w-[100%] lg:w-[80%] rounded-md p-2 my-2 flex justify-between items-center p-5'>
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
            <div className='bg-[#0d2539] w-[100%] lg:w-[80%] rounded-md p-2 my-2 flex justify-between items-center p-5'>
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
            <div className='bg-[#0d2539] w-[100%] lg:w-[80%] rounded-md p-2 my-2 flex justify-between items-center p-5'>
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
            <div className='bg-[#0d2539] w-[100%] lg:w-[80%] rounded-md p-2 my-2 flex justify-between items-center p-5'>
              <div className='flex'>
                <img src={circel4Image} alt="" />
                <div className='ml-5 mt-3'>
                  <p className='text-gray-400'>Step 4 of 4</p>
                  <p className='text-white my-2'>Take a look at available games</p>
                </div>
              </div>
              <div className='flex items-center gap-x-4'>
                <Button onClickFunc={() => nav("/user/convention")} title={"Games for sale"} className={"w-[10rem] h-[2.3rem] rounded-md bg-transparent text-white border border-lightOrange"} />
              </div>
            </div>
          )}
          {currentStep === 5 && (
            <div className='bg-[#0d2539] w-[100%] lg:w-[80%] rounded-md p-2 my-2 flex justify-between items-center'>

              <div className='ml-5 mt-3'>
                <p className='text-white'>Setup complete</p>
                <p className='text-white my-2'>You’ve completed the setup, enjoy your account!</p>
              </div>

              <div className='flex items-center gap-x-4'>
                {/* <Button title={"Hide message"} className={"w-[10rem] h-[2.3rem] rounded-md bg-transparent text-white border border-lightOrange"} /> */}
              </div>
            </div>
          )}


          <div className='flex-1 rounded-md px-2 mb-2'>
            {/* Expo Announcements */}
            <div className='flex items-center gap-x-[1rem] my-[1rem]'>
              <img src={announceImage} alt="" />
              <p className='text-white'>Expo Announcements</p>
            </div>
            {announcements.filter(a => a.type === 'Expo').map((announcement) => (
              <div key={announcement.id} className="mb-3">
                <Link to={`/single/announcement/${announcement.id}`}>
                  {renderAnnouncementLogo(announcement)}
                </Link>
              </div>
            ))}

            {/* Feature Announcements */}
            <div className='flex items-center gap-x-[1rem] my-[1rem]'>
              <img src={announceImage} alt="" />
              <p className='text-white'>Feature Announcements</p>
            </div>
            {announcements.filter(a => a.type === 'Feature').map((announcement) => (
            <Link
              key={announcement.id}
              to={`/single/announcement/${announcement.id}`}
              className="block bg-darkBlue p-4 rounded-[1.37rem] mb-3 border border-white transition-transform transform hover:scale-105"
            >
              <div className="flex flex-col md:flex-row justify-between items-center md:items-center">
                {/* Name */}
                <h1 className="text-white text-2xl font-semibold text-center md:text-left">
                  {announcement.name}
                </h1>

                {/* Divider (hidden on mobile) */}
                <div className="hidden md:block w-[1px] h-8 bg-white mx-4"></div>

                {/* Logo (below name on mobile) */}
                <div className="mt-4 md:mt-0 flex-shrink-0">
                  {renderAnnouncementLogo(announcement)}
                </div>
              </div>
            </Link>
          ))}

            {/* Advert Announcements */}
            <div className='flex items-center gap-x-[1rem] my-[1rem]'>
              <img src={announceImage} alt="" />
              <p className='text-white'>Advert Announcements</p>
            </div>
            {announcements.filter(a => a.type === 'Advert').map((announcement) => (
              <div key={announcement.id} className="mb-3">
                <Link to={`/single/announcement/${announcement.id}`}>
                  {renderAnnouncementLogo(announcement)}
                </Link>
              </div>
            ))}

          </div>
        </div>


      </div>

      {/* footer  */}
      <Bottom />
    </div>
  )
}

export default Layout
