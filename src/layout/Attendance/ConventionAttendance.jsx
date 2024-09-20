import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Select from 'react-select';  // Import react-select for multi-select dropdown
import { FaList } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { BsFillCaretDownFill, BsPrinterFill } from 'react-icons/bs';
import Button from '../../components/Button';
import { useParams } from 'react-router-dom';
import { BiSolidDownload } from 'react-icons/bi';
import toastr from 'toastr';
import { fetchWithAuth } from '../../services/apiService';

const ConventionAttendance = () => {
    const [selectedDates, setSelectedDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [convention, setConvention] = useState({});
    const { convention_id } = useParams();
    const nav = useNavigate();

    // Load the convention data and attendance data
    useEffect(() => {
        fetchConventions(convention_id);
        fetchAttendanceData(convention_id);  // Fetch attendance data
    }, [convention_id]);

    const fetchConventions = async (convention_id) => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/convention/${convention_id}`, {
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
            console.log(data);
        } catch (error) {
            console.error('Error fetching conventions data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch saved attendance data
    const fetchAttendanceData = async (convention_id) => {
        try {
            const response = await fetchWithAuth(`/user/convention_attendance/${convention_id}`, {
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
            const selectedDatesOptions = data.map(item => ({
                value: item.attendance_date,
                label: item.attendance_date
            }));

            setSelectedDates(selectedDatesOptions);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        }
    };

    // Convert the convention dates to an array of objects for react-select
    const dateOptions = convention.convention_dates
        ? convention.convention_dates.map((date, index) => ({
            value: date,
            label: date,
            key: index
        }))
        : [];

    // Handle multi-select change
    const handleDateChange = (selectedOptions) => {
        setSelectedDates(selectedOptions || []);  // If nothing is selected, set to an empty array
    };

    // Handle form submission
    const handleSubmit = async () => {
        // Extract values from selected dates
        const selectedDatesValues = selectedDates.map(dateOption => dateOption.value);

        // Check if selected dates are provided
        if (selectedDatesValues.length === 0) {
            toastr.warning('Please select at least one date.');
            return;  // Exit if no dates are selected
        }

        // Payload to submit
        const payload = {
            convention_id: convention_id,
            attendance_dates: selectedDatesValues
        };

        try {
            const response = await fetchWithAuth('/user/convention_attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(payload)
            });

            // Check if response is not ok
            if (!response.ok) {
                const data = await response.json();
                toastr.error(data.message || 'An error occurred while submitting.');
                throw new Error('Network response was not ok');
            }

            // Handle successful response
            const data = await response.json();
            toastr.success(data.message || 'Attendance updated successfully!');
            console.log('Response from server:', data);
            nav(-1); 
            // Additional handling on success, like navigation or resetting form
        } catch (error) {
            console.error('Error submitting attendance:', error);
        }
    };

    return (
        <div className='flex flex-col w-[100vw] h-[100vh] overflow-y-auto'>
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
                </div>
            )}
            <Navbar type={"verified"} />

            <div className='bg-black md:px-[2rem] px-[1rem] flex items-center gap-x-4 py-3 '>
                <span className='text-white'>Account</span>
                <BsFillCaretDownFill className=' text-lightOrange -rotate-90' />
                <span className='text-white'>Your conventions Attendance</span>
            </div>

            <div className='md:px-[2rem] px-[1rem] bg-darkBlue h-[86vh] w-[100vw] pt-3 flex justify-center items-center'>
                <div className='sm:w-[50%] w-[100%] bg-[#0d2539] px-3 py-5 rounded-md mt-6'>
                    <div className='flex justify-center items-center'>
                        <div className='w-[3rem] h-[3rem] rounded-full bg-lightOrange flex justify-center items-center'>UKGE</div>
                        <div className='w-[3rem] h-[3rem] rounded-full bg-lightOrange flex justify-center items-center'><FaList className='text-white' /></div>
                    </div>
                    <h1 className='text-3xl mt-3 text-center text-white font-semibold'>Select Your {convention.convention_name} Attendance</h1>

                    {/* Multi-select dropdown for dates */}
                    <Select
                        isMulti
                        options={dateOptions}  // Convention dates as options
                        onChange={handleDateChange}
                        value={selectedDates}  // Set default values
                        className="text-black mt-4"
                        placeholder="Select convention dates"
                    />

                    <div className='flex justify-between items-center mt-4'>
                        <div className='flex items-center gap-x-4'>
                        </div>
                        <Button onClickFunc={handleSubmit} title={"Update"} className={`w-[8rem] h-[2.3rem] rounded-md text-white bg-lightOrange`} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConventionAttendance;
