import React, { useState, useEffect } from 'react'
import ConventionImage from '../../../assets/traditional.png'
import drop from '../../../assets/icon-caret-down.svg';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Admin/Navbar';
import { MdRemoveRedEye } from "react-icons/md";
import { IoMdEyeOff } from "react-icons/io";
import { fetchWithAuth } from '../../../services/apiService';
import toastr from 'toastr';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Convention({ onSearch, Convention, search, path }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Sort by...');
  const [searchInput, setSearchInput] = useState(''); // For search input

  const [loading, setLoading] = useState(true);
  const [conventions, setConvention] = useState([]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  useEffect(() => {
    fetchConventions();
  }, []);
  // Handle selection of an option
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  
    if (option === 'Sort by A to Z') {
      setConvention([...conventions].sort((a, b) => a.name.localeCompare(b.name)));
    } else if (option === 'Sort by Z to A') {
      setConvention([...conventions].sort((a, b) => b.name.localeCompare(a.name)));
    } else if (option === 'Sort by Oldest') {
      setConvention(
        [...conventions].sort((a, b) => extractFirstDate(a.date) - extractFirstDate(b.date))
      );
    } else if (option === 'Sort by Latest') {
      setConvention(
        [...conventions].sort((a, b) => extractFirstDate(b.date) - extractFirstDate(a.date))
      );
    } else if (option === 'Publish') {
      // Sort conventions with active status 1 first
      setConvention(
        [...conventions].sort((a, b) => b.active - a.active)
      );
    } else if (option === 'Unpublish') {
      // Sort conventions with active status 0 first
      setConvention(
        [...conventions].sort((a, b) => a.active - b.active)
      );
    }
  };
  

  // Helper function to extract the first date from the string
  const extractFirstDate = (dateString) => {
    const [firstDate] = dateString.split(','); // Extract the first date
    return new Date(firstDate.trim()); // Convert to Date object
  };


  // Function to handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value); // Update the local state
    onSearch(value); // Call the parent function to pass the search term (optional, if you need to inform the parent component)
  };


  const onhandleEdit = (id) => {
    navigate(`/admin/edit/convention/${id}`); // Use the id to navigate to the specific edit page
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
      setConvention(data);
      // console.log(data);
    } catch (error) {
      // console.error('Error fetching conventions data:', error);
    } finally {
      setLoading(false);
    }
  };

  function toggleActiveStatus(conventionId, currentStatus) {
    // Define the new status based on the current one
    const newStatus = currentStatus === "1" ? "0" : "1";

    // Make the API call to update the status
    const updateStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/convention_status/${conventionId}`, {
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
        fetchConventions();
        // Optionally, trigger a UI update here if needed

      } catch (error) {
        // console.error('Error updating convention status:', error);
        toastr.error('Error updating convention status:');
      }
    };

    updateStatus();
  }
  const handleConfirmDelete = async () => {
    if (isSelectedRecord) {
      const response = await fetch(`${API_BASE_URL}/admin/convention/${isSelectedRecord.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        toastr.success(data.message);
        fetchConventions();
      } else {
        toastr.error("Failed to delete convention");
        // console.error("Failed to delete convention");
      }
    }

    setIsModalOpen(false);
    setIsSelectedRecord(null);
  };

  // Filter conventions based on search input
  const filteredConventions = conventions.filter((convention) =>
    convention.name.toLowerCase().includes(searchInput.toLowerCase()) // Modify field name (e.g., `name`) based on your convention data structure
  );

  return (
    <div className="bg-[#102F47] w-full opacity-100 min-h-screen">
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
        </div>
      )}
      <Navbar />
      <div className='w-11/12 max-w-screen-2xl mx-auto pt-[6rem] md:pt-[10rem] text-white py-8'>
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-x-6 items-center">
          {/* Title */}
          <p className='text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-palanquin-dark leading-snug'>
            Conventions
          </p>

          {/* Search + Sort + Create New Button */}
          <div className='flex flex-col md:flex-row md:items-center gap-y-4 gap-x-6 justify-start 2xl:justify-end mt-6 md:mt-0'>

            {/* Search Input */}
            <div className='w-full md:w-auto'>
              <form className='flex items-center'>
                <input
                  value={searchInput}
                  onChange={handleSearchChange}
                  type="search"
                  placeholder='Search Convention'
                  className='bg-[#102F47] border-b-2 border-[#707070] w-full lg:w-96 rounded-none focus:outline-none text-lg md:text-xl lg:text-2xl py-2 md:py-3 tracking-custom'
                />
              </form>
            </div>

            {/* Sort Dropdown */}
            <div className='relative w-full md:w-auto'>
              <button
                type='button'
                className='w-full lg:w-72 border-2 border-[#707070] text-lg md:text-xl lg:text-2xl py-2 md:py-3 px-5 flex items-center justify-between'
                onClick={toggleDropdown}
              >
                {selectedOption}
                <img src={drop} alt="" />
              </button>

              {isDropdownOpen && (
                <div className='absolute w-full lg:w-72 mt-2 bg-[#102F47] border border-gray-300 shadow-lg text-lg'>
                  <ul>
                    <li
                      className='p-2 hover:bg-gray-100 cursor-pointer hover:text-black'
                      onClick={() => handleOptionClick('Sort by A to Z')}
                    >
                      Sort by A to Z
                    </li>
                    <li
                      className='p-2 hover:bg-gray-100 cursor-pointer hover:text-black'
                      onClick={() => handleOptionClick('Sort by Z to A')}
                    >
                      Sort by Z to A
                    </li>
                    <li
                      className='p-2 hover:bg-gray-100 cursor-pointer hover:text-black'
                      onClick={() => handleOptionClick('Sort by Oldest')}
                    >
                      Sort by Oldest
                    </li>
                    <li
                      className='p-2 hover:bg-gray-100 cursor-pointer hover:text-black'
                      onClick={() => handleOptionClick('Sort by Latest')}
                    >
                      Sort by Latest
                    </li>
                    <li
                      className='p-2 hover:bg-gray-100 cursor-pointer hover:text-black'
                      onClick={() => handleOptionClick('Publish')}
                    >
                      Publish
                    </li>
                    <li
                      className='p-2 hover:bg-gray-100 cursor-pointer hover:text-black'
                      onClick={() => handleOptionClick('Unpublish')}
                    >
                      Unpublish
                    </li>
                  </ul>
                </div>
              )}
            </div>


            {/* Create New Button */}
            <div className='w-full md:w-auto'>
              <button
                type='button'
                onClick={() => navigate(`/admin/create/convention`)}
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
            {filteredConventions.length > 0 ? (
              <table className='w-full table-auto'>
                <tbody>
                  {filteredConventions.map((convention, index) => (
                    <tr
                      className={`w-full items-center flex gap-x-14 gap-y-5 py-5 px-8 justify-between ${index % 2 === 0 ? 'bg-[#0D2539]' : 'bg-[#102F47]'}`}
                      key={convention.id}
                    >
                      <div className="flex items-center gap-x-10 justify-center w-full">
                        {/* Image */}
                        <img
                          src={convention.logo || ConventionImage}
                          className="w-10 h-10 md:w-66 md:h-66 rounded-full object-cover"
                          alt="Convention Logo"
                        />
                        {/* Name */}
                        <div className="flex flex-col justify-center md:w-72 w-48">
                          <td className="font-mulish text-md leading-7 md:text-26 md:leading-33">
                            {convention.name}
                          </td>
                        </div>
                        {/* Date */}
                        <div className="flex-grow flex items-end w-48 md:w-72">
                          <td className="font-mulish text-sm leading-5 md:text-26 md:leading-33">
                            {convention.date}
                          </td>
                        </div>
                      </div>
                      <div className="flex items-center gap-x-20 justify-self-end">
                        {/* Feature status */}
                        <td className="font-mulish text-sm leading-7 md:text-lg md:leading-33">
                          {convention.is_private === "1" ? (
                            <button className="bg-red w-20 text-white px-2 py-1 rounded">
                              Private
                            </button>
                          ) : (
                            <button className="bg-green-500 w-20 text-white px-2 py-1 rounded">
                              Public
                            </button>
                          )}
                        </td>
                        {/* Active status */}
                        {/* Status Cell with Toggle */}
                        <td
                          className={`font-mulish text-26 leading-33 ${convention.active === "1" ? 'text-yellow-500' : ''}`}
                          onClick={() => toggleActiveStatus(convention.id, convention.active)} // Call the function on click
                          style={{ cursor: 'pointer' }} // Add pointer cursor to indicate it's clickable
                        >
                          {convention.active === "1" ? <MdRemoveRedEye /> : <IoMdEyeOff />}
                        </td>
                        {/* Delete Button */}
                        <td
                          className="font-mulish text-lg leading-10 md:text-26 md:leading-47 text-[#C53A33] cursor-pointer"
                          onClick={() => handleDeleteClick(convention)} // Use convention for the delete action
                        >
                          Delete
                        </td>
                        {/* Edit Button */}
                        <td
                          className="font-mulish text-lg leading-10 md:text-26 md:leading-47 cursor-pointer"
                          onClick={() => onhandleEdit(convention.id)} // Pass the convention id here
                        >
                          Edit
                        </td>
                      </div>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className='flex justify-center items-center py-16'>
                <span className='text-[#F2F0EF] tracking-custom text-lg leading-6 md:text-24 md:leading-30'>
                  There are no more results for this search query.
                  <span className='text-[#F3C15F] cursor-pointer' onClick={() => setSearchInput('')}> Clear search</span>
                </span>
              </div>
            )}
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