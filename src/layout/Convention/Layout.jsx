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

const Layout = () => {
  const [loading, setLoading] = useState(true);
  const [conventions, setConvention] = useState([]);
  const [attendance, setAttendance] = useState();
  const [AgendaItems, setItems] = useState([]);
  const [AccommodationItem, setAccommodation] = useState([]);
  const [EventItem, setEvent] = useState([]);
  const [GameItem, setGame] = useState([]);
  const [showSub, setShowSub] = useState({ show: false, conventionId: null });

  useEffect((id) => {
    fetchConventions();
    fetchAgendas();
    fetchAccommodation();
    fetchEvent();
    fetchGame();
  }, []);

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

          <div className='flex justify-between items-center flex-wrap'>
            <h1 className='text-white text-2xl font-semibold'>Your conventions</h1>
            {/* <Button onClickFunc={() => nav("/complete")} title={"Add convention"} className={"min-w-[10rem] min-h-[2.3rem] rounded-md bg-transparent text-white border border-lightOrange sm:mt-0 mt-2"} /> */}
          </div>
          {conventions.length > 0 ? (
            <div className="bg-[#0d2539] p-3 w-full min-h-[700px] md:max-h-fit rounded-md mt-6 overflow-y-auto overflow-x-hidden">
              {conventions.map((convention) => (
                <div key={convention.id} className='flex flex-col md:flex-row justify-between items-start mb-4 p-2 bg-[#1a2a3a] rounded-md'>

                  {/* 1st Column */}
                  <div className='flex items-center gap-x-2 flex-1 mb-2 md:mb-0'>
                    <img src={convention.convention_logo || ConventionImage} alt="" className='w-[3rem] h-[3rem] rounded-full object-cover' />
                    <p className='text-lightOrange font-semibold text-lg break-words'>{convention.convention_name}</p>
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

                  {/* 4th Column */}
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

        </div>

      </div>
    </div>
  );
}

export default Layout;
