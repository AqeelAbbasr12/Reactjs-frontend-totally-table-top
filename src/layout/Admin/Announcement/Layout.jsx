import React, { useState, useEffect } from 'react'
import img1 from '../../../assets/Announcement.svg';
import img2 from '../../../assets/Convention.svg';
import ConventionImage from '../../../assets/traditional.png'
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
  const [announcements, setAnnouncement] = useState([]);
  const [originalAnnouncements, setOriginalAnnouncements] = useState([]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Announcements');
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  useEffect(() => {
    fetchAnnoucements();
  }, []);
  // Handle selection of an option


  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);

    if (option === 'Sort by A to Z') {
      setAnnouncement([...originalAnnouncements].sort((a, b) => a.name.localeCompare(b.name))); // Sort original announcements
    } else if (option === 'Sort by Z to A') {
      setAnnouncement([...originalAnnouncements].sort((a, b) => b.name.localeCompare(a.name))); // Sort original announcements
    } else {
      // Reset to original announcements before filtering
      let filteredAnnouncements = [...originalAnnouncements]; // Start with original announcements

      if (option === 'Sort by Expo') {
        filteredAnnouncements = filteredAnnouncements.filter(a => a.type === 'Expo'); // Filter by Expo
      } else if (option === 'Sort by Feature') {
        filteredAnnouncements = filteredAnnouncements.filter(a => a.type === 'Feature'); // Filter by Feature
      } else if (option === 'Sort by Advert') {
        filteredAnnouncements = filteredAnnouncements.filter(a => a.type === 'Advert'); // Filter by Advert
      } else if (option === 'Show All') {
        filteredAnnouncements = [...originalAnnouncements]; // Show all announcements
      }

      setAnnouncement(filteredAnnouncements); // Update the displayed announcements
    }
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value); // Update the local state
    onSearch(value); // Call the parent function to pass the search term
  };




  const onhandleEdit = (id) => {
    navigate(`/admin/edit/announcement/${id}`); // Use the id to navigate to the specific edit page
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


  const fetchAnnoucements = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/admin/announcement`, {
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
      setAnnouncement(data);
      // console.log(data);
      setOriginalAnnouncements(data);
    } catch (error) {
      // console.error('Error fetching conventions data:', error);
    } finally {
      setLoading(false);
    }
  };

  function toggleActiveStatus(announcementId, currentStatus) {
    // Define the new status based on the current one
    const newStatus = currentStatus === "1" ? "0" : "1";

    // Make the API call to update the status
    const updateStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/announcement_status/${announcementId}`, {
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
        fetchAnnoucements();
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
      const response = await fetch(`${API_BASE_URL}/admin/announcement/${isSelectedRecord.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        toastr.success(data.message);
        fetchAnnoucements();
      } else {
        toastr.error("Failed to delete convention");
        // console.error("Failed to delete convention");
      }
    }

    setIsModalOpen(false);
    setIsSelectedRecord(null);
  };

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.name.toLowerCase().includes(searchInput.toLowerCase())
  );
  return (
    <div className="bg-[#102F47] w-full opacity-100 min-h-screen">
      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
        </div>
      )}

      <Navbar />

      {/* Main Container */}
      <div className="w-11/12 max-w-screen-2xl mx-auto pt-[10rem] md:pt-40 text-white py-8">
        {/* Tabs Section */}
        <div className="flex gap-4 border-b border-gray-500 mb-8">
          <button
            className={`px-6 py-2 text-lg md:text-2xl ${activeTab === "Announcements"
              ? "border-b-2 border-[#F77F02] text-[#F77F02]"
              : "text-gray-300"
              }`}
            onClick={() => setActiveTab("Announcements")}
          >
            Announcements
          </button>
          <button
            className={`px-6 py-2 text-lg md:text-2xl ${activeTab === "Pictures"
              ? "border-b-2 border-[#F77F02] text-[#F77F02]"
              : "text-gray-300"
              }`}
            onClick={() => setActiveTab("Pictures")}
          >
            Pictures
          </button>
        </div>

        {/* Content Section */}
        {activeTab === "Announcements" && (
          <>
            {/* Title and Search */}
            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-x-6 items-center">
              <p className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-palanquin-dark leading-normal md:leading-snug lg:leading-snug">
                Adverts
              </p>

              <div className="flex flex-col md:flex-row md:items-center gap-y-4 gap-x-6 justify-start 2xl:justify-end mt-6 md:mt-0">
                {/* Search Input */}
                <form action="" className="flex items-center">
                  <input
                    value={searchInput}
                    onChange={handleSearchChange}
                    type="search"
                    placeholder="Search Advert"
                    className="bg-[#102F47] border-b-2 border-[#707070] w-full lg:w-96 rounded-none focus:outline-none text-lg md:text-xl py-2 tracking-custom"
                  />
                </form>

                {/* Create New Button */}
                <button
                  type='button'
                  onClick={() => navigate(`/admin/create/Announcement`)}
                  className='w-full lg:w-52 border-2 border-[#F77F02] text-lg md:text-xl lg:text-2xl py-2 md:py-3 px-4'
                >
                  Create new
                </button>
              </div>
            </div>

            {/* Announcements Table */}
            <div className="w-full bg-[#102F47] min-h-screen">
              <div className="w-full mx-auto text-white pt-[42px]">
                <div className="overflow-x-auto mb-10">
                  {filteredAnnouncements.length > 0 ? ( // Check if there are filtered announcements
                    <table className='w-full table-auto'>
                      <tbody>
                        {filteredAnnouncements
                          .filter(
                            (announcement) => announcement.type === "Announcement" || announcement.type === "Adverts"
                          )
                          .map((announcement, index) => (
                            <tr
                              className={`w-full items-center flex gap-x-14 gap-y-5 py-5 px-8 justify-between ${index % 2 === 0 ? 'bg-[#0D2539]' : 'bg-[#102F47]'}`}
                              key={announcement.id}
                            >
                              <div className="flex items-center gap-x-10 justify-center">
                                {/* Image */}
                                <img
                                  src={
                                    announcement.expo_logo && announcement.expo_logo !== null
                                      ? announcement.expo_logo
                                      : announcement.feature_logo && announcement.feature_logo !== null
                                        ? announcement.feature_logo
                                        : announcement.advert_logo && announcement.advert_logo !== null
                                          ? announcement.advert_logo
                                          : ConventionImage
                                  }
                                  className="w-10 h-10 md:w-66 md:h-66 rounded-full object-cover"
                                  alt="Convention Logo"
                                />

                                {/* Name */}
                                <div className="flex flex-col justify-center md:w-72 w-48">
                                  <td className="font-mulish text-md leading-7 md:text-26 md:leading-33">
                                    {announcement.name}
                                  </td>
                                </div>

                                {/* Date */}
                                <div className="flex-grow flex items-end w-48 md:w-72">
                                  <td className="font-mulish text-sm leading-5 md:text-26 md:leading-33">
                                    {announcement.created_at}
                                  </td>
                                </div>

                                {/* Position */}
                                <div className="flex-grow flex items-end w-48 md:w-72">
                                  <td className="font-mulish text-sm leading-5 md:text-26 md:leading-33">
                                    {announcement.position_of_announcement === '1st_position' && (
                                      <span className="inline-block px-3 py-1 bg-green-600 text-white rounded-full text-xs md:text-sm">
                                        1st Position
                                      </span>
                                    )}
                                    {announcement.position_of_announcement === '2nd_position' && (
                                      <span className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-xs md:text-sm">
                                        2nd Position
                                      </span>
                                    )}
                                    {announcement.position_of_announcement === '3rd_position' && (
                                      <span className="inline-block px-3 py-1 bg-yellow-600 text-white rounded-full text-xs md:text-sm">
                                        3rd Position
                                      </span>
                                    )}
                                  </td>
                                </div>




                              </div>
                              <div className="flex items-center gap-x-20 justify-self-end">
                                {/* Feature status */}
                                <td className="font-mulish text-sm leading-7 md:text-lg md:leading-33">
                                  {announcement.feature === "1" ? (
                                    <button className="bg-[#F3C15F] text-black px-2 py-1 rounded">
                                      Featured
                                    </button>
                                  ) : (
                                    ''
                                  )}
                                </td>
                                {/* Active status */}
                                {/* Status Cell with Toggle */}
                                <td
                                  className={`font-mulish text-26 leading-33 ${announcement.active === "1" ? 'text-yellow-500' : ''}`}
                                  onClick={() => toggleActiveStatus(announcement.id, announcement.active)} // Call the function on click
                                  style={{ cursor: 'pointer' }} // Add pointer cursor to indicate it's clickable
                                >
                                  {announcement.active === "1" ? <MdRemoveRedEye /> : <IoMdEyeOff />}
                                </td>
                                {/* Delete Button */}
                                <td
                                  className="font-mulish text-lg leading-10 md:text-26 md:leading-47 text-[#C53A33] cursor-pointer"
                                  onClick={() => handleDeleteClick(announcement)} // Use announcement for the delete action
                                >
                                  Delete
                                </td>
                                {/* Edit Button */}
                                <td
                                  className="font-mulish text-lg leading-10 md:text-26 md:leading-47 cursor-pointer"
                                  onClick={() => onhandleEdit(announcement.id)} // Pass the announcement id here
                                >
                                  Edit
                                </td>
                              </div>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className='flex justify-center items-center py-16'> {/* Add padding for spacing */}
                      <span className='text-[#F2F0EF] tracking-custom text-lg leading-6 md:text-24 md:leading-30'>
                        There are no more results for this search query.
                        <span className='text-[#F3C15F] cursor-pointer' onClick={() => setSearchInput('')}> Clear search</span>
                      </span>
                    </div>
                  )}
                </div>

                {/*  */}


              </div>
            </div>
          </>
        )}

        {/* Pictures Tab Content */}
        {activeTab === "Pictures" && (
          <>
            {/* Title and Search */}
            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-x-6 items-center">
              <p className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-palanquin-dark leading-normal md:leading-snug lg:leading-snug">
                Pictures
              </p>

              <div className="flex flex-col md:flex-row md:items-center gap-y-4 gap-x-6 justify-start 2xl:justify-end mt-6 md:mt-0">
                {/* Search Input */}
                <form action="" className="flex items-center">
                  <input
                    value={searchInput}
                    onChange={handleSearchChange}
                    type="search"
                    placeholder="Search Pictures"
                    className="bg-[#102F47] border-b-2 border-[#707070] w-full lg:w-96 rounded-none focus:outline-none text-lg md:text-xl py-2 tracking-custom"
                  />
                </form>
                {/* Create New Button */}
                <button
                  type='button'
                  onClick={() => navigate(`/admin/create/Announcement`)}
                  className='w-full lg:w-52 border-2 border-[#F77F02] text-lg md:text-xl lg:text-2xl py-2 md:py-3 px-4'
                >
                  Create new
                </button>
              </div>
            </div>

            {/* Pictures Table */}
            <div className="w-full bg-[#102F47] min-h-screen">
              <div className="w-full mx-auto text-white pt-[42px]">
                <div className="overflow-x-auto mb-10">
                  {filteredAnnouncements.length > 0 ? ( // Check if there are filtered announcements
                    <table className='w-full table-auto'>
                      <tbody>
                        {filteredAnnouncements
                          .filter((announcement) => announcement.type === "Picture") // Filter by type === 'advert'
                          .map((announcement, index) => (
                            <tr
                              className={`w-full items-center flex gap-x-14 gap-y-5 py-5 px-8 justify-between ${index % 2 === 0 ? 'bg-[#0D2539]' : 'bg-[#102F47]'}`}
                              key={announcement.id}
                            >
                              <div className="flex items-center gap-x-10 justify-center">
                                {/* Image */}
                                <img
                                  src={
                                    announcement.advert_logo && announcement.advert_logo !== null
                                      ? announcement.advert_logo
                                      : ConventionImage
                                  }
                                  className="w-10 h-10 md:w-66 md:h-66 rounded-full object-cover"
                                  alt="Advert Logo"
                                />

                                {/* Name */}
                                <div className="flex flex-col justify-center md:w-72 w-48">
                                  <td className="font-mulish text-md leading-7 md:text-26 md:leading-33">
                                    {announcement.name}
                                  </td>
                                </div>

                                {/* Date */}
                                <div className="flex-grow flex items-end w-48 md:w-72">
                                  <td className="font-mulish text-sm leading-5 md:text-26 md:leading-33">
                                    {announcement.created_at}
                                  </td>
                                </div>
                                {/* Position */}
                              <div className="flex-grow flex items-end w-48 md:w-72">
                                <td className="font-mulish text-sm leading-5 md:text-26 md:leading-33">
                                  {announcement.position_of_picture === '1st_position' && (
                                    <span className="inline-block px-3 py-1 bg-green-600 text-white rounded-full text-xs md:text-sm">
                                      1st Position
                                    </span>
                                  )}
                                  {announcement.position_of_picture === '2nd_position' && (
                                    <span className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-xs md:text-sm">
                                      2nd Position
                                    </span>
                                  )}
                                  {announcement.position_of_picture === '3rd_position' && (
                                    <span className="inline-block px-3 py-1 bg-yellow-600 text-white rounded-full text-xs md:text-sm">
                                      3rd Position
                                    </span>
                                  )}
                                </td>
                              </div>
                              </div>

                              
                              <div className="flex items-center gap-x-20 justify-self-end">
                                {/* Feature status */}
                                <td className="font-mulish text-sm leading-7 md:text-lg md:leading-33">
                                  {announcement.feature === "1" ? (
                                    <button className="bg-[#F3C15F] text-black px-2 py-1 rounded">
                                      Featured
                                    </button>
                                  ) : (
                                    ''
                                  )}
                                </td>
                                {/* Status Cell with Toggle */}
                                <td
                                  className={`font-mulish text-26 leading-33 ${announcement.active === "1" ? 'text-yellow-500' : ''}`}
                                  onClick={() => toggleActiveStatus(announcement.id, announcement.active)} // Call the function on click
                                  style={{ cursor: 'pointer' }} // Add pointer cursor to indicate it's clickable
                                >
                                  {announcement.active === "1" ? <MdRemoveRedEye /> : <IoMdEyeOff />}
                                </td>

                                {/* Delete Button */}
                                <td
                                  className="font-mulish text-lg leading-10 md:text-26 md:leading-47 text-[#C53A33] cursor-pointer"
                                  onClick={() => handleDeleteClick(announcement)}
                                >
                                  Delete
                                </td>
                                {/* Edit Button */}
                                <td
                                  className="font-mulish text-lg leading-10 md:text-26 md:leading-47 cursor-pointer"
                                  onClick={() => onhandleEdit(announcement.id)} // Pass the announcement id here
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
                        No pictures available.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

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
  );

}

export default Convention;