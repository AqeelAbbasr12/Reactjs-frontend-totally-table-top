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
        });
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

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      const response = await fetch(`${API_BASE_URL}/user/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Profile updated:', data);
      toastr.success('Profile updated successfully');
      // You might want to handle successful update here
    } catch (error) {
      console.error('Error updating profile:', error);
      toastr.error('Error updating profile');
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
        <Left />

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
                    className={`w-[11rem] h-[2.3rem] rounded-md px-3 bg-darkBlue text-white`}
                    placeholder={"Marry"}
                  />
                  <Input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={`w-[11rem] h-[2.3rem] rounded-md px-3 bg-darkBlue text-white`}
                    placeholder={"Harward"}
                  />
                </div>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-[23.3rem] h-[2.3rem] rounded-md px-3 bg-darkBlue mt-3 text-white`}
                  placeholder={"Marry@email.com"}
                />
                <p className='mt-4 border-b border-b-[#F2F0EF] text-[#F2F0EF] pb-2'>@{userData.username}</p>
                <p className='mt-2 text-[#F2F0EF] pb-2'>Username cannot be changed</p>
                <div className="pb-4">
                  <div className="relative w-[23.3rem] h-[2.3rem] mt-3">
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full h-full rounded-md px-3 bg-darkBlue pr-10 text-white`}
                      placeholder={"Bristol"}
                    />
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
                    className={`peer h-full min-h-[100px] w-full resize-none rounded-md px-3 bg-darkBlue mt-3 px-3 py-2.5 text-white`}
                    placeholder={"Your biography (160 characters)"}
                  />
                </div>
                <div className='pb-2'>
                  <Button title={"Save changes"} type="submit" className={`w-[8rem] h-[2.3rem] text-white bg-[#F77F00] rounded-md`} />
                </div>
              </div>

              <div className='sm:mt-0 mt-3'>
                <img src={userData.profile_picture || FaceImage} alt="" className='w-[10rem] h-[10rem] rounded-full' />
                <Button title={"Upload Picture"} type="file" className={`w-[8rem] mt-2 h-[2.3rem] text-white border border-[#F77F00] rounded-md`} />
              </div>
            </div>

            <div className='pb-4'>
              <h1 className='text-white font-semibold mt-3'>Your password</h1>
              <Input
                name="cpassword"
                className={`w-[23.3rem] h-[2.3rem] rounded-md px-3 bg-darkBlue mt-3 block text-white`}
                placeholder={"Current Password"}
              />
              <Input
                name="npassword"
                className={`w-[23.3rem] h-[2.3rem] rounded-md px-3 bg-darkBlue mt-3 block text-white`}
                placeholder={"New Password"}
              />
              <Input
                name="cnfpsw"
                className={`w-[23.3rem] h-[2.3rem] rounded-md px-3 bg-darkBlue mt-3 block text-white`}
                placeholder={"Confirm New Password"}
              />
            </div>

            <div className='pb-4'>
              <Button title={"Update password"} type="button" className={`w-[10rem] h-[2.3rem] text-white bg-[#F77F00] rounded-md mt-2`} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
