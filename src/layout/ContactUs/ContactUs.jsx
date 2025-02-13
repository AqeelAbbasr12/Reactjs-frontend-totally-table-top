import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Bottom from '../../layout/Footer/Bottom';

const API_BASE_URL = "http://127.0.0.1:8000/api";

const ContactUS = () => {
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
    setMessage('');

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/contactus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Your message has been sent successfully!');
        setFormData({ name: '', email: '', description: '' });
      } else {
        setMessage(result.message || 'Failed to send message.');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className='flex flex-col w-full'>
      <Navbar />

      <div className='flex flex-col md:flex-row h-screen bg-darkBlue p-4 md:p-8 gap-4 justify-center items-center'>
        <div className='md:w-1/2 w-full flex flex-col items-start'>
          <div className='pb-4'>
            <h1 className='text-3xl text-white font-semibold'>Contact Us</h1>
          </div>
          <p className='text-white'>The best way to get in touch with us is to fill in this form,</p>
          <p className='text-white pb-4'>and we’ll get your message right away.</p>
          <p className="text-white">
            Alternatively, you can email{' '}
            <a href="mailto:hello@totallytabletop.com" className="text-f3c15f">
              hello@totallytabletop.com
            </a>
          </p>
        </div>

        <div className='md:w-1/2 w-full flex flex-col'>
          <div className='w-full bg-[#0d2539] px-4 py-4 border-r-2 border-b-2 border-[#f3c15f] shadow-[4px 4px 0px #F3C15F]'>
            <div className='pb-4'>
              <h1 className='text-2xl text-white font-semibold'>Send us a message</h1>
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
};

export default ContactUS;
