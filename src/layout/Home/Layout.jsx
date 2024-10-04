import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import { BsMicFill } from 'react-icons/bs'
import annoucementImage from '../../assets/annoucement.jpg'
import connectImage from '../../assets/connect.svg'
import announceImage from '../../assets/announce.svg'
import circelImage from '../../assets/circel.svg'
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
  const nav = useNavigate()
  

  useEffect(() => {
    fetchProfile();

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
      if (data.total_friends > 0) {
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





  return (
    <div className='flex flex-col w-[100vw]'>
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
                <Button onClickFunc={() => nav("/user/convention")} title={"All conventions"} className={"w-[10rem] h-[2.3rem] rounded-md bg-transparent text-white border border-lightOrange"} />
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
                <p className='text-white my-2'>You,ve completed the setup, enjoy your account!</p>
              </div>

              <div className='flex items-center gap-x-4'>
                {/* <Button title={"Hide message"} className={"w-[10rem] h-[2.3rem] rounded-md bg-transparent text-white border border-lightOrange"} /> */}
              </div>
            </div>
          )}

         
          <div className='flex items-center gap-x-[1rem] my-[1rem]'>
            <img src={announceImage} alt="" />
            {/* <div className='w-[2rem] h-[2rem] rounded-full bg-red flex justify-center items-center'>
              <BsMicFill className='text-white text-lg ml-[-1px]' />
            </div> */}
            <p className='text-white'>Annoucements</p>

          </div>
          <div className="mb-3">
            <img src={annoucementImage} alt="" className='w-[100%] lg:w-[80%] h-[15rem] rounded-md cursor-pointer' />
          </div>

          <div className="mb-3">
            <img src={annoucementImage} alt="" className='w-[100%] lg:w-[80%] h-[15rem] rounded-md cursor-pointer' />
          </div>

          <div className="mb-3">
            <img src={annoucementImage} alt="" className='w-[100%] lg:w-[80%] h-[15rem] rounded-md cursor-pointer' />
          </div>

          <div className=' bg-lime-50 w-[100%] lg:w-[80%] rounded-md p-5 my-4 flex justify-between items-center'>

            <div>
              <p className='text-darkBlue'>New feature added</p>
              <p className='text-darkBlue my-1'>Your account now support direct messaging</p>
            </div>
            {/* <img src={connectImage} alt="" /> */}
          </div>
        </div>


      </div>

      {/* footer  */}
      <Bottom />
    </div>
  )
}

export default Layout
