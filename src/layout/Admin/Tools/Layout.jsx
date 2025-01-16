import React, { useState, useEffect } from 'react'
import ConventionImage from '../../../assets/traditional.png'
import drop from '../../../assets/icon-caret-down.svg';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Admin/Navbar';
import Swal from "sweetalert2";
import toastr from 'toastr';
import { fetchWithAuth } from '../../../services/apiService';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function layout({ onSearch }) {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  // NewsLetter
  const [isDropdownNewsOpen, setIsDropdownNewsOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState('Filter By News...');
  // Partner
  const [isDropdownPartnerOpen, setIsDropdownPartnerOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState('Filter By Partner...');

  // Deleted Account
  const [isDropdownDeletedUserOpen, setIsDropdownDeletedUserOpen] = useState(false);
  const [selectedDeletedUser, setSelectedDeletedUser] = useState('Filter By Del User...');

  // State for Convention Dropdown
  const [isDropdownConventionOpen, setIsDropdownConventionOpen] = useState(false);
  const [selectedConvention, setSelectedConvention] = useState('Filter By Conv... ');

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConventions, setFilteredConventions] = useState([]);

  // State for Country Dropdown
  const [isDropdownCountryOpen, setIsDropdownCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('Filter By Country...');
  const [searchTerm, setSearchTerm] = useState('');



  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setTools] = useState([]);
  const [conventions, setConventions] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();

  const toggleDropdownNews = () => {
    setIsDropdownNewsOpen(!isDropdownNewsOpen);
  };

  const toggleDropdownPartner = () => {
    setIsDropdownPartnerOpen(!isDropdownPartnerOpen);
  };

  const toggleDropdownDeletedUser = () => {
    setIsDropdownDeletedUserOpen(!isDropdownDeletedUserOpen);
  };

  // Toggle Convention Dropdown
  const toggleDropdownConvention = () => {
    setIsDropdownConventionOpen(!isDropdownConventionOpen);
  };

  // Toggle Country Dropdown
  const toggleDropdownCountry = () => {
    setIsDropdownCountryOpen(!isDropdownCountryOpen);
  };
  const countries = [
    "Argentina", "Australia", "Austria", "Belgium", "Brazil", "Bulgaria", "Canada",
    "Chile", "Colombia", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia",
    "Finland", "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland",
    "Italy", "India", "Japan", "Latvia", "Lithuania", "Luxembourg", "Malta",
    "Mexico", "Netherlands", "Norway", "Peru", "Poland", "Portugal", "Romania",
    "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "South Korea",
    "Thailand", "United Kingdom", "USA", "Uruguay", "Venezuela"
  ];

  useEffect(() => {
    fetchUsers();
    fetchConventions();
  }, []);


  // Function to apply all filters simultaneously
  const applyFilters = ({
    updatedNews = selectedNews,
    updatedPartner = selectedPartner,
    updatedDeletedUser = selectedDeletedUser,
    updatedConvention = selectedConvention,
    updatedCountry = selectedCountry,
    updatedSearchInput = searchInput,
  } = {}) => {
    let filtered = users;

    // Filter by Newsletter
    if (updatedNews === "Filter by Newsletter") {
      console.log("Filtering by Newsletter");
      filtered = filtered.filter(user => user.newsletter_info === "1");
    }

    // Filter by Partner
    if (updatedPartner === "Filter by Partner") {
      filtered = filtered.filter(user => user.promotional_info === "1");
    }

    // Filter by Deleted User
    if (updatedDeletedUser === "Filter by Deleted User") {
      filtered = filtered.filter(user => user.deleted_at !== null);
    }

    // Filter by Convention
if (updatedConvention !== "Filter By..." && updatedConvention !== "Filter by All") {
  const convention = conventions.find(c => c.name === updatedConvention);
  if (convention) {
    filtered = filtered.filter(user => {
      return (
        Array.isArray(user.convention_ids) &&
        user.convention_ids.includes(Number(convention.id))
      );
    });
  }
} else if (updatedConvention === "Filter by All") {
  // If "Filter by All" is selected, do not apply any convention filter, show all users
  // In this case, the filtered list remains unchanged.
}

    

    // Filter by Country
    if (updatedCountry !== "Filter By Country..." && updatedCountry !== "Filter by All") {
      filtered = filtered.filter(user =>
        user.country && user.country.toLowerCase().includes(updatedCountry.toLowerCase())
      );
    }

    // Filter by Search Input
    if (updatedSearchInput.trim() !== "") {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(updatedSearchInput.toLowerCase()) ||
        user.email.toLowerCase().includes(updatedSearchInput.toLowerCase())
      );
    }

    console.log(filtered);
    setFilteredUsers(filtered); // Update the filtered users
  };





  // Update filtered conventions when the search query changes
  useEffect(() => {
    const filtered = conventions.filter((convention) =>
      convention.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredConventions(filtered); // Update filteredConventions based on search query
  }, [searchQuery, conventions]);

  // Function to filter countries based on the search term
  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleOptionNews = (option) => {
    setSelectedNews(option);
    setIsDropdownNewsOpen(false);
    applyFilters({ updatedNews: option });
  };

  const handleOptionPartner = (option) => {
    setSelectedPartner(option);
    setIsDropdownPartnerOpen(false);
    applyFilters({ updatedPartner: option });
  };

  const handleOptionDeletedUser = (option) => {
    setSelectedDeletedUser(option);
    setIsDropdownDeletedUserOpen(false);
    applyFilters({ updatedDeletedUser: option });
  };

  const handleOptionConvention = (convention) => {
    if (convention === 'Filter by All') {
      // If "Filter by All" is selected, reset the filtering
      setSelectedConvention('Filter By All');  // Reset the selected convention text
      applyFilters({ updatedConvention: 'Filter By...' });  // Reset filter in the parent component
    } else {
      // Apply filter for selected convention
      setSelectedConvention(convention.name);
      applyFilters({ updatedConvention: convention.name });
    }
  
    setIsDropdownConventionOpen(false);  // Close the dropdown after selection
  };

  const handleOptionCountry = (option) => {
    setSelectedCountry(option);
    setIsDropdownCountryOpen(false);
    applyFilters({ updatedCountry: option });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    applyFilters({ updatedSearchInput: value });
  };





  const onhandleView = (id) => {
    navigate(`/admin/view/users/${id}`);
  };


  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/admin/tools`, {
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
      setTools(data);
      setFilteredUsers(data); // Initially show all users
      console.log('Tools', data);
    } catch (error) {
      console.error('Error fetching Sponser data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConventions = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/admin/convention`, {
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
      setConventions(data); // Save fetched conventions
      console.log('Convention', data);
    } catch (error) {
      console.error('Error fetching Convention data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilters = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const resetFilters = () => {
    // Reset all filter states to their initial values
    setSelectedNews('Filter by All');
    setSelectedPartner('Filter by All');
    setSelectedDeletedUser('Filter by All');
    setSelectedConvention('Filter by All');
    setSelectedCountry('Filter by All');

    // You may also want to reset the search query or any other filter criteria
    setSearchQuery('');
    setSearchTerm('');

    // Optionally, reset the filtered lists (if needed)
    setFilteredUsers(users);  // Reset the users filter
  };

  const exportData = () => {
    // Check if there are any filtered users
    if (filteredUsers.length > 0) {
      // Create CSV headers based on the user data
      const headers = [
        'ID',
        'First Name',
        'Last Name',
        'User Name',
        'Email',
        'Status',
        'Country',
        'Location',
        'News Letter Info',
        'Promotional Info',
        'Steps Completed',
        'Created At',
        'Deleted At',
        'Conventions'
      ];

      const rows = filteredUsers.map(user => {
        // Combine all convention names into a single string
        const conventionInfo = user.conventions
    ?.map(convention => {
      const conventionNames = convention.convention_name;
      const attendanceDates = convention.attendance_dates.join(', '); // Join all attendance dates for this convention
      return `${conventionNames} (${attendanceDates})`; // Convention name followed by attendance dates in parentheses
    })
    .join(', ') || '';
    return [
      user.id,
      user.first_name,
      user.last_name,
      user.username,
      user.email,
      user.status,
      user.country,
      user.location,
      user.newsletter_info,
      user.promotional_info,
      user.is_steps_complete,
      user.created_at,
      user.deleted_at,
      conventionInfo, // This now includes convention names and attendance dates together
    ];
  });
      console.log(headers, rows);


      // Combine headers and rows into a CSV string
      const csvContent = [
        headers.join(','), // Join the headers with commas
        ...rows.map(row => row.join(',')) // Join each row with commas
      ].join('\n'); // Join all rows with new lines

      // Create a Blob from the CSV string
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

      // Create an anchor element to trigger the file download
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'filtered_users.csv'); // Set the file name
      link.style.visibility = 'hidden'; // Hide the link
      document.body.appendChild(link);
      link.click(); // Simulate a click to start the download
      document.body.removeChild(link); // Clean up the link element
    } else {
      // alert('No users to export');
      toastr.warning('No users available for export.');
    }
  };


  const handleBlockUnblock = async (userId, newStatus) => {
    // Confirmation popup
    Swal.fire({
      title: newStatus === 'blocked' ? 'Block User?' : 'Unblock User?',
      text: `Are you sure you want to ${newStatus === 'blocked' ? 'block' : 'unblock'} this user?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'blocked' ? '#d33' : '#28a745', // Different colors for actions
      cancelButtonColor: '#3085d6',
      confirmButtonText: newStatus === 'blocked' ? 'Yes, Block!' : 'Yes, Unblock!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // API Call to Update Status
          const response = await fetchWithAuth(`/admin/block_user/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify({ status: newStatus }), // Pass updated status
          });

          const data = await response.json();

          if (response.ok) {
            Swal.fire(
              newStatus === 'blocked' ? 'Blocked!' : 'Unblocked!',
              `User has been ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully.`,
              'success'
            );
            fetchUsers(); // Refresh user list or fetch updated status
          } else {
            Swal.fire('Error!', data.message || 'Failed to update status.', 'error');
          }
        } catch (error) {
          console.error('Error:', error);
          Swal.fire('Error!', 'Something went wrong. Please try again later.', 'error');
        }
      }
    });
  };

  const handleDeleteClick = async (userId) => {
    // Confirmation popup
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this user? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // API Call to delete the user
          const response = await fetchWithAuth(`/admin/users/${userId}`, {
            method: 'DELETE', // DELETE request to the API
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Bearer token for auth
            },
          });

          const data = await response.json();

          if (response.ok) {
            // Success message
            Swal.fire('Deleted!', 'The user has been deleted successfully.', 'success');
            fetchUsers(); // Refresh the user list after deletion
          } else {
            // Error message
            Swal.fire('Error!', data.message || 'Failed to delete the user.', 'error');
          }
        } catch (error) {
          // Handle any network errors
          console.error('Error:', error);
          Swal.fire('Error!', 'Something went wrong. Please try again later.', 'error');
        }
      }
    });
  };


  return (
    <div className="bg-[#102F47] w-full opacity-100 min-h-screen">
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
        </div>
      )}
      <Navbar />
      <div className="w-11/12 max-w-screen-2xl mx-auto pt-[10rem] md:pt-40 text-white py-8">
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-x-6 items-center">
  {/* Title */}
  <p className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-palanquin-dark leading-normal md:leading-snug lg:leading-snug">
    Tools
  </p>

  <div className="flex flex-col md:flex-row md:items-center gap-y-4 gap-x-6 justify-start 2xl:justify-end mt-6 md:mt-0">

    {/* Search */}
    <div className="w-full md:w-auto">
      <form action="" className="flex items-center">
        <input
          value={searchInput}
          onChange={handleSearchChange}
          type="search"
          id="search"
          placeholder="Search by Email"
          className="bg-[#102F47] border-b-2 border-[#707070] w-full lg:w-96 xl:w-96 rounded-none focus:outline-none text-lg md:text-xl lg:text-2xl py-2 md:py-3 tracking-custom"
        />
      </form>
    </div>
    
    {/* Show/Hide Filters Button */}
    <div className="flex justify-end mt-4 md:mt-0">
      <button
        onClick={toggleFilters}
        className="bg-lightOrange text-white px-6 py-2 rounded-lg text-lg md:text-xl"
      >
        {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
      </button>
    </div>
    
  </div>
</div>

        {/* Filters Section */}
        {isFilterVisible && (
          <div className="mt-8">
            <div className="flex flex-col md:flex-row md:items-center gap-y-4 gap-x-6">
              {/* Filter by Newsletter */}
              <div className="relative">
                <button
                  type="button"
                  className="w-full lg:w-72 border-2 truncate pr-5 pl-5 border-[#707070] text-lg md:text-xl lg:text-2xl py-2 md:py-3 flex items-center justify-between"
                  onClick={toggleDropdownNews}
                >
                  {selectedNews}
                  <img src={drop} alt="" />
                </button>

                {isDropdownNewsOpen && (
                  <div className="md:absolute w-full lg:w-72 mt-2 bg-[#102F47] border border-gray-300 shadow-lg text-lg md:text-xl lg:text-2xl">
                    <ul>
                      <li
                        className="p-2 hover:bg-gray-100 cursor-pointer hover:text-black"
                        onClick={() => handleOptionNews("Filter by All")}
                      >
                        Filter by All
                      </li>
                      <li
                        className="p-2 hover:bg-gray-100 cursor-pointer hover:text-black"
                        onClick={() => handleOptionNews("Filter by Newsletter")}
                      >
                        Filter by Newsletter
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Filter by Partner */}
              <div className="relative">
                <button
                  type="button"
                  className="w-full lg:w-72 border-2 pr-5 pl-5 truncate border-[#707070] text-lg md:text-xl lg:text-2xl py-2 md:py-3 flex items-center justify-between"
                  onClick={toggleDropdownPartner}
                >
                  {selectedPartner}
                  <img src={drop} alt="" />
                </button>

                {isDropdownPartnerOpen && (
                  <div className="md:absolute w-full lg:w-72 mt-2 bg-[#102F47] border border-gray-300 shadow-lg text-lg md:text-xl lg:text-2xl">
                    <ul>
                      <li
                        className="p-2 hover:bg-gray-100 cursor-pointer hover:text-black"
                        onClick={() => handleOptionPartner('Filter by All')}
                      >
                        Filter by All
                      </li>
                      <li
                        className="p-2 hover:bg-gray-100 cursor-pointer hover:text-black"
                        onClick={() => handleOptionPartner('Filter by Partner')}
                      >
                        Filter by Partner
                      </li>

                    </ul>
                  </div>
                )}


              </div>

              {/* Filter by Delete Account */}
              <div className="relative">
                <button
                  type="button"
                  className="w-full lg:w-72 border-2 pr-5 pl-5 truncate border-[#707070] text-lg md:text-xl lg:text-2xl py-2 md:py-3 flex items-center justify-between"
                  onClick={toggleDropdownDeletedUser}
                >
                  {selectedDeletedUser}
                  <img src={drop} alt="" />
                </button>

                {isDropdownDeletedUserOpen && (
                  <div className="md:absolute w-full lg:w-72 mt-2 bg-[#102F47] border border-gray-300 shadow-lg text-lg md:text-xl lg:text-2xl">
                    <ul>
                      <li
                        className="p-2 hover:bg-gray-100 cursor-pointer hover:text-black"
                        onClick={() => handleOptionDeletedUser('Filter by All')}
                      >
                        Filter by All
                      </li>
                      <li
                        className="p-2 hover:bg-gray-100 cursor-pointer hover:text-black"
                        onClick={() => handleOptionDeletedUser('Filter by Deleted User')}
                      >
                        Filter by Deleted User
                      </li>

                    </ul>
                  </div>
                )}


              </div>

              {/* Filter by Convention */}
              <div className="relative">
                <button
                  type="button"
                  className="w-full lg:w-72 border-2 pr-5 pl-5 truncate border-[#707070] text-lg md:text-xl lg:text-2xl py-2 md:py-3 flex items-center justify-between"
                  onClick={toggleDropdownConvention}
                >
                  {selectedConvention}
                  <img src={drop} alt="Dropdown Icon" />
                </button>

                {isDropdownConventionOpen && (
                  <div
                    className="md:absolute w-full lg:w-72 mt-2 bg-[#102F47] border border-gray-300 shadow-lg text-lg md:text-xl lg:text-2xl"
                    style={{ maxHeight: '300px' }}
                  >
                    {/* Search Input */}
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full p-2 bg-[#102F47] text-white text-lg md:text-xl lg:text-2xl border-b border-gray-300 focus:outline-none"
                    />
                    {/* Dropdown List */}
                    <ul className="overflow-y-auto" style={{ maxHeight: '200px' }}>
                      <li
                        className="p-2 hover:bg-gray-100 cursor-pointer hover:text-black"
                        onClick={() => handleOptionConvention('Filter by All')}
                      >
                        Filter by All
                      </li>
                      {/* Filter and render conventions */}
                      {filteredConventions.map((convention) => (
                        <li
                          key={convention.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer hover:text-black"
                          onClick={() => handleOptionConvention(convention)}
                        >
                          {convention.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {/* Filter by Country */}
              <div className="relative">
                {/* Dropdown Button */}
                <button
                  type="button"
                  className="w-full lg:w-72 border-2 pr-5 pl-5 truncate border-[#707070] text-lg md:text-xl lg:text-2xl py-2 md:py-3 flex items-center justify-between"
                  onClick={toggleDropdownCountry}
                >
                  {selectedCountry}
                  <img src={drop} alt="Dropdown Icon" />
                </button>

                {/* Dropdown List */}
                {isDropdownCountryOpen && (
                  <div className="md:absolute w-full lg:w-72 mt-2 bg-[#102F47] border border-gray-300 shadow-lg text-lg md:text-xl lg:text-2xl max-h-64 overflow-y-auto">
                    {/* Search Input */}
                    <input
                      type="text"
                      placeholder="Search Country..."
                      className="w-full p-2 bg-[#102F47] text-white border-b-2 border-gray-300"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)} // Filter conventions as you type
                    />

                    <ul>
                      {/* Option to Filter by All */}
                      <li
                        className="p-2 hover:bg-gray-100 cursor-pointer hover:text-black"
                        onClick={() => handleOptionCountry('Filter by All')}
                      >
                        Filter by All
                      </li>

                      {/* Dynamically Render Filtered Countries */}
                      {filteredCountries.map((country) => (
                        <li
                          key={country}
                          className="p-2 hover:bg-gray-100 cursor-pointer hover:text-black"
                          onClick={() => handleOptionCountry(country)}
                        >
                          {country}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>


            </div>
            {/* Reset Filters and Export Buttons */}
            <div className="flex justify-center gap-6 mt-6">
              {/* Reset Filters Button */}
              <button
                onClick={resetFilters}
                className="bg-red text-white px-6 py-2 rounded-lg text-lg md:text-xl"
              >
                Reset Filters
              </button>

              {/* Export Button */}
              <button
                onClick={exportData}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg text-lg md:text-xl"
              >
                Export
              </button>
            </div>
          </div>
        )}

      </div>

      {/* table */}
      <div className="w-full bg-[#102F47] min-h-screen">
        <div className="w-10/12 mx-auto text-white pt-[42px]">
          <div className="overflow-x-auto mb-10">
            <table className="w-full table-auto">
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr
                      className={`w-full items-center flex gap-x-14 gap-y-5 py-5 px-8 justify-between ${index % 2 === 0 ? "bg-[#0D2539]" : "bg-[#102F47]"
                        }`}
                      key={user.id}
                    >
                      <div className="flex items-center gap-x-10 justify-center w-full">
                        {/* Image */}
                        <img
                          src={user.profile_picture || ConventionImage} // Add a valid fallback if needed
                          className="w-10 h-10 md:w-66 md:h-66 rounded-full object-cover"
                          alt="Convention Logo"
                        />
                        {/* Name */}
                        <div className="flex flex-col justify-center">
                          <td className="font-mulish text-md leading-7 md:text-26 md:leading-33">

                            <span className="text-lightOrange">{user.username}</span>
                          </td>
                        </div>

                        {/* Email */}
                        <div className="flex-grow flex items-end w-48 md:w-72">
                          <td className="font-mulish text-sm leading-5 md:text-26 md:leading-33">
                            {user.email || ""} {/* Show N/A if date is missing */}
                          </td>
                        </div>

                        {/* Country */}
                        <div className="flex-grow flex items-end w-48 md:w-72">
                          <td className="font-mulish text-sm leading-5 md:text-26 md:leading-33">
                            {user.country || ""} {/* Show N/A if date is missing */}
                          </td>
                        </div>


                        <div className="flex-grow flex items-end w-48 md:w-72">
                          <td className="font-mulish text-sm leading-5 md:text-26 md:leading-33 truncate">
                            <span className="text-lightOrange truncate block w-full overflow-hidden">
                              {/* Conditionally Render Button */}
                              {!user?.deleted_at && (
                                user.status === 'blocked' ? (
                                  <button
                                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition"
                                    onClick={() => handleBlockUnblock(user.id, 'active')} // Unblock
                                  >
                                    Unblock {user.username}
                                  </button>
                                ) : (
                                  <button
                                    className="px-3 py-1 text-sm bg-red text-white rounded hover:bg-red transition"
                                    onClick={() => handleBlockUnblock(user.id, 'blocked')} // Block
                                  >
                                    Block {user.username}
                                  </button>
                                )
                              )}

                            </span>
                          </td>
                        </div>


                      </div>
                      <div className="flex items-center gap-x-20 justify-self-end">
                        {/* Delete Button */}
                        <td
                          className="font-mulish text-lg leading-10 md:text-26 md:leading-47 text-[#C53A33] cursor-pointer"
                          onClick={user?.deleted_at ? null : () => handleDeleteClick(user.id)} // Apply onClick only if not deleted
                        >
                          {user?.deleted_at ? (
                            <button className="ml-4 px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition">
                              Deleted
                            </button>
                          ) : (
                            "Delete"
                          )}
                        </td>




                        {/* Edit Button */}
                        <td
                          className="font-mulish text-lg leading-10 md:text-26 md:leading-47 cursor-pointer"
                          onClick={() => onhandleView(user.id)}
                        >
                          View
                        </td>
                      </div>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="flex justify-center items-center py-16">
                      {/* Center the message */}
                      <span className="text-[#F2F0EF] tracking-custom text-lg leading-6 md:text-24 md:leading-30">
                        There are no more results for this search query.
                        <span
                          className="text-[#F3C15F] cursor-pointer"
                          onClick={() => setSearchInput("")}
                        >
                          {" "}
                          Clear search
                        </span>
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default layout;