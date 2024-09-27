import React, { useState, useEffect } from "react";
import Navbar from '../../components/Navbar'
import FaceImage from '../../assets/face.avif'
import ConventionImage from '../../assets/convention.jpeg'
import { FaCalendarAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { BsFillCaretDownFill } from 'react-icons/bs'
import Button from '../../components/Button'
import { useParams } from 'react-router-dom';
import { FaLocationDot } from 'react-icons/fa6'
import { fetchWithAuth } from "../../services/apiService";
import toastr from 'toastr';

const Layout = () => {
    const data = [1, 2, 3, 4, 5]
    const { convention_id } = useParams();
    const [games, setGames] = useState([]);
    const nav = useNavigate()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGames(convention_id);
    }, []);

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
            console.error('Error fetching Events data:', error);
        } finally {
            setLoading(false); // Hide loading spinner
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
                <a href="#" className='text-white'>
                    Account
                </a>
                <BsFillCaretDownFill className=' text-lightOrange -rotate-90' />

                <a href="/user/convention" className='text-white'>
                    Your conventions
                </a>
                <BsFillCaretDownFill className=' text-lightOrange -rotate-90' />

                <a href="#" className='text-white'>
                    Your conventions Attendance
                </a>
            </div>


            <div className='md:px-[2rem] px-[1rem] bg-darkBlue h-[86vh] w-[100vw] pt-3 overflow-y-auto'>

                <div className='flex justify-between items-start sm:items-center flex-wrap w-[100%] sm:flex-row flex-col'>
                    <div className='flex items-center gap-x-4'>
                        <div className='min-w-[3rem] min-h-[3rem] rounded-full bg-lightOrange  flex justify-center items-center'>UKGE</div>
                        <h1 className='text-3xl font-bold text-white'>Your UK Games Expo Games</h1>
                    </div>

                    <div class="flex items-center gap-x-4 sm:mt-0 mt-2">
                        <div className='flex justify-between px-2 items-center h-[2.3rem] rounded-md border border-gray-300 cursor-pointer'>
                            <p className='text-white'>Filter games by…</p>
                            <BsFillCaretDownFill className='text-white ' />
                        </div>
                        <Button onClickFunc={() => { nav(`/new/game/${convention_id}`) }} title={"Add New"} className={`w-[8rem] h-[2.3rem] rounded-md border border-lightOrange text-white sm:mt-0 mt-3`} />
                    </div>
                </div>


                <div className='mt-6'>
                    {
                        games.map((game) => (
                            <div key={game.id} className='w-[100%] sm:h-[13rem] bg-[#0d2539] p-3 rounded-md flex justify-between items-start relative sm:flex-row flex-col mt-4'>
                                <div className=''>
                                    <h1 className='text-lg font-semibold text-white'>{game.game_name}</h1>
                                    <div className='flex gap-x-2 items-center mt-4'>
                                        <p className='text-white'>{game.game_currency_symbol}{game.game_price}</p>
                                        <div className='w-[1px] h-[1rem] bg-white'></div>
                                        <p className='text-white'>{game.game_condition}</p>
                                    </div>

                                    <div className='sm:absolute bottom-6 flex items-center gap-x-3 mt-4 '>
                                        <Button onClickFunc={() => nav("/game/sale")} title={"Mark as sold"} className={`w-[8rem] h-[2.3rem] rounded-md bg-lightOrange text-white`} />
                                        <Button onClickFunc={() => {
                                                nav(`/edit/game/${game.id}/convention/${convention_id}`);
                                            }} title={"Edit"} className={`w-[8rem] h-[2.3rem] rounded-md border border-lightOrange text-white`} />
                                        <Button onClickFunc={() => nav("/game/sale")} title={"Delete"} className={`w-[8rem] h-[2.3rem] rounded-md border border-red text-white`} />
                                    </div>
                                </div>

                                <div className='sm:mt-0 mt-4'>
                                    <img src={game.game_image} alt="" className='h-[10rem] sm:absolute top-0 right-0' />
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
