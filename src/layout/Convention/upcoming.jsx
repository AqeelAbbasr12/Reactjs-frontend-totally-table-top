import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Left from '../../components/Left';
import drop from '../../assets/icon-caret-down.svg';
import ConventionImage from '../../assets/convention.jpeg'
import { FaBuilding, FaCalendarAlt, FaDiceFive, FaList } from 'react-icons/fa';
import { BsFillCaretDownFill } from 'react-icons/bs';
import { fetchWithAuth } from '../../services/apiService';
import ImageCross from '../../assets/red-cross.png'

const upcoming = () => {
  const nav = useNavigate()
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [conventions, setConvention] = useState([]);
  const [selectedOption, setSelectedOption] = useState('Sort by Country...');
  const [filteredConventions, setFilteredConventions] = useState([]);
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

  const countries = [
    // North America
    { label: "Canada", value: "Canada" },
    { label: "Mexico", value: "Mexico" },
    { label: "USA", value: "USA" },
    // South America
    { label: "Argentina", value: "Argentina" },
    { label: "Brazil", value: "Brazil" },
    { label: "Chile", value: "Chile" },
    { label: "Colombia", value: "Colombia" },
    { label: "Peru", value: "Peru" },
    { label: "Uruguay", value: "Uruguay" },
    { label: "Venezuela", value: "Venezuela" },
    // Europe
    { label: "Austria", value: "Austria" },
    { label: "Belgium", value: "Belgium" },
    { label: "Bulgaria", value: "Bulgaria" },
    { label: "Croatia", value: "Croatia" },
    { label: "Cyprus", value: "Cyprus" },
    { label: "Czech Republic", value: "Czech Republic" },
    { label: "Denmark", value: "Denmark" },
    { label: "Estonia", value: "Estonia" },
    { label: "Finland", value: "Finland" },
    { label: "France", value: "France" },
    { label: "Germany", value: "Germany" },
    { label: "Greece", value: "Greece" },
    { label: "Hungary", value: "Hungary" },
    { label: "Iceland", value: "Iceland" },
    { label: "Ireland", value: "Ireland" },
    { label: "Italy", value: "Italy" },
    { label: "Latvia", value: "Latvia" },
    { label: "Lithuania", value: "Lithuania" },
    { label: "Luxembourg", value: "Luxembourg" },
    { label: "Malta", value: "Malta" },
    { label: "Netherlands", value: "Netherlands" },
    { label: "Norway", value: "Norway" },
    { label: "Poland", value: "Poland" },
    { label: "Portugal", value: "Portugal" },
    { label: "Romania", value: "Romania" },
    { label: "Slovakia", value: "Slovakia" },
    { label: "Slovenia", value: "Slovenia" },
    { label: "Spain", value: "Spain" },
    { label: "Sweden", value: "Sweden" },
    { label: "Switzerland", value: "Switzerland" },
    { label: "United Kingdom", value: "United Kingdom" },
    // Asia and Oceania
    { label: "Australia", value: "Australia" },
    { label: "Japan", value: "Japan" },
    { label: "Thailand", value: "Thailand" },
  ];



  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  
    // Filter conventions based on the selected country
    const filteredData = option === "All"
      ? conventions // Show all conventions if "All" is selected
      : conventions.filter(convention => convention.convention_state === option);
  
    setFilteredConventions(filteredData);
  };
  


  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };
  const fetchConventions = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/user/upcoming_convention`, {
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
      setFilteredConventions(data); // Initially show all conventions
      // console.log(data);
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

          <div className='flex justify-between items-center flex-col md:flex-row gap-y-2'>

            <h1 className='text-white text-2xl font-semibold'>Upcoming Conventions</h1>

            {/* Sort by Dropdown moved to the right */}
            <div className="relative">
              <button
                type="button"
                className="w-full lg:w-72 text-white border-2 px-5 border-[#707070] text-lg md:text-xl lg:text-2xl py-2 md:py-3 flex items-center justify-between"
                onClick={toggleDropdown}
              >
                {selectedOption || "Select a country"}
                <img src={drop} alt="" />
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute text-white w-full lg:w-72 mt-2 bg-[#102F47] border border-gray-300 shadow-lg text-lg md:text-xl lg:text-2xl z-50 max-h-64 overflow-y-auto"
                  style={{ maxHeight: '300px' }} // Maximum height for the dropdown
                >
                  <ul className="divide-y divide-gray-600">
                    <li
                      className="p-2 hover:bg-gray-100 cursor-pointer hover:text-black"
                      onClick={() => handleOptionClick("All")}
                    >
                      All
                    </li>
                    {countries.map((country) => (
                      <li
                        key={country.value}
                        className="p-2 hover:bg-gray-100 cursor-pointer hover:text-black"
                        onClick={() => handleOptionClick(country.value)}
                      >
                        {country.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>




          </div>

          {/* Conditionally Render Convention List or Empty State */}
          {filteredConventions.length > 0 ? (
            <div className='bg-[#0d2539] p-3 w-full h-fit md:h-auto rounded-md mt-6 overflow-y-auto overflow-x-hidden'>
              {filteredConventions.map((convention) => (
                <div
                  key={convention.id}
                  className='flex flex-col md:flex-row justify-between items-start mb-4 p-2 bg-[#1a2a3a] rounded-md'
                >
                  {/* 1st Column */}
                  <div onClick={() => nav(`/single-upcoming-convention/${convention.id}`)} className='flex items-center gap-x-2 flex-1 mb-2 md:mb-0 cursor-pointer'>
                    <img
                      src={convention.convention_logo || ConventionImage}
                      alt=""
                      className='w-[3rem] h-[3rem] rounded-full object-cover'
                    />
                    <p className='text-lightOrange font-semibold text-lg break-words'>
                      {convention.convention_name}
                    </p>
                  </div>

                  {/* 2nd Column */}
                  <div className='flex-1 mb-2 md:mb-0'>
                    <p className='text-white text-sm break-words'>
                      {convention.convention_dates.join(', ')}
                    </p>
                  </div>

                  {/* 3rd Column */}
                  <div className='flex items-center gap-x-2 flex-1 mb-2 md:mb-0'>
                    <p className='text-lightOrange font-semibold text-lg break-words'>
                      {convention.convention_state}
                    </p>
                  </div>

                  {/* 4th Column */}
                  <div className='relative flex items-center cursor-pointer'>
                    <p onClick={() => handleShowSub(convention.id)} className='text-white text-sm mr-1'>
                      Activity
                    </p>
                    <BsFillCaretDownFill
                      className='text-white'
                      onClick={() => handleShowSub(convention.id)}
                    />

                    {showSub.show && showSub.conventionId === convention.id && (
                      <div className='absolute top-[2rem] left-0 md:left-[-4rem] bg-black p-4 w-48 z-50 rounded-md shadow-lg'>
                        <Link
                          to={`/convention/attendance/${convention.id}`}
                          className='block mb-1 cursor-pointer text-white text-sm'
                        >
                          Your attendance
                        </Link>
                        {attendance && attendance.length > 0 && (
                          <>
                            <Link
                              to={`/next/agenda/${convention.id}`}
                              className='block mb-1 cursor-pointer text-white text-sm'
                            >
                              Agenda
                            </Link>
                            <Link
                              to={`/accomodation/${convention.id}`}
                              className='block mb-1 cursor-pointer text-white text-sm'
                            >
                              Accommodations
                            </Link>
                            <Link
                              to={`/event/${convention.id}`}
                              className='block mb-1 cursor-pointer text-white text-sm'
                            >
                              Events
                            </Link>
                            <Link
                              to={`/game/sale/${convention.id}`}
                              className='block mb-1 cursor-pointer text-white text-sm'
                            >
                              Games for sale
                            </Link>
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
                No Upcoming Convention
              </h1>
            </div>
          )}

        </div>
      </div>
    </div>

  );
}

export default upcoming;
