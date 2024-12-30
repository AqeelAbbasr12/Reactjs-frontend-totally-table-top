import React, { useState, useEffect } from 'react'
import img1 from '../../../assets/Announcement.svg';
import img2 from '../../../assets/Convention.svg';
import ConventionImage from '../../../assets/traditional.png'
import drop from '../../../assets/icon-caret-down.svg';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Admin/Navbar';
import Swal from "sweetalert2";
import { MdRemoveRedEye } from "react-icons/md";
import { IoMdEyeOff } from "react-icons/io";
import { fetchWithAuth } from '../../../services/apiService';
import toastr from 'toastr';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function layout({ onSearch }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Sort by...');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [reports, setReport] = useState([]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  useEffect(() => {
    fetchReports();
  }, []);


  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);

    // Sorting by type
    if (option === 'Sort by Game') {
      setReport([...reports].sort((a, b) => (a.type === 'game' ? -1 : 1))); // Game first
    } else if (option === 'Sort by Message') {
      setReport([...reports].sort((a, b) => (a.type === 'message' ? -1 : 1))); // Message first
    } else if (option === 'Sort by Event') {
      setReport([...reports].sort((a, b) => (a.type === 'event' ? -1 : 1))); // Event first
    }

    // Sorting by name (A to Z or Z to A)
    else if (option === 'Sort by A to Z') {
      setReport([...reports].sort((a, b) => a.reporter_name.localeCompare(b.reporter_name)));
    } else if (option === 'Sort by Z to A') {
      setReport([...reports].sort((a, b) => b.reporter_name.localeCompare(a.reporter_name)));
    }
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value); // Update the local state
    onSearch(value); // Call the parent function to pass the search term
  };




  const onhandleView = (id) => {
    navigate(`/admin/view/report/${id}`); // Use the id to navigate to the specific edit page
  };


  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/admin/report`, {
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
      setReport(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching Sponser data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (report) => {
  const reportId = report.id; // Get the report ID

  // Show confirmation dialog
  Swal.fire({
    title: "Are you sure?",
    text: `You are about to delete the report with ID ${reportId}. This action cannot be undone!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        // Call the API to delete the report
        const response = await fetchWithAuth(`/admin/report/${reportId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete the report.");
        }

        // Show success message
        const data = await response.json();
        Swal.fire("Deleted!", data.message || "The report has been deleted.", "success");
        fetchReports();
        // Optional: Update the UI by removing the deleted report
        console.log(`Successfully deleted report with ID: ${reportId}`);
        // Example: setReports((prev) => prev.filter((r) => r.id !== reportId)); // Update state if using hooks
      } catch (error) {
        console.error("Error deleting report:", error);
        Swal.fire("Error", "Failed to delete the report. Please try again.", "error");
      }
    }
  });
};


  const filteredReports = reports.filter((report) =>
    // Check if any of the fields match the search input (case-insensitive)
    report.reporter_name.toLowerCase().includes(searchInput.toLowerCase()) ||
    report.type.toLowerCase().includes(searchInput.toLowerCase()) ||
    report.reason.toLowerCase().includes(searchInput.toLowerCase())
  );

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
            Reports
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
                  placeholder="Search Report"
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
                      onClick={() => handleOptionClick('Sort by Game')}
                    >
                      Sort by Game
                    </li>
                    <li
                      className='p-2 hover:bg-gray-100 cursor-pointer hover:text-black'
                      onClick={() => handleOptionClick('Sort by Message')}
                    >
                      Sort by Message
                    </li>
                    <li
                      className='p-2 hover:bg-gray-100 cursor-pointer hover:text-black'
                      onClick={() => handleOptionClick('Sort by Event')}
                    >
                      Sort by Table
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
                {filteredReports.length > 0 ? (
                  filteredReports.map((report, index) => (
                    <tr
                      className={`w-full items-center flex gap-x-14 gap-y-5 py-5 px-8 justify-between ${index % 2 === 0 ? "bg-[#0D2539]" : "bg-[#102F47]"
                        }`}
                      key={report.id}
                    >
                      <div className="flex items-center gap-x-10 justify-center w-full">
                        {/* Image */}
                        <img
                          src={report.reporter_profile_picture || ConventionImage} // Add a valid fallback if needed
                          className="w-10 h-10 md:w-66 md:h-66 rounded-full object-cover"
                          alt="Convention Logo"
                        />
                        {/* Name */}
                        <div className="flex flex-col justify-center">
                          <td className="font-mulish text-md leading-7 md:text-26 md:leading-33">
                            Reported By{" "}
                            <span className="text-lightOrange">{report.reporter_name}</span>
                          </td>
                        </div>

                        {/* Date */}
                        <div className="flex-grow flex items-end w-48 md:w-72">
                          <td className="font-mulish text-sm leading-5 md:text-26 md:leading-33">
                            {report.created_at || ""} {/* Show N/A if date is missing */}
                          </td>
                        </div>

                        {/* Type */}
                        <div className="flex-grow flex items-end w-48 md:w-72">
                          <td className="font-mulish text-sm leading-5 md:text-26 md:leading-33">
                            {report.type === "game" && (
                              <>
                                Report type is{" "}
                                <span className="text-lightOrange">Game</span>
                              </>
                            )}
                            {report.type === "message" && (
                              <>
                                Report type is{" "}
                                <span className="text-lightOrange">Message</span>
                              </>
                            )}
                            {report.type === "event" && (
                              <>
                                Report type is{" "}
                                <span className="text-lightOrange">Table</span>
                              </>
                            )}
                            {!report.type && (
                              <span className="bg-gray-500 text-white px-3 py-1 rounded-full">
                                Unknown Report Type
                              </span>
                            )}
                          </td>
                        </div>

                        {/* Reason */}
                        <div className="flex-grow flex items-end w-48 md:w-72">
                          <td className="font-mulish text-sm leading-5 md:text-26 md:leading-33 truncate">
                            Reason is{" "}
                            <span className="text-lightOrange truncate block w-full overflow-hidden">
                              {report.reason || "N/A"} {/* Show N/A if reason is missing */}
                            </span>
                          </td>
                        </div>
                      </div>
                      <div className="flex items-center gap-x-20 justify-self-end">
                        {/* Delete Button */}
                        <td
                          className="font-mulish text-lg leading-10 md:text-26 md:leading-47 text-[#C53A33] cursor-pointer"
                          onClick={() => handleDeleteClick(report)}
                        >
                          Delete
                        </td>
                        {/* Edit Button */}
                        <td
                          className="font-mulish text-lg leading-10 md:text-26 md:leading-47 cursor-pointer"
                          onClick={() => onhandleView(report.id)}
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