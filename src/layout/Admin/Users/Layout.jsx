import React, { useState, useEffect } from 'react'
import ConventionImage from '../../../assets/traditional.png'
import drop from '../../../assets/icon-caret-down.svg';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Admin/Navbar';
import Swal from "sweetalert2";
import { fetchWithAuth } from '../../../services/apiService';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function layout({ onSearch }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Sort by...');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  useEffect(() => {
    fetchUsers();
  }, []);


 

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    if (option === 'Sort by A to Z') {
      setUsers([...users].sort((a, b) => a.username.localeCompare(b.username)));
    } else if (option === 'Sort by Z to A') {
      setUsers([...users].sort((a, b) => b.username.localeCompare(a.username)));
    } else if (option === 'Sort by Block') {
      // Sort by Block - Show blocked users first
      setUsers([...users].sort((a, b) => {
        // Move blocked users to the top
        if (a.status === 'blocked' && b.status !== 'blocked') return -1;
        if (a.status !== 'blocked' && b.status === 'blocked') return 1;
        return 0; // Maintain current order otherwise
      }));
    }
  };
  

  // Function to handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value); // Update the local state
    onSearch(value); // Call the parent function to pass the search term
  };




  const onhandleView = (id) => {
    navigate(`/admin/view/users/${id}`);
  };


  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/admin/users`, {
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
      setUsers(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching Sponser data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredusers = users.filter((user) =>
    // Check if any of the fields match the search input (case-insensitive)
    user.username.toLowerCase().includes(searchInput.toLowerCase()) ||
    user.email.toLowerCase().includes(searchInput.toLowerCase())
  );

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
          const response = await fetchWithAuth(`/users/${userId}`, {
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
            Users
          </p>

          {/* Sort by + Search + Create New Button */}
          <div className="flex flex-col md:flex-row md:items-center gap-y-4 gap-x-6 justify-start 2xl:justify-end mt-6 md:mt-0">
            {/* Search */}
            <div className="w-full md:w-auto">
              <form action="" className="flex items-center">
                <input
                  value={searchInput}
                  onChange={handleSearchChange}
                  type="search"
                  id="search"
                  placeholder="Search user"
                  className="bg-[#102F47] border-b-2 border-[#707070] w-full lg:w-96 xl:w-96 rounded-none focus:outline-none text-lg md:text-xl lg:text-2xl py-2 md:py-3 tracking-custom"
                />
              </form>
            </div>
            {/* Sort by Dropdown */}
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
                      onClick={() => handleOptionClick('Sort by Block')}
                    >
                      Sort by Block
                    </li>
                    <li
                      className='p-2 hover:bg-gray-100 cursor-pointer hover:text-black'
                      onClick={() => handleOptionClick('Sort by A to Z')}
                    >
                      Sort by A to Z (Name)
                    </li>
                    <li
                      className='p-2 hover:bg-gray-100 cursor-pointer hover:text-black'
                      onClick={() => handleOptionClick('Sort by Z to A')}
                    >
                      Sort by Z to A (Name)
                    </li>
                  </ul>
                </div>
              )}
            </div>


          </div>
        </div>
      </div>

      {/* table */}
      <div className="w-full bg-[#102F47] min-h-screen">
        <div className="w-10/12 mx-auto text-white pt-[42px]">
          <div className="overflow-x-auto mb-10">
            <table className="w-full table-auto">
              <tbody>
                {filteredusers.length > 0 ? (
                  filteredusers.map((user, index) => (
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
                              {user.status === 'blocked' ? (
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
                              )}
                            </span>
                          </td>
                        </div>


                      </div>
                      <div className="flex items-center gap-x-20 justify-self-end">
                        {/* Delete Button */}
                        <td
                          className="font-mulish text-lg leading-10 md:text-26 md:leading-47 text-[#C53A33] cursor-pointer"
                          onClick={() => handleDeleteClick(user.id)} // Trigger delete on click
                        >
                          Delete
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