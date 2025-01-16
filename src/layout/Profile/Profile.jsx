import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Left from '../../components/Left';
import FaceImage from '../../assets/profile.jpeg';
import PostImageDefault from "../../assets/post.jpeg"; // Default image
import MapIcon from '../../assets/mapMarker.png';
import Input from '../../components/Input';
import Swal from 'sweetalert2';
import Textarea from '../../components/Textarea';
import { fetchWithAuth } from "../../services/apiService";
import imageCompression from 'browser-image-compression';
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
    newsletter_info: '',
    promotional_info: '',
    country: ''
  });
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureURL, setProfilePictureURL] = useState(null);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [content, setContent] = useState('');
  const [PostImage, setPostImage] = useState(null); // Store the uploaded file
  const [PostImagePreview, setPostImagePreview] = useState(""); // Store preview URL

  const [passwordFormData, setPasswordFormData] = useState({
    cpassword: '',
    npassword: '',
    cnfpsw: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    cpassword: false,
    npassword: false,
    cnfpsw: false,
  });


  const togglePasswordVisibility = (field) => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: checked ? "1" : "0", // Convert boolean to "1" or "0"
    }));
  };



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

        // Update user data state
        setUserData(data);

        // Initialize form data
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          location: data.location || '',
          bio: data.bio || '',
          country: data.country || '',
          newsletter_info: data.newsletter_info === "1" ? "1" : "0", // Map to "1" or "0"
          promotional_info: data.promotional_info === "1" ? "1" : "0", // Map to "1" or "0"
          profilePicture: data.profile_picture || '',
        });

        // Stop loading once data is fetched
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);

        // Ensure loading stops even on error
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Dependency array is empty to run only on component mount


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

  const handlePostImageChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file

    console.log(file);
    // Validate file type (e.g., only accept PNG or JPEG)
    if (!file || !["image/jpeg", "image/png"].includes(file.type)) {
      toastr.error("Invalid file type. Please upload a PNG or JPEG image.");
      return;
    }

    // Validate file size (e.g., max 2MB)
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSizeInBytes) {
      toastr.error("File size exceeds 2MB. Please upload a smaller image.");
      return;
    }

    // Generate and set the preview URL
    const imagePreviewUrl = URL.createObjectURL(file);
    setPostImage(file); // Store the file for uploading
    setPostImagePreview(imagePreviewUrl); // Update the preview
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
      console.log(result);

      if (response.ok) {
        toastr.success('Profile Updated Successfully');
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
  const handlePost = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Validate input
    if (!content.trim()) {
      toastr.error("Please enter some content.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("content", content); // Add content
      if (PostImage) {
        formData.append("image", PostImage); // Add the image file
      }

      const response = await fetch(`${API_BASE_URL}/user/post`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include your token if needed
        },
        body: formData, // Send as multipart/form-data
      });

      if (!response.ok) {
        const result = await response.json();
        toastr.error("Failed to create post.");
        throw new Error(result.message || "Failed to create post");
      }


      toastr.success("Post created successfully!");
      setContent("");
      setPostImage(null);
      setPostImagePreview("");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("There was an error creating the post.");
    } finally {
      setLoading(false);
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
            toastr.success('Success', data.message);
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

          <form onSubmit={handleSubmit} className="w-full h-fit mt-4 bg-[#0d2539] rounded-md p-6">
            <h1 className="text-white font-semibold text-lg mb-4">About You</h1>
            <div className="flex justify-between sm:flex-row flex-col">
              {/* Left Section */}
              <div className="flex-1">
                <div className="flex flex-wrap gap-5 mt-3">
                  {/* First Name */}
                  <div className="flex-1">
                    <Input
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue"
                      placeholder="First Name"
                    />
                    {errors.first_name && <p className="text-red mt-1">{errors.first_name.join(", ")}</p>}
                  </div>

                  {/* Last Name */}
                  <div className="flex-1">
                    <Input
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue"
                      placeholder="Last Name"
                    />
                    {errors.last_name && <p className="text-red mt-1">{errors.last_name.join(", ")}</p>}
                  </div>
                </div>

                {/* Email */}
                <div className="mt-3">
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue"
                    placeholder="Email Address"
                  />
                  {errors.email && <p className="text-red mt-1">{errors.email.join(", ")}</p>}
                </div>

                {/* Username Section */}
                <p className="mt-4 border-b border-[#F2F0EF] text-[#F2F0EF] pb-2">{userData?.username || ""}</p>
                <p className="mt-2 text-[#F2F0EF] pb-2 text-sm">Username cannot be changed</p>

                {/* Location */}
                <div className="relative mt-3">
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue"
                    placeholder="Your Location"
                  />
                  {errors.location && <p className="text-red mt-1">{errors.location.join(", ")}</p>}
                  <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                    <img src={MapIcon} alt="Location Icon" className="w-[15px] h-[20px]" />
                  </div>
                </div>

                <div className="relative mt-3">
                  {/* Country Dropdown */}
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue"
                  >
                    <option value="">Select Country</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Australia">Australia</option>
                    <option value="Austria">Austria</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Bulgaria">Bulgaria</option>
                    <option value="Canada">Canada</option>
                    <option value="Chile">Chile</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Croatia">Croatia</option>
                    <option value="Cyprus">Cyprus</option>
                    <option value="Czech Republic">Czech Republic</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Estonia">Estonia</option>
                    <option value="Finland">Finland</option>
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="Greece">Greece</option>
                    <option value="Hungary">Hungary</option>
                    <option value="Iceland">Iceland</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Italy">Italy</option>
                    <option value="India">India</option>
                    <option value="Japan">Japan</option>
                    <option value="Latvia">Latvia</option>
                    <option value="Lithuania">Lithuania</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Malta">Malta</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Norway">Norway</option>
                    <option value="Peru">Peru</option>
                    <option value="Poland">Poland</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Romania">Romania</option>
                    <option value="Slovakia">Slovakia</option>
                    <option value="Slovenia">Slovenia</option>
                    <option value="Spain">Spain</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="South Korea">South Korea</option>
                    <option value="Thailand">Thailand</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="USA">USA</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Venezuela">Venezuela</option>
                  </select>
                  {errors.country && <p className="text-red mt-1">{errors.country.join(", ")}</p>}
                </div>

                {/* Bio */}
                <div className="relative w-full min-w-[200px] mt-3">
                  <Textarea
                    name="bio"
                    value={formData.bio}
                    onChangeFunc={handleInputChange}
                    className={`peer h-full min-h-[100px] w-full resize-none rounded-md bg-darkBlue px-3 py-2.5 text-white ${errors.bio ? "border-red" : ""
                      }`}
                    placeholder="Your biography (160 characters)"
                  />
                  {errors.bio && <p className="text-red mt-1">{errors.bio.join(", ")}</p>}
                </div>

                {/* Save Changes Button */}
                <div className="mt-4">
                  <Button
                    title="Save changes"
                    type="submit"
                    className="w-[8rem] h-[2.3rem] text-white bg-[#F77F00] rounded-md"
                  />
                </div>
              </div>

              {/* Checkboxes Section */}
              <div className="flex flex-col mt-6 sm:mt-0 sm:ml-6">
                <h2 className="text-white font-semibold text-base mb-3">Preferences</h2>

                {/* Checkbox for Monthly Newsletter */}
                <label className="flex items-center mb-2 text-white">
                  <input
                    type="checkbox"
                    name="newsletter_info"
                    checked={formData.newsletter_info === "1"} // Convert "1"/"0" to boolean
                    onChange={handleCheckboxChange}
                    className="mr-2 w-5 h-5 rounded bg-darkBlue border-gray-600"
                  />
                  Do you wish to receive the monthly newsletter from Totally Tabletop?
                </label>

                {/* Checkbox for Promotional Information */}
                <label className="flex items-center text-white">
                  <input
                    type="checkbox"
                    name="promotional_info"
                    checked={formData.promotional_info === "1"} // Convert "1"/"0" to boolean
                    onChange={handleCheckboxChange}
                    className="mr-2 w-5 h-5 rounded bg-darkBlue border-gray-600"
                  />
                  Do you wish to receive promotional information from selected partners?
                </label>
              </div>




              {/* Profile Picture Section */}
              <div className="flex flex-col items-center sm:mt-0 mt-6">
                <img
                  src={profilePictureURL || formData.profilePicture || FaceImage}
                  alt="Profile"
                  className="w-[10rem] h-[10rem] rounded-full object-cover"
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
                  onClick={handleDeleteProfile}
                >
                  Delete Profile
                </label>
              </div>
            </div>
          </form>

          {/* 2nd form  */}
          <form
            className="w-[100%] h-[fit] mt-4 bg-[#0d2539] rounded-md p-6"
            onSubmit={handlePasswordSubmit}
          >
            <div className="pb-4">
              <h1 className="text-white font-semibold mt-3">Your password</h1>

              {/* Current Password */}
              <div className="relative">
                <Input
                  name="cpassword"
                  type={showPasswords.cpassword ? "text" : "password"}
                  value={passwordFormData.cpassword}
                  onChange={handlePasswordInputChange}
                  className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`}
                  placeholder={"Current Password"}
                />
                <span
                  className="absolute top-[50%] right-3 transform -translate-y-[50%] cursor-pointer text-white"
                  onClick={() => togglePasswordVisibility("cpassword")}
                >
                  {showPasswords.cpassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {passwordErrors.cpassword && (
                  <p className="text-red">
                    {passwordErrors.cpassword.join(", ")}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className="relative">
                <Input
                  name="npassword"
                  type={showPasswords.npassword ? "text" : "password"}
                  value={passwordFormData.npassword}
                  onChange={handlePasswordInputChange}
                  className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`}
                  placeholder={"New Password"}
                />
                <span
                  className="absolute top-[50%] right-3 transform -translate-y-[50%] cursor-pointer text-white"
                  onClick={() => togglePasswordVisibility("npassword")}
                >
                  {showPasswords.npassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {passwordErrors.npassword && (
                  <p className="text-red">
                    {passwordErrors.npassword.join(", ")}
                  </p>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="relative">
                <Input
                  name="cnfpsw"
                  type={showPasswords.cnfpsw ? "text" : "password"}
                  value={passwordFormData.cnfpsw}
                  onChange={handlePasswordInputChange}
                  className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`}
                  placeholder={"Confirm New Password"}
                />
                <span
                  className="absolute top-[50%] right-3 transform -translate-y-[50%] cursor-pointer text-white"
                  onClick={() => togglePasswordVisibility("cnfpsw")}
                >
                  {showPasswords.cnfpsw ? <FaEyeSlash /> : <FaEye />}
                </span>
                {passwordErrors.cnfpsw && (
                  <p className="text-red">
                    {passwordErrors.cnfpsw.join(", ")}
                  </p>
                )}
              </div>
            </div>

            <div className="pb-2 flex justify-center sm:justify-start">
              <Button
                title={"Update password"}
                type="submit"
                className={`w-[10rem] h-[2.3rem] text-white bg-[#F77F00] rounded-md mt-2`}
              />
            </div>
          </form>
          {/* 3rd Form  */}
          <form className="w-[100%] mt-4 bg-[#0d2539] rounded-md p-6" onSubmit={handlePost}>
            <h1 className="text-white font-semibold mt-3">
              Share updates and let anyone or friends know what's happening!
            </h1>
            <div className="w-[100%] bg-[#0d2539] py-5 mt-0 rounded-md mb-2">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Profile Image and Textarea */}
                <div className="flex flex-1 gap-x-4 items-stretch">
                  {/* Textarea */}
                  <textarea
                    type="text"
                    name="content"
                    placeholder="Tell your friend what's happening...."
                    className="flex-1 bg-[#102F47] text-white h-[12rem] pt-2 px-3 placeholder:text-start resize-none rounded-md"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />

                  {/* Image and Upload Buttons */}
                  <div className="flex flex-col items-center justify-between h-[12rem]">
                    {/* Image Preview */}
                    <div className="w-[10rem] h-[10rem] border-2 border-[#F77F00] rounded-md overflow-hidden flex items-center justify-center">
                      <img
                        src={PostImagePreview || PostImageDefault} // Show preview or default image
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* File Upload Input */}
                    <input
                      type="file"
                      id="PostImageInput"
                      className="hidden"
                      onChange={handlePostImageChange}
                      accept="image/png, image/jpeg"
                    />

                    {/* Upload Button */}
                    <label
                      htmlFor="PostImageInput"
                      className="w-[10rem] h-[2.3rem] mt-2 text-white border border-[#F77F00] rounded-md flex items-center justify-center cursor-pointer"
                    >
                      Upload Photo
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-between items-center mt-4">
                <Button
                  title={loading ? "Posting..." : "Post"}
                  type="submit"
                  disabled={loading}
                  className="w-[8rem] h-[2.3rem] rounded-md bg-[#E78530] text-white"
                />
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Profile;
