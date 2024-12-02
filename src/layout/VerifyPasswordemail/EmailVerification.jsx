import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toastr from 'toastr';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EmailVerification = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/email/password/verify/${id}/${token}`);
        const data = await response.json();
        console.log('API Response:', data);

        if (response.ok) {
          toastr.success(data.message || 'Your email has been verified!');
          setTimeout(() => {
            navigate('/reset'); // Redirect to homepage after a successful verification
          }, 2000); // 2 seconds delay
        } else {
          toastr.error(data.message || 'Invalid or expired verification link.');
          setTimeout(() => {
            navigate('/forget'); // Redirect to homepage after a successful verification
          }, 2000); // 2 seconds delay
          
        }
      } catch (error) {
        toastr.error('An error occurred while verifying your email.');
        setTimeout(() => {
          navigate('/forget'); // Redirect to homepage after a successful verification
        }, 2000); // 2 seconds delay
      } finally {
        setLoading(false); // Stop loading spinner after request is done
      }
    };

    verifyEmail();
  }, [id, token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {loading ? (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700">We are verifying your email. Please wait...</p>
        </div>
      ) : (
        <div>
          {/* You can also add a loading spinner or message for the non-loading state */}
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
