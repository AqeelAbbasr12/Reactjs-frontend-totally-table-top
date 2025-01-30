import React, { useState, useEffect } from "react";
import Navbar from '../../components/Navbar'
import ConventionImage from '../../assets/convention.jpeg'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { BsFillCaretDownFill } from 'react-icons/bs'
import { fetchWithAuth } from "../../services/apiService";
import { FaHeart } from "react-icons/fa";
import toastr from 'toastr';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SingleAnnouncement = () => {
    const data = [1, 2, 3, 4, 5]
    const { announcement_id } = useParams();
    const nav = useNavigate()
    const [announcement, setAnnouncements] = useState([]);;
    const [loading, setLoading] = useState(true);


    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);


    const toggleLike = () => {
        setIsLiked(!isLiked); // Toggle like state
    };
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
            console.log('Announcement', data);

            // Assuming 'data' is a single announcement object
            setAnnouncements(data);  // Save the announcement to state
            setIsLiked(data.is_like); // Set the initial like status
            setLikeCount(data.total_likes); // Set the initial like count
        } catch (error) {
            // Handle error fetching announcements
            console.error('Error fetching announcement data:', error);
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


    const handleSubmit = async () => {
        setIsLoading(true);

        // Toggle like status and update like count
        const newLikeStatus = !isLiked;
        const newLikeCount = newLikeStatus ? likeCount + 1 : likeCount - 1;

        try {
            // Make the API request to like/unlike
            const response = await fetch(`${API_BASE_URL}/user/announcement_like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    announcement_id: announcement.id,  // Use the correct announcement ID
                    status: newLikeStatus ? 1 : 0,    // 1 for like, 0 for unlike
                }),
            });

            if (response.ok) {
                // If successful, update the like state and like count
                toastr.success('Announcement status updated successfully!');
                setIsLiked(newLikeStatus);
                setLikeCount(newLikeCount);
            } else {
                console.error('Error liking announcement:', await response.text());
            }
        } catch (error) {
            console.error('Error making like request:', error);
        } finally {
            setIsLoading(false); // Stop loading after request
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
                <a href="/home" className='text-white'>
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
                <div className="flex-1">
                    <h1 className="text-white text-3xl font-semibold">{announcement?.name}</h1>
                    <p className="text-white mt-2">
                        {formatGameDate(announcement?.created_at)} Announcement
                    </p>
                    <p className="text-white mt-3">{formatDescription(announcement?.description)}</p>
                    <p className="text-white mt-3">{formatDescription(announcement?.url)}</p>

                    <div className="flex items-center gap-x-4 mt-4">
                        {/* User Info */}
                        <p className="text-white">
                            Listed by <span className="text-lightOrange">Admin</span>
                        </p>
                    </div>

                    {/* Like Button and Count */}
                    <div className="mt-2 flex items-center gap-x-4">
                        <button
                            onClick={handleSubmit}  // Trigger handleSubmit function on click
                            className="focus:outline-none"
                            disabled={isLoading}  // Disable the button during API request
                        >
                            <FaHeart
                                size={24}
                                className={`transition-colors duration-300 ${isLiked ? "text-lightOrange" : "text-white"}`}
                            />
                        </button>
                        <p className="text-white">{likeCount} Likes</p>
                    </div>
                </div>



                {/* Right Section */}
                <div className='h-fit bg-[#0d2539] rounded-md relative md:mt-0 mt-4 mb-4 md:mb-0 md:w-[30rem]'>

                    <img
                        src={
                            announcement.type === 'Advert' ? announcement.promo_logo :
                                announcement.type === 'Announcement' ? announcement.first_image :
                                    announcement.type === 'Picture' ? announcement.advert_logo :
                                        ConventionImage // fallback to ConventionImage if no logos are available
                        }
                        alt="" className='w-full md:w-[54rem]' />

                    {/* <h2 className='text-white text-2xl mb-4 flex justify-between items-center m-2'>Feature Images</h2> */}
                    <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 m-2'>
                        {announcement.feature_logos && announcement.feature_logos.slice(1).map((image, index) => ( // Splice the first image
                            <div key={index} className='relative rounded-md overflow-hidden bg-[#0D2539] cursor-pointer'>
                                <img
                                    src={image || ConventionImage}
                                    alt={`Game Image ${index + 1}`}
                                    className='w-full h-[10rem] object-cover'
                                // onClick={() => nav(`${image}`)} // Redirect to new page with image
                                />
                            </div>
                        ))}
                    </div>

                </div>
            </div>

        </div>
    )
}

export default SingleAnnouncement
