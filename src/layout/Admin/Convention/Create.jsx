import React, { useState } from 'react'
import img1 from '../../../assets/icon-caret-down.svg';
import Input from '../../../components/Admin/Input/Input';
import ConventionImage from '../../../assets/traditional.png'
import { useNavigate } from 'react-router-dom';
import { MdRemoveRedEye } from "react-icons/md";
import { IoMdEyeOff } from "react-icons/io";
import toastr from 'toastr';
import { FaTrash } from 'react-icons/fa';
import Navbar from '../../../components/Admin/Navbar';
import imageCompression from 'browser-image-compression';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Create() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Invisible to users');
     // Toggle private state
    const [formErrors, setFormErrors] = useState({});
    const [dates, setDates] = useState(['']);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        website: '',
        state: '',
        fb_url: '',
        ig_url: '',
        logo: null,
        dates: [],
        feature: 0,
        is_private: false,
        password: '',
    });

    const [showPasswords, setShowPasswords] = useState({
        password: false,

    });
    const togglePasswordVisibility = (field) => {
        setShowPasswords((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };


    const addDateField = () => {
        setDates([...dates, '']); // Add an empty string to the dates array
    };
    const handleDateChange = (index, event) => {
        const newDates = [...dates];
        newDates[index] = event.target.value; // Get the new date value
        setDates(newDates); // Update the local dates state

        // Update formData with the new dates
        setFormData((prevData) => ({
            ...prevData,
            dates: newDates, // Store dates as an array
        }));

        // console.log("Updated Form Data:", newDates); // Debugging
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsDropdownOpen(false);
    };


    const today = new Date().toISOString().split('T')[0];

    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        if (file) {
            // Check file size (20 MB limit)
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

                // Update the formData and image preview with the new compressed file
                setFormData((prevData) => ({
                    ...prevData,
                    logo: newFile, // Set the compressed file as the logo
                }));
                setImagePreview(URL.createObjectURL(newFile)); // Set the preview with the compressed file URL
            } catch (error) {
                console.error('Error during image compression:', error);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value, // Handle checkbox values
        }));
    };

    const handleDeleteDate = (index) => {
        if (dates.length > 1) {
            const newDates = [...dates];
            newDates.splice(index, 1); // Remove the date at the specified index
            setDates(newDates);

            // Update formData with the new dates array
            setFormData((prevData) => ({
                ...prevData,
                dates: newDates,
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name) {
            toastr.error('Convention Name is required');
            errors.name = 'Convention Name is required';
        }

        if (!formData.description) {
            toastr.error('Convention Description is required');
            errors.description = 'Convention Description is required';
        }



        if (!formData.state) {
            toastr.error('Convention State is required');
            errors.state = 'Convention State is required';
        }

        // Validate URL for website
        const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/; // Basic URL pattern
        if (formData.website && !urlPattern.test(formData.website)) {
            toastr.error('Please enter a valid URL');
            errors.website = 'Please enter a valid URL';
        }

        if (!formData.dates || formData.dates.length === 0 || !formData.dates.some(date => date)) {
            errors.dates = 'At least one Convention Date is required';
            toastr.error('At least one Convention Date is required');
        }

        if (formData.is_private) {
            if (!formData.password) {
                toastr.error('Password is required for private conventions');
                errors.password = 'Password is required for private conventions';
            } else if (formData.password.length < 6) {
                toastr.error('Password must be at least 6 characters long');
                errors.password = 'Password must be at least 6 characters long';
            }
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
        formDataToSend.append('description', formData.description); // Changed from location_address to description
        formDataToSend.append('location', formData.location); // Changed from location_address to location
        formDataToSend.append('website', formData.website); // Changed from location_website to website
        formDataToSend.append('state', formData.state); // Changed from location_website to website
        formDataToSend.append('fb_url', formData.fb_url); // Changed from location_website to website
        formDataToSend.append('ig_url', formData.ig_url); // Changed from location_website to website
        // Handle private and password fields
        formDataToSend.append('is_private', formData.is_private ? 1 : 0);
        if (formData.is_private && formData.password) {
            formDataToSend.append('password', formData.password);
        }
        // Since the original fields didn't have 'from_date' and 'to_date', you may want to send the dates as a single array
        formDataToSend.append('date', formData.dates); // Send date array as a JSON string
        formDataToSend.append('feature', formData.feature || 0); // Assuming you have a feature field

        if (formData.logo) { // Assuming 'logo' corresponds to the location_image in your new structure
            formDataToSend.append('logo', formData.logo);
        }

        // console.log("Submitting form data:", Object.fromEntries(formDataToSend.entries())); // Log form data


        try {
            const response = await fetch(`${API_BASE_URL}/admin/convention`, {
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
            toastr.success('Convnetion created successfully!');

            // Clear form fields, image preview, and form errors
            setFormData({
                name: '', // Changed from location_name to name
                description: '', // Changed from location_address to description
                location: '', // Changed from location_address to location
                website: '', // Changed from location_website to website
                state: '', // Changed from location_website to website
                fb_url: '', // Changed from location_website to website
                ig_url: '', // Changed from location_website to website
                logo: null, // Changed from location_image to logo
                dates: [], // Initialize as an empty array
                feature: 0, // Initialize feature if needed, adjust according to your logic
                is_private: false,
                password: '',
            });
            setImagePreview(null);
            setFormErrors({});

            navigate(`/admin/conventions`);

        } catch (error) {
            // console.error('Error creating convention:', error);
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
                            Add Convention
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
                                {/* Convention Name */}
                                <div className='my-[18px] md:my-[38px] w-11/12 bg-[#102F47] mx-auto h-12 sm:h-73 flex items-center'>
                                    <Input holder='Convention name…' name="name" onChange={handleChange} />
                                </div>
                                {formErrors.name && (
                                    <p className="text-red text-sm sm:text-base mt-1 ml-2 sm:ml-[3rem]">
                                        {formErrors.name}
                                    </p>
                                )}

                                {/* Convention Description */}
                                <div className='my-[18px] md:my-[38px] w-11/12 bg-[#102F47] mx-auto flex items-center mt-3 sm:mt-[38px]'>
                                    <textarea
                                        name="description"
                                        className='w-full text-white bg-[#102F47] p-4 focus:outline-none resize-none text-sm leading-3 sm:text-xl sm:leading-7 md:text-2xl md:leading-10 lg:text-28 lg:leading-35 tracking-[0.56px]'
                                        placeholder='Convention description…'
                                        rows="5"
                                        onChange={handleChange}
                                        style={{ minHeight: '150px' }}
                                    />
                                </div>
                                {formErrors.description && (
                                    <p className="text-red text-sm sm:text-base mt-1 ml-2 sm:ml-[3rem]">
                                        {formErrors.description}
                                    </p>
                                )}

                                {/* Convention Location */}
                                <div className='my-[18px] md:my-[38px] w-11/12 bg-[#102F47] mx-auto h-12 sm:h-73 flex items-center mt-3 sm:mt-[38px]'>
                                    <Input holder='Convention location…' name="location" onChange={handleChange} />
                                </div>
                                {formErrors.location && (
                                    <p className="text-red text-sm sm:text-base mt-1 ml-2 sm:ml-[3rem]">
                                        {formErrors.location}
                                    </p>
                                )}
                                
                                {/* Convention Website */}
                                <div className='my-[18px] md:my-[38px] w-11/12 bg-[#102F47] mx-auto h-12 sm:h-73 flex items-center mt-3 sm:mt-[38px]'>
                                    <Input holder='Convention website… e.g. https://www.totallytabletop.com' name="website" onChange={handleChange} />
                                </div>
                                {formErrors.website && (
                                    <p className="text-red text-sm sm:text-base mt-1 ml-2 sm:ml-[3rem]">
                                        {formErrors.website}
                                    </p>
                                )}

                                <div className='my-[18px] md:my-[38px] w-11/12 bg-[#102F47] mx-auto h-12 sm:h-73 flex items-center mt-3 sm:mt-[38px]'>
                                    <Input holder='FB URL e.g. https://www.facebook.com/' name="fb_url" onChange={handleChange} />
                                </div>
                                {formErrors.fb_url && (
                                    <p className="text-red text-sm sm:text-base mt-1 ml-2 sm:ml-[3rem]">
                                        {formErrors.fb_url}
                                    </p>
                                )}

                                <div className='my-[18px] md:my-[38px] w-11/12 bg-[#102F47] mx-auto h-12 sm:h-73 flex items-center mt-3 sm:mt-[38px]'>
                                    <Input holder='IG URL e.g. https://www.instagram.com/' name="ig_url" onChange={handleChange} />
                                </div>
                                {formErrors.ig_url && (
                                    <p className="text-red text-sm sm:text-base mt-1 ml-2 sm:ml-[3rem]">
                                        {formErrors.ig_url}
                                    </p>
                                )}

                                {/* State Dropdown */}
                                <div className="my-[18px] md:my-[38px] w-11/12 bg-[#102F47] mx-auto h-12 sm:h-73 flex items-center mt-3 sm:mt-[38px]">
                                    <select
                                        name="state"
                                        className="w-full text-white bg-[#102F47] p-[1.5rem] focus:outline-none"
                                        onChange={handleChange}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            Select a Country
                                        </option>
                                        <option value="Argentina">Argentina</option>
                                        <option value="Australia">Australia</option>
                                        <option value="Austria">Austria</option>
                                        <option value="Belgium">Belgium</option>
                                        <option value="Brazil">Brazil</option>
                                        <option value="Bulgaria">Bulgaria</option>
                                        <option value="Canada">Canada</option>
                                        <option value="Chile">Chile</option>
                                        <option value="Colombia">Colombia</option>
                                        <option value="Croatia">Croatia</option>
                                        <option value="Cyprus">Cyprus</option>
                                        <option value="Czech Republic">Czech Republic</option>
                                        <option value="Denmark">Denmark</option>
                                        <option value="Estonia">Estonia</option>
                                        <option value="Finland">Finland</option>
                                        <option value="France">France</option>
                                        <option value="Germany">Germany</option>
                                        <option value="Greece">Greece</option>
                                        <option value="Hungary">Hungary</option>
                                        <option value="Iceland">Iceland</option>
                                        <option value="Ireland">Ireland</option>
                                        <option value="Italy">Italy</option>
                                        <option value="India">India</option>
                                        <option value="Japan">Japan</option>
                                        <option value="Latvia">Latvia</option>
                                        <option value="Lithuania">Lithuania</option>
                                        <option value="Luxembourg">Luxembourg</option>
                                        <option value="Malta">Malta</option>
                                        <option value="Mexico">Mexico</option>
                                        <option value="Netherlands">Netherlands</option>
                                        <option value="Norway">Norway</option>
                                        <option value="Peru">Peru</option>
                                        <option value="Poland">Poland</option>
                                        <option value="Portugal">Portugal</option>
                                        <option value="Romania">Romania</option>
                                        <option value="Slovakia">Slovakia</option>
                                        <option value="Slovenia">Slovenia</option>
                                        <option value="Spain">Spain</option>
                                        <option value="Sweden">Sweden</option>
                                        <option value="Switzerland">Switzerland</option>
                                        <option value="South Korea">South Korea</option>
                                        <option value="Thailand">Thailand</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="USA">USA</option>
                                        <option value="Uruguay">Uruguay</option>
                                        <option value="Venezuela">Venezuela</option>
                                    </select>
                                </div>


                                {formErrors.state && (
                                    <p className="text-red text-sm sm:text-base mt-1 ml-2 sm:ml-[3rem]">
                                        {formErrors.state}
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
                                            name='logo'
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
                            <div className='xl:col-span-4 col-span-8'>
                                <div className='bg-[#0D2539] w-full'>
                                    <div className='w-10/12 mx-auto py-[26px] flex-col justify-start items-center'>
                                        <div>
                                            <span className='text-xl leading-10 sm:text-28 sm:leading-35 tracking-[0.56px]'>
                                                Convention dates
                                            </span>
                                        </div>
                                        {formErrors.dates && (
                                            <p className="text-red text-sm sm:text-base mt-1 ml-2 sm:ml-[3rem]">
                                                {formErrors.dates}
                                            </p>
                                        )}
                                        <div>
                                            {dates.map((date, index) => (
                                                <div key={index} className='flex items-center mt-3'>
                                                    {/* Date Input */}
                                                    <Input
                                                        name={`date-${index}`} // Unique name for each date input
                                                        type="date"
                                                        min={today}
                                                        value={date} // Bind the date value
                                                        onChange={(event) => handleDateChange(index, event)} // Handle date change
                                                        className="w-[90%] px-3 py-2 border border-[#707070] bg-[#102F47] text-white"
                                                    />
                                                    {/* Delete Button */}
                                                    {dates.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteDate(index)}
                                                            className="ml-3 text-red-600"
                                                            title="Delete this date"
                                                        >
                                                            <FaTrash className='text-red' size={20} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            {/* Add another date button */}
                                            <div className='mt-5 flex justify-start'>
                                                <button
                                                    type="button"
                                                    className='w-[26rem] mt-2 h-[2.3rem] text-white border border-[#F77F00] rounded-md flex items-center justify-center cursor-pointer'
                                                    onClick={addDateField}
                                                >
                                                    Add another date
                                                </button>
                                            </div>
                                        </div>
                                        {/*  */}
                                        {/* Private Toggle */}
                                        <div className="mt-6 flex items-center gap-4">
                                            <span className="text-lg leading-10 md:text-28 md:leading-35 tracking-[0.56px]">Private</span>
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="is_private"
                                                    checked={formData.is_private} // Bind to formData
                                                    onChange={handleChange} // Use the same handleChange function
                                                    className="hidden"
                                                />
                                                <span
                                                    className={`relative inline-flex items-center h-[36px] rounded-full w-[54px] transition-colors duration-300 ease-in-out ${formData.is_private ? 'bg-[#F77F00]' : 'bg-gray-400'}`}
                                                >
                                                    <span
                                                        className={`inline-block w-5 h-5 transform rounded-full transition-transform duration-300 ease-in-out ${formData.is_private ? 'bg-white translate-x-6' : 'bg-blue-600 translate-x-2'}`}
                                                    ></span>
                                                </span>
                                            </label>
                                        </div>


                                        {formData.is_private && (
                                            <div className="mt-4 relative">
                                                <Input
                                                    type={showPasswords.password ? "text" : "password"}
                                                    name="password"
                                                    holder="Enter password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-[#707070] bg-[#102F47] text-white"
                                                />
                                                <span
                                                    className="absolute top-[40%] right-3 transform -translate-y-[50%] cursor-pointer text-[#F77F00]"
                                                    onClick={() => togglePasswordVisibility("password")}
                                                >
                                                    {showPasswords.password ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                                </span>

                                            </div>
                                        )}

                                        {formErrors.password && (
                                            <p className="text-red text-sm sm:text-base mt-1 ml-2 sm:ml-[3rem]">
                                                {formErrors.password}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </form>
        </div>
    )
}

export default Create;