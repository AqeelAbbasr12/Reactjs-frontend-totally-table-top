import React, { useEffect, useState } from 'react';

import { Link, Navigate } from 'react-router-dom';
import { fetchWithAuth } from '../services/apiService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Left = () => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Check if the user is authenticated
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  if (!isAuthenticated) {
    return <Navigate to="/" replace />; // Redirect to login page if not authenticated
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/get`, {
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
        setUser(data);
      } catch (error) {
        // console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
    fetchAnnouncements()
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
    <div className="flex flex-col min-w-full md:min-w-[15rem] md:w-[15rem] gap-y-4">
      {/* Sidebar */}
      <div className='bg-[#0d2539] h-fit rounded-md p-2 md:mx-0 mx-2'>
        <h1 className='text-white text-center text-lg mt-2'>
          Hello, {user ? user.username : 'Loading...'}
        </h1>
        <div className='w-[100%] h-[1px] bg-lightGray mt-4 mb-4'></div>
        {/* <Link className='block mb-2 text-white cursor-pointer' to={"/home"}>Home</Link> */}
        <Link className='block mb-2 text-white cursor-pointer' to={"/user/convention"}>Your conventions</Link>
        <Link className='block mb-2 text-white cursor-pointer' to={"/user/announcements"}>Announcements</Link>
        <Link className='block mb-2 text-white cursor-pointer' to={"/friends"}>Friends</Link>
        <Link className='block mb-2 text-white cursor-pointer' to={"/activity"}>Activity</Link>
        {/* <Link className='block mb-2 text-white cursor-pointer' to={"/profile"}>Profile</Link> */}
        {/* <Link className='block mb-2 text-white cursor-pointer' to={"/settings"}>Settings</Link> */}
        <div className='w-[100%] h-[1px] bg-lightGray mt-4 mb-4'></div>
        <Link className='block mb-2 text-white cursor-pointer'><i>Quick Links</i></Link>
        <Link className='block mb-2 text-white cursor-pointer' to={"/upcoming-convention"}>Upcoming conventions</Link>
        <Link className='block mb-2 text-white cursor-pointer' to={"/sales"}>Games for sale</Link>
        <Link className='block mb-2 text-white cursor-pointer' to={"/sold"}>Sold Games</Link>
        <Link className='block mb-2 text-white cursor-pointer' to={"/find_a_table"}>Find a Table</Link>
      </div>

      {/* 2nd Position Advertisement */}
      <div className="flex justify-center">
  {loading ? (
    <div 
      className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"
    ></div>
  ) : (
    // Find the announcement with 2nd position
    announcements.find(item => item.position_of_picture === '2nd_position') && (
      <img
        src={
          announcements.find(item => item.position_of_picture === '2nd_position').advert_logo
        }
        alt={
          announcements.find(item => item.position_of_picture === '2nd_position').name
        }
        className='w-[15rem] h-[20rem] rounded-md cursor-pointer'
        // Open URL when image is clicked
        onClick={() => {
          const announcement = announcements.find(item => item.position_of_picture === '2nd_position');
          window.open(announcement.url, '_blank'); // Open URL in a new tab
        }}
      />
    )
  )}
</div>

    </div>
  );
  
  
};

export default Left;
