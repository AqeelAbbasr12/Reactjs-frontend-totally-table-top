import React, { useState, useEffect } from 'react'
import img1 from '../../assets/logo.png';
import { CiMenuBurger } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { TbLogout } from "react-icons/tb";
import { CiLogin } from "react-icons/ci";
import { IoIosLogIn } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

import { Link } from 'react-router-dom';
import toastr from 'toastr';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const items = [
    {
      id: 1,
      name: ""
    },
    {
      id: 2,
      name: "Conventions",
      path: "/admin/conventions"
    },
    {
      id: 3,
      name: "Adverts",
      path: "/admin/announcement"
    },
    {
      id: 4,
      name: "Sponsers",
      path: "/admin/sponser"
    },
    {
      id: 5,
      name: "Reports",
      path: "/admin/report"
    },

    {
      id: 6,
      name: "Users",
      path: "/admin/users"
    },
    {
      id: 7,
      name: "Messages",
      path: "/admin/messages"
    },
  ]
  const [isOpen, setIsOpen] = useState(false);
  const toggler = () => {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to log out');
      }

      // Remove authToken from localStorage
      localStorage.removeItem('authToken');

      // Show success message
      toastr.success('Log out successfully');

      // Navigate to the home page
      navigate('/admin-login');
    } catch (error) {
      // console.error('Error during logout:', error);
      toastr.error('Error logging out');
    }
  };

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
      console.log(data);
      setUser(data);
    } catch (error) {
      // console.error('Error fetching user data:', error);
    }
  };



  return (
    <div className={`bg-[#C53A33] font-mulish w-full fixed z-50`}>
      <div className="md:py-22 md:flex items-center relative  w-10/12 mx-auto ">
        {/* logo */}
        <div className='logo flex justify-center md:justify-start items-center'>
          <div className="w-15 h-15 md:w-136 md:h-136" >
            <Link to="/admin/dashboard">
              <img src={img1} alt="logo" className='w-full h-full' />
            </Link>
          </div>
        </div>
        <div className='md:flex md:justify-between items-center w-full'>
          <ul className="hidden md:flex md:gap-[12px] lg:gap-[52px] text-white">
            {items.map((item, index) => (
              <li key={index} className="relative text-xl xl:text-28 xl:leading-35 cursor-pointer" onClick={() => navigate(item.path)}>
                {/* Check if the current item is the "Message" item and show the count */}
                {item.name === "Messages" && user && user.message_count > 0 ? (
                  <span className="absolute -left-8  bg-green-500 text-white text-xs font-bold w-[1.6rem] h-[1.6rem] rounded-full flex justify-center items-center mr-2">
                    {user.message_count}
                  </span>
                ) : null}

                {item.name}
              </li>
            ))}
          </ul>



          <div className="hidden logout md:flex items-center text-white text-xl xl:text-28 xl:leading-35 gap-1 cursor-pointer" onClick={handleLogout}>
            Logout
            <IoIosLogIn className='text-white w-[27px] h-[27px]' />
          </div>
        </div>
        {/* menu-icon */}
        <div className={`absolute top-5 right-3 md:hidden text-white ${isOpen ? '' : ''}`} onClick={toggler}>
          {
            isOpen ? <RxCross2 /> : <CiMenuBurger />
          }
        </div>
      </div>

      {/* Sliding Menu */}
      <div className={`fixed top-15 z-50 right-0 h-full  bg-[#C53A33] text-white transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden w-72`}>
        <div className='p-6'>
          <ul className='space-y-4 font-bold'>
            {
              items.map((item, index) => (
                <li key={index} className="text-lg lg:text-28 lg:leading-35 cursor-pointer" onClick={() => navigate(item.path)}>
                  {item.name}
                </li>
              ))
            }

            <li className='flex items-center gap-1 cursor-pointer' onClick={handleLogout}>Logout
              <IoIosLogIn className='text-white w-[27px] h-[27px]' />
            </li>
          </ul>
        </div>
      </div>

    </div>
  )
}

export default Navbar;