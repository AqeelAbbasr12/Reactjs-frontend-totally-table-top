import React, { useState, useEffect } from "react";
import Navbar from '../../components/Navbar'
import ConventionImage from '../../assets/traditional.png'
import { useNavigate } from 'react-router-dom'
import { BsFillCaretDownFill } from 'react-icons/bs'
import Button from '../../components/Button'
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { fetchWithAuth } from "../../services/apiService";
import toastr from 'toastr';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Layout = () => {
    const data = [1, 2, 3, 4, 5]
    const { convention_id } = useParams();
    const [convention, setConvention] = useState([]);
    const [games, setGames] = useState([]);
    const nav = useNavigate()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGames(convention_id);
        fetchConventions(convention_id)
    }, []);

    const fetchConventions = async (convention_id) => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/convention/${convention_id}`, {
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
            setConvention(data);
            // console.log(data);
        } catch (error) {
            console.error('Error fetching conventions data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGames = async () => {
        setLoading(true); // Show loading spinner while fetching
        try {
            const response = await fetchWithAuth(`/user/convention_game/${convention_id}`, {
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
            console.log(data);
            setGames(data);
        } catch (error) {
            // console.error('Error fetching Events data:', error);
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };

    const handleDelete = async (id) => {
        // Show confirmation dialog using Swal
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to undo this action!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        // Exit if the user cancels
        if (!result.isConfirmed) {
            return;
        }

        try {
            // Make API call to delete the event
            const response = await fetch(`${API_BASE_URL}/user/convention_game/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            if (response.ok) {
                // Show success message using Swal
                Swal.fire('Deleted!', 'The game has been deleted successfully.', 'success');
                fetchGames(convention_id); // Refresh the game list
            } else {
                // Show error message using Swal
                Swal.fire('Error!', 'Failed to delete the game. Please try again later.', 'error');
            }
        } catch (error) {
            // Handle errors
            Swal.fire('Error!', 'An error occurred while deleting the game.', 'error');
        }
    };



    const handleMarkAsSold = async (id) => {
        // Show confirmation dialog using Swal
        const { value: soldPrice } = await Swal.fire({
            title: 'Mark Game as Sold',
            input: 'text', // Use text input for better control
            inputLabel: 'Enter Sold Price (Min: 1, Max: 1,00,0000)',
            inputPlaceholder: 'Enter price...',
            showCancelButton: true,
            confirmButtonText: 'Mark as Sold',
            cancelButtonText: 'Cancel',
            inputValidator: (value) => {
                // Trim any spaces
                value = value.trim();

                // Check if value is a valid integer
                if (!/^\d+$/.test(value)) {
                    return 'Price must be a valid integer!';
                }

                // Convert value to a number
                const price = parseInt(value, 10);

                // Enforce min, max, and length validation
                if (price < 1 || price > 1000000) {
                    return 'Price must be between 1 and 1,00,0000!';
                }
                if (value.length > 5) {
                    return 'Price is too large!';
                }
            }
        });

        // If user cancels the input
        if (!soldPrice) {
            return; // Exit the function
        }

        try {
            // API call to mark the game as sold
            const response = await fetch(`${API_BASE_URL}/user/mark_game_as_sold/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({
                    status: 'sold',       
                    sold_price: soldPrice 
                })
            });

            if (response.ok) {
                // Show success message using Swal
                Swal.fire('Success', 'Game marked as sold successfully!', 'success');
                fetchGames(convention_id); // Refresh the game list
            } else {
                // Show error message if request fails
                Swal.fire('Error', 'Failed to mark the game as sold. Please try again!', 'error');
            }
        } catch (error) {
            // Handle network or server error
            Swal.fire('Error', 'An error occurred while updating the game.', 'error');
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
                <a href="/profile" className='text-white'>
                    Account
                </a>
                <BsFillCaretDownFill className=' text-lightOrange -rotate-90' />

                <a href="/user/convention" className='text-white'>
                    Your conventions
                </a>
                <BsFillCaretDownFill className=' text-lightOrange -rotate-90' />

                <a href="#" className='text-white'>
                    Your games
                </a>
            </div>


            <div className='md:px-[2rem] px-[1rem] bg-darkBlue h-[86vh] w-[100vw] pt-3 overflow-y-auto'>

                <div className='flex justify-between items-start sm:items-center flex-wrap w-[100%] sm:flex-row flex-col'>
                    <div className='flex items-center gap-x-4'>
                        <div className='min-w-[3rem] min-h-[3rem] rounded-full bg-lightOrange  flex justify-center items-center'><img src={convention.convention_logo || ConventionImage} alt="" className='w-[3rem] h-[3rem] rounded-full object-cover' /></div>
                        <h1 className='text-3xl font-bold text-white'>{convention.convention_name} Game</h1>
                    </div>

                    <div class="flex items-center gap-x-4 sm:mt-0 mt-2">
                        {/* <div className='flex justify-between px-2 items-center md:lg:h-[2.3rem] rounded-md border border-gray-300 cursor-pointer'>
                            <p className='text-white'>Filter games by…</p>
                            <BsFillCaretDownFill className='text-white ' />
                        </div> */}
                        <Button onClickFunc={() => { nav(`/new/game/${convention_id}`) }} title={"Add New"} className={`w-[8rem] h-[2.3rem] rounded-md border border-lightOrange text-white sm:mt-0 mt-3`} />
                    </div>
                </div>


                <div className='mt-6'>
                    {
                        games.map((game) => (
                            <div
                                key={game.id}
                                className="w-full sm:h-[13rem] bg-[#0d2539] p-3 rounded-md flex justify-between items-start relative sm:flex-row flex-col mt-4"
                            >
                                <div className="w-full sm:w-auto">
                                    <h1 className="text-lg font-semibold text-white break-all sm:w-auto">
                                        {game.game_name}
                                    </h1>
                                    <div className="flex gap-x-2 items-center mt-4">
                                        <p className="text-white">
                                            {game.game_currency_symbol}
                                            {game.game_price}
                                        </p>
                                        <div className="w-[1px] h-[1rem] bg-white"></div>
                                        <p className="text-white">{game.game_condition}</p>
                                        <div className='w-[1px] h-[1rem] bg-white'></div>

                                        {game.game_status === "sold" && (
                                            <p className="text-red">
                                                Sold Price
                                                <span className="ml-1">
                                                    {game.game_currency_symbol}{game.sold_price}
                                                </span>
                                            </p>
                                        )}
                                    </div>

                                    {/* Buttons Section */}
                                    <div className="sm:absolute bottom-6 flex flex-wrap items-center gap-3 mt-4 sm:gap-3 w-full sm:w-auto">
                                        <Button
                                            onClickFunc={
                                                game.game_status === "publish"
                                                    ? () => handleMarkAsSold(game.id)
                                                    : null
                                            }
                                            title={game.game_status === "publish" ? "Mark as sold" : "Sold"}
                                            className={`w-full sm:w-[8rem] h-[2.3rem] rounded-md text-white ${game.game_status === "publish"
                                                ? "bg-lightOrange cursor-pointer"
                                                : "bg-red cursor-not-allowed"
                                                }`}
                                        />
                                        <Button
                                            onClickFunc={() => {
                                                nav(`/edit/game/${game.id}/convention/${convention_id}`);
                                            }}
                                            title={"Edit"}
                                            className="w-full sm:w-[8rem] h-[2.3rem] rounded-md border border-lightOrange text-white"
                                        />
                                        {game.game_status === "publish" && (
                                            <Button
                                                onClickFunc={() => handleDelete(game.id)}
                                                title={"Delete"}
                                                className="w-full sm:w-[8rem] h-[2.3rem] rounded-md border border-red text-white"
                                            />
                                        )}

                                    </div>
                                </div>

                                {/* Image Section */}
                                <div className="sm:mt-0 mt-4 sm:w-auto w-full">
                                    <img
                                        src={game.game_image}
                                        alt=""
                                        className="h-[10rem] w-full sm:w-auto sm:absolute top-[20px] right-[20px] object-cover"
                                    />
                                </div>
                            </div>

                        ))
                    }



                </div>


            </div>




        </div>
    )
}

export default Layout
