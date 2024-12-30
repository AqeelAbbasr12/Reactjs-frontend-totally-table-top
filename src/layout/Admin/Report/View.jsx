import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../../components/Admin/Navbar';
import Swal from "sweetalert2";
import { fetchWithAuth } from '../../../services/apiService';
import toastr from 'toastr';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function layout({ onSearch }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState([]);
  const navigate = useNavigate();
  const { report_id } = useParams();
  useEffect(() => {
    fetchReport(report_id);
  }, [report_id]);


  const handleTakeAction = async (reportId) => {
    Swal.fire({
      title: "Are you sure?",
      text: `This action will delete the report and reported item and cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetchWithAuth(`/admin/delete_reported_item/${reportId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });
  
          if (!response.ok) {
            throw new Error("Failed to delete the report.");
          }
  
          const data = await response.json();
          Swal.fire("Deleted!", data.message || "The report has been deleted.", "success");
          navigate('/admin/report');
          
          // Optional: Add logic to update the UI (e.g., remove the deleted report from the list)
        } catch (error) {
          Swal.fire("Error", "Failed to delete the report. Please try again.", "error");  
        }
      }
    });
  };
  
  


  const fetchReport = async (report_id) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/admin/report/${report_id}`, {
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
              fetchReport(report_id); // Refresh user list or fetch updated status
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

  return (
    <div className="bg-[#102F47] w-full min-h-screen text-white">
      {/* Loading Spinner Placeholder */}
      <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50 hidden">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
      </div>

      {/* Navbar Placeholder */}
      <Navbar />

      <div className="w-11/12 max-w-screen-2xl mx-auto pt-48 text-white">
        {/* Page Title */}
        <div className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">Report Details</h1>
            <p className="text-lg md:text-xl mt-2 text-gray-300">
              Comprehensive information about the reported issue.
            </p>
          </div>
          <button
            className="ml-4 px-3 py-1 text-lg bg-red text-white rounded hover:bg-red-600 transition"
            onClick={() => handleTakeAction(report.id)}
          >
            Take Action to Delete
          </button>
        </div>



        {/* Report Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Report Overview</h2>
            <p className="text-lg mb-2 font-semibold">
              <span className="font-semibold">Type:</span>{" "}
              <span className="text-lightOrange">
                {report?.type
                  ? report.type.toUpperCase() === "EVENT"
                    ? "TABLE"
                    : report.type.toUpperCase()
                  : ""}
              </span>
            </p>

            <p className="text-lg mb-2">
              <span className="font-semibold">Reporter:</span>{" "}
              <span className="text-lightOrange">{report?.reporter_name || ""}</span>
            </p>

            <p className="text-lg mb-2">
              <span className="font-semibold">Report Date:</span>{" "}
              <span className="text-lightOrange">{report?.created_at || ""}</span>
            </p>
            <p className="text-lg">
              <span className="font-semibold">Reason:</span>{" "}
              <span className="text-lightOrange">{report?.reason || "No reason provided"}</span>
            </p>
          </div>
          <div className="bg-darkBlue p-6 rounded-lg shadow-lg">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Additional Information</h2>
            <ul className="space-y-2">
              <p className="text-lg mb-2">
                <span className="font-semibold">Reported:</span>{" "}
                <span className="text-lightOrange">
                  {report?.reported_user_name || ""}
                </span>
                {report?.reported_user_name && (
                  <button
                    className="ml-4 px-3 py-1 text-sm bg-red text-white rounded hover:bg-red-600 transition"
                    onClick={() => {
                      navigate(`/admin/messages/${report?.reported_user_id}`);  // Removed the extra curly brace here
                  }}
                  >
                    Send Warning Message
                  </button>
                )}
                
                {/* Conditionally Render Button */}
                {report.reported_user_status === 'blocked' ? (
                                <button
                                  className="ml-4 px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition"
                                  onClick={() => handleBlockUnblock(report.reported_user_id, 'active')} // Unblock
                                >
                                  Unblock
                                </button>
                              ) : (
                                <button
                                  className="ml-4 px-3 py-1 text-sm bg-red text-white rounded hover:bg-red transition"
                                  onClick={() => handleBlockUnblock(report.reported_user_id, 'blocked')} // Block
                                >
                                  Block
                                </button>
                              )}
              </p>

              {report?.type === "game" && (
                <>
                  <li>
                    <span className="font-semibold">Game Name:</span>{" "}
                    <span className='text-lightOrange'>{report?.reported_game_name || ""}</span>
                  </li>
                  <li>
                    <span className="font-semibold">Game Price:</span>{" "}
                    <span className='text-lightOrange'>{report?.reported_game_currency_tag || ""}{report?.reported_game_price || ""}</span>
                  </li>
                  <li>
                    <span className="font-semibold">Game Condition:</span>{" "}
                    <span className='text-lightOrange'>{report?.reported_game_condition || ""}</span>
                  </li>
                  <li>
                    <span className="font-semibold">Game Status:</span>{" "}
                    <span className='text-lightOrange'>{report?.reported_game_status || ""}</span>
                  </li>
                  <li>
                    <span className="font-semibold">Game Description:</span>{" "}
                    <span className='text-lightOrange'>{report?.reported_game_desc || ""}</span>
                  </li>
                </>
              )}
              {report?.type === "message" && (
                <>
                  {/* <li>
                    <span className="font-semibold">Message ID:</span>{" "}
                    <span>{report?.reported_message_id || "N/A"}</span>
                  </li> */}
                  <li>
                    <span className="font-semibold">Message Content:</span>{" "}
                    <span className='text-lightOrange'>{report?.reported_message_content || ""}</span>
                  </li>
                </>
              )}
              {report?.type === "event" && (
                <>
                  <li>
                    <span className="font-semibold">Event Name:</span>{" "}
                    <span className='text-lightOrange'>{report?.reported_event_name || ""}</span>
                  </li>
                  <li>
                    <span className="font-semibold">Event Date:</span>{" "}
                    <span className='text-lightOrange'>{report?.reported_event_date || ""}</span>
                  </li>

                  <li>
                    <span className="font-semibold">Event Time:</span>{" "}
                    <span className='text-lightOrange'>{report?.reported_event_time || ""}</span>
                  </li>

                  <li>
                    <span className="font-semibold">Event Location:</span>{" "}
                    <span className='text-lightOrange'>{report?.reported_event_location || ""}</span>
                  </li>
                  <li>
                    <span className="font-semibold">Event Available Space:</span>{" "}
                    <span className='text-lightOrange'>{report?.reported_event_space || ""}</span>
                  </li>
                  <li>
                    <span className="font-semibold">Event Description:</span>{" "}
                    <span className='text-lightOrange'>{report?.reported_event_description || ""}</span>
                  </li>
                </>
              )}


            </ul>
          </div>
        </div>

        
      </div>

    </div>
  );
}

export default layout;