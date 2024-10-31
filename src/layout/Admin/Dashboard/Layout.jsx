import React, { useState, useEffect } from 'react';
import convention from '../../../assets/Convention.svg';
import announcement from '../../../assets/Announcement.svg';
import sponser from '../../../assets/Sponsers.svg';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Admin/Navbar';
import { fetchWithAuth } from '../../../services/apiService';

import toastr from 'toastr';
function Layout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    fetchConventions();
  }, []);
  const fetchConventions = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/admin/convention`, {
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
      // setConvention(data);
      // console.log(data);
    } catch (error) {
      // console.error('Error fetching conventions data:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-[#102F47] w-full opacity-100 min-h-screen">
      <Navbar/>
      <div className='w-10/12 mx-auto pt-20 md:pt-30 text-white opacity-100'>
        <p className='text-[26px] leading-10 sm:text-5xl sm:leading-15 md:text-6xl  md:leading-108 pt-20 pb-[22px] md:pb-[42px] font-palanquin-dark'>Totally TableTop Admin</p>
        <div className='w-full 2xl:w-8/12 font-mulish text-xl leading-7 sm:text-26 sm:leading-33 flex flex-col'>
          <span>Remember that any actions you take in the admin portal will have an impact
            on the platform and some actions cannot be undone, so take care.</span>
          <span>With power comes responsibility!</span>
        </div>
      </div>

      {/* 3 cols */}
      <div className='w-10/12 mx-auto text-white pt-[51px] pb-20'>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4  gap-x-4 gap-y-10">
          
              <div className='py-14 bg-[#0D2539] flex justify-center items-center border-r-4 border-b-4 border-[#F3C15F] cursor-pointer'onClick={() => navigate('/admin/conventions')} >
                <div className='flex-col'>
                  <div className='w-30 h-30 mb-4 flex mx-auto'>
                    <img src={convention} alt="" className='w-full h-full object-cover' />
                  </div>
                  <span className='font-palanquin-dark text-3xl sm:text-35 sm:leading-63'>Convention</span>
                </div>
              </div>

              {/* Annoucement */}
              <div className='py-14 bg-[#0D2539] flex justify-center items-center border-r-4 border-b-4 border-[#F3C15F] cursor-pointer' onClick={() => navigate('/admin/announcement')} >
                <div className='flex-col'>
                  <div className='w-30 h-30 mb-4 flex mx-auto'>
                    <img src={announcement} alt="" className='w-full h-full object-cover' />
                  </div>
                  <span className='font-palanquin-dark text-3xl sm:text-35 sm:leading-63'>Announcement</span>
                </div>
              </div>

              {/* Sponcer */}

              <div className='py-14 bg-[#0D2539] flex justify-center items-center border-r-4 border-b-4 border-[#F3C15F] cursor-pointer' onClick={() => navigate('/admin/sponser')} >
                <div className='flex-col'>
                  <div className='w-30 h-30 mb-4 flex mx-auto'>
                    <img src={sponser} alt="" className='w-full h-full object-cover' />
                  </div>
                  <span className='font-palanquin-dark text-3xl sm:text-35 sm:leading-63'>Sponsers</span>
                </div>
              </div>
        </div>
      </div>

    </div>
  )
}

export default Layout;