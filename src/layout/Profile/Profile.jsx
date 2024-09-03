import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Left from '../../components/Left';
import FaceImage from '../../assets/face.avif';
import MapIcon from '../../assets/mapMarker.png';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
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
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureURL, setProfilePictureURL] = useState(null);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordFormData, setPasswordFormData] = useState({
    cpassword: '',
    npassword: '',
    cnfpsw: ''
  });


  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/user/get`, {
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
          console.log(data);
          setUserData(data);
          setFormData({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            email: data.email || '',
            location: data.location || '',
            bio: data.bio || '',
            profilePicture: data.profile_picture || '',
          });
          // Set initial profile picture URL
        } catch (error) {
          console.error('Error fetching user data:', error);
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
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const url = URL.createObjectURL(file);
      setProfilePictureURL(url);
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
        console.log('Profile updated:', result);
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

    // Create a FormData object for password fields
    const passwordFormDataToSend = new FormData();
    passwordFormDataToSend.append('current_password', passwordFormData.cpassword);
    passwordFormDataToSend.append('new_password', passwordFormData.npassword);
    passwordFormDataToSend.append('new_password_confirmation', passwordFormData.cnfpsw); // Adjust if necessary

    // Log the form data to inspect its contents
    for (let pair of passwordFormDataToSend.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/update-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          // No Content-Type header needed for FormData
        },
        body: passwordFormDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Password updated:', result);
        toastr.success('Password updated successfully');
        setPasswordFormData({
          cpassword: '',
          npassword: '',
          cnfpsw: ''
        });
        setPasswordErrors({});
      } else {
        // Check if the error is a direct message
        if (result.errors) {
          if (typeof result.errors === 'string') {
            toastr.error(result.errors);
          } else {
            // Handle validation errors if `errors` is an object
            const mappedErrors = {
              cpassword: result.errors.current_password || [],
              npassword: result.errors.new_password || [],
              cnfpsw: result.errors.confirm_password || [] // Adjust if necessary
            };
            setPasswordErrors(mappedErrors);
          }
        } else if (result.message) {
          // Handle other types of errors if `message` is present
          toastr.error(result.message);
        } else {
          // Handle a generic failure message
          toastr.error('Password update failed');
        }
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toastr.error('An error occurred. Please try again.');
      setPasswordErrors({ form: 'An error occurred. Please try again.' });
    }
  };






  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col w-[100vw] h-[100vh]'>
      <Navbar type={"verified"} />
      <div className='pt-[2.3rem] flex justify-between items-start md:flex-row flex-col bg-darkBlue md:px-[2rem] flex-1 h-[fit] md:h-[86rem] w-[100vw] gap-x-6'>
        {/* LEFT */}
        <Left/>

        {/* RIGHT */}
        <div className='flex-1 rounded-md px-2 mb-2 w-full md:mt-0 mt-4'>
          <div className='sm:flex justify-between items-center'>
            <h1 className='text-white text-2xl font-semibold'>Edit your profile</h1>
            <Button onClick={() => navigate("/ownFeed")} title={"View Profile"} className={'w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange sm:mt-0 mt-2'} />
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
                    className={`w-[11rem] h-[2.3rem] rounded-md px-3 bg-darkBlue text-white ${errors.first_name ? 'border-red' : ''}`}
                    placeholder={"Marry"}
                  />
                  {errors.first_name && <p className='text-red'>{errors.first_name.join(', ')}</p>}

                  <Input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={`w-[11rem] h-[2.3rem] rounded-md px-3 bg-darkBlue text-white ${errors.last_name ? 'border-red' : ''}`}
                    placeholder={"Harward"}
                  />
                  {errors.last_name && <p className='text-red'>{errors.last_name.join(', ')}</p>}
                </div>

                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-[23.3rem] h-[2.3rem] rounded-md px-3 bg-darkBlue mt-3 text-white ${errors.email ? 'border-red' : ''}`}
                  placeholder={"Marry@email.com"}
                />
                {errors.email && <p className='text-red'>{errors.email.join(', ')}</p>}

                <p className='mt-4 border-b border-b-[#F2F0EF] text-[#F2F0EF] pb-2'>@{userData.username}</p>
                <p className='mt-2 text-[#F2F0EF] pb-2'>Username cannot be changed</p>

                <div className="pb-4">
                  <div className="relative w-[23.3rem] h-[2.3rem] mt-3">
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full h-full rounded-md px-3 bg-darkBlue pr-10 text-white ${errors.location ? 'border-red' : ''}`}
                      placeholder={"Bristol"}
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
                    className={`peer h-full min-h-[100px] w-full resize-none rounded-md px-3 bg-darkBlue mt-3 px-3 py-2.5 text-white ${errors.bio ? 'border-red' : ''}`}
                    placeholder={"Your biography (160 characters)"}
                  />
                  {errors.bio && <p className='text-red'>{errors.bio.join(', ')}</p>}
                </div>

                <div className='pb-2'>
                  <Button title={"Save changes"} type="submit" className={`w-[8rem] h-[2.3rem] text-white bg-[#F77F00] rounded-md`} />
                </div>
              </div>

              <div className='sm:mt-0 mt-3'>
                <img
                  src={profilePictureURL || formData.profilePicture || FaceImage} // Use the URL if available, otherwise fallback to dynamic or default image
                  alt="Profile"
                  className='w-[10rem] h-[10rem] rounded-full'
                />
                <input
                  type="file"
                  id="profilePictureInput"
                  className="hidden" // Hide the default file input
                  onChange={handleProfilePictureChange}
                  accept="image/png, image/jpeg"
                />
                <label
                  htmlFor="profilePictureInput" // Associate the label with the input
                  className="w-[8rem] mt-2 h-[2.3rem] text-white border border-[#F77F00] rounded-md flex items-center justify-center cursor-pointer"
                >
                  Upload Picture
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
                onChange={e => setPasswordFormData({ ...passwordFormData, cpassword: e.target.value })}
                className={`w-[23.3rem] h-[2.3rem] rounded-md px-3 bg-darkBlue mt-3 block text-white ${passwordErrors.cpassword ? 'border-red' : ''}`}
                placeholder={"Current Password"}
              />
              {passwordErrors.cpassword && <p className='text-red'>{passwordErrors.cpassword.join(', ')}</p>}

              <Input
                name="npassword"
                type="password"
                value={passwordFormData.npassword}
                onChange={e => setPasswordFormData({ ...passwordFormData, npassword: e.target.value })}
                className={`w-[23.3rem] h-[2.3rem] rounded-md px-3 bg-darkBlue mt-3 block text-white ${passwordErrors.npassword ? 'border-red' : ''}`}
                placeholder={"New Password"}
              />
              {passwordErrors.npassword && <p className='text-red'>{passwordErrors.npassword.join(', ')}</p>}

              <Input
                name="cnfpsw"
                type="password"
                value={passwordFormData.cnfpsw}
                onChange={e => setPasswordFormData({ ...passwordFormData, cnfpsw: e.target.value })}
                className={`w-[23.3rem] h-[2.3rem] rounded-md px-3 bg-darkBlue mt-3 block text-white ${passwordErrors.cnfpsw ? 'border-red' : ''}`}
                placeholder={"Confirm New Password"}
              />
              {passwordErrors.cnfpsw && <p className='text-red'>{passwordErrors.cnfpsw.join(', ')}</p>}
            </div>

            <div className='pb-4'>
              <Button title={"Update password"} type="submit" className={`w-[10rem] h-[2.3rem] text-white bg-[#F77F00] rounded-md mt-2`} />
            </div>
          </form>



        </div>
      </div>
    </div>
  );
};

export default Profile;
