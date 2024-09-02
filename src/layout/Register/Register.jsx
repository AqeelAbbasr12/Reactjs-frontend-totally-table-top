import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import Bottom from '../../layout/Footer/Bottom';
import Icon from '../../assets/Icon-check-circle.svg';

// Make sure to use REACT_APP_ prefix in .env file and access it as shown below
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const Register = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        c_password: '',
        create_password: '',
    });

    const data = [
        "Sell and buy board games in advance of a convention", 
        "Create an agenda for each stand you wish to visit", 
        "Instantly invite friends to play games and events"
    ];
    const nav = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const [errors, setErrors] = React.useState({});

    const handleSubmit = async () => {
    // Ensure passwords match
    if (formData.c_password !== formData.create_password) {
        setErrors({ ...errors, password: "Passwords do not match" });
        return;
    }

    // Add additional validation as needed
    if (formData.firstname === '' || formData.lastname === '' || formData.email === '' || formData.username === '' || formData.c_password === '') {
        setErrors({ ...errors, form: "Please fill out all fields." });
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                first_name: formData.firstname,
                last_name: formData.lastname,
                email: formData.email,
                username: formData.username,
                password: formData.c_password,
                password_confirmation: formData.create_password,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            nav("/acknowledge");
        } else {
            // Handle validation errors
            if (result.errors) {
                setErrors(result.errors);  // Update errors state
            } else {
                setErrors({ form: result.message || "Registration failed" });
            }
        }
    } catch (error) {
        console.error("Error during registration:", error);
        setErrors({ form: "An error occurred. Please try again." });
    }
};

    

return (
    <div className='flex flex-col w-[100vw] h-[100vh]'>
        <Navbar />

        <div className='flex justify-center items-center md:flex-row flex-col bg-darkBlue md:px-[2rem] flex-1 h-[90vh] md:h-[86rem] w-[100vw] gap-x-6'>
            <div className='bg-[#0d2539] w-[98%] md:w-[70%] lg:w-[50%] border-r-4 border-b-4 border-[#f3c15f] p-4'>
                <h1 className='text-white text-lg font-semibold mb-2'>Create an account</h1>
                <p className='text-white'>It only takes a minute</p>

                <div className='flex justify-between items-center gap-x-4 mt-3 sm:flex-row flex-col'>
                    <Input 
                        placeholder={"First Name"} 
                        name={"firstname"} 
                        type={"text"} 
                        className={`sm:flex-1 flex-none w-full sm:mb-0 mb-3 h-[2.3rem] px-3 rounded-md bg-darkBlue text-white ${errors.firstname ? 'border-red' : ''}`} 
                        value={formData.firstname} 
                        onChange={handleChange} 
                    />
                    {errors.firstname && <p className='text-red'>{errors.firstname.join(', ')}</p>}
                    
                    <Input 
                        placeholder={"Last Name"} 
                        name={"lastname"} 
                        type={"text"} 
                        className={`sm:flex-1 flex-none w-full sm:mb-0 h-[2.3rem] px-3 rounded-md bg-darkBlue text-white ${errors.lastname ? 'border-red' : ''}`} 
                        value={formData.lastname} 
                        onChange={handleChange} 
                    />
                    {errors.lastname && <p className='text-red'>{errors.lastname.join(', ')}</p>}
                </div>
                <Input 
                    placeholder={"Email Address"} 
                    name={"email"} 
                    type={"email"} 
                    className={`w-[100%] mt-3 h-[2.3rem] px-3 rounded-md bg-darkBlue text-white ${errors.email ? 'border-red' : ''}`} 
                    value={formData.email} 
                    onChange={handleChange} 
                />
                {errors.email && <p className='text-red'>{errors.email.join(', ')}</p>}

                <Input 
                    placeholder={"@ Choose a username"} 
                    name={"username"} 
                    type={"text"} 
                    className={`w-[100%] mt-3 h-[2.3rem] px-3 rounded-md bg-darkBlue text-white ${errors.username ? 'border-red' : ''}`} 
                    value={formData.username} 
                    onChange={handleChange} 
                />
                {errors.username && <p className='text-red'>{errors.username.join(', ')}</p>}
                
                <p className='text-white mt-3'>Select a username. Cannot already be in use, cannot be changed </p>
                
                <Input 
                    placeholder={"Create Password"} 
                    name={"c_password"} 
                    type={"password"} 
                    className={`w-[100%] mt-3 h-[2.3rem] px-3 rounded-md bg-darkBlue text-white ${errors.password ? 'border-red' : ''}`} 
                    value={formData.c_password} 
                    onChange={handleChange} 
                />
                {errors.password && <p className='text-red'>{errors.password}</p>}
                
                <Input 
                    placeholder={"Confirm Password"} 
                    name={"create_password"} 
                    type={"password"} 
                    className={`w-[100%] mt-3 h-[2.3rem] px-3 rounded-md bg-darkBlue text-white ${errors.password_confirmation ? 'border-red' : ''}`} 
                    value={formData.create_password} 
                    onChange={handleChange} 
                />
                {errors.password_confirmation && <p className='text-red'>{errors.password_confirmation}</p>}

                {errors.form && <p className='text-red'>{errors.form}</p>}

                <Button 
                    onClickFunc={handleSubmit} 
                    title={"Submit"} 
                    className={"w-[10rem] h-[2.3rem] rounded-md text-white bg-lightOrange mt-3"} 
                />
            </div>

            <div className='bg-[#0d2539] w-[98%] md:w-[30%] p-4 mt-3 md:mt-0 border-r-4 border-b-4 border-[#f3c15f]'>
                {
                    data.map((i, index) => (
                        <div className='flex gap-x-5 items-center mt-2' key={index}>
                            <div className='w-[1.3rem] h-[1.3rem] flex justify-center items-center rounded-full'>
                                <img src={Icon} alt="" />
                            </div>
                            <div>
                                <p className='text-white'>{i}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>

        <Bottom />
    </div>
);

};

export default Register;
