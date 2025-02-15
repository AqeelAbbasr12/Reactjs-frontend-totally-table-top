import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import Left from '../../components/Left';
import drop from '../../assets/icon-caret-down.svg';
import ConventionImage from '../../assets/traditional.png'
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
  const [announcements, setAnnouncements] = useState([]);
  const [showSub, setShowSub] = useState({ show: false, conventionId: null });
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const [selectedDateSort, setSelectedDateSort] = useState(""); // State for selected date sort
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false); // State for dropdown visibility

  const toggleDateDropdown = () => {
    setIsDateDropdownOpen(!isDateDropdownOpen); // Toggle dropdown visibility
  };


  useEffect((id) => {
    fetchConventions();
    fetchAnnouncements();
  }, []);

  const countries = [
    { label: "Argentina", value: "Argentina" },
    { label: "Australia", value: "Australia" },
    { label: "Austria", value: "Austria" },
    { label: "Belgium", value: "Belgium" },
    { label: "Brazil", value: "Brazil" },
    { label: "Bulgaria", value: "Bulgaria" },
    { label: "Canada", value: "Canada" },
    { label: "Chile", value: "Chile" },
    { label: "Colombia", value: "Colombia" },
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
    { label: "Japan", value: "Japan" },
    { label: "Latvia", value: "Latvia" },
    { label: "Lithuania", value: "Lithuania" },
    { label: "Luxembourg", value: "Luxembourg" },
    { label: "Malta", value: "Malta" },
    { label: "Mexico", value: "Mexico" },
    { label: "Netherlands", value: "Netherlands" },
    { label: "Norway", value: "Norway" },
    { label: "Peru", value: "Peru" },
    { label: "Poland", value: "Poland" },
    { label: "Portugal", value: "Portugal" },
    { label: "Romania", value: "Romania" },
    { label: "Slovakia", value: "Slovakia" },
    { label: "Slovenia", value: "Slovenia" },
    { label: "Spain", value: "Spain" },
    { label: "Sweden", value: "Sweden" },
    { label: "Switzerland", value: "Switzerland" },
    { label: "Thailand", value: "Thailand" },
    { label: "United Kingdom", value: "United Kingdom" },
    { label: "Uruguay", value: "Uruguay" },
    { label: "USA", value: "USA" },
    { label: "Venezuela", value: "Venezuela" }
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



  const handleSort = (sortType) => {
    setSelectedDateSort(sortType); // Update selected sort option
    setIsDateDropdownOpen(false); // Close dropdown

    // Clone conventions array for sorting
    let sortedConventions = [...conventions];

    if (sortType === "Nearest" || sortType === "Furthest") {
      sortedConventions.sort((a, b) => {
        const dateA = new Date(a.convention_dates[0]);
        const dateB = new Date(b.convention_dates[0]);
        return sortType === "Nearest" ? dateA - dateB : dateB - dateA;
      });
    } else if (sortType === "A to Z") {
      sortedConventions.sort((a, b) =>
        a.convention_name.localeCompare(b.convention_name)
      );
    } else if (sortType === "Z to A") {
      sortedConventions.sort((a, b) =>
        b.convention_name.localeCompare(a.convention_name)
      );
    }

    setFilteredConventions(sortedConventions); // Update sorted conventions
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
      console.log('conventions', data)
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update search term
  };

  const filteredCountries = countries.filter((country) =>
    country.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
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

          {/* Show loading spinner */}
          {loading ? (
            <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
              <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
            </div>
          ) : null}
          {/* Render 1st position at the top */}
          {announcements[0] && announcements[0].position_of_picture === '1st_position' && (
            <div
              className='flex items-center gap-x-[1rem] my-[1rem]'
              onClick={() => window.open(announcements[0].url, '_blank')} // Open URL in new tab
            >
              <img
                src={announcements[0].advert_logo}
                alt={announcements[0].name}
                className='w-[100%] lg:w-[100%] h-[12rem] rounded-md cursor-pointer'
              />
            </div>
          )}
          <div className="flex justify-between items-center flex-col md:flex-row gap-y-2">

            {/* Heading */}
            <h1 className="text-white text-2xl font-semibold">Upcoming Conventions</h1>

            {/* Sort Options */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Sort by Date Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="w-full lg:w-72 text-white border-2 px-5 border-[#707070] text-lg md:text-xl lg:text-2xl py-2 md:py-3 flex items-center justify-between"
                  onClick={toggleDateDropdown} // Toggle dropdown visibility
                >
                  {selectedDateSort || "Sort by Date....."}
                  <img src={drop} alt="Dropdown icon" />
                </button>

                {isDateDropdownOpen && (
                  <div
                    className="absolute text-white w-full lg:w-72 mt-2 bg-[#102F47] border border-gray-300 shadow-lg text-lg md:text-xl lg:text-2xl z-50 max-h-64 overflow-y-auto"
                  >
                    <ul className="divide-y divide-gray-600">
                      <li
                        className="p-2 hover:bg-gray-100 cursor-pointer hover:text-black"
                        onClick={() => handleSort("Nearest")}
                      >
                        Nearest Date
                      </li>
                      <li
                        className="p-2 hover:bg-gray-100 cursor-pointer hover:text-black"
                        onClick={() => handleSort("Furthest")}
                      >
                        Furthest Date
                      </li>
                      <li
                        className="p-2 hover:bg-gray-100 cursor-pointer hover:text-black"
                        onClick={() => handleSort("A to Z")}
                      >
                        Name (A to Z)
                      </li>
                      <li
                        className="p-2 hover:bg-gray-100 cursor-pointer hover:text-black"
                        onClick={() => handleSort("Z to A")}
                      >
                        Name (Z to A)
                      </li>
                    </ul>
                  </div>
                )}
              </div>



              {/* Sort by Country Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="w-full lg:w-72 text-white border-2 px-5 border-[#707070] text-lg md:text-xl lg:text-2xl py-2 md:py-3 flex items-center justify-between"
                  onClick={toggleDropdown}
                >
                  {selectedOption || "Select a country"}
                  <img src={drop} alt="Dropdown icon" />
                </button>

                {isDropdownOpen && (
                  <div
                    className="absolute text-white w-full lg:w-72 mt-2 bg-[#102F47] border border-gray-300 shadow-lg text-lg md:text-xl lg:text-2xl z-50 max-h-64 overflow-y-auto"
                    style={{ maxHeight: "300px" }}
                  >
                    {/* Search Input */}
                    <div className="p-2">
                      <input
                        type="text"
                        className="w-full p-2 border bg-darkBlue text-white rounded"
                        placeholder="Search for a country..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>

                    {/* Country List */}
                    <ul className="divide-y divide-gray-600">
                      <li
                        className="p-2 hover:bg-gray-100 cursor-pointer hover:text-black"
                        onClick={() => handleOptionClick("All")}
                      >
                        All
                      </li>
                      {filteredCountries.map((country) => (
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
                  <div className='flex items-center gap-x-2 flex-1 mb-2 md:mb-0'>
                    {convention.convention_is_private === "1" ? (
                      <button className='bg-red w-20 text-white px-2 py-1 rounded'>
                        Private
                      </button>
                    ) : (
                      <button className='bg-[#4CAF50] w-20 text-white px-2 py-1 rounded'>
                        Public
                      </button>
                    )}
                  </div>


                  {/* 5th Column */}
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
                        {convention.convention_is_private === "1" ? (
                          // Navigate to single upcoming convention if private
                          <Link
                            to={`/single-upcoming-convention/${convention.id}`}
                            className='block mb-1 cursor-pointer text-white text-sm'
                          >
                            View Convention
                          </Link>
                        ) : (
                          // Navigate to attendance if not private
                          <Link
                            to={`/convention/attendance/${convention.id}`}
                            className='block mb-1 cursor-pointer text-white text-sm'
                          >
                            Your attendance
                          </Link>
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


          {/* 3rd Position Advert Logo */}
          {announcements.length > 0 && announcements.find(a => a.position_of_picture === '3rd_position') && (
            <div
              className='mt-6 flex justify-center'
              onClick={() => window.open(announcements[0].url, '_blank')} // Open URL in new tab
            >
              <img
                src={announcements.find(a => a.position_of_picture === '3rd_position').advert_logo}
                alt="3rd Position Ad"
                className='w-[100%] lg:w-[100%] h-[12rem] rounded-md cursor-pointer'
              />
            </div>
          )}

        </div>
      </div>
    </div>

  );
}

export default upcoming;
