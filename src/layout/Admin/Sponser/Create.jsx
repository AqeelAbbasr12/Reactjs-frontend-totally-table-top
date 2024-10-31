import React, { useState } from 'react'
import img1 from '../../../assets/icon-caret-down.svg';
import Input from '../../../components/Admin/Input/Input';
import ConventionImage from '../../../assets/convention.jpeg'
import { useNavigate } from 'react-router-dom';
import { MdRemoveRedEye } from "react-icons/md";
import { IoMdEyeOff } from "react-icons/io";
import toastr from 'toastr';
import Navbar from '../../../components/Admin/Navbar';
import imageCompression from 'browser-image-compression';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Create() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Invisible to users');
    const [formErrors, setFormErrors] = useState({});
    const [dates, setDates] = useState(['']);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState();
    const [formData, setFormData] = useState({
        name: '',          // Convention name

        url: '',       // Convention website
        promo_logo: null,        // Convention logo (initially null for file)

        feature: 0         // Feature flag (initially set to 0)
    });

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };


    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsDropdownOpen(false);
    };


    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const { name } = e.target; // Get the input's name
    
        if (file) {
            // Check file size (20 MB limit)
            const fileSizeInMB = file.size / (1024 * 1024);
            if (fileSizeInMB > 20) {
                toastr.warning('Image size exceeds 20 MB, cannot compress this image.');
                return;
            }
    
            // Compression options
            const options = {
                maxSizeMB: 1, // 1 MB limit for compression
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
    
                // Update formData with the promo_logo
                setFormData((prevData) => ({
                    ...prevData,
                    promo_logo: newFile, // Set promo_logo in formData
                }));
    
                // Set image preview for the promo_logo being uploaded
                setImagePreview(URL.createObjectURL(newFile));
            } catch (error) {
                console.error('Error during image compression:', error);
            }
        }
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        // console.log(`Input Name: ${name}, Input Value: ${value}`); // Log the input name and value
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name) {
            toastr.error('Sponser Name is required');
            errors.name = 'Sponser Name is required';
        }

        // Validate URL for website
        const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/; // Basic URL pattern
        if (formData.url && !urlPattern.test(formData.url)) {
            toastr.error('Please enter a valid URL');
            errors.url = 'Please enter a valid URL';
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
        formDataToSend.append('name', formData.name); // Changed from location_name to name
           formDataToSend.append('url', formData.url); // Changed from location_website to website

        // Since the original fields didn't have 'from_date' and 'to_date', you may want to send the dates as a single array
        formDataToSend.append('feature', formData.feature || 0); // Assuming you have a feature field

        if (formData.promo_logo) { // Assuming 'logo' corresponds to the location_image in your new structure
            formDataToSend.append('promo_logo', formData.promo_logo);
        }

        // console.log("Submitting form data:", Object.fromEntries(formDataToSend.entries())); // Log form data


        try {
            const response = await fetch(`${API_BASE_URL}/admin/sponser`, {
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
            toastr.success('sponser created successfully!');

            // Clear form fields, image preview, and form errors
            // Clear form fields, image preview, and form errors
            setFormData({
                name: '', // Changed from location_name to name
                               website: '', // Changed from location_website to website
                               promo_logo: null, // Changed from location_image to logo
              
                feature: 0, // Initialize feature if needed, adjust according to your logic
            });
            setImagePreview(null);
            setFormErrors({});

            navigate(`/admin/sponser`);

        } catch (error) {
            console.error('Error creating convention:', error);
            toastr.error('Failed to create convention.');
        }
    };

    return (
        <div className="bg-[#102F47] w-full opacity-100 min-h-screen">
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
                </div>
            )}
            <Navbar />
            <form onSubmit={handleSubmit}>
                <div className='w-10/12 mx-auto pt-[10rem] md:pt-40 text-white py-8'>
                    <div className="grid grid-cols-1 2xl:grid-cols-2 items-center justify-between gap-x-10">
                        {/* Title */}
                        <p className='text-[29px] sm:text-3xl md:text-6xl leading-35 md:leading-[108px] font-palanquin-dark'>
                            Add Sponser
                        </p>

                        {/* Sort by + Status Label + Dropdown + Save Button */}
                        <div className='flex flex-col lg:flex-row col-span-1 2xl:justify-self-end gap-x-6 gap-y-4 lg:justify-start'>

                            {/* Status Label */}
                            <div className='h-20 pt-6'>
                                <label className='text-xl leading-7 md:text-[28px] md:leading-35 tracking-[0.56px] text-[#F2F0EF] font-mulish'>
                                    Status:
                                </label>
                            </div>

                            {/* Dropdown Button */}
                            <div className='w-full lg:w-[460px]'>
                                <button
                                    type='button'
                                    className='w-full h-full lg:w-[460px] lg:h-[73px] border-b-2 border-[#707070] text-xl sm:text-[28px] sm:leading-35 tracking-[0.56px] py-4 px-3 flex items-center justify-between bg-[#0D2539]'
                                    onClick={toggleDropdown}
                                >
                                    <div className='flex gap-8 items-center'>
                                        {selectedOption === 'Published' ? <MdRemoveRedEye className='text-yellow-500' /> : <IoMdEyeOff />}
                                        <p>{selectedOption}</p>
                                    </div>
                                    <img src={img1} alt="" />
                                </button>

                                {/* Dropdown content */}
                                <div className='relative'>
                                    {isDropdownOpen && (
                                        <div className='absolute w-full mt-2 bg-[#102F47] border border-gray-300 shadow-lg text-white text-sm md:text-[28px] md:leading-35 tracking-[0.56px]'>
                                            <ul>
                                                <li className='p-2 hover:bg-gray-100 cursor-pointer hover:text-black' onClick={() => handleOptionClick('Published')}>
                                                    <div className='flex items-center gap-8'>
                                                        <MdRemoveRedEye className='text-yellow-500' />
                                                        <span>Published</span>
                                                    </div>
                                                </li>
                                                <li className='p-2 hover:bg-gray-100 cursor-pointer hover:text-black' onClick={() => handleOptionClick('Invisible to users')}>
                                                    <div className='flex items-center gap-8'>
                                                        <IoMdEyeOff />
                                                        <p>Invisible to users</p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className='w-full lg:w-[197px]'>
                                <button
                                    type='submit'
                                    className='w-full h-full lg:w-[197px] lg:h-[73px] text-[26px] leading-[47px] bg-[#F77F00] px-5 py-3'
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full bg-[#102F47] min-h-full">
                    <div className="w-10/12 mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-7 text-white pb-40 text-28 leading-35 tracking-[0.56px] font-mulish">
                            {/* Form Section */}
                            <div className='bg-[#0D2539] col-span-8'>
                                {/* Sponser Name */}
                                <div className='my-[18px] md:my-[38px] w-11/12 bg-[#102F47] mx-auto h-12 sm:h-73 flex items-center'>
                                    <Input holder='Sponser name…' name="name" onChange={handleChange} />
                                </div>
                                {formErrors.name && (
                                    <p className="text-red text-sm sm:text-base mt-1 ml-2 sm:ml-[3rem]">
                                        {formErrors.name}
                                    </p>
                                )}




                                {/* Convention Website */}
                                <div className='my-[18px] md:my-[38px] w-11/12 bg-[#102F47] mx-auto h-12 sm:h-73 flex items-center mt-3 sm:mt-[38px]'>
                                    <Input holder='URL.. e.g. https://www.totallytabletop.com' name="url" onChange={handleChange} />
                                </div>
                                {formErrors.url && (
                                    <p className="text-red text-sm sm:text-base mt-1 ml-2 sm:ml-[3rem]">
                                        {formErrors.url}
                                    </p>
                                )}

                                {/* Image Upload */}
                                <div className='my-[18px] md:my-[38px] w-11/12 bg-[#0D2539] mx-auto flex items-center justify-center lg:justify-start'>
                                    <div className='sm:mt-5 mt-2 flex flex-col items-center'>
                                        <img
                                            src={imagePreview || ConventionImage}
                                            alt="Preview"
                                            className='w-[10rem] h-[10rem] rounded-full object-cover'
                                        />
                                        <input
                                            type="file"
                                            id="locationPictureInput"
                                            name='promo_logo'
                                            className="hidden"
                                            onChange={handleFileChange}
                                            accept="image/png, image/jpeg"
                                        />
                                        <label htmlFor="locationPictureInput" className="w-[8rem] mt-2 h-[2.3rem] text-white border border-[#F77F00] rounded-md flex items-center justify-center cursor-pointer">
                                            Upload Logo
                                        </label>
                                    </div>
                                    {formErrors.logo && (
                                        <p className="text-red text-sm sm:text-base mt-1 ml-2 sm:ml-[3rem]">
                                            {formErrors.logo}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Dates Section */}

                        </div>
                    </div>
                </div>


            </form>
        </div>
    )
}

export default Create;