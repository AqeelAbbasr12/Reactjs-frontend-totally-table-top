// src/services/apiService.js
import { refreshToken } from './authService';
import toastr from 'toastr';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const fetchWithAuth = async (url, options = {}) => {
//   let authToken = localStorage.getItem('authToken');
  
//   const defaultHeaders = {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${authToken}`,
//   };

//   const response = await fetch(`${API_BASE_URL}${url}`, {
//     ...options,
//     headers: {
//       ...defaultHeaders,
//       ...options.headers, // merge any additional headers
//     },
//   });
//   // console.log(response.status);
//   if (response.status === 403) {
//     // Clear tokens
//     toastr.error('Access Denied! Your account has been blocked by the admin.');
//     setTimeout(() => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('refreshToken');
  
//     // Show toastr error message
  
//     console.log('User is blocked');
  
//     // Delay redirection by 5 seconds (5000 milliseconds)
    
//       window.location.href = '/'; // Redirect to login page
//     }, 4000);
//   }
  
  
//   if (response.status === 500) { // If unauthorized, try to refresh token
    
//     try {
//       const newAuthToken = await refreshToken(); // Attempt to refresh token
//       // Retry the original request with the new token
//       const retryResponse = await fetch(`${API_BASE_URL}${url}`, {
//         ...options,
//         headers: {
//           ...defaultHeaders,
//           'Authorization': `Bearer ${newAuthToken}`,
//         },
//       });
//       return retryResponse; // Return the retried response
//     } catch (error) {
//       console.error("Token refresh failed:", error);
//       // Optionally, handle redirection to login page or logout
//       localStorage.removeItem('authToken');
//       localStorage.removeItem('refreshToken');
//       window.location.href = '/'; // Redirect to login
//     }
//   }

//   return response;
// };

let hasAccessDeniedBeenShown = false; // Global flag to track if access denied toast has been shown

const fetchWithAuth = async (url, options = {}) => {
  let authToken = localStorage.getItem('authToken');
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers, // Merge any additional headers
    },
  });

  // Check if the response status is 403 (Forbidden)
  if (response.status === 403) {
    // If the toast has not been shown yet
    if (!hasAccessDeniedBeenShown) {
      toastr.error('Access Denied! Your account has been blocked by the admin.');
      hasAccessDeniedBeenShown = true; // Set the flag to true to prevent repeated toast messages
      
      // Delay the redirection after showing the toastr message
      setTimeout(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        console.log('User is blocked');
        window.location.href = '/'; // Redirect to login page
      }, 4000); // Show the error message for 4 seconds before redirecting
    }
  }

  // Check if the response status is 500 (Internal Server Error), and attempt to refresh token
  if (response.status === 500) {
    try {
      const newAuthToken = await refreshToken(); // Attempt to refresh token

      // Retry the original request with the new token
      const retryResponse = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${newAuthToken}`,
        },
      });
      return retryResponse; // Return the retried response
    } catch (error) {
      console.error("Token refresh failed:", error);

      // Optionally, handle redirection to login page or logout
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/'; // Redirect to login
    }
  }

  return response;
};

// Function to reset the access denied flag (called when user is unblocked)
const resetAccessDeniedFlag = () => {
  hasAccessDeniedBeenShown = false; // Reset the flag to allow the next 403 error to trigger the toastr message
};


export { fetchWithAuth };
