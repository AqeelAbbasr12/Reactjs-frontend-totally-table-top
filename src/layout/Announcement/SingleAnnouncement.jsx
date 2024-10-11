import React, { useState, useEffect } from "react";
import Navbar from '../../components/Navbar'
import FaceImage from '../../assets/face.avif'
import ConventionImage from '../../assets/convention.jpeg'
import { FaCalendarAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { BsFillCaretDownFill } from 'react-icons/bs'
import Button from '../../components/Button'
import { FaLocationDot } from 'react-icons/fa6'
import { fetchWithAuth } from "../../services/apiService";


const SingleAnnouncement = () => {
    const data = [1, 2, 3, 4, 5]
    const { announcement_id } = useParams();
    const nav = useNavigate()
    const [announcement, setAnnouncements] = useState([]);;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnnouncements();
    }, []);



    const fetchAnnouncements = async () => {
        setLoading(true); // Show loading spinner while fetching
        try {
            const response = await fetchWithAuth(`/user/announcement/${announcement_id}`, {
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
            setAnnouncements(data);
        } catch (error) {
            console.error('Error fetching Events data:', error);
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };

    const formatGameDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: 'long', year: 'numeric' }; // Options for formatting
        return date.toLocaleDateString('en-US', options); // Format the date
    };

    const formatDescription = (content) => {
        if (!content) return null; // Handle case where content is undefined or null

        // Regex to detect URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        // Split the content into lines and map over them
        return content.split(/[\r\n]+/).map((line, index) => {
            // Replace URLs with clickable links
            const formattedLine = line.split(urlRegex).map((part, i) => {
                if (urlRegex.test(part)) {
                    return (
                        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-lightOrange underline break-all">
                            {part}
                        </a>
                    );
                }
                return part;
            });

            // Return the formatted line with <br /> at the end
            return (
                <React.Fragment key={index}>
                    {formattedLine}
                    <br />
                </React.Fragment>
            );
        });
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
                <a href="#" className='text-white'>
                    Account
                </a>
                <BsFillCaretDownFill className=' text-lightOrange -rotate-90' />

                <a href="/user/announcements" className='text-white'>
                    Your announcement
                </a>
                {/* <BsFillCaretDownFill className=' text-lightOrange -rotate-90' />

                <a href="#" className='text-white'>
                    Your conventions Attendance
                </a> */}
            </div>


            <div className='md:px-[2rem] px-[1rem] bg-darkBlue h-[86vh] w-[100vw] overflow-y-auto flex flex-col md:flex-row justify-between items-start md:items-center pt-4 gap-y-6 md:gap-x-6'>

                {/* Left Section */}
                <div className='flex-1'>
                    <h1 className='text-white text-3xl font-semibold'>{announcement.name}</h1>
                    <p className='text-white mt-2'>{formatGameDate(announcement.created_at)} Announcement</p>
                    <p className='text-white mt-3'>{formatDescription(announcement.description)}</p>
                    <p className='text-white mt-3'>{formatDescription(announcement.url)}</p>

                    <div className='flex items-center gap-x-4 mt-4'>
                        {/* <img src={announcement.user_image || FaceImage} alt="" className='w-[3rem] h-[3rem] rounded-full' /> */}
                        <p className='text-white'>Listed by <span className='text-lightOrange'>Admin</span></p>
                    </div>
                </div>

                {/* Right Section */}
                <div className='h-fit bg-[#0d2539] rounded-md relative md:mt-0 mt-4 mb-4 md:mb-0 md:w-[30rem]'>
                    {/* Conditionally render a SOLD triangle badge */}
                   

                    <img 
                    src={
                        announcement.type === 'Expo' ? announcement.promo_logo :
                          announcement.type === 'Feature' ? announcement.feature_logo :
                            announcement.type === 'Advert' ? announcement.advert_logo :
                              ConventionImage // fallback to ConventionImage if no logos are available
                      }
                    alt="" className='w-full md:w-[54rem]' />


                </div>
            </div>



           



        </div>
    )
}

export default SingleAnnouncement
