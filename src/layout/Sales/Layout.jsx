import React, { useState, useEffect } from "react";
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom'
import { TbGridDots } from 'react-icons/tb'
import { IoListSharp } from 'react-icons/io5'
import ConventionImage from '../../assets/traditional.png'
import Input from '../../components/Input'
import { useParams } from 'react-router-dom';
import { fetchWithAuth } from '../../services/apiService';
import { BsFillCaretDownFill } from 'react-icons/bs'
import toastr from 'toastr';
import ImageCross from '../../assets/red-cross.png'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Layout = () => {
    const nav = useNavigate();
    const { game_id } = useParams();
    const [loading, setLoading] = useState(false);
    const [games, setGames] = useState([]);
    const [conventions, setConventions] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const [currentView, setCurrentView] = useState("list");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedConvention, setSelectedConvention] = useState(null);
    const [selectedConditions, setSelectedConditions] = useState([]);
    const dummyList = ['Brand new', 'Excellent', 'Good', 'Fair', 'Below Average'];

    useEffect(() => {
        fetchGames();
        fetchConventions();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [games, searchQuery, selectedConvention, selectedConditions]);

    const fetchGames = async () => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/game_for_sale`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setGames(data);
        } catch (error) {
            console.error('Error fetching games:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchConventions = async () => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(`/user/convention`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setConventions(data);
        } catch (error) {
            console.error('Error fetching conventions:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...games];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(game =>
                game.game_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Convention filter
        if (selectedConvention) {
            filtered = filtered.filter(game => game.convention_id === selectedConvention);
        }

        // Condition filter
        if (selectedConditions.length > 0) {
            filtered = filtered.filter(game =>
                selectedConditions.includes(game.game_condition)
            );
        }

        setFilteredGames(filtered);
    };

    return (
        <div className='flex flex-col w-[100vw] min-h-[100vh] max-h-fit overflow-y-auto bg-darkBlue'>
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
                </div>
            )}
            <Navbar type={"verified"} />
            <div className='md:px-[2rem] px-[1rem] bg-darkBlue h-[86vh] w-[100vw] pt-3 overflow-y-auto'>
                <div className='flex justify-between items-center'>
                    <h1 className='text-3xl font-semibold text-white'>Games for sales</h1>
                    <div className='flex gap-x-2 items-center'>
                        <p className='text-white'>{filteredGames.length} games for sale</p>
                        <div className='border border-lightOrange flex items-center w-[fit] justify-center h-[2rem]'>
                            <IoListSharp onClick={() => setCurrentView("list")} className={`text-white h-full w-[2rem] p-2 cursor-pointer ${currentView === "list" && ' bg-lightOrange'}`} />
                            <TbGridDots onClick={() => setCurrentView("grid")} className={`text-white h-full w-[2rem] p-2 cursor-pointer ${currentView === "grid" && ' bg-lightOrange'}`} />
                        </div>
                    </div>
                </div>

                <div className='flex justify-between items-start gap-x-[2rem] mt-5 md:flex-row flex-col'>

                    {/* Games Grid/List View */}
                    {
                        filteredGames.length > 0 ? (
                            currentView === "grid" ?
                                <div className='flex-1 flex justify-between items-center flex-wrap md:order-1 order-2'>
                                    {
                                        filteredGames.map((game) => (
                                            <div onClick={() => nav(`/game/single/${game.id}`)} key={game.id} className='min-w-full sm:min-w-[15rem] max-w-full sm:max-w-[15rem] h-[18rem] cursor-pointer rounded-md bg-[#0D2539] mx-2 my-2'>
                                                <img src={game.game_image || ConventionImage} alt="" className='w-full sm:w-[15rem] h-[11rem] object-cover' />
                                                <p className='py-2 mx-2 text-white text-sm'>{game.game_name}</p>
                                                <div className='flex gap-x-2 items-center mx-2'>
                                                    <p className='text-white'>{game.game_currency_symbol}{game.game_price}</p>
                                                    <div className='w-[1px] h-[1rem] bg-white'></div>
                                                    <p className='text-white'>{game.game_condition}</p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                :
                                <div className='flex-1 md:order-1 order-2'>
                                    {filteredGames.map((game) => (
                                        <div
                                            onClick={() => nav(`/game/single/${game.id}`)}
                                            key={game.id}
                                            className='rounded-md bg-[#0D2539] cursor-pointer flex gap-x-5 items-left mb-2 p-3'
                                        >
                                            <img
                                                src={game.game_image || ConventionImage}
                                                alt=""
                                                className='w-[3rem] h-[3rem] object-cover'
                                            />
                                            <div>
                                                <p className='py-2 mx-2 text-white text-sm'>
                                                    {game.game_name}
                                                    <span className="py-2 mx-2 text-white font-bold">
                                                        Sold By: {game.user_name}
                                                        {game.game_status === "sold" && (
                                                            <span className="text-red font-bold ml-2">(SOLD)</span>
                                                        )}
                                                    </span>
                                                </p>
                                                <div className='flex gap-x-2 items-center mx-2'>
                                                    <p className='text-white'>
                                                        {game.game_currency_symbol}
                                                        {game.game_price}
                                                    </p>
                                                    <div className='w-[1px] h-[1rem] bg-white'></div>
                                                    <p className='text-white'>{game.game_condition}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                        ) : (
                            <div className='w-[100%] h-[52.5vh] mt-4 bg-[#0d2539] rounded-md flex justify-center items-center flex-col'>
                                <img className='justify-center' src={ImageCross} alt="" />
                                <h1 className='text-lg text-center font-semibold mt-3 mb-5 text-white'>No games available</h1>


                            </div>
                        )
                    }


                    {/* Filters */}
                    <div className='bg-[#0D2539] w-full md:w-[15rem] px-2 py-4 rounded-md md:mb-0 mb-4 md:order-2 order-1'>
                        <Input
                            name={"search"}
                            placeholder={"Game Search..."}
                            className={"w-full h-[2.3rem] rounded-md px-2 bg-darkBlue outline-none text-white"}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        <h1 className=' text-white font-semibold mt-2 mb-2'>Show By Convention</h1>
                        <select
                            className="w-full h-[2.3rem] bg-darkBlue text-white rounded-md"
                            onChange={(e) => setSelectedConvention(parseInt(e.target.value))}
                            value={selectedConvention || ""}
                        >
                            <option value="" className="text-gray-300">All Conventions</option>
                            {conventions.map(convention => (
                                <option key={convention.id} value={convention.id}>
                                    {convention.convention_name}
                                </option>
                            ))}
                        </select>

                        <h1 className=' text-white font-semibold mt-2 mb-2'>Condition</h1>
                        {dummyList.map((condition, index) => (
                            <div key={index} className='flex items-center gap-x-3 mb-1'>
                                <input
                                    type="checkbox"
                                    checked={selectedConditions.includes(condition)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedConditions([...selectedConditions, condition]);
                                        } else {
                                            setSelectedConditions(selectedConditions.filter(c => c !== condition));
                                        }
                                    }}
                                />
                                <p className='text-white'>{condition}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Layout;
