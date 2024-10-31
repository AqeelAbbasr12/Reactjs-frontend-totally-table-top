import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { FaList } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { BsFillCaretDownFill } from 'react-icons/bs';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { fetchWithAuth } from '../../services/apiService';
import ConventionImage from '../../assets/convention.jpeg'
import toastr from 'toastr';
import imageCompression from 'browser-image-compression';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CreateAccommodation = () => {
    const nav = useNavigate();
    const { convention_id } = useParams();
    const [loading, setLoading] = useState();
    // console.log(convention_id);
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

    const [formErrors, setFormErrors] = useState({}); // State for form errors

    // Calculate today's date in YYYY-MM-DD format
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
    
        // Validate the form before submitting
        if (!validateForm()) {
            return;
        }
    
        const formDataToSend = new FormData();
        formDataToSend.append('convention_id', convention_id);
        formDataToSend.append('location_name', formData.location_name);
        formDataToSend.append('from_date', formData.from_date);
        formDataToSend.append('to_date', formData.to_date);
        formDataToSend.append('location_address', formData.location_address);
        formDataToSend.append('location_website', formData.location_website);
        formDataToSend.append('location_phone_number', formData.location_phone_number);
        
        if (formData.location_image) {
            formDataToSend.append('location_image', formData.location_image);
        }
    
        // console.log("Submitting form data:", Object.fromEntries(formDataToSend.entries())); // Log form data
    
        try {
            const response = await fetch(`${API_BASE_URL}/user/convention_accommodation`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: formDataToSend,
            });
    
            // console.log('Form data submitted:', formData);
            
            if (!response.ok) {
                const result = await response.json();
                // console.log("Error response:", result); // Log the error response
                if (result.errors) {
                    setFormErrors(result.errors);
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const result = await response.json();
            // console.log("Success response:", result); // Log the success response
            toastr.success('Accommodation created successfully!');
    
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
            // console.error('Error creating accommodation:', error);
            toastr.error('Failed to create accommodation.');
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

            <div className='md:px-[2rem] px-[1rem] bg-darkBlue md:h-[86vh] w-[100vw] pt-3 flex justify-center md:items-center'>
                <form onSubmit={handleSubmit} className='sm:w-[50%] w-[100%] h-[48rem] bg-[#0d2539] px-3 py-5 rounded-md mt-6'>
                    <div className='flex justify-center items-center'>
                        <div className='w-[3rem] h-[3rem] rounded-full bg-lightOrange flex justify-center items-center'>UKGE</div>
                        <div className='w-[3rem] h-[3rem] rounded-full bg-lightOrange flex justify-center items-center'><FaList className='text-white' /></div>
                    </div>
                    <h1 className='text-3xl mt-3 text-center text-white font-semibold'>Add new accommodation</h1>

                    <Input 
                        name="location_name" 
                        placeholder="Location Name" 
                        type="text" 
                        onChange={handleChange} 
                        className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`} 
                    />
                    {formErrors.location_name && <p className="text-red">{formErrors.location_name}</p>}

                    <div className='flex justify-center items-center md:flex-row flex-col mt-2 gap-x-4'>
                        <Input
                            name="from_date"
                            placeholder="Date From"
                            type="date"
                            min={today} // Disable dates before today
                            onChange={handleChange}
                            className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 outline-none bg-darkBlue`}
                        />
                        {formErrors.from_date && <p className="text-red">{formErrors.from_date}</p>}

                        <Input
                            name="to_date"
                            placeholder="Date To"
                            type="date"
                            min={formData.from_date || today} // Disable dates before the selected "From Date"
                            onChange={handleChange}
                            className={`w-[100%] md:mt-0 h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`}
                        />
                        {formErrors.to_date && <p className="text-red">{formErrors.to_date}</p>}
                    </div>

                    <Input 
                        name="location_address" 
                        placeholder="Location Address" 
                        type="text" 
                        onChange={handleChange} 
                        className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`} 
                    />

                    <Input 
                        name="location_website" 
                        placeholder="Location Website" 
                        type="text" 
                        onChange={handleChange} 
                        className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`} 
                    />
                    {formErrors.location_website && <p className="text-red">{formErrors.location_website}</p>}
                    <Input 
                        name="location_phone_number" 
                        placeholder="Location Phone Number" 
                        type="number" 
                        onChange={handleChange} 
                        className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`} 
                    />

                    <div className='sm:mt-5 mt-2 flex flex-col items-center'>
                        
                            <img
                                src={imagePreview || ConventionImage}
                                alt="Preview"
                                className='w-[10rem] h-[10rem] rounded-full object-cover'
                            />
                        
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

export default CreateAccommodation;
