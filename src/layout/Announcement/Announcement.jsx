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

  const onhandleView = (id) => {
    navigate(`/single/announcement/${id}`); // Use the id to navigate to the specific edit page
  };

  const renderAnnouncementLogo = (announcement) => {
    switch (announcement.type) {
      case 'Adverts':
        return <img src={announcement.promo_logo} alt="Expo Announcement" className="w-[100%] lg:w-[100%] h-[15rem] rounded-md cursor-pointer" />;
      case 'Announcement':
        return <img src={announcement.feature_logo} alt="Feature Announcement" className="w-[100%] lg:w-[100%] h-[15rem] rounded-md cursor-pointer" />;
      case 'Picture':
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
            {/* <p className='text-white'>Expo Announcements</p> */}
          </div>
          {announcements.filter(a => a.type === 'Adverts').map((announcement) => (
            <div key={announcement.id} className="mb-3">
              <Link to={`/single/announcement/${announcement.id}`}>
                {renderAnnouncementLogo(announcement)}
              </Link>
            </div>
          ))}

          {/* Feature Announcements */}
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
                      .filter((a) => a.type === 'Announcement') // Filter by type 'Feature'
                      .map((announcement, index) => (
                        <Link
                          key={announcement.id}
                          to={`/single/announcement/${announcement.id}`}
                          className="block w-full"
                        >
                          <tr
                            className={`w-full flex flex-wrap items-center py-5 px-4 sm:px-8 ${index % 2 === 0 ? 'bg-[#0D2539]' : 'bg-[#102F47]'
                              }`}
                          >
                            {/* Image and Name */}
                            <td className="flex items-center gap-x-4 sm:gap-x-10 w-full sm:w-1/3 mb-3 sm:mb-0">
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
                                className="w-10 h-10 sm:w-16 sm:h-16 rounded-full object-cover"
                                alt="Convention Logo"
                              />

                              {/* Name */}
                              <div className="flex flex-col justify-center">
                                <span className="font-mulish text-white text-sm sm:text-md leading-6 sm:leading-7">
                                  {announcement.name}
                                </span>
                              </div>
                            </td>

                            {/* Date */}
                            <td className="text-center w-full sm:w-1/3 mb-3 sm:mb-0">
                              <span className="font-mulish text-white text-xs sm:text-sm leading-5">
                                {announcement.created_at}
                              </span>
                            </td>

                            {/* Status Buttons */}
                            <td className="flex justify-center sm:justify-end items-center gap-x-2 sm:gap-x-5 w-full sm:w-1/3">
                              {/* Feature Status */}
                              {announcement.feature === '1' && (
                                <button className="bg-[#F3C15F] text-black px-2 py-1 rounded text-xs sm:text-sm">
                                  Featured
                                </button>
                              )}

                              {/* View Button */}
                              <span
                                className="cursor-pointer font-mulish text-white text-sm sm:text-lg"
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
          <div className='flex items-center gap-x-[1rem] my-[1rem]'>
            <img src={announceImage} alt="" />
            {/* <p className='text-white'>Advert Announcements</p> */}
          </div>
          {announcements.filter(a => a.type === 'Picture').map((announcement) => (
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
