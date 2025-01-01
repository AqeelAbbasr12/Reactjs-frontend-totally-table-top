import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { FaList } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { BsFillCaretDownFill } from 'react-icons/bs';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from 'react-select';
import { fetchWithAuth } from '../../services/apiService';
import imageCompression from 'browser-image-compression';
import ConventionImage from '../../assets/traditional.png'
import toastr from 'toastr';
import { FaTrash } from 'react-icons/fa'; // Import delete icon
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditAccommodation = () => {
    const nav = useNavigate();
    const [loading, setLoading] = useState(true);
    const { accommodation_id, convention_id } = useParams();
    const [convention, setConvention] = useState({});
    const [selectedDates, setSelectedDates] = useState([]);
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
    const [formErrors, setFormErrors] = useState({});

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        if (file) {
            // Check file size (10 MB limit)
            const fileSizeInMB = file.size / (1024 * 1024);
            if (fileSizeInMB > 20) {
                toastr.warning('Image size exceeds 20 MB, cannot compress this image.');
                return;
            }

            // Compression options
            const options = {
                maxSizeMB: 1, // 1 MB limit
                maxWidthOrHeight: 800, // Resize to fit within 800x800px
                useWebWorker: true,
                fileType: file.type, // Preserve original file type
            };

            try {
                // Compress image if size is greater than 1 MB
                let compressedFile = file;
                if (fileSizeInMB > 1) {
                    compressedFile = await imageCompression(file, options);
                }

                // Create a new File object with the original name and file type
                const newFile = new File([compressedFile], file.name, {
                    type: file.type,
                    lastModified: Date.now(),
                });

                // Set the new File object to formData and update image preview
                setFormData((prevData) => ({
                    ...prevData,
                    location_image: newFile, // Use the new compressed file
                }));
                setImagePreview(URL.createObjectURL(newFile)); // Set the preview with the compressed file URL
            } catch (error) {
                console.error('Error during image compression:', error);
            }
        }
    };

    const validateForm = () => {
        const errors = {};

        // Check for required fields
        if (!formData.location_name) {
            errors.location_name = 'Location Name is required';
        }
        if (!formData.from_date) {
            errors.from_date = 'From Date is required';
        }
        if (!formData.to_date) {
            errors.to_date = 'To Date is required';
        }

        // Validate URL for location_website
        const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/; // Basic URL pattern
        if (formData.location_website && !urlPattern.test(formData.location_website)) {
            errors.location_website = 'Please enter a valid URL';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        // Create a FormData object instead of a plain object
        const dataToSend = new FormData();

        // Append the data to FormData
        dataToSend.append('accommodation_id', accommodation_id);
        dataToSend.append('convention_id', convention_id);
        dataToSend.append('location_name', formData.location_name);
        dataToSend.append('from_date', formData.from_date);
        dataToSend.append('to_date', formData.to_date);
        dataToSend.append('location_address', formData.location_address);
        dataToSend.append('location_website', formData.location_website);
        dataToSend.append('location_phone_number', formData.location_phone_number);

        // Append the image if it exists
        if (formData.location_image) {
            dataToSend.append('location_image', formData.location_image); // image as file
        }

        // Log form data
        // console.log("Form Data Before Submitting:", formData);

        try {
            // console.log("Submitting FormData:", dataToSend); 

            const response = await fetch(`${API_BASE_URL}/user/update_convention_accommodation`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: dataToSend, // Send FormData
            });

            // console.log("Response status:", response.status); // Log response status

            if (!response.ok) {
                const result = await response.json();
                // console.log("Error response:", result); // Log the error response
                toastr.error(result.message || 'Error updating accommodation.'); // Handle error appropriately
                return; // Stop execution on error
            }

            const result = await response.json();
            // console.log("Success response:", result);
            toastr.success('Accommodation Updated successfully!');

            // Clear form fields, image preview, and form errors
            setFormData({
                location_name: '',
                from_date: '',
                to_date: '',
                location_address: '',
                location_website: '',
                location_phone_number: '',
                location_image: null,
            });
            setImagePreview(null);
            setFormErrors({});
            nav(`/accomodation/${convention_id}`);

        } catch (error) {
            // console.error('Error updating accommodation:', error);
            toastr.error('Failed to update accommodation.');
        }
    };


    const handleDeleteImage = async () => {
        try {
            // Call API to delete the event image
            const response = await fetch(`${API_BASE_URL}/user/delete_accommodation_image/${accommodation_id}`, {
                method: 'DELETE', // Assuming DELETE method for removing the image
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
            });

            // Check if the response is ok
            if (!response.ok) {
                const result = await response.json();
                toastr.error(result.message);
            }

            const result = await response.json();
            // Display success message
            // Clear the image from form data and preview
            setFormData(prev => ({ ...prev, event_image: '' }));
            setImagePreview(null); // Clear the preview
            toastr.success(result.message);
            // Optionally handle success (like showing a notification)
            // console.log('Image deleted successfully');
        } catch (error) {
            console.error('Error deleting image:', error);
            // Optionally handle error (like showing a notification)
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
            <div className='bg-black md:px-[2rem] px-[1rem] flex items-center gap-x-4 py-3'>
                <a href='/profile' className='text-white'>Account</a>
                <BsFillCaretDownFill className='text-lightOrange -rotate-90' />
                <a href='/user/convention' className='text-white'>Your conventions</a>
            </div>
            <div className='md:px-[2rem] px-[1rem] bg-darkBlue w-[100vw] pt-3 flex justify-center md:items-center'>
                <form onSubmit={handleSubmit} className='sm:w-[50%] w-[100%] mb-8 h-[48rem] bg-[#0d2539] px-3 py-5 rounded-md mt-6'>
                    <div className='flex justify-center items-center'>
                        <div className='w-[3rem] h-[3rem] rounded-full bg-lightOrange flex justify-center items-center'><img src={convention.convention_logo || ConventionImage} alt="" className='w-[3rem] h-[3rem] rounded-full object-cover' /></div>
                        <div className='w-[3rem] h-[3rem] rounded-full bg-lightOrange flex justify-center items-center'>
                            <FaList className='text-white' />
                        </div>
                    </div>
                    <h1 className='text-3xl mt-3 text-center text-white font-semibold'>Update accommodation</h1>

                    <Input
                        name="location_name"
                        placeholder="Location Name"
                        type="text"
                        value={formData.location_name}
                        onChange={handleChange}
                        className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`}
                    />
                    {formErrors.location_name && <p className="text-red">{formErrors.location_name}</p>}

                    <div className='flex justify-center items-center md:flex-row flex-col mt-2 gap-x-4'>
                        <Select
                            options={dateOptions}
                            onChange={(selectedOption) => handleDateChange([selectedOption], 'from_date')}
                            value={dateOptions.find(option => option.value === formatToConventionDate(formData.from_date))}
                            name="from_date"
                            className="w-[100%] sm:w-[50%] h-[2.3rem] rounded-md text-black mb-4 mt-4 outline-none bg-darkBlue"
                            placeholder="From date"
                        />
                        {formErrors.from_date && <p className="text-red">{formErrors.from_date}</p>}

                        <Select
                            options={filteredToDateOptions}
                            onChange={(selectedOption) => handleDateChange([selectedOption], 'to_date')}
                            value={dateOptions.find(option => option.value === formatToConventionDate(formData.to_date))} // Match converted date
                            name="to_date"
                            className="w-[100%] sm:w-[50%] h-[2.3rem] rounded-md text-black mb-4 mt-4 outline-none bg-darkBlue"
                            placeholder="To date"
                        />

                        {formErrors.to_date && <p className="text-red">{formErrors.to_date}</p>}
                    </div>

                    <Input
                        name="location_address"
                        placeholder="Location Address"
                        type="text"
                        value={formData.location_address}
                        onChange={handleChange}
                        className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`}
                    />
                    {formErrors.location_address && <p className="text-red">{formErrors.location_address}</p>}


                    <Input
                        name="location_website"
                        placeholder="Location Website"
                        type="text"
                        value={formData.location_website}
                        onChange={handleChange}
                        className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`}
                    />
                    {formErrors.location_website && <p className="text-red">{formErrors.location_website}</p>}


                    <Input
                        name="location_phone_number"
                        placeholder="Phone Number"
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        value={formData.location_phone_number}
                        onChange={handleChange}
                        className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`}
                    />

                    <div className='sm:mt-5 mt-2 flex flex-col items-center'>
                        <div className='relative'>
                            <img
                                src={imagePreview || ConventionImage}
                                alt="Preview"
                                className='w-[10rem] h-[10rem] rounded-full object-cover'
                            />
                            {imagePreview || formData.location_image ? (
                                <FaTrash
                                    onClick={handleDeleteImage} // Call delete function on click
                                    className='absolute top-2 right-[4.5rem] text-red cursor-pointer hover:text-lightOrange'
                                />
                            ) : null}
                        </div>
                        <input
                            type="file"
                            id="locationPictureInput"
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg"
                        />
                        <label
                            htmlFor="locationPictureInput"
                            className="w-[8rem] mt-2 h-[2.3rem] text-white border border-[#F77F00] rounded-md flex items-center justify-center cursor-pointer"
                        >
                            Upload Image
                        </label>
                    </div>

                    <div className='flex justify-center items-center mt-4'>
                        <Button type="submit" title={"Update Accommodation"} className={`w-[14rem] h-[2.3rem] rounded-md text-white bg-lightOrange`} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAccommodation;
