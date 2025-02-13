import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Bottom from '../../layout/Footer/Bottom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Ensure this is set in your .env file

const FeedBack = () => {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
  });

  // Loading and Message State
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Simple Validation Function
const validateForm = () => {
  let newErrors = {};

  if (!formData.name.trim()) {
    newErrors.name = 'Name is required';
  } else if (formData.name.length < 3) {
    newErrors.name = 'Name must be at least 3 characters';
  }

  if (!formData.email.trim()) {
    newErrors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Invalid email format';
  }

  if (!formData.description.trim()) {
    newErrors.description = 'Message is required';
  } else if (formData.description.length < 10) {
    newErrors.description = 'Message must be at least 10 characters';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

  if (!validateForm()) {
    return; // Stop submission if validation fails
  }
    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage('Your feedback has been sent successfully!');
        setFormData({ name: '', email: '', description: '' });
      } else {
        setMessage(result.message || 'Failed to send feedback.');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className='flex flex-col w-[100vw]'>
      <Navbar />

      <div className='flex justify-between h-[100vh] md:flex-row flex-col bg-darkBlue p-[1rem] md:p-[2rem] gap-x-[4rem]'>

        <div className='md:w-fit w-[100%] md:w-[100%] flex flex-col items-start'>
          <div className='pb-4'>
            <h1 className='text-3xl text-white font-semibold'>Feedback form</h1>
          </div>
          <div className=''>
            <p className='text-white'>The best way to tell us about your experience using</p>
            <p className='text-white pb-4'>TotallyTableTop is to fill in this form, and we’ll get your feedback right away. </p>
          </div>
        </div>

        <div className='md:w-[40%] w-[100%] md:block flex-col'>
          <div className='w-[100%] md:w-[100%] bg-[#0d2539] px-[2rem] py-[2rem] border-r-2 border-b-2 border-[#f3c15f] boxshadow-[4px 4px 0px #F3C15F]'>
            <div className='pb-4'>
              <h1 className='text-2xl text-white font-semibold'>Tell us what you think</h1>
            </div>
            <form onSubmit={handleSubmit}>
  <div>
    <Input
      placeholder="Your name"
      name="name"
      type="text"
      className="w-full h-12 px-3 text-white bg-darkBlue mb-2 outline-none"
      value={formData.name}
      onChange={handleChange}
    />
    {errors.name && <p className="text-red">{errors.name}</p>}
  </div>

  <div>
    <Input
      placeholder="Your email address"
      name="email"
      type="email"
      className="w-full h-12 px-3 text-white bg-darkBlue mb-2 outline-none"
      value={formData.email}
      onChange={handleChange}
    />
    {errors.email && <p className="text-red">{errors.email}</p>}
  </div>

  <div className="relative w-full pb-4">
    <Textarea
      name="description"
      className="peer h-full min-h-[100px] w-full resize-none px-3 py-2.5 bg-darkBlue mt-3 text-white outline-none"
      placeholder="Your message - write as much as you like"
      value={formData.description}
      onChangeFunc={handleChange}
    />
    {errors.description && <p className="text-red">{errors.description}</p>}
  </div>

  <Button
    title={loading ? 'Sending...' : 'Send Message'}
    className="w-full h-12 text-white bg-lightOrange"
    type="submit"
    disabled={loading}
  />
</form>

{message && <p className="text-white mt-4">{message}</p>}

          </div>
          
        </div>

      </div>
      
      <Bottom />
    </div>
  );
}

export default FeedBack;
