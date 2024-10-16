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


const SingleGame = () => {
    const data = [1, 2, 3, 4, 5]
    const { game_id } = useParams();
    const nav = useNavigate()
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

                <a href="/user/convention" className='text-white'>
                    Your conventions
                </a>
                {/* <BsFillCaretDownFill className=' text-lightOrange -rotate-90' />

                <a href="#" className='text-white'>
                    Your conventions Attendance
                </a> */}
            </div>


            <div className='md:px-[2rem] px-[1rem] bg-darkBlue h-[86vh] w-[100vw] overflow-y-auto flex flex-col md:flex-row justify-between items-start md:items-center pt-4 gap-y-6 md:gap-x-6'>

                {/* Left Section */}
                <div className='flex-1'>
                    <h1 className='text-white text-3xl font-semibold'>{game.game_name}</h1>
                    <p className='text-white mt-2'>{formatGameDate(game.game_created_at)} Game</p>
                    <p className='text-white mt-3'>{formatDescription(game.game_desc)}</p>

                    <div className='flex items-center gap-x-4 mt-4'>
                        <img src={game.user_image || FaceImage} alt="" className='w-[3rem] h-[3rem] rounded-full' />
                        <p className='text-white'>Listed for sale by <span className='text-lightOrange'>{game.user_name}</span></p>
                    </div>
                </div>

                {/* Right Section */}
                <div className='h-fit bg-[#0d2539] rounded-md relative md:mt-0 mt-4 mb-4 md:mb-0 md:w-[30rem]'>
                    {/* Conditionally render a SOLD triangle badge */}
                    {game.game_status === 'sold' && (
                        <div className="absolute top-0 right-0 w-0 h-0 border-t-[60px] border-t-red border-l-[60px] border-l-transparent">
                            <p className="absolute top-[-50px] right-[0px] rotate-45 text-white font-bold text-xs">SOLD</p>
                        </div>
                    )}

                    <img src={game.game_image || ConventionImage} alt="" className='w-full md:w-[54rem]' />

                    <div className='flex justify-between items-center m-2'>
                        {/* Check if the game is sold */}
                        {game.game_status === 'sold' ? (
                            <p className='text-white font-semibold'>Sorry, this game is no longer available</p>
                        ) : (
                            <>
                                {/* If the game is not sold, display price and condition */}
                                <div>
                                    <p className='text-white font-semibold'>{game.game_currency_symbol}{game.game_price}</p>
                                    <p className='text-white'>{game.game_condition}</p>
                                </div>

                                {/* Conditionally render the button for enquiring if not sold */}
                                {game.user_id !== currentUserId && (
                                    <div>
                                        <Button
                                            onClickFunc={() => {
                                                nav(`/messages/${game.user_id}/game/${game.id}`);
                                            }}
                                            title={"Enquire Now"}
                                            className={`text-white bg-lightOrange w-[7rem] h-[2.3rem] rounded-md`}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>



            <div className='mt-4 p-3'>
                <p>All games are listed for sale by other members of Totally TableTop. Any arrangement is directly between users, and Totally TableTop takes no responsibility for the quality of games or accuracy of listings. Follow our <span className='text-lightOrange'>tips for staying safe when buying and selling.</span></p>
            </div>




        </div>
    )
}

export default SingleGame
