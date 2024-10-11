import React, { useState, useEffect } from 'react'
import img1 from '../../../assets/icon-caret-down.svg';
import Input from '../../../components/Admin/Input/Input';
import ConventionImage from '../../../assets/convention.jpeg'
import { useNavigate, useParams } from 'react-router-dom';
import { MdRemoveRedEye } from "react-icons/md";
import { IoMdEyeOff } from "react-icons/io";
import toastr from 'toastr';
import expo from '../../../assets/Group expo.svg';
import feature from '../../../assets/Group features.svg';
import advert from '../../../assets/Advert.svg';
import Navbar from '../../../components/Admin/Navbar';
import { fetchWithAuth } from '../../../services/apiService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Edit() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Invisible to users');
    const [formErrors, setFormErrors] = useState({});
    const [dates, setDates] = useState(['']);
    const [imagePreview, setImagePreview] = useState(null);
    const { announcement_id } = useParams();
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
        feature: 0         // Feature flag (initially set to 0)
    });

    const Announcement_Format = [
        {
            id: 1,
            image: expo,
            name: "Expo",
            path: "/expo"
        },
        {
            id: 2,
            image: feature,
            name: "Feature",
            path: "/feature"
        },
        {
            id: 3,
            image: advert,
            name: "Advert",
            path: "/advert"
        },
    ]

    useEffect(() => {
        fetchAnnouncement(announcement_id);
    }, [announcement_id]);

    const [activeTab, setActiveTab] = useState(null);
    const onhandletab = (tab) => {
        setActiveTab(tab);
    }
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };


    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsDropdownOpen(false);
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const { name } = e.target; // Get the input's name

        // Update the specific logo in formData based on the input name
        setFormData((prevData) => ({
            ...prevData,
            [name]: file, // Dynamically set the corresponding logo
        }));

        // Set image preview for the specific logo being uploaded
        setImagePreview(URL.createObjectURL(file));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // console.log(`Input Name: ${name}, Input Value: ${value}`); // Log the input name and value
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleToggle = () => {
        // Toggle the feature state in formData between "0" and "1"
        setFormData(prevState => ({
            ...prevState,
            feature: prevState.feature === "0" ? "1" : "0", // Update the feature state
        }));
    };
    const fetchAnnouncement = async (announcement_id) => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/admin/announcement/${announcement_id}`, {
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

            console.log(data);

            setFormData({
                name: data.name,          // Convention name
                description: data.description,   // Convention description
                title: data.title,      // Convention location
                url: data.url,       // Convention website
                call_to_action: data.call_to_action,      // Convention location
                type: data,      // Convention location 
                feature: data.feature,
                expo_logo: data.expo_logo || null,   // Expo logo
                feature_logo: data.feature_logo || null, // Feature logo
                advert_logo: data.advert_logo || null,   // Advert logo     // Feature flag (initially set to 0)
                promo_logo: data.promo_logo || null,
            });
            setSelectedOption(data.active);
            setActiveTab(data.type);



        } catch (error) {
            console.error('Error fetching conventions data:', error);
        } finally {
            ``
            setLoading(false);
        }
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

        const formDataToSend = new FormData();
        formDataToSend.append('announcement_id', announcement_id); // Convention name
        formDataToSend.append('name', formData.name); // Convention name
        formDataToSend.append('description', formData.description); // Convention description
        formDataToSend.append('title', formData.title); // Convention title
        formDataToSend.append('url', formData.url); // Convention website
        formDataToSend.append('call_to_action', formData.call_to_action); // Convention call to action
        formDataToSend.append('type', activeTab); // Convention type
        formDataToSend.append('feature', formData.feature || 0); // Feature flag
        

        // Append logos if they exist
       
    // Append logos if they are valid File instances
    if (formData.expo_logo instanceof File) {
        formDataToSend.append('expo_logo', formData.expo_logo);
    }

    if (formData.promo_logo instanceof File) {
        formDataToSend.append('promo_logo', formData.promo_logo);
    }

    if (formData.feature_logo instanceof File) {
        formDataToSend.append('feature_logo', formData.feature_logo);
    }

    if (formData.advert_logo instanceof File) {
        formDataToSend.append('advert_logo', formData.advert_logo);
    }
        // Log form data for debugging
        console.log("Submitting form data:", Object.fromEntries(formDataToSend.entries()));


        try {
            const response = await fetch(`${API_BASE_URL}/admin/update_announcement`, {
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
            console.log("Success response:", result); // Log the success response
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
                feature: 0    // Initialize feature if needed, adjust according to your logic
            });
            setImagePreview(null);
            setFormErrors({});

            navigate(`/admin/announcement`);

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
                            Update Announcement
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
                                    // onClick={toggleDropdown}
                                >
                                    <div className='flex gap-8 items-center'>
                                        {selectedOption === '1' ? (
                                            <MdRemoveRedEye className='text-yellow-500' />
                                        ) : (
                                            <IoMdEyeOff />
                                        )}
                                        <p>{selectedOption === '1' ? 'Published' : 'Invisible to users'}</p>
                                    </div>
                                    {/* <img src={img1} alt="" /> */}
                                </button>

                                {/* Dropdown content */}
                                <div className='relative'>
                                    {isDropdownOpen && (
                                        <div className='absolute w-full mt-2 bg-[#102F47] border border-gray-300 shadow-lg text-white text-sm md:text-[28px] md:leading-35 tracking-[0.56px]'>
                                            <ul>
                                                <li className='p-2 hover:bg-gray-100 cursor-pointer hover:text-black' onClick={() => handleOptionClick('1')}>
                                                    <div className='flex items-center gap-8'>
                                                        <MdRemoveRedEye className='text-yellow-500' />
                                                        <span>Published</span>
                                                    </div>
                                                </li>
                                                <li className='p-2 hover:bg-gray-100 cursor-pointer hover:text-black' onClick={() => handleOptionClick('0')}>
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

                <div className="w-full bg-[#102F47] min-h-screen">

                    <div className="  bg-[#102F47] w-10/12 mx-auto pb-10">
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-10 text-white ">
                            <div className='col-span-8 lg:col-span-8 order-last lg:order-1'>
                                <div className='flex-col bg-[#0D2539] pt-[26px] pb-10'>
                                    <span className='text-xl leading-7 md:text-35 md:leading-63 font-palanquin-dark px-[39px]'>Announcement format</span>
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
                                    activeTab === 'Expo' && (
                                        <div className="w-full bg-[#102F47] mt-10">
                                            <div className="">
                                                <div className=" text-white">
                                                    <div className='bg-[#0D2539] px-[39px] pt-[26px]'>
                                                        <span className='text-2xl md:text-35 md:leading-63 font-palanquin-dark'>Expo Details</span>
                                                        <div className=' mt-[37px] mb-[52px]'>
                                                            {/* mt-[37px] */}
                                                            {formErrors.name && (
                                                                <p className="text-red text-sm sm:text-base mt-1 ml-2">
                                                                    {formErrors.name}
                                                                </p>
                                                            )}
                                                            <Input holder="Announcement name…" name="name" onChange={handleChange} value={formData.name}/>


                                                            <Input holder="Announcement Title....." name="title" onChange={handleChange}  value={formData.title} />

                                                            <textarea
                                                                name="description"
                                                                className='w-full text-white mb-5 bg-[#102F47] p-4 focus:outline-none resize-none text-sm leading-3 sm:text-xl sm:leading-7 md:text-2xl md:leading-10 lg:text-28 lg:leading-35 tracking-[0.56px]'
                                                                placeholder='Announcement description…'
                                                                rows="5"
                                                                value={formData.description}
                                                                onChange={handleChange}
                                                                style={{ minHeight: '150px' }}
                                                            />
                                                            <Input holder="Announcement call to action text…" name="call_to_action" onChange={handleChange} value={formData.call_to_action} />

                                                            {formErrors.url && (
                                                                <p className="text-red text-sm sm:text-base mt-1 ml-2">
                                                                    {formErrors.url}
                                                                </p>
                                                            )}
                                                            <Input holder="Announcement URL…" name="url" onChange={handleChange} value={formData.url} />
                                                            <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-y-5 pb-10'>
                                                                <div className=' flex flex-col items-center xl:items-start'>
                                                                    <div className='my-[18px] md:my-[38px] w-11/12 bg-[#0D2539] mx-auto flex items-center justify-center lg:justify-start'>
                                                                        <div className='sm:mt-5 mt-2 flex flex-col items-center'>
                                                                            <img
                                                                                src={
                                                                                    formData.expo_logo instanceof File
                                                                                        ? URL.createObjectURL(formData.expo_logo)
                                                                                        : formData.expo_logo || ConventionImage
                                                                                }
                                                                                alt="Expo Logo Preview"
                                                                                className='w-[10rem] h-[10rem] rounded-full mb-2'
                                                                            />
                                                                            <input
                                                                                type="file"
                                                                                id="expoLogoInput"
                                                                                name='expo_logo'
                                                                                className="hidden"
                                                                                onChange={handleFileChange}
                                                                                accept="image/png, image/jpeg"
                                                                            />
                                                                            <label htmlFor="expoLogoInput" className="w-[12rem] mt-2 h-[2.3rem] text-white border border-[#F77F00] rounded-md flex items-center justify-center cursor-pointer">
                                                                                Upload Expo Logo
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
                                                                                src={
                                                                                    formData.promo_logo instanceof File
                                                                                        ? URL.createObjectURL(formData.promo_logo)
                                                                                        : formData.promo_logo || ConventionImage
                                                                                }
                                                                                alt="Promo Logo Preview"
                                                                                className='w-[10rem] h-[10rem] rounded-full mb-2'
                                                                            />
                                                                            <input
                                                                                type="file"
                                                                                id="promoLogoInput"
                                                                                name='promo_logo'
                                                                                className="hidden"
                                                                                onChange={handleFileChange}
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
                                    activeTab === 'Feature' && (
                                        <div className="w-full bg-[#102F47] mt-10 ">
                                            <div className="">
                                                <div className=" text-white">
                                                    <div className='bg-[#0D2539] px-[39px] pt-[26px]'>
                                                        <span className='text-2xl md:text-35 md:leading-63 font-palanquin-dark'>Feature Details</span>
                                                        <div className=' mt-[37px] mb-[52px] pb-10'>

                                                            <Input holder="Announcement name…" name="name" onChange={handleChange} value={formData.name}/>
                                                            <Input holder="Announcement Title....." name="title" onChange={handleChange} value={formData.title}/>

                                                            <textarea
                                                                name="description"
                                                                className='w-full text-white mb-5 bg-[#102F47] p-4 focus:outline-none resize-none text-sm leading-3 sm:text-xl sm:leading-7 md:text-2xl md:leading-10 lg:text-28 lg:leading-35 tracking-[0.56px]'
                                                                placeholder='Announcement description…'
                                                                rows="5"
                                                                value={formData.description}
                                                                onChange={handleChange}
                                                                style={{ minHeight: '150px' }}
                                                            />
                                                            <Input holder="Announcement URL…" name="url" onChange={handleChange} value={formData.url}/>
                                                            <div className=''>

                                                                <div className='my-[18px] md:my-[38px] w-11/12 bg-[#0D2539] mx-auto flex items-center justify-center lg:justify-start'>
                                                                    <div className='sm:mt-5 mt-2 flex flex-col items-center'>
                                                                        <img
                                                                            src={
                                                                                formData.feature_logo instanceof File
                                                                                    ? URL.createObjectURL(formData.feature_logo)
                                                                                    : formData.feature_logo || ConventionImage
                                                                            }
                                                                            alt="Preview"
                                                                            className='w-[10rem] h-[10rem] rounded-full mb-2'
                                                                        />
                                                                        <input
                                                                            type="file"
                                                                            id="featureLogoInput"
                                                                            name='feature_logo'
                                                                            className="hidden"
                                                                            onChange={handleFileChange}
                                                                            accept="image/png, image/jpeg"
                                                                        />
                                                                        <label htmlFor="featureLogoInput" className="w-[8rem] mt-2 h-[2.3rem] text-white border border-[#F77F00] rounded-md flex items-center justify-center cursor-pointer">
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

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    activeTab === 'Advert' && (
                                        <div className="w-full bg-[#102F47] mt-10">
                                            <div className="">
                                                <div className=" text-white">
                                                    <div className='bg-[#0D2539] px-[39px] pt-[26px]'>
                                                        <span className='text-2xl md:text-35 md:leading-63 font-palanquin-dark'>Advert Details</span>
                                                        <div className=' mt-[37px] mb-[52px]'>

                                                            <Input holder="Announcement name…" name="name" onChange={handleChange} value={formData.name}/>
                                                            <Input holder="Announcement URL…" name="url" onChange={handleChange} value={formData.url}/>
                                                            <div className='flex flex-col items-center md:items-start pb-10'>

                                                                <div className='my-[18px] md:my-[38px] w-11/12 bg-[#0D2539] mx-auto flex items-center justify-center lg:justify-start'>
                                                                    <div className='sm:mt-5 mt-2 flex flex-col items-center'>
                                                                        <img
                                                                            src={formData.advert_logo instanceof File
                                                                                ? URL.createObjectURL(formData.advert_logo)
                                                                                : formData.advert_logo || ConventionImage}
                                                                            alt="Preview"
                                                                            className='w-[10rem] h-[10rem] rounded-full mb-2'
                                                                        />
                                                                        <input
                                                                            type="file"
                                                                            id="advertLogoInput"
                                                                            name='advert_logo'
                                                                            className="hidden"
                                                                            onChange={handleFileChange}
                                                                            accept="image/png, image/jpeg"
                                                                        />
                                                                        <label htmlFor="advertLogoInput" className="w-[12rem] mt-2 h-[2.3rem] text-white border border-[#F77F00] rounded-md flex items-center justify-center cursor-pointer">
                                                                            Upload Advert Logo
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
                            <div className='bg-[#0D2539] w-full'>
                                    {/* Feature */}
                                    <div className='w-10/12 bg-[#0D2539] mx-auto h-[102px] flex justify-between items-center'>
                                        <div>
                                            <span className='text-lg leading-10 md:text-28 md:leading-35 tracking-[0.56px]'>Feature?</span>
                                        </div>

                                        <div>
                                            {formData.feature === "1" && ( // Use formData.feature to conditionally render "FEATURED"
                                                <span className='font-mulish text-sm leading-7 md:text-lg md:leading-28 text-black bg-[#F3C15F] me-2 w-[104px]'>FEATURED</span>
                                            )}
                                            <div
                                                className={`relative inline-flex items-center h-[36px] rounded-full w-[54px] transition-colors duration-300 ease-in-out ${formData.feature === "1" ? 'bg-yellow-500' : 'bg-gray-300'}`}
                                                onClick={handleToggle} // Call handleToggle on click
                                            >
                                                <span className={`inline-block w-5 h-5 transform rounded-full transition-transform duration-300 ease-in-out ${formData.feature === "1" ? 'bg-white translate-x-6' : 'bg-blue-600 translate-x-2'}`} />
                                            </div>
                                        </div>
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

export default Edit;