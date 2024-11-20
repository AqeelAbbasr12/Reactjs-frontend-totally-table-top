import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Left from '../../components/Left';
import Bottom from '../../layout/Footer/Bottom';
import { fetchWithAuth } from '../../services/apiService';
import annoucementImage from '../../assets/annoucement.jpg';
import announceImage from '../../assets/announce.svg';

const Layout = () => {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

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
      // console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderAnnouncementLogo = (announcement) => {
    switch (announcement.type) {
      case 'Expo':
        return <img src={announcement.promo_logo} alt="Expo Announcement" className="w-[100%] lg:w-[100%] h-[15rem] rounded-md cursor-pointer" />;
      case 'Feature':
        return <img src={announcement.feature_logo} alt="Feature Announcement" className="w-[100%] lg:w-[100%] h-[15rem] rounded-md cursor-pointer" />;
      case 'Advert':
        return <img src={announcement.advert_logo} alt="Advert Announcement" className="w-[100%] lg:w-[190%] h-[15rem] rounded-md cursor-pointer" />;
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
      <div className='pt-[2.3rem] flex justify-between items-start md:flex-row flex-col bg-darkBlue md:px-[2rem] flex-1 h-[fit] md:h-[86rem] w-[100vw] gap-x-6'>
        {/* LEFT  */}
        <Left />

        {/* RIGHT */}
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

          {/* Example of a New Feature notification */}
          {/* <div className='bg-lime-50 w-[100%] lg:w-[80%] rounded-md p-5 my-4 flex justify-between items-center'>
            <div>
              <p className='text-darkBlue'>New feature added</p>
              <p className='text-darkBlue my-1'>Your account now supports direct messaging</p>
            </div>
          </div> */}
        </div>
      </div>

      {/* footer */}
      <Bottom />
    </div>
  );
};

export default Layout;
