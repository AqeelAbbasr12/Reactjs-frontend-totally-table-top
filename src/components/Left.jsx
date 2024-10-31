import React, { useEffect, useState } from 'react';

import { Link, Navigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Left = () => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Check if the user is authenticated
  const [user, setUser] = useState(null);
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
  }, []); 
  return (
    <div className='bg-[#0d2539] w-[97%] md:w-[15rem] h-fit rounded-md p-2 md:mx-0 mx-2'>
      <h1 className='text-white text-center text-lg mt-2'>Your turn, {user ? user.username : 'Loading...'}</h1>
      <div className='w-[100%] h-[1px] bg-lightGray mt-4 mb-4'></div>
      <Link className='block mb-2 text-white cursor-pointer' to={"/home"}>Home</Link>
      <Link className='block mb-2 text-white cursor-pointer' to={"/activity"}>Activity</Link>
      <Link className='block mb-2 text-white cursor-pointer' to={"/user/convention"}>Your conventions</Link>
      <Link className='block mb-2 text-white cursor-pointer' to={"/user/announcements"}>Announcements</Link>
      <Link className='block mb-2 text-white cursor-pointer' to={"/friends"}>Friends</Link>
      {/* <Link className='block mb-2 text-white cursor-pointer' to={"/findfriends"}>Find Friends</Link> */}
      <Link className='block mb-2 text-white cursor-pointer' to={"/profile"}>Profile</Link>
      <Link className='block mb-2 text-white cursor-pointer' to={"/settings"}>Settings</Link>
      <div className='w-[100%] h-[1px] bg-lightGray mt-4 mb-4'></div>
      <Link className='block mb-2 text-white cursor-pointer' ><i>Quick Links</i></Link>
      <Link className='block mb-2 text-white cursor-pointer' to={"/upcoming-convention"}>Upcoming conventions</Link>
      <Link className='block mb-2 text-white cursor-pointer' to={"/sales"}>Game for sale</Link>
      <Link className='block mb-2 text-white cursor-pointer' to={"/find_a_table"}>Find a Table</Link>
    </div>
  );
};

export default Left;
