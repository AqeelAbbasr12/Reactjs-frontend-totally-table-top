import React, { useState, useEffect } from "react";
import Navbar from '../../components/Navbar';
import { FaExpand, FaList } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { BsFillCaretDownFill } from 'react-icons/bs';
import ConventionImage from '../../assets/traditional.png'
import Button from '../../components/Button';
import Input from '../../components/Input';
import { BiSolidDownload } from 'react-icons/bi';
import { fetchWithAuth } from "../../services/apiService";
import Select from 'react-select'; // Import react-select
import toastr from 'toastr';
import imageCompression from 'browser-image-compression';
import { FaTrash } from 'react-icons/fa'; // Import delete icon

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditEvent = () => {
    const nav = useNavigate();
    const { event_id, convention_id } = useParams();
    const [loading, setLoading] = useState(true);
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]); // State for selected friends
    const [imagePreview, setImagePreview] = useState(null);
    const [spaces, setSpaces] = useState('');
    const [spacesType, setSpacesType] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        event_name: '',
        event_date: '',
        event_time: '',
        event_location: '',
        event_description: '',
        event_location_phone: '',
        event_image: '',
        event_space: '',
        event_space_type: '',
        invite_receiver_ids: ''

    });

    useEffect(() => {
        fetchFriends();
        fetchEvent();
    }, []);

    const fetchEvent = async () => {
        setLoading(true); // Show loading spinner while fetching
        try {
            const response = await fetchWithAuth(`/user/get_convention_event/${event_id}`, {
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
            // Log event data
            // console.log(data);

            // Set the form data and spaces
            setFormData(data);
            setSpaces(data.event_space);
            setSpacesType(data.event_space_type);

            // Format invitations for react-select as selected friends
            const formattedFriends = data.invitations.map(invitation => ({
                value: invitation.invite_receiver_id, // This will act as the unique value for the dropdown
                label: (
                    <div className="flex items-center">
                        <img src={invitation.invite_receiver_image} alt={invitation.invite_receiver_name} className="w-8 h-8 rounded-full object-cover" />
                        <span>{invitation.invite_receiver_name}</span>
                    </div>
                ), // The label to display in the select
                username: invitation.invite_receiver_name,
                profile_picture: invitation.invite_receiver_image,
            }));

            // Set the selected friends in the react-select format
            setSelectedFriends(formattedFriends);

        } catch (error) {
            console.error('Error fetching Events data:', error);
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };


    const fetchFriends = async () => {
        setLoading(true); // Show loading spinner while fetching
        try {
            const response = await fetchWithAuth(`/user/getfriends`, {
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
            const friendOptions = data.map(friend => ({
                value: friend.id, // Assuming each friend object has an id
                label: (
                    <div className="flex items-center">
                        <img src={friend.profile_picture} alt={friend.username} className="w-8 h-8 rounded-full object-cover" /> {/* Profile picture */}
                        <span>{friend.username}</span> {/* Friend username */}
                    </div>
                ),
                username: friend.username, // Store username for later use if needed
                profile_picture: friend.profile_picture, // Store profile picture URL for later use if needed
            }));
            setFriends(friendOptions); // Set formatted friends for the dropdown
        } catch (error) {
            console.error('Error fetching friends data:', error);
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };

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
    
                // Set the new File object to formData and update image preview
                setFormData((prevData) => ({
                    ...prevData,
                    event_image: newFile, // Use the new compressed file
                }));
                setImagePreview(URL.createObjectURL(newFile)); // Set the preview with the compressed file URL
            } catch (error) {
                console.error('Error during image compression:', error);
            }
        }
    };

    const handleSelectChange = (selectedOptions) => {
       

        setSelectedFriends(selectedOptions || []); // Set selected friends state
        setFormData((prevData) => ({
            ...prevData,
            invite_receiver_ids: selectedOptions.map(option => option.value), // Save selected IDs as an array
        }));
    };

    // Handle spaces dropdown change
    const handleSpacesChange = (e) => {
        setSpaces(e.target.value);
        setFormData((prevData) => ({
            ...prevData,
            event_space: e.target.value,
        }));
    };
    const handleSpacesTypeChange = (e) => {
        setSpacesType(e.target.value);
        setFormData((prevData) => ({
            ...prevData,
            event_space_type: e.target.value,
        }));
    };
    // Handle form inputs change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDeleteImage = async () => {
        try {
            // Call API to delete the event image
            const response = await fetch(`${API_BASE_URL}/user/delete_event_image/${event_id}`, {
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
    // Calculate today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    const validateForm = () => {
        const errors = {};

        if (!formData.event_name) {
            errors.event_name = 'Event name is required.';
        } else if (formData.event_name.length > 255) {
            errors.event_name = 'Event name cannot exceed 255 characters.';
        }

        if (!formData.event_date) {
            errors.event_date = 'Event date is required.';
        } else if (isNaN(new Date(formData.event_date))) {
            errors.event_date = 'Event date must be a valid date.';
        }

        if (!formData.event_time) {
            errors.event_time = 'Event time is required.';
        }
        if (!formData.event_space_type) {
            errors.event_space_type = 'Table space type is required.';
        }

        if (formData.event_location && formData.event_location.length > 255) {
            errors.event_location = 'Event location cannot exceed 255 characters.';
        }

        if (formData.event_location_phone && formData.event_location_phone.length > 20) {
            errors.event_location_phone = 'Event location phone number cannot exceed 20 characters.';
        }

        // if (formData.invite_receiver_ids) {
        //    if (formData.invite_receiver_ids.length > formData.event_space) {
        //         errors.invite_receiver_ids = `You can't select more than ${formData.event_space} friends.`;
        //     }
        // }

        // if (formData.invite_receiver_ids.length > formData.event_space) {
        //     errors.invite_receiver_ids = `You can't select more than ${formData.event_space} friends.`;
        // }


        return errors;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        setFormErrors(validationErrors); // Set form errors state

        // Check for validation errors before proceeding
        if (Object.keys(validationErrors).length > 0) {
            return; // Stop submission
        }

        // Prepare form data for submission
        const submissionData = new FormData();
        submissionData.append('event_id', event_id);
        submissionData.append('convention_id', convention_id);
        submissionData.append('event_name', formData.event_name);
        submissionData.append('event_date', formData.event_date);
        submissionData.append('event_time', formData.event_time);
        submissionData.append('event_location', formData.event_location);
        submissionData.append('event_description', formData.event_description);
        submissionData.append('event_location_phone', formData.event_location_phone);
        submissionData.append('event_space', formData.event_space);
        submissionData.append('event_space_type', formData.event_space_type);

        if (formData.invite_receiver_ids) {
            const inviteIds = formData.invite_receiver_ids; // Assuming it's an array
            inviteIds.forEach(id => {
                submissionData.append('invite_receiver_ids[]', id); // Append each ID as an array item
            });

        }

        if (formData.event_image) {
            submissionData.append('event_image', formData.event_image); // image as file
        }

        // console.log('Form data submitted:', formData); // Log the form data for debugging
        // return;
        try {
            const response = await fetch(`${API_BASE_URL}/user/update_convention_event`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: submissionData,
            });

            if (!response.ok) {
                const result = await response.json();
                toastr.error(result.message);
            }
            const result = await response.json();
            toastr.success(result.message);// Display success message

            // Clear form fields, image preview, and form errors
            setFormData({
                event_name: '',
                event_date: '',
                event_time: '',
                event_location: '',
                event_description: '',
                event_location_phone: '',
                event_space: '',
                event_space_type: '',
            });
            setImagePreview(null);
            setFormErrors({});
            nav(`/event/${convention_id}`);  

        } catch (error) {
            console.error('Error creating Event:', error);
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
                <span className='text-white'>Your conventions</span>
            </div>
            <div className='md:px-[2rem] px-[1rem] bg-darkBlue md:h-[86vh] w-[100vw] py-3 flex justify-center md:items-center overflow-y-auto'>
                <form onSubmit={handleSubmit} className='sm:w-[50%] w-[100%] h-[55rem] bg-[#0d2539] px-3 py-5 rounded-md mt-6'>
                    <div className='flex justify-center items-center'>
                        <div className='w-[3rem] h-[3rem] rounded-full bg-lightOrange flex justify-center items-center'>UKGE</div>
                        <div className='w-[3rem] h-[3rem] rounded-full bg-lightOrange flex justify-center items-center'><FaList className='text-white' /></div>
                    </div>
                    <h1 className='text-3xl mt-3 text-center text-white font-semibold'>Edit Table</h1>

                    {/* Event Name */}
                    <Input name={"event_name"} placeholder={"Table Name"} type={"text"} value={formData.event_name} onChange={handleChange} className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`} />
                    {formErrors.event_name && <p className="text-red">{formErrors.event_name}</p>}
                    {/* Event Date and Time */}
                    <div className='flex justify-center items-center md:flex-row flex-col mt-2 gap-x-4'>
                        <Input name={"event_date"} min={today} placeholder={"Table Date"} type={"date"} value={formData.event_date} onChange={handleChange} className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 outline-none bg-darkBlue`} />
                        <Input name={"event_time"} placeholder={"Table Time"} type={"time"} value={formData.event_time} onChange={handleChange} className={`w-[100%] md:mt-0 h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`} />
                    </div>
                    {formErrors.event_date && <p className="text-red">{formErrors.event_date}</p>}

                    {/* Event Location */}
                    <Input name={"event_location"} placeholder={"Table Location"} type={"text"} value={formData.event_location} onChange={handleChange} className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`} />
                    {formErrors.event_location && <p className="text-red">{formErrors.event_location}</p>}
                    {/* Description and Direction */}
                    <Input name={"event_description"} placeholder={"Description And Direction"} type={"text"} value={formData.event_description} onChange={handleChange} className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`} />

                    {/* Location Phone Number */}
                    <Input name={"event_location_phone"} placeholder={"Location Phone Number"} type={"number"} value={formData.event_location_phone} onChange={handleChange} className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`} />

                    {/* Image Upload */}
                    <div className='sm:mt-5 mt-2 flex flex-col items-center'>
                        <div className='relative'>
                            <img
                                src={imagePreview || formData.event_image || ConventionImage}
                                alt="Preview"
                                className='w-[10rem] h-[10rem] rounded-full object-cover'
                            />
                            {imagePreview || formData.event_image ? (
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
                    {formErrors.event_image && <p className="text-red">{formErrors.event_image}</p>}
                    {/* Dropdown to select number of spaces */}
                    <div className='flex flex-col mt-2'>
                        <select
                            name="event_space"
                            value={spaces}
                            onChange={handleSpacesChange}
                            className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`}
                        >
                            <option value="" disabled>Select number of spaces</option>
                            {[0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((space) => (
                                <option key={space} value={space}>
                                    {space}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Multi-Select Dropdown for Friends */}
                    <div className='mt-2'>
                        <Select
                            isMulti
                            options={friends}
                            value={selectedFriends}
                            onChange={handleSelectChange}
                            className='text-black mt-4'
                            placeholder='Invite friends, start typing names'
                        />
                    </div>
                    {formErrors.invite_receiver_ids && <p className="text-red">{formErrors.invite_receiver_ids}</p>}

                    {/* Dropdown to select number of spaces */}
                    <div className='flex flex-col mt-2'>
                        <select
                            name="event_space_type"
                            value={spacesType}
                            onChange={handleSpacesTypeChange}
                            className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`}
                        >
                            <option value="" disabled>Select space type</option>
                            {['Space','No Space'].map((space) => (
                                <option key={space} value={space}>
                                    {space}
                                </option>
                            ))}
                        </select>
                    </div>
                    {formErrors.event_space_type && <p className="text-red">{formErrors.event_space_type}</p>}
                    {/* Submit Button */}
                    <div className='flex justify-center items-center mt-4'>
                        <Button type="submit" title={"Update Table"} className={`w-[12rem] h-[2.3rem] rounded-md text-white bg-lightOrange`} />
                    </div>
                </form>
            </div>
        </div>
    )

}

export default EditEvent;
