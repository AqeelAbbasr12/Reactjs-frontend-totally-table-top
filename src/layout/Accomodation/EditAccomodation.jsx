import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { FaList } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { BsFillCaretDownFill } from 'react-icons/bs';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { fetchWithAuth } from '../../services/apiService';
import toastr from 'toastr';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditAccommodation = () => {
    const nav = useNavigate();
    const [loading, setLoading] = useState(true);
    const { accommodation_id, convention_id } = useParams();

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
    }, [accommodation_id]);

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
            console.log(data);

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
            console.error('Error fetching accommodation data:', error);
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
    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Get the first selected file
        if (file) {
            setFormData({ ...formData, location_image: file }); // Update the state with the selected file
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Set image preview if needed
            };
            reader.readAsDataURL(file); // Read the file as a data URL
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
        console.log("Form Data Before Submitting:", formData);
    
        try {
            console.log("Submitting FormData:", dataToSend); // Log FormData for debugging
    
            const response = await fetch(`${API_BASE_URL}/user/update_convention_accommodation`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: dataToSend, // Send FormData
            });
    
            console.log("Response status:", response.status); // Log response status
    
            if (!response.ok) {
                const result = await response.json();
                console.log("Error response:", result); // Log the error response
                toastr.error(result.message || 'Error updating accommodation.'); // Handle error appropriately
                return; // Stop execution on error
            }
    
            const result = await response.json();
            console.log("Success response:", result); // Log the success response
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
            console.error('Error updating accommodation:', error);
            toastr.error('Failed to update accommodation.');
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
                <span className='text-white'>Account</span>
                <BsFillCaretDownFill className='text-lightOrange -rotate-90' />
                <span className='text-white'>Your conventions</span>
            </div>
            <div className='md:px-[2rem] px-[1rem] bg-darkBlue h-[86vh] w-[100vw] pt-3 flex justify-center items-center'>
                <form onSubmit={handleSubmit} className='sm:w-[50%] w-[100%] bg-[#0d2539] px-3 py-5 rounded-md mt-6'>
                    <div className='flex justify-center items-center'>
                        <div className='w-[3rem] h-[3rem] rounded-full bg-lightOrange flex justify-center items-center'>UKGE</div>
                        <div className='w-[3rem] h-[3rem] rounded-full bg-lightOrange flex justify-center items-center'>
                            <FaList className='text-white' />
                        </div>
                    </div>
                    <h1 className='text-3xl mt-3 text-center text-white font-semibold'>Edit accommodation</h1>

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
                        <Input
                            name="from_date"
                            placeholder="Date From"
                            type="date"
                            value={formData.from_date}
                            min={today}
                            onChange={handleChange}
                            className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 outline-none bg-darkBlue`}
                        />
                        {formErrors.from_date && <p className="text-red">{formErrors.from_date}</p>}

                        <Input
                            name="to_date"
                            placeholder="Date To"
                            type="date"
                            value={formData.to_date}
                            min={formData.from_date || today}
                            onChange={handleChange}
                            className={`w-[100%] md:mt-0 h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`}
                        />
                        {formErrors.to_date && <p className="text-red">{formErrors.to_date}</p>}
                    </div>

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
                        value={formData.location_phone_number}
                        onChange={handleChange}
                        className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`}
                    />

                    <div className='sm:mt-5 mt-2 flex flex-col items-center'>
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className='w-[10rem] h-[10rem] rounded-full mb-2'
                        />
                        )}
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
                        <Button type="submit" title={"Save Accommodation"} className={`w-[12rem] h-[2.3rem] rounded-md text-white bg-lightOrange`} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAccommodation;
