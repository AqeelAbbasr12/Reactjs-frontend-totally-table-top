import React, { useState, useEffect } from "react";
import Navbar from '../../components/Navbar'
import ConventionImage from '../../assets/traditional.png'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { BsFillCaretDownFill } from 'react-icons/bs'
import Button from '../../components/Button'
import { fetchWithAuth } from "../../services/apiService";
import { FaFacebook, FaInstagram } from 'react-icons/fa';


const SingleConvention = () => {
    const data = [1, 2, 3, 4, 5]
    const { convention_id } = useParams();
    const nav = useNavigate()
    const [upcoming, setUpcominh] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUpcominConvention();
    }, []);



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

    const formatGameDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: 'long', year: 'numeric' }; // Options for formatting
        return date.toLocaleDateString('en-US', options); // Format the date
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



    // Get the current user ID from local storage
    const currentUserId = parseInt(localStorage.getItem('current_user_id'));


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
                    <div className='flex justify-center my-4'>
                        <Button
                            onClickFunc={() => {
                                nav(`/convention/attendance/${convention_id}`);
                            }}
                            title={"Confirm Your Attendance"}
                            className={`text-white bg-lightOrange w-[16rem] h-[2.3rem] rounded-md`}
                        />
                    </div>

                </div>



            </div>

            {/* Game Images Grid */}


        </div>

    )
}

export default SingleConvention
