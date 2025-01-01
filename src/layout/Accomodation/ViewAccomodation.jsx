import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { FaList } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { BsFillCaretDownFill } from 'react-icons/bs';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from 'react-select';
import { fetchWithAuth } from '../../services/apiService';
import ConventionImage from '../../assets/traditional.png'
import { FaTrash } from 'react-icons/fa'; // Import delete icon

const ViewAccommodation = () => {
    const nav = useNavigate();
    const [loading, setLoading] = useState(true);
    const { accommodation_id, convention_id } = useParams();
    const [convention, setConvention] = useState({});
    const [formData, setFormData] = useState({
        location_name: '',
        from_date: '',
        to_date: '',
        location_address: '',
        location_website: '',
        location_phone_number: '',
        location_image: null,
    });

    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchAccommodation(accommodation_id);
        fetchConventions(convention_id);
    }, [accommodation_id]);

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
            // console.error('Error fetching conventions data:', error);
        } finally {
            setLoading(false);
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

    // console.log(dateOptions)

    const formatDate = (dateString) => {
        const date = new Date(dateString); // Create a new Date object
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits for month
        const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for day
        return `${year}-${month}-${day}`; // Return the formatted date
    };

    const handleDateChange = (selectedOptions, fieldName) => {
        // Convert the selected date to 'yyyy-mm-dd' format
        const selectedDate = selectedOptions && selectedOptions[0] ? formatDate(selectedOptions[0].value) : '';

        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: selectedDate,
        }));
    };


    const filteredToDateOptions = formData.from_date
        ? dateOptions.filter(option => new Date(option.value) >= new Date(formData.from_date))
        : dateOptions;

    const formatToConventionDate = (dateString) => {
        if (!dateString) return ''; // Return an empty string if the date is not defined
        const date = new Date(dateString);
        if (isNaN(date)) return ''; // Handle invalid date inputs

        // Extract day, month, and year
        const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for day
        const month = date.toLocaleString('en-US', { month: 'long' }); // Get full month name
        const year = date.getFullYear(); // Get full year

        // Return the formatted string
        return `${day} ${month} ${year}`;
    };

    // console.log(formatToConventionDate(formData.to_date));

    const fetchAccommodation = async (accommodation_id) => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/get_convention_accommodation/${accommodation_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            // console.log(data);

            // Set formData with fetched accommodation details
            setFormData({
                location_name: data.location_name || '',
                from_date: data.from_date || '',
                to_date: data.to_date || '',
                location_address: data.location_address || '',
                location_website: data.location_website || '',
                location_phone_number: data.location_phone_number || '',
                location_image: data.location_image || null,
            });

            setImagePreview(data.location_image);
        } catch (error) {
            // console.error('Error fetching accommodation data:', error);
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];






    return (
        <div className='flex flex-col w-[100vw] h-[100vh] overflow-y-auto'>
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
                </div>
            )}
            <Navbar type={"verified"} />
            <div className='bg-black md:px-[2rem] px-[1rem] flex items-center gap-x-4 py-3'>
                <a href='/profile' className='text-white'>Account</a>
                <BsFillCaretDownFill className='text-lightOrange -rotate-90' />
                <a href='/user/convention' className='text-white'>Your conventions</a>
            </div>
            <div className='md:px-[2rem] px-[1rem] h-[100%] bg-darkBlue  w-[100vw] pt-3 flex justify-center md:items-center'>
                <form className='sm:w-[50%] w-[100%] bg-[#0d2539] m-4 px-4 py-6 rounded-md mt-6 shadow-lg'>
                    {/* Logo and Icon Section */}
                    <div className='flex justify-center items-center gap-6 mb-6'>
                        <div className='w-[4rem] h-[4rem] rounded-full bg-lightOrange flex justify-center items-center shadow-md'>
                            <img
                                src={convention.convention_logo || ConventionImage}
                                alt="Convention Logo"
                                className='w-[4rem] h-[4rem] rounded-full object-cover'
                            />
                        </div>
                        <div className='w-[4rem] h-[4rem] rounded-full bg-lightOrange flex justify-center items-center shadow-md'>
                            <FaList className='text-white text-2xl' />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className='text-3xl text-center text-white font-bold mb-6'>View Accommodation</h1>

                    {/* Accommodation Details */}
                    <div className='text-white space-y-4'>
                        <h2 className='text-xl font-semibold'>Accommodation</h2>
                        <p className='text-lg'>Location Name: <span className='text-lightOrange font-medium'>{formData.location_name}</span></p>
                        <p className='text-lg'>Address: <span className='text-lightOrange font-medium'>{formData.location_address}</span></p>
                        <p className='text-lg'>
                            Website:
                            <a
                                href={formData.location_website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className='text-lightOrange underline font-medium ml-1 break-words md:ml-2'
                            >
                                {formData.location_website}
                            </a>
                        </p>

                        <p className='text-lg'>Phone Number:
                            <a href={`tel:${formData.location_phone_number}`} className='text-lightOrange underline font-medium ml-1'>{formData.location_phone_number}</a>
                        </p>
                        <p className='text-lg'>From Date: <span className='text-lightOrange font-medium'>{formatToConventionDate(formData.from_date)}</span></p>
                        <p className='text-lg'>To Date: <span className='text-lightOrange font-medium'>{formatToConventionDate(formData.to_date)}</span></p>
                    </div>

                    {/* Image Preview Section */}
                    <div className='flex justify-center items-center mt-8'>
                        <img
                            src={imagePreview || ConventionImage}
                            alt="Preview"
                            className='w-[12rem] h-[12rem] rounded-full object-cover shadow-md'
                        />
                    </div>
                </form>


            </div>
        </div>
    );
};

export default ViewAccommodation;
