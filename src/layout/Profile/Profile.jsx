import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Left from '../../components/Left';
import FaceImage from '../../assets/face.avif';
import MapIcon from '../../assets/mapMarker.png';
import Input from '../../components/Input';
import Swal from 'sweetalert2';
import Textarea from '../../components/Textarea';
import { fetchWithAuth } from "../../services/apiService";
import imageCompression from 'browser-image-compression';
import toastr from 'toastr';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const [userData, setUserData] = useState(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    location: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureURL, setProfilePictureURL] = useState(null);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordFormData, setPasswordFormData] = useState({
    cpassword: '',
    npassword: '',
    cnfpsw: ''
  });


  const [errors, setErrors] = useState({});

  const nav = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchWithAuth(`/user/get`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        setUserData(data);
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          location: data.location || '',
          bio: data.bio || '',
          profilePicture: data.profile_picture || '',
        });
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Check file size (10 MB limit)
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 20) {
        toastr.warning('Image size exceeds 20 MB, cannot compress this image.');
        return;
      }

      // Compression options
      const options = {
        maxSizeMB: 1, // 1 MB limit
        maxWidthOrHeight: 800, // Resize to fit within 800x800px
        useWebWorker: true,
        fileType: file.type // Preserve original file type
      };

      try {
        // Compress image if size is greater than 1 MB
        let compressedFile = file;
        if (fileSizeInMB > 1) {
          compressedFile = await imageCompression(file, options);
        }

        // Create a new File object with the original name and file type
        const newFile = new File([compressedFile], file.name, {
          type: file.type,
          lastModified: Date.now(),
        });

        // Create a URL for the compressed image
        const compressedURL = URL.createObjectURL(newFile);

        // Set profile picture and URL
        setProfilePicture(newFile); // Use the new File object
        setProfilePictureURL(compressedURL);
      } catch (error) {
        console.error('Error during image compression:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Create a FormData object
    const formDataToSend = new FormData();

    // Append form data fields
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    // Append the profile picture if it's set
    if (profilePicture) {
      formDataToSend.append('profile_picture', profilePicture); // Append file object
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/update-profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          // Note: Do not set Content-Type header for FormData, the browser will set it automatically
        },
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        toastr.success('Profile updated successfully');
        // Handle successful update here
        setErrors({});
      } else {
        // Handle validation errors
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setErrors({ form: result.message || "Profile update failed" });
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors({ form: "An error occurred. Please try again." });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Create a plain JavaScript object with the necessary fields
    const dataToSend = {
      current_password: passwordFormData.cpassword,
      new_password: passwordFormData.npassword,
      new_password_confirmation: passwordFormData.cnfpsw, // Laravel expects this for confirmation
    };

    // console.log("Data being sent:", dataToSend); // Debugging log

    try {
      const response = await fetchWithAuth(`/user/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Use JSON format
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(dataToSend), // Send as JSON
      });

      const result = await response.json();

      if (response.ok) {
        toastr.success('Password successfully updated');
        setPasswordFormData({
          cpassword: '',
          npassword: '',
          cnfpsw: '',
        });
        setPasswordErrors({});
      } else {
        if (result.errors) {
          if (typeof result.errors === 'string') {
            toastr.error(result.errors);
          } else {
            const mappedErrors = {
              cpassword: result.errors.current_password || [],
              npassword: result.errors.new_password || [],
              cnfpsw: result.errors.new_password_confirmation || [],
            };
            setPasswordErrors(mappedErrors);
          }
        } else if (result.message) {
          toastr.error(result.message);
        } else {
          toastr.error('Password update failed');
        }
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toastr.error('An error occurred. Please try again.');
      setPasswordErrors({ form: 'An error occurred. Please try again.' });
    }
  };

  // Define the handleDeleteProfile function
  const handleDeleteProfile = async () => {
    // Show the SweetAlert confirmation popup
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Create the form data (if needed, depending on your backend's requirements)
          const formDataToSend = new FormData();
  
          // Make the API request to delete the profile
          const response = await fetch(`${API_BASE_URL}/user/delete-profile`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: formDataToSend,  // Assuming FormData is needed, you can adjust this if necessary
          });
  
          // Handle the response
          if (response.ok) {
            const data = await response.json();
            // console.log(data);
            // console.log('Profile deleted successfully:', data);
  
            // Show success message with SweetAlert
            Swal.fire({
              title: "Deleted!",
              text: data.message,
              icon: "success"
            });
  
            // Optionally, display a success toastr notification
            toastr.success('Success',data.message);
            localStorage.setItem('authToken', result.token);
          localStorage.setItem('current_user_id', result.user_id);
          nav("/");
          } else {
            console.error('Error:', response.statusText);
            toastr.error('Error', 'Failed to delete the profile.');
          }
        } catch (error) {
          console.error('Error:', error);
          toastr.error('Error', 'An error occurred while deleting the profile.');
        }
      }
    });
  };
  



  return (
    <div className='flex flex-col w-[100vw] h-[100vh]'>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
        </div>
      )}
      <Navbar type={"verified"} />
      <div className='pt-[2.3rem] flex justify-between items-start md:flex-row flex-col bg-darkBlue md:px-[2rem] flex-1 h-[fit] md:h-[86rem] w-[100vw] gap-x-6'>
        {/* LEFT */}
        <Left />

        {/* RIGHT */}
        <div className='flex-1 rounded-md px-2 mb-2 w-full md:mt-0 mt-4'>
          <div className='sm:flex justify-between items-center'>
            <h1 className='text-white text-2xl font-semibold'>Edit your profile</h1>
            <Button onClickFunc={() => nav("/ownFeed")} title={"View Profile"} className={'w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange sm:mt-0 mt-2'} />
          </div>

          <form onSubmit={handleSubmit} className='w-[100%] h-[fit] mt-4 bg-[#0d2539] rounded-md p-3'>
            <h1 className='text-white font-semibold'>About you</h1>
            <div className='flex justify-between sm:items-center sm:flex-row flex-col'>
              <div>
                <div className='flex justify-start items-center gap-x-5 mt-3'>
                  <Input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`}
                    placeholder={"first name"}
                  />
                  {errors.first_name && <p className='text-red'>{errors.first_name.join(', ')}</p>}

                  <Input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`}
                    placeholder={"second name"}
                  />
                  {errors.last_name && <p className='text-red'>{errors.last_name.join(', ')}</p>}
                </div>

                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`}
                  placeholder={"email address"}
                />
                {errors.email && <p className='text-red'>{errors.email.join(', ')}</p>}

                <p className='mt-4 border-b border-b-[#F2F0EF] text-[#F2F0EF] pb-2'> {userData?.username || ''}</p>
                <p className='mt-2 text-[#F2F0EF] pb-2'>Username cannot be changed</p>

                <div className="pb-4">
                  <div className="relative  mt-3">
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`}
                      placeholder={"your location"}
                    />
                    {errors.location && <p className='text-red'>{errors.location.join(', ')}</p>}
                    <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                      <img src={MapIcon} alt="Location Icon" className="w-[15px] h-[20px]" />
                    </div>
                  </div>
                </div>

                <div className="relative w-full min-w-[200px] pb-4">
                  <Textarea
                    name="bio"
                    value={formData.bio}
                    onChangeFunc={handleInputChange}
                    className={`peer h-full min-h-[100px] w-full resize-none rounded-md bg-darkBlue mt-3 px-3 py-2.5 text-white ${errors.bio ? 'border-red' : ''}`}
                    placeholder={"Your biography (160 characters)"}
                  />
                  {errors.bio && <p className='text-red'>{errors.bio.join(', ')}</p>}
                </div>

                <div className="pb-2 flex justify-center sm:justify-start">
                  <Button
                    title={"Save changes"}
                    type="submit"
                    className="w-[8rem] h-[2.3rem] text-white bg-[#F77F00] rounded-md"
                  />
                </div>

              </div>

              <div className="flex flex-col items-center sm:mt-0 mt-3">
                <img
                  src={profilePictureURL || formData.profilePicture || FaceImage}
                  alt="Profile"
                  className="w-[10rem] h-[10rem] rounded-full object-cover" // Added object-cover
                />

                <input
                  type="file"
                  id="profilePictureInput"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                  accept="image/png, image/jpeg"
                />

                <label
                  htmlFor="profilePictureInput"
                  className="w-[12rem] mt-2 h-[2.3rem] text-white border border-[#F77F00] rounded-md flex items-center justify-center cursor-pointer"
                >
                  Upload Picture
                </label>
                <label
                  className="w-[12rem] mt-6 h-[2.3rem] text-white bg-red border border-red-700 rounded-md flex items-center justify-center cursor-pointer"
                  onClick={handleDeleteProfile}  // Attach the click event handler
                >
                  Delete Profile
                </label>
              </div>


            </div>
          </form>
          <form className='w-[100%] h-[fit] mt-4 bg-[#0d2539] rounded-md p-3' onSubmit={handlePasswordSubmit}>
            <div className='pb-4'>
              <h1 className='text-white font-semibold mt-3'>Your password</h1>
              <Input
                name="cpassword"
                type="password"
                value={passwordFormData.cpassword}
                onChange={handlePasswordInputChange}
                className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`}
                placeholder={"Current Password"}
              />
              {passwordErrors.cpassword && <p className='text-red'>{passwordErrors.cpassword.join(', ')}</p>}

              <Input
                name="npassword"
                type="password"
                value={passwordFormData.npassword}
                onChange={handlePasswordInputChange}
                className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`}
                placeholder={"New Password"}
              />
              {passwordErrors.npassword && <p className='text-red'>{passwordErrors.npassword.join(', ')}</p>}

              <Input
                name="cnfpsw"
                type="password"
                value={passwordFormData.cnfpsw}
                onChange={handlePasswordInputChange}
                className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`}
                placeholder={"Confirm New Password"}
              />
              {passwordErrors.cnfpsw && <p className='text-red'>{passwordErrors.cnfpsw.join(', ')}</p>}
            </div>

            <div className='pb-2 flex justify-center sm:justify-start'>
              <Button title={"Update password"} type="submit" className={`w-[10rem] h-[2.3rem] text-white bg-[#F77F00] rounded-md mt-2`} />
            </div>
          </form>



        </div>
      </div>
    </div>
  );
};

export default Profile;
