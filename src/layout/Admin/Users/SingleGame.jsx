import React, { useState, useEffect } from "react";
import Navbar from '../../../components/Admin/Navbar';
import FaceImage from '../../../assets/profile.jpeg'
import ConventionImage from '../../../assets/traditional.png'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';
import { IoMdFlag } from 'react-icons/io';
import { useParams } from 'react-router-dom';
import { BsFillCaretDownFill } from 'react-icons/bs'
import Button from '../../../components/Button'
import { fetchWithAuth } from "../../../services/apiService";


const SingleGame = () => {
    const data = [1, 2, 3, 4, 5]
    const { game_id } = useParams();
    const nav = useNavigate()
    const [showPopup, setShowPopup] = useState(false);

    const [game, setGame] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGame();
    }, []);



    const fetchGame = async () => {
        setLoading(true); // Show loading spinner while fetching
        try {
            const response = await fetchWithAuth(`/user/game_for_sale/${game_id}`, {
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
            setGame(data);
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

        return desc.split(/[\r\n]+/).map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };
    async function handleReportGame(gameId) {
        Swal.fire({
            title: 'Report Game',
            text: 'Please enter the reason for reporting this game:',
            html: `
                <textarea 
                id="report-reason" 
                placeholder="Enter your reason here..."
                style="margin: 0; padding: 10px; width: 100%; height: 100px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Submit Report',
            preConfirm: () => {
                // Fetch the value of the textarea
                const reason = document.getElementById('report-reason').value;
                if (!reason.trim()) {
                    Swal.showValidationMessage('Reason is required!');
                }
                return reason.trim();
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const reason = result.value;

                try {
                    // Call the API
                    const response = await fetchWithAuth(`/user/report`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                        },
                        body: JSON.stringify({
                            reported_game_id: gameId, // The ID of the reported game
                            type: 'game', // The type of report (in this case, "game")
                            reason: reason // The reason provided by the user
                        })
                    });

                    // Check if the response is successful
                    const data = await response.json();
                    if (response.ok) {
                        console.log('API Response:', data);
                        Swal.fire('Reported!', 'Thank you for your feedback.', 'success');
                    } else {
                        // Display validation errors if the API response indicates failure
                        if (data.errors && data.errors.general) {
                            const errorMessage = data.errors.general.join(' ');
                            Swal.fire('Error!', errorMessage, 'error');
                        } else {
                            Swal.fire('Error!', 'There was an issue reporting the game. Please try again later.', 'error');
                        }
                    }
                } catch (error) {
                    console.error('Error reporting the game:', error);
                    Swal.fire('Error!', 'There was an issue reporting the game. Please try again later.', 'error');
                }
            }
        });
    }



    // Get the current user ID from local storage
    const currentUserId = parseInt(localStorage.getItem('current_user_id'));


    return (
        <div className='bg-[#102F47] w-full opacity-100 min-h-screen'>
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
                </div>
            )}
            <Navbar />

            

            <div className='md:px-[2rem] px-[1rem] pt-48 bg-darkBlue w-[100vw] overflow-y-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-y-6 md:gap-x-6'>


                {/* Left Section */}
                <div className='flex-1'>
                    <h1 className='text-white text-3xl font-semibold'>{game.game_name}</h1>
                    <p className='text-white mt-2'>{formatGameDate(game.game_created_at)} Game</p>
                    <p className='text-white mt-3'>{formatDescription(game.game_desc)}</p>

                    <div className='flex items-center gap-x-4 mt-4'>
                        <img src={game.user_image || FaceImage} alt="" className='w-[3rem] h-[3rem] rounded-full object-cover' />
                        <p className='text-white'>Listed for sale by <span className='text-lightOrange'>{game.user_name}</span></p>
                    </div>
                    {/* Flag Icon Section */}
                    

                </div>

                {/* Right Section */}
                <div className='h-fit bg-[#0d2539] rounded-md relative md:mt-0 mt-4 mb-4 md:mb-0 md:w-[30rem]'>
                    {game.game_status === 'sold' && (
                        <div className="absolute top-0 right-0 w-0 h-0 border-t-[100px] border-t-red border-l-[100px] border-l-transparent">
                            <p className="absolute top-[-85px] right-[0px] rotate-45 text-white font-bold text-lg">
                                SOLD
                            </p>
                        </div>
                    )}

                    <img src={game.first_image || ConventionImage} alt="" className='w-full md:w-[54rem] object-cover' />

                    <div className='flex justify-between items-center m-2'>
                        {game.game_status === 'sold' ? (
                            <p className='text-white font-semibold'>Sorry, this game is no longer available</p>
                        ) : (
                            <>
                                <div>
                                    <p className='text-white font-semibold'>{game.game_currency_symbol}{game.game_price}</p>
                                    <p className='text-white'>{game.game_condition}</p>
                                </div>
                                
                            </>
                        )}

                    </div>
                    {/* <h2 className='text-white text-2xl mb-4 flex justify-between items-center m-2'>Game Images</h2> */}
                    <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 m-2'>
                        {game.game_images && game.game_images.slice(1).map((image, index) => ( // Splice the first image
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

            {/* Game Images Grid */}



        </div>

    )
}

export default SingleGame
