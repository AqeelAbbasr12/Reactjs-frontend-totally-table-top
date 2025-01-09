import React, { useState, useEffect } from "react";
import Navbar from '../../components/Navbar'
import ConventionImage from '../../assets/traditional.png'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { BsFillCaretDownFill } from 'react-icons/bs'
import Button from '../../components/Button'
import toastr from 'toastr';
import { fetchWithAuth } from "../../services/apiService";
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const SingleConvention = () => {
    const { convention_id } = useParams();
    const nav = useNavigate()
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [password, setPassword] = useState('');
    
    const [upcoming, setUpcominh] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUpcominConvention();
    }, []);



    const [showPasswords, setShowPasswords] = useState({
        password: false,

    });
    const togglePasswordVisibility = (field) => {
        setShowPasswords((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    const handleAttendanceClick = () => {
        // Check if the convention is private and show the password input
        if (upcoming.is_private === "1") {
            toastr.warning('Private Convention Please Enter Password');
            setShowPasswordInput(true); // Show password input if private
        } else {
            nav(`/convention/attendance/${convention_id}`); // If not private, navigate
        }
    };

    const fetchUpcominConvention = async () => {
        setLoading(true); // Show loading spinner while fetching
        try {
            const response = await fetchWithAuth(`/user/single_upcoming_convention/${convention_id}`, {
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
            // console.log(data);
            setUpcominh(data);
        } catch (error) {
            // console.error('Error fetching Events data:', error);
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };


    const formatDescription = (desc) => {
        if (!desc) return null; // Handle case where desc is undefined or null

        // Split the description by double newlines to separate paragraphs
        const paragraphs = desc.split(/\n\s*\n/);

        return paragraphs.map((paragraph, index) => (
            <p key={index} className="text-white mt-3">
                {/* For each paragraph, split it by single newlines and map each line to <span> */}
                {paragraph.split(/\n/).map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                        {line}
                        <br />
                    </React.Fragment>
                ))}
            </p>
        ));
    };


    const validateForm = () => {
        const errors = {};

        if (upcoming.is_private === "1" && !password) {
            toastr.error('Password is required');
            errors.password = 'Password is required';
        }

      
        return Object.keys(errors).length === 0;
    };


    const handlePasswordSubmit = async (e) => {
        e.preventDefault(); // Prevent default behavior
    
        // Validate the form
        if (!validateForm()) {
            return;
        }
    
        const formDataToSend = new FormData();
        formDataToSend.append('password', password); // Append password
        formDataToSend.append('convention_id', upcoming.id); // Append convention_id
    
        try {
            const response = await fetch(`${API_BASE_URL}/user/convention_password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: formDataToSend,
            });
    
            // Handle non-200 responses
            const result = await response.json(); // Parse the response JSON
    
            if (!response.ok) {
                // Show dynamic error message from API response
                toastr.error(result.message || 'Something went wrong.');
                setPassword('');
                return; // Exit function early
            }
    
            if (response.ok) {
                // Success case
                toastr.success(result.message); // Show success message from API response
    
                // Store password in localStorage
                localStorage.setItem('ConventionPassword', password);
    
                // Delay navigation by 2 seconds (2000 milliseconds)
                setTimeout(() => {
                    nav(`/convention/attendance/${convention_id}`);
                }, 2000);
    
                setPassword('');
            }
    
        } catch (error) {
            // Catch block for network or parsing errors
            console.error('Error submitting password:', error);
    
            // Handle the case when API response itself fails to parse
            toastr.error('An error occurred. Please try again.');
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
                <a href="/profile" className='text-white'>Account</a>
                <BsFillCaretDownFill className='text-lightOrange -rotate-90' />
                <a href="/upcoming-convention" className='text-white'>Upcoming conventions</a>
            </div>

            <div className='md:px-[2rem] px-[1rem] bg-darkBlue h-[86vh] w-[100vw] overflow-y-auto flex flex-col md:flex-row justify-between items-start md:items-center pt-4 gap-y-6 md:gap-x-6'>


                {/* Left Section */}
                <div className='flex-1'>
                    <h1 className='text-white text-3xl font-semibold'>{upcoming.convention_name}</h1>
                    <p className='text-lightOrange mt-2'>
                        Dates: {upcoming.convention_dates ? upcoming.convention_dates.join(', ') : 'No dates available'}
                    </p>
                    <div className='flex items-center gap-x-4 mt-4'>
                        <p className='text-white'>Address: <span className='text-lightOrange'>{upcoming.convention_location}</span></p>
                    </div>
                    <div className='flex items-center gap-x-4 mt-4'>
                        <p className='text-white'>Country: <span className='text-lightOrange'>{upcoming.convention_state}</span></p>
                    </div>

                    <p className='text-white mt-3'>{formatDescription(upcoming.convention_description)}</p>

                    <div className="flex items-center gap-x-4 mt-4">
                        <p className="text-white">
                            Website:{" "}
                            {upcoming.website ? (
                                <a
                                    href={upcoming.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-lightOrange"
                                >
                                    {upcoming.website}
                                </a>
                            ) : (
                                null
                            )}
                        </p>
                    </div>


                    {/* Social media icons */}
                    <div className='flex items-center gap-x-4 mt-4'>
                        {upcoming.fb_url && (
                            <a href={upcoming.fb_url} target="_blank" rel="noopener noreferrer">
                                <FaFacebook className="text-lightOrange hover:text-white" size={24} />
                            </a>
                        )}
                        {upcoming.ig_url && (
                            <a href={upcoming.ig_url} target="_blank" rel="noopener noreferrer">
                                <FaInstagram className="text-lightOrange hover:text-white" size={24} />
                            </a>
                        )}
                    </div>
                </div>

                {/* Right Section */}
                <div className='h-fit bg-[#0d2539] rounded-md relative md:mt-0 mt-4 mb-4 md:mb-0 md:w-[30rem] mx-auto w-full max-w-[54rem]'>

                    <img src={upcoming.convention_logo || ConventionImage} alt="" className='w-full object-cover' />

                    <div className='flex justify-between items-center m-2'>
                        <div>
                            <p className='text-white font-semibold'>{upcoming.game_currency_symbol}{upcoming.game_price}</p>
                            <p className='text-white'>{upcoming.game_condition}</p>
                        </div>
                    </div>

                    {/* Centered Button */}
                    <div className='flex justify-center my-4 items-center'>
                        <Button
                            onClickFunc={handleAttendanceClick} // Call the function when the button is clicked
                            title={"Confirm Your Attendance"}
                            className={`text-white bg-lightOrange w-[16rem] h-[2.3rem] rounded-md`}
                        />

                        <div className='ml-4'>
                            {upcoming.is_private === "1" ? (
                                <button className='bg-red w-20 text-white px-2 py-1 rounded'>
                                    Private
                                </button>
                            ) : (
                                <button className='bg-[#4CAF50] w-20 text-white px-2 py-1 rounded'>
                                    Public
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Conditionally show the password input if the convention is private */}
                    {showPasswordInput && upcoming.is_private === "1" && (
                        <div className="mt-4 relative pl-4 pr-4 pb-4">
                            <input
                                type={showPasswords.password ? "text" : "password"}
                                placeholder="Enter Password"
                                value={password} // Bind the value to the state
                                onChange={(e) => setPassword(e.target.value)} // Update password state
                                className="w-full h-[2.3rem] rounded-md border border-color-white text-white px-4 mt-2 outline-none bg-[#0d2539]"
                            />

                            <span
                                className="absolute top-[23%] right-7 transform -translate-y-[50%] cursor-pointer text-[#F77F00]"
                                onClick={() => togglePasswordVisibility("password")}
                            >
                                {showPasswords.password ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </span>

                            {/* Submit Button for Password */}
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={handlePasswordSubmit}
                                    className="bg-lightOrange text-white w-[16rem] h-[2.3rem] rounded-md"
                                >
                                    Submit Password
                                </button>
                            </div>
                        </div>
                    )}


                </div>



            </div>

            {/* Game Images Grid */}


        </div>

    )
}

export default SingleConvention
