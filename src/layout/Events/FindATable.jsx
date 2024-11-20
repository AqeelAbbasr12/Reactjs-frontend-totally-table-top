import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Left from '../../components/Left'
import { FaLocationDot } from 'react-icons/fa6'
import { FaCalendarAlt, FaDiceFive, FaList } from 'react-icons/fa'
import ConventionImage from '../../assets/traditional.png'
import { fetchWithAuth } from '../../services/apiService';
import toastr from 'toastr';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FindATable = () => {
    const nav = useNavigate()
    const [loading, setLoading] = useState();
    const [events, setEvents] = useState([]);
    const [selectedConvention, setSelectedConvention] = useState(null);
    const [conventions, setConventions] = useState([]);

    useEffect(() => {
        fetchFindTable();
        fetchConventions();
    }, []);



    const fetchFindTable = async () => {
        setLoading(true); // Show loading spinner while fetching
        try {
            const response = await fetchWithAuth(`/user/find_a_table`, {
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
            // Transform data into the format required by react-select
            console.log(data);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching Events data:', error);
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };

    const fetchConventions = async () => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/convention_filter`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setConventions(data);
        } catch (error) {
            console.error('Error fetching conventions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (conventionEventId) => {
        try {
            // Create the data to be sent in the request body
            const submissionData = new FormData();
            submissionData.append('convention_event_id', conventionEventId);

            // Make the API request
            const response = await fetch(`${API_BASE_URL}/user/attend_table_request`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: submissionData,
            });

            // Handle the response
            if (response.ok) {
                const data = await response.json();
                // console.log(data);
                fetchFindTable()
                toastr.success(data.message);
            } else {
                const data = await response.json();
                console.error('Error:', response.statusText);
                toastr.error(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            toastr.error('Error', 'An error occurred while updating the event.');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
        const day = date.getDate();
        const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
        const year = date.getFullYear();

        // Add the 'st', 'nd', 'rd', 'th' suffix
        const suffix = day % 10 === 1 && day !== 11 ? 'st' :
            day % 10 === 2 && day !== 12 ? 'nd' :
                day % 10 === 3 && day !== 13 ? 'rd' : 'th';

        return `${weekday}, ${day}${suffix}, ${month}, ${year}`;
    };


    return (
        <div className='flex flex-col w-[100vw] min-h-[100vh] max-h-fit overflow-y-auto bg-darkBlue'>
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
                </div>
            )}
            <Navbar type={"verified"} />
            <div className='pt-[2.3rem] flex  justify-between items-start md:flex-row flex-col bg-darkBlue md:px-[2rem] flex-1 h-[fit] w-[100vw] gap-x-6'>

                {/* LEFT  */}
                <Left />

                {/* RIGHT  */}
                <div className='flex-1 rounded-md px-2 mb-2 w-full md:mt-0 mt-4'>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-2 w-full">


                        <h1 className="text-white text-2xl font-semibold text-center md:text-left">
                            Find A Table
                        </h1>


                        <select
                            className="w-full md:w-[15rem] h-[2.5rem] bg-darkBlue text-white rounded-md px-4 outline-none text-sm border border-white"
                            onChange={(e) => setSelectedConvention(parseInt(e.target.value))}
                            value={selectedConvention || ""}
                        >
                            <option value="" className="text-gray-300">
                                All Conventions
                            </option>
                            {conventions.map((convention) => (
                                <option key={convention.id} value={convention.id}>
                                    {convention.convention_name}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className='mt-6'>
                    <div>
  {events
    .filter((event) => 
      !selectedConvention || event.convention_id === selectedConvention
    )
    .map((event) => (
      <div
        key={event.id}
        className="w-full sm:h-[13rem] bg-[#0d2539] p-3 rounded-md flex justify-between items-start relative sm:flex-row flex-col mt-4"
      >
        {/* Event Details */}
        <div className="w-full sm:w-auto">
          <h1 className="text-lg font-semibold text-white break-all">
            {event.event_name} on {formatDate(event.event_date).split(",")[0]}{" "}
            <span className="text-lightOrange">Space ({event.event_space})</span>
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center gap-x-2">
              <FaCalendarAlt className="text-lightOrange" />
              <p className="text-white">
                {event.event_time} {formatDate(event.event_date)}
              </p>
            </div>
            <div className="flex items-center gap-x-2">
              <FaLocationDot className="text-lightOrange" />
              <p className="text-white">{event.event_location}</p>
            </div>
          </div>

          {/* Invitations */}
          <div className="flex items-center mt-4">
            {event.invitations.map((invitation) => (
              <img
                key={invitation.invite_receiver_image}
                src={invitation.invite_receiver_image}
                className="w-[2rem] h-[2rem] rounded-full object-cover"
                alt="Invitation"
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-4 w-full">
            <Button
              onClickFunc={() => handleSubmit(event.id)}
              title={"+"}
              className="w-[2rem] h-[2rem] rounded-full border border-lightOrange text-white"
            />
          </div>
        </div>

        {/* Event Image */}
        <div className="sm:mt-0 mt-4 w-full sm:w-auto">
          <img
            src={event.event_image || ConventionImage}
            alt=""
            className="h-[10rem] w-full sm:w-auto object-cover"
          />
        </div>
      </div>
    ))}
</div>

                    </div>



                </div>


            </div>

        </div>
    )
}

export default FindATable
