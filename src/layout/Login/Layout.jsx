import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';
import logoImage from '../../assets/image.png';
import Icon from '../../assets/Icon-check-circle.svg';

// Make sure to use REACT_APP_ prefix in .env file and access it as shown below
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Layout = () => {
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  
  const data = [
    "Sell and buy board games in advance of a convention",
    "Create an agenda for each stand you wish to visit",
    "Instantly invite friends to play games and events"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', result.token);
        // Navigate to the home page or handle successful login
        nav("/home");
        
      } else {
        // Handle validation errors
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setErrors({ form: result.message || "Login failed" });
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrors({ form: "An error occurred. Please try again." });
    }
  };

  return (
    <div className='w-screen h-screen bg-darkBlue flex justify-center items-center'>
      <div className='flex justify-center items-start md:flex-row flex-col w-[100%] gap-x-[0rem] md:w-[70%] md:gap-x-[7rem]'>

        <div className='md:w-fit w-[100%] md:block flex  flex-col items-center'>
          {/* LOGO  */}
          <div className='flex'>
            <div className='w-[6rem] h-[6rem] '>
              <img src={logoImage} alt='' />
            </div>
            {/* HEADING  */}
            <div>
              <h1 className='text-5xl text-white font-semibold'>Totally TableTop</h1>
              <p className='text-gray-400 ml-2 mt-2'>CONVENTIONS, MANAGED</p>
            </div>
          </div>
          {/* TICK  */}
          {
            data.map((i, index) => (
              <div className='md:flex hidden gap-x-5 items-center mt-2 ' key={index}>
                <div className='w-[1.3rem] h-[1.3rem] flex justify-center items-center rounded-full'>
                  <img src={Icon} alt="" />
                </div>
                <div>
                  <p className='text-white'>{i}</p>
                </div>
              </div>
            ))
          }
          <p className='text-white mt-[1rem] md:flex hidden'>Find out more</p>
        </div>

        <div className='md:w-[40%] w-[100%] md:block flex justify-center items-center flex-col'>
          <div className='w-[80%] md:w-[100%] bg-[#0d2539] px-[2rem] py-[2rem] rounded-md'>
            <form onSubmit={handleSubmit}>
              <Input 
                placeholder={"Email Address"} 
                name={"email"} 
                type={"text"} 
                className={`w-[100%] h-[2.3rem] px-3 rounded-md text-white bg-darkBlue mb-3 outline-none ${errors.email ? 'border-red' : ''}`} 
                value={formData.email} 
                onChange={handleChange} 
              />
              {errors.email && <p className='text-red'>{errors.email.join(', ')}</p>}
              
              <Input 
                placeholder={"Password"} 
                name={"password"} 
                type={"password"} 
                className={`w-[100%] h-[2.3rem] px-3 rounded-md text-white bg-darkBlue mb-3 outline-none ${errors.password ? 'border-red' : ''}`} 
                value={formData.password} 
                onChange={handleChange} 
              />
              {errors.password && <p className='text-red'>{errors.password.join(', ')}</p>}
              
              {errors.form && <p className='text-red'>{errors.form}</p>}
              
              <Button 
                type="submit"
                title={"Login"} 
                className={"w-[100%] h-[2.3rem] rounded-md text-white bg-lightOrange"} 
              />
              <p onClick={() => nav("/forget")} className='text-white text-center mt-3 cursor-pointer'>Lost your password?</p>
            </form>
          </div>
          <div className='w-[80%] md:w-[100%] px-[2rem] py-[2rem] rounded-md'>
            <Button 
              onClickFunc={() => nav("/register")} 
              title={"Create An Account"} 
              className={"w-[100%] h-[2.3rem] rounded-md text-white bg-transparent border border-white mt-3"} 
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Layout;
