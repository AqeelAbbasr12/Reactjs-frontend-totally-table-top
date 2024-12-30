import React, { useState } from 'react'
import img1 from '../../../assets/icon-caret-down.svg';
import Input from '../../../components/Admin/Input/Input';
import ConventionImage from '../../../assets/traditional.png'
import { useNavigate } from 'react-router-dom';
import { MdRemoveRedEye } from "react-icons/md";
import { IoMdEyeOff } from "react-icons/io";
import toastr from 'toastr';
import expo from '../../../assets/Group expo.svg';
import feature from '../../../assets/Group features.svg';
import advert from '../../../assets/Advert.svg';
import { FaSpinner } from 'react-icons/fa'; // For a spinner icon
import Navbar from '../../../components/Admin/Navbar';
import imageCompression from 'browser-image-compression';
import { FaTrash, FaPlus } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Create() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Invisible to users');
    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [dates, setDates] = useState(['']);
    const [imagePreviews, setImagePreviews] = useState([ConventionImage]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState();
    const [formData, setFormData] = useState({
        name: '',          // Convention name
        description: '',   // Convention description
        title: '',      // Convention location
        url: '',       // Convention website
        call_to_action: '',      // Convention location
        type: '',      // Convention location
        expo_logo: null,        // Convention logo (initially null for file)
        promo_logo: null,        // Convention logo (initially null for file)
        feature_logo: null,        // Convention logo (initially null for file)
        advert_logo: null,        // Convention logo (initially null for file)
        feature: 0,         // Feature flag (initially set to 0)
        country: '',
        position_of_announcement: '',
        position_of_picture: ''
    });

    const Announcement_Format = [
        {
            id: 1,
            image: expo,
            name: "Adverts",
            path: "/expo"
        },
        {
            id: 2,
            image: feature,
            name: "Announcement",
            path: "/feature"
        },
        {
            id: 3,
            image: advert,
            name: "Picture",
            path: "/advert"
        },
    ]
    const [activeTab, setActiveTab] = useState('Adverts');
    const onhandletab = (tab) => {
        setActiveTab(tab);
    }
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

    const handleAddLogo = () => {
        if (imagePreviews.length < 15) { // Limit to 4 images
            setImagePreviews([...imagePreviews, null]); // Add a placeholder for the new logo
            setFormData((prevData) => ({
                ...prevData,
                feature_logo: [...(prevData.feature_logo || []), null], // Ensure feature_logo is an array
            }));
        }
    };

    const handleFileChange = async (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const fileSizeInMB = file.size / (1024 * 1024);
            if (fileSizeInMB > 20) {
                toastr.warning('Image size exceeds 20 MB, cannot compress this image.');
                return;
            }

            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 800,
                useWebWorker: true,
                fileType: file.type,
            };

            try {
                let compressedFile = file;
                if (fileSizeInMB > 1) {
                    compressedFile = await imageCompression(file, options);
                }

                const newFile = new File([compressedFile], file.name, {
                    type: file.type,
                    lastModified: Date.now(),
                });

                setFormData((prevData) => {
                    const updatedFeatureLogo = [...(prevData.feature_logo || [])];
                    updatedFeatureLogo[index] = newFile; // Update the specific index
                    return { ...prevData, feature_logo: updatedFeatureLogo };
                });

                const newImagePreviews = [...imagePreviews];
                newImagePreviews[index] = URL.createObjectURL(compressedFile); // Update the specific index
                setImagePreviews(newImagePreviews);
            } catch (error) {
                console.error('Error during image compression:', error);
            }
        }
    };

    const handleFileChangeOther = async (e) => {
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

                // Update the specific logo in formData based on the input name
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: newFile, // Dynamically set the corresponding logo field
                }));

                // Set image preview for the specific logo being uploaded
                setImagePreviews(URL.createObjectURL(newFile));
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

    // Handle deleting an image preview
    const handleDeleteLogo = (index) => {
        const newImagePreviews = [...imagePreviews];
        newImagePreviews.splice(index, 1); // Remove the selected logo preview
        setImagePreviews(newImagePreviews);

        setFormData((prevData) => {
            const updatedFeatureLogo = [...(prevData.feature_logo || [])];
            updatedFeatureLogo.splice(index, 1); // Remove the corresponding file
            return { ...prevData, feature_logo: updatedFeatureLogo };
        });
    };


    const validateForm = () => {
        const errors = {};

        if (!formData.name) {
            toastr.error('Annoucement Name is required');
            errors.name = 'Annoucement Name is required';
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

        setIsLoading(true);

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name); // Convention name
        formDataToSend.append('description', formData.description); // Convention description
        formDataToSend.append('title', formData.title); // Convention title
        formDataToSend.append('url', formData.url); // Convention website
        formDataToSend.append('call_to_action', formData.call_to_action); // Convention call to action
        formDataToSend.append('type', activeTab); // Convention type
        formDataToSend.append('feature', formData.feature || 0); // Feature flag
        formDataToSend.append('country', formData.country); // Feature flag
        formDataToSend.append('position_of_announcement', formData.position_of_announcement); // Feature flag
        formDataToSend.append('position_of_picture', formData.position_of_picture); // Feature flag

        // Append logos if they exist
        if (formData.expo_logo) {
            formDataToSend.append('expo_logo', formData.expo_logo);
        }

        if (formData.promo_logo) {
            formDataToSend.append('promo_logo', formData.promo_logo);
        }

        // Append feature_logo files individually
        if (formData.feature_logo && formData.feature_logo.length > 0) {
            formData.feature_logo.forEach((file, index) => {
                formDataToSend.append(`feature_logo[${index}]`, file);
            });
        }


        if (formData.advert_logo) {
            formDataToSend.append('advert_logo', formData.advert_logo);
        }
        // Log form data for debugging
        // console.log("Submitting form data:", Object.fromEntries(formDataToSend.entries()));


        try {
            const response = await fetch(`${API_BASE_URL}/admin/announcement`, {
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
            toastr.success('Announcement created successfully!');

            // Clear form fields, image preview, and form errors
            // Clear form fields, image preview, and form errors
            setFormData({
                name: '',          // Convention name
                description: '',   // Convention description
                title: '',      // Convention location
                url: '',       // Convention website
                call_to_action: '',      // Convention location
                type: '',      // Convention location
                expo_logo: null,        // Convention logo (initially null for file)
                promo_logo: null,        // Convention logo (initially null for file)
                feature_logo: null,        // Convention logo (initially null for file)
                advert_logo: null,        // Convention logo (initially null for file)
                feature: 0,    // Initialize feature if needed, adjust according to your logic
                country: '',
                position_of_announcement: '',
                position_of_picture: ''
            });
            setImagePreviews(null);
            setFormErrors({});
            navigate(`/admin/announcement`);

        } catch (error) {

            toastr.error('Failed to create convention.');
        } finally {
            setIsLoading(false);
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
                            Add an advert
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
                                    type="submit"
                                    className={`flex justify-center items-center gap-2 text-[26px] leading-[47px] rounded-md text-white px-5 py-3 ${isLoading ? 'bg-lightOrange' : 'bg-lightOrange'
                                        }`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex justify-center items-center gap-2 text-[26px] leading-[47px] bg-[#F77F00] px-5 py-3">
                                            <FaSpinner className="animate-spin" />
                                            Saving...
                                        </div>
                                    ) : (
                                        'Save'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full bg-[#102F47] min-h-screen">

                    <div className="  bg-[#102F47] w-10/12 mx-auto pb-10">
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-10 text-white ">
                            <div className='col-span-8 lg:col-span-8 order-last lg:order-1'>
                                <div className='flex-col bg-[#0D2539] pt-[26px] pb-10'>
                                    <span className='text-xl leading-7 md:text-35 md:leading-63 font-palanquin-dark px-[39px]'>Advert format</span>
                                    <div className='mt-7 mx-[39px]'>
                                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-10">
                                            {
                                                Announcement_Format.map((items, index) => (
                                                    <div className={`bg-[#102F47] h-[212px] flex flex-col  items-center pt-[32px] ${activeTab === items.name ? 'border-2 border-orange-500' : ''}`}
                                                        key={index}
                                                        onClick={() => onhandletab(items.name)}
                                                    >
                                                        <div className='w-auto h-[92px] px-2'>
                                                            {/* md:w-[234px] */}
                                                            <img src={items.image} alt="" className='h-full w-full' />
                                                        </div>
                                                        <div className='mt-5'>
                                                            <span className='text-28 leading-35 tracking-[0.56px] font-mulish'>{items.name}</span>
                                                        </div>

                                                    </div>
                                                ))
                                            }

                                        </div>
                                    </div>

                                </div>
                                {
                                    activeTab === 'Adverts' && (
                                        <div className="w-full bg-[#102F47] mt-10">
                                            <div className="">
                                                <div className=" text-white">
                                                    <div className='bg-[#0D2539] px-[39px] pt-[26px]'>
                                                        <span className='text-2xl md:text-35 md:leading-63 font-palanquin-dark'>Advert Details</span>
                                                        <div className=' mt-[37px] mb-[52px]'>
                                                            {/* mt-[37px] */}
                                                            {formErrors.name && (
                                                                <p className="text-red text-sm sm:text-base mt-1 ml-2">
                                                                    {formErrors.name}
                                                                </p>
                                                            )}
                                                            <Input holder="Name…" name="name" onChange={handleChange} />


                                                            <Input holder="Title....." name="title" onChange={handleChange} />

                                                            <textarea
                                                                name="description"
                                                                className='w-full text-white mb-5 bg-[#102F47] p-4 focus:outline-none resize-none text-sm leading-3 sm:text-xl sm:leading-7 md:text-2xl md:leading-10 lg:text-28 lg:leading-35 tracking-[0.56px]'
                                                                placeholder='Description…'
                                                                rows="5"
                                                                onChange={handleChange}
                                                                style={{ minHeight: '150px' }}
                                                            />
                                                            <Input holder="Call to action text…" name="call_to_action" onChange={handleChange} />

                                                            {formErrors.url && (
                                                                <p className="text-red text-sm sm:text-base mt-1 ml-2">
                                                                    {formErrors.url}
                                                                </p>
                                                            )}
                                                            <Input holder=" URL…" name="url" onChange={handleChange} />
                                                            <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-y-5 pb-10'>
                                                                <div className=' flex flex-col items-center xl:items-start'>
                                                                    <div className='my-[18px] md:my-[38px] w-11/12 bg-[#0D2539] mx-auto flex items-center justify-center lg:justify-start'>
                                                                        <div className='sm:mt-5 mt-2 flex flex-col items-center'>
                                                                            <img
                                                                                src={formData.expo_logo ? URL.createObjectURL(formData.expo_logo) : ConventionImage}
                                                                                alt="Preview"
                                                                                className='w-[10rem] h-[10rem] rounded-full object-cover'
                                                                            />
                                                                            <input
                                                                                type="file"
                                                                                id="expoLogoInput"
                                                                                name='expo_logo'
                                                                                className="hidden"
                                                                                onChange={handleFileChangeOther}
                                                                                accept="image/png, image/jpeg"
                                                                            />
                                                                            <label htmlFor="expoLogoInput" className="w-[12rem] mt-2 h-[2.3rem] text-white border border-[#F77F00] rounded-md flex items-center justify-center cursor-pointer">
                                                                                Upload Adverts Logo
                                                                            </label>
                                                                        </div>
                                                                        {formErrors.logo && (
                                                                            <p className="text-red text-sm sm:text-base mt-1 ml-2 sm:ml-[3rem]">
                                                                                {formErrors.logo}
                                                                            </p>
                                                                        )}
                                                                    </div>

                                                                </div>
                                                                <div className=' flex flex-col items-center xl:items-start'>
                                                                    <div className='my-[18px] md:my-[38px] w-11/12 bg-[#0D2539] mx-auto flex items-center justify-center lg:justify-start'>
                                                                        <div className='sm:mt-5 mt-2 flex flex-col items-center'>
                                                                            <img
                                                                                src={formData.promo_logo ? URL.createObjectURL(formData.promo_logo) : ConventionImage}
                                                                                alt="Preview"
                                                                                className='w-[10rem] h-[10rem] rounded-full object-cover'
                                                                            />
                                                                            <input
                                                                                type="file"
                                                                                id="promoLogoInput"
                                                                                name='promo_logo'
                                                                                className="hidden"
                                                                                onChange={handleFileChangeOther}
                                                                                accept="image/png, image/jpeg"
                                                                            />
                                                                            <label htmlFor="promoLogoInput" className="w-[12rem] mt-2 h-[2.3rem] text-white border border-[#F77F00] rounded-md flex items-center justify-center cursor-pointer">
                                                                                Upload Promo Logo
                                                                            </label>
                                                                        </div>
                                                                        {formErrors.logo && (
                                                                            <p className="text-red text-sm sm:text-base mt-1 ml-2 sm:ml-[3rem]">
                                                                                {formErrors.logo}
                                                                            </p>
                                                                        )}
                                                                    </div>

                                                                </div>

                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    activeTab === 'Announcement' && (
                                        <div className="w-full bg-[#102F47] mt-10 ">
                                            <div className="">
                                                <div className=" text-white">
                                                    <div className='bg-[#0D2539] px-[39px] pt-[26px]'>
                                                        <span className='text-2xl md:text-35 md:leading-63 font-palanquin-dark'>Announcement Details</span>
                                                        <div className=' mt-[37px] mb-[52px] pb-10'>
                                                            {formErrors.name && (
                                                                <p className="text-red text-sm sm:text-base mt-1 ml-2">
                                                                    {formErrors.name}
                                                                </p>
                                                            )}
                                                            <Input holder="Name…" name="name" onChange={handleChange} />
                                                            <Input holder="Title....." name="title" onChange={handleChange} />

                                                            <textarea
                                                                name="description"
                                                                className='w-full text-white mb-5 bg-[#102F47] p-4 focus:outline-none resize-none text-sm leading-3 sm:text-xl sm:leading-7 md:text-2xl md:leading-10 lg:text-28 lg:leading-35 tracking-[0.56px]'
                                                                placeholder='Description…'
                                                                rows="5"
                                                                onChange={handleChange}
                                                                style={{ minHeight: '150px' }}
                                                            />
                                                            <Input holder="URL…" name="url" onChange={handleChange} />
                                                            {/* <select
                                                                name="position_of_announcement"
                                                                className="w-full text-white bg-[#102F47] p-[1.5rem] focus:outline-none"
                                                                onChange={handleChange}
                                                                defaultValue=""
                                                            >
                                                                <option value="" disabled>
                                                                    Select Position
                                                                </option>
                                                                <option value="1st_position">!st Position</option>
                                                                <option value="2nd_position">2nd Position</option>
                                                                <option value="3rd_position">3rd Position</option>
                                                                
                                                            </select> */}
                                                            <div className="flex flex-col items-center">
                                                                <div className="flex flex-wrap justify-center">
                                                                    {imagePreviews.map((imagePreview, index) => (
                                                                        <div key={index} className="flex flex-col items-center relative mb-4 mx-2">
                                                                            <img
                                                                                src={imagePreview || ConventionImage} // Use a default if no preview available
                                                                                alt={`Preview ${index + 1}`}
                                                                                className="w-[10rem] h-[10rem] rounded-full object-cover"
                                                                            />
                                                                            <input
                                                                                type="file"
                                                                                id={`featureLogoInput${index}`}
                                                                                className="hidden"
                                                                                onChange={(event) => handleFileChange(index, event)}
                                                                                accept="image/png, image/jpeg"
                                                                            />
                                                                            <label
                                                                                htmlFor={`featureLogoInput${index}`}
                                                                                className="w-[8rem] mt-2 h-[2.3rem] text-white border border-[#F77F00] rounded-md flex items-center justify-center cursor-pointer"
                                                                            >
                                                                                Upload Logo
                                                                            </label>
                                                                            <FaTrash
                                                                                onClick={() => handleDeleteLogo(index)}
                                                                                className="absolute top-2 right-[4.5rem] text-red cursor-pointer hover:text-lightOrange"
                                                                                size={20}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <FaPlus
                                                                    onClick={handleAddLogo}
                                                                    className="text-white cursor-pointer hover:text-green-500 mt-4"
                                                                    size={30}
                                                                />
                                                            </div>



                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    activeTab === 'Picture' && (
                                        <div className="w-full bg-[#102F47] mt-10">
                                            <div className="">
                                                <div className=" text-white">
                                                    <div className='bg-[#0D2539] px-[39px] pt-[26px]'>
                                                        <span className='text-2xl md:text-35 md:leading-63 font-palanquin-dark'>Picture Details</span>
                                                        <div className=' mt-[37px] mb-[52px]'>
                                                            {formErrors.name && (
                                                                <p className="text-red text-sm sm:text-base mt-1 ml-2">
                                                                    {formErrors.name}
                                                                </p>
                                                            )}
                                                            <Input holder="name…" name="name" onChange={handleChange} />
                                                            <Input holder="URL…" name="url" onChange={handleChange} />
                                                            {/* State Dropdown */}
                                                            {/* <div className="mt-4">
                                                            <select
                                                                name="position_of_picture"
                                                                className="w-full text-white h-12 sm:h-[4.8rem] bg-[#102F47] rounded-md p-3 focus:outline-none"
                                                                onChange={handleChange}
                                                                defaultValue=""
                                                            >
                                                                <option value="" disabled>
                                                                    Select Position
                                                                </option>
                                                                <option value="1st_position">!st Position</option>
                                                                <option value="2nd_position">2nd Position</option>
                                                                <option value="3rd_position">3rd Position</option>
                                                                
                                                            </select>
                                                            </div> */}
                                                            <div className="mt-4">
                                                            <select
                                                                name="country"
                                                                className="w-full text-white h-12 sm:h-[4.8rem] bg-[#102F47] rounded-md p-3 focus:outline-none"
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
                                                                <option value="Thailand">Thailand</option>
                                                                <option value="United Kingdom">United Kingdom</option>
                                                                <option value="USA">USA</option>
                                                                <option value="Uruguay">Uruguay</option>
                                                                <option value="Venezuela">Venezuela</option>
                                                            </select>

                                                            </div>

                                                            {formErrors.country && (
                                                                <p className="text-red text-sm sm:text-base mt-1 ml-2 sm:ml-[3rem]">
                                                                    {formErrors.country}
                                                                </p>
                                                            )}
                                                            <div className='flex flex-col items-center md:items-start pb-10'>

                                                                <div className='my-[18px] md:my-[38px] w-11/12 bg-[#0D2539] mx-auto flex items-center justify-center lg:justify-start'>
                                                                    <div className='sm:mt-5 mt-2 flex flex-col items-center'>
                                                                        <img
                                                                            src={formData.advert_logo ? URL.createObjectURL(formData.advert_logo) : ConventionImage}
                                                                            alt="Preview"
                                                                            className='w-[10rem] h-[10rem] rounded-full mb-2'
                                                                        />
                                                                        <input
                                                                            type="file"
                                                                            id="advertLogoInput"
                                                                            name='advert_logo'
                                                                            className="hidden"
                                                                            onChange={handleFileChangeOther}
                                                                            accept="image/png, image/jpeg"
                                                                        />
                                                                        <label htmlFor="advertLogoInput" className="w-[12rem] mt-2 h-[2.3rem] text-white border border-[#F77F00] rounded-md flex items-center justify-center cursor-pointer">
                                                                            Upload Picture
                                                                        </label>
                                                                    </div>
                                                                    {formErrors.logo && (
                                                                        <p className="text-red text-sm sm:text-base mt-1 ml-2 sm:ml-[3rem]">
                                                                            {formErrors.logo}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }

                            </div>

                            <div className='lg:col-span-4 col-span-8 bg-[#102F47] order-1 lg:order-last'>

                            </div>
                        </div>
                    </div>
                </div>


            </form>
        </div>
    )
}

export default Create;