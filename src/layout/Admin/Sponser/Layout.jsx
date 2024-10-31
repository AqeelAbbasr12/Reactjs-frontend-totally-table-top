import React, { useState, useEffect } from 'react'
import img1 from '../../../assets/Announcement.svg';
import img2 from '../../../assets/Convention.svg';
import ConventionImage from '../../../assets/convention.jpeg'
import drop from '../../../assets/icon-caret-down.svg';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Admin/Navbar';
import { MdRemoveRedEye } from "react-icons/md";
import { IoMdEyeOff } from "react-icons/io";
import { fetchWithAuth } from '../../../services/apiService';
import toastr from 'toastr';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Convention({ onSearch }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Sort by...');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sponsers, setSponser] = useState([]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  useEffect(() => {
    fetchSponsers();
  }, []);
 

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  
    if (option === 'Sort by A to Z') {
      setSponser([...sponsers].sort((a, b) => a.name.localeCompare(b.name)));
    } else if (option === 'Sort by Z to A') {
      setSponser([...sponsers].sort((a, b) => b.name.localeCompare(a.name)));
    }
    // Add more sorting logic as needed
  };
  // Function to handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value); // Update the local state
    onSearch(value); // Call the parent function to pass the search term
  };




  const onhandleEdit = (id) => {
    navigate(`/admin/edit/sponser/${id}`); // Use the id to navigate to the specific edit page
  };


  const [isSelectedRecord, setIsSelectedRecord] = useState(null);
  const handleDeleteClick = (record) => {
    setIsModalOpen(true);
    setIsSelectedRecord(record);
    //console.log("The deleted record is: :" +record)
  }
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSelectedRecord(null)
  }


  const fetchSponsers = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/admin/sponser`, {
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
      setSponser(data);
      // console.log(data);
    } catch (error) {
      console.error('Error fetching Sponser data:', error);
    } finally {
      setLoading(false);
    }
  };

  function toggleActiveStatus(sponserId, currentStatus) {
    // Define the new status based on the current one
    const newStatus = currentStatus === "1" ? "0" : "1";

    // Make the API call to update the status
    const updateStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/sponser_status/${sponserId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ active: newStatus }), // Send the new status in the request body
        });

        if (!response.ok) {
          throw new Error('Failed to update convention status');
          toastr.error('Failed to update convention status');
        }

        const data = await response.json();
        toastr.success(data.message);
        fetchSponsers();
        // Optionally, trigger a UI update here if needed

      } catch (error) {
        console.error('Error updating sponsers status:', error);
        toastr.error('Error updating sponsers status:');
      }
    };

    updateStatus();
  }
  const handleConfirmDelete = async () => {
    if (isSelectedRecord) {
      const response = await fetch(`${API_BASE_URL}/admin/sponser/${isSelectedRecord.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        toastr.success(data.message);
        fetchSponsers();
      } else {
        toastr.error("Failed to delete convention");
        console.error("Failed to delete convention");
      }
    }

    setIsModalOpen(false);
    setIsSelectedRecord(null);
  };

  const filteredSponsers = sponsers.filter((sponser) =>
    sponser.name.toLowerCase().includes(searchInput.toLowerCase()) // Modify field name (e.g., `name`) based on your convention data structure
  );
  return (
    <div className="bg-[#102F47] w-full opacity-100 min-h-screen">
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
        </div>
      )}
      <Navbar />
      <div className='w-11/12 max-w-screen-2xl mx-auto pt-[10rem] md:pt-40 text-white py-8'>
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-x-6 items-center">
          {/* Title */}
          <p className='text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-palanquin-dark leading-normal md:leading-snug lg:leading-snug'>
            Sponsers
          </p>

          {/* Sort by + Search + Create New Button */}
          <div className='flex flex-col md:flex-row md:items-center gap-y-4 gap-x-6 justify-start 2xl:justify-end mt-6 md:mt-0'>
            {/* Search */}
            <div className='w-full md:w-auto'>
              <form action="" className='flex items-center'>
                <input
                  value={searchInput}
                  onChange={handleSearchChange}
                  type="search"
                  id="search"
                  placeholder='Search Convention'
                  className='bg-[#102F47] border-b-2 border-[#707070] w-full lg:w-96 xl:w-96 rounded-none focus:outline-none text-lg md:text-xl lg:text-2xl py-2 md:py-3 tracking-custom'
                />
              </form>
            </div>

            {/* Sort by Dropdown */}
            <div className='relative'>
              <button
                type='button'
                className='w-full lg:w-72 border-2 pr-5 pl-5 border-[#707070] text-lg md:text-xl lg:text-2xl py-2 md:py-3 flex items-center justify-between'
                onClick={toggleDropdown}
              >
                {selectedOption}
                <img src={drop} alt="" />
              </button>

              {isDropdownOpen && (
                <div className='absolute w-full lg:w-72 mt-2 bg-[#102F47] border border-gray-300 shadow-lg text-lg md:text-xl lg:text-2xl'>
                  <ul>
                    <li
                      className='p-2 hover:bg-gray-100 cursor-pointer hover:text-black'
                      onClick={() => handleOptionClick('Sort by A to Z')}
                    >
                      Sort by A to Z
                    </li>
                    <li
                      className='p-2 hover:bg-gray-100 cursor-pointer hover:text-black'
                      onClick={() => handleOptionClick('Sort by...')}
                    >
                      Sort by...
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Create New Button */}
            <div className='w-full md:w-auto'>
              <button
                type='button' onClick={() => { navigate(`/admin/create/sponser`) }}
                className='w-full lg:w-52 border-2 border-[#F77F02] text-lg md:text-xl lg:text-2xl py-2 md:py-3 px-4'
              >
                Create new
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* table */}
      <div className="w-full bg-[#102F47] min-h-screen">
        <div className="w-10/12 mx-auto text-white pt-[42px]">
        <div className="overflow-x-auto mb-10">
        <table className='w-full table-auto'>
          <tbody>
            {filteredSponsers.length > 0 ? ( // Check if there are filtered sponsors
              filteredSponsers.map((sponser, index) => (
                <tr
                  className={`w-full items-center flex gap-x-14 gap-y-5 py-5 px-8 justify-between ${index % 2 === 0 ? 'bg-[#0D2539]' : 'bg-[#102F47]'}`}
                  key={sponser.id}
                >
                  <div className="flex items-center gap-x-10 justify-center w-full">
                    {/* Image */}
                    <img
                      src={sponser.promo_logo || ConventionImage} // Fallback image if logo is not available
                      className="w-10 h-10 md:w-66 md:h-66 rounded-full object-cover"
                      alt="Convention Logo"
                    />
                    {/* Name */}
                    <div className="flex flex-col justify-center md:w-72 w-48">
                      <td className="font-mulish text-md leading-7 md:text-26 md:leading-33">
                        {sponser.name}
                      </td>
                    </div>
                    {/* Date */}
                    <div className="flex-grow flex items-end w-48 md:w-72">
                      <td className="font-mulish text-sm leading-5 md:text-26 md:leading-33">
                        {sponser.created_at}
                      </td>
                    </div>
                  </div>
                  <div className="flex items-center gap-x-20 justify-self-end">
                    {/* Feature status */}
                    <td className="font-mulish text-sm leading-7 md:text-lg md:leading-33">
                      {sponser.feature === "1" ? (
                        <button className="bg-[#F3C15F] text-black px-2 py-1 rounded">
                          Featured
                        </button>
                      ) : null}
                    </td>
                    {/* Active status */}
                    <td
                      className={`font-mulish text-26 leading-33 ${sponser.active === "1" ? 'text-yellow-500' : ''}`}
                      onClick={() => toggleActiveStatus(sponser.id, sponser.active)} // Call the function on click
                      style={{ cursor: 'pointer' }} // Add pointer cursor to indicate it's clickable
                    >
                      {sponser.active === "1" ? <MdRemoveRedEye /> : <IoMdEyeOff />}
                    </td>
                    {/* Delete Button */}
                    <td
                      className="font-mulish text-lg leading-10 md:text-26 md:leading-47 text-[#C53A33] cursor-pointer"
                      onClick={() => handleDeleteClick(sponser)} // Use convention for the delete action
                    >
                      Delete
                    </td>
                    {/* Edit Button */}
                    <td
                      className="font-mulish text-lg leading-10 md:text-26 md:leading-47 cursor-pointer"
                      onClick={() => onhandleEdit(sponser.id)} // Pass the convention id here
                    >
                      Edit
                    </td>
                  </div>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className='flex justify-center items-center py-16'> {/* Center the message */}
                  <span className='text-[#F2F0EF] tracking-custom text-lg leading-6 md:text-24 md:leading-30'>
                    There are no more results for this search query.
                    <span className='text-[#F3C15F] cursor-pointer' onClick={() => setSearchInput('')}> Clear search</span>
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
          {/*  */}
          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-none w-[330px] h-96 md:h-[386px] md:w-[706px]">
                {/* Are you sure??? */}
                <div className='bg-red flex justify-center items-center h-20 md:h-[94px]'>
                  <span className="font-semibold text-white text-center text-2xl leading-5 md:text-35 md:leading-63 font-palanquin-dark">Are you sure?</span>
                </div>

                {/* Text */}
                <div className='flex justify-center items-center md:px-[84px] pt-5 md:pt-[34px] text-center'>
                  <p className='text-[#000000] text-2xl md:text-26 md:leading-33 font-mulish'>
                    Deleted conventions cannot be restored. Are you sure you want to delete "{isSelectedRecord?.name}"?
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-center gap-x-5 items-center pt-7 md:pt-[44px]">
                  <button className="bg-white text-[#0D2539] px-0 md:px-4 py-2 md:py-2 rounded-none border border-1 border-red-500 w-32 md:w-[197px] md:h-[73px] text-lg md:text-26 md:leading-47 font-palanquin-dark" onClick={handleCloseModal}>Don't delete</button>
                  <button className="bg-red text-white px-5 md:px-9 py-2 md:py-2 rounded-none md:w-[197px] md:h-[73px] text-lg md:text-26 md:leading-47 font-palanquin-dark" onClick={handleConfirmDelete}>Delete</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Convention;