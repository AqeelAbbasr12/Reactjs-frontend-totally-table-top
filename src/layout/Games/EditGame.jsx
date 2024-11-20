import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { FaList } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
import Button from "../../components/Button";
import Input from "../../components/Input";
import IconCaretSvg from "../../assets/icon-caret-down.svg";
import ConventionImage from '../../assets/traditional.png'
import { fetchWithAuth } from '../../services/apiService';
import toastr from 'toastr';
import { FaTrash, FaPlus } from 'react-icons/fa';
import imageCompression from 'browser-image-compression';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditGame = () => {
  const nav = useNavigate();
  const { convention_id, game_id } = useParams();
  const [loading, setLoading] = useState();
  const CONDITIONS = [
    "Brand new",
    "Excellent",
    "Good",
    "Fair",
    "Below Average",
  ];
  const [imagePreviews, setImagePreviews] = useState([ConventionImage]); // Array for multiple image previews
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    currency: '',
    currency_tag: '',
    condition: '',
    desc: '',
    game_images: [], // Store images as an array
    game_image_id: [], // Store images as an array
  });
  const [formErrors, setFormErrors] = useState({}); // State for form errors

  useEffect(() => {
    fetchGame(game_id);
  }, [game_id]);

  const fetchGame = async (game_id) => {
    setLoading(true); // Show loading spinner while fetching
    try {
      const response = await fetchWithAuth(`/user/get_convention_game/${game_id}`, {
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
      // Transform data into the format required by react-select
      // console.log(data);
      // setGames(data);
      setFormData({
        name: data.name || '',
        price: data.price || '',
        currency: data.currency || '',
        currency_tag: data.currency_tag || '',
        condition: data.condition || '',
        desc: data.desc || '',
        game_images: [], // Keep empty initially for file input
        game_image_id: data.gameImages.map((img) => img.game_image_id) || [], // Set image IDs
      });

      // Set image previews from server
      setImagePreviews(data.gameImages.map((img) => img.game_image) || []); // Set preview images
    } catch (error) {
      // console.error('Error fetching Events data:', error);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      // Ensure currency_tag is updated whenever currency changes
      currency_tag: name === "currency" ? getCurrencySymbol(value) : prevState.currency_tag
    }));
  };


  const handleFileChange = async (e, index) => {
    const file = e.target.files[0];
  
    if (file) {
      // Check if the file size exceeds 20 MB (20 * 1024 * 1024 bytes)
      if (file.size > 20 * 1024 * 1024) {
        toastr.warning("Your image is greater than 20 MB.");
        return; // Exit if the file is too large
      }
  
      try {
        // Compress the image
        const options = {
          maxSizeMB: 2, // Set maximum size for compression
          maxWidthOrHeight: 1920, // Set maximum width or height
          useWebWorker: true, // Use a web worker for better performance
        };
        const compressedFile = await imageCompression(file, options);
        const newPreview = URL.createObjectURL(compressedFile); // Use compressed file for preview
  
        // Update previews and form data
        setImagePreviews((prevPreviews) => {
          const updatedPreviews = [...prevPreviews];
          updatedPreviews[index] = newPreview; // Update specific index
          return updatedPreviews;
        });
  
        setFormData((prevData) => {
          const updatedImages = [...prevData.game_images];
          const updatedImageIds = [...prevData.game_image_id]; // Clone existing image IDs
  
          // Update the file at the specific index
          updatedImages[index] = compressedFile; // Use compressed file
  
          // Keep the image ID if it exists, to track the changed image
          const imageId = updatedImageIds[index] !== null ? updatedImageIds[index] : null;
  
          // Add file and image ID only for this index where the file is changed
          return {
            ...prevData,
            game_images: updatedImages,
            game_image_id: updatedImageIds.map((id, i) => i === index ? imageId : id), // Retain original ID if not changed
          };
        });
      } catch (error) {
        console.error("Error compressing image:", error);
        toastr.error("Failed to compress the image.");
      }
    }
  };





  const handleAddImage = () => {
    if (imagePreviews.length < 4) { // Limit to 4 images
      setImagePreviews((prev) => [...prev, null]); // Add a placeholder for new image
      setFormData((prevData) => ({
        ...prevData,
        game_images: [...prevData.game_images, null], // Add a null entry for new image
      }));
    }
  };

  const handleDeleteImage = async (game_image_id, index) => {
    try {
      // Call API to delete the game image
      const response = await fetch(`${API_BASE_URL}/user/delete_game_image/${game_image_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
      });

      // Check if the response is ok
      if (!response.ok) {
        const result = await response.json();
        toastr.error(result.message);
        throw new Error('Failed to delete the image');
      }

      const result = await response.json();
      // Display success message
      toastr.success(result.message);
      // console.log('Image deleted successfully');

      // Update state to remove the image
      setFormData(prev => {
        const updatedImages = [...prev.game_images];
        const updatedImageIds = [...prev.game_image_id];

        // Remove the image and ID from the respective arrays
        updatedImages.splice(index, 1);  // Remove image from array
        updatedImageIds.splice(index, 1); // Remove ID from array

        return {
          ...prev,
          game_images: updatedImages,
          game_image_id: updatedImageIds,
        };
      });

      // Update the image previews to remove the deleted image
      setImagePreviews(prevPreviews => {
        const updatedPreviews = [...prevPreviews];
        updatedPreviews.splice(index, 1); // Remove the specific preview
        return updatedPreviews; // Return updated previews without the deleted one
      });

    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };


  // Dynamic currency symbol mapping
  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      default:
        return "$";
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) {
      errors.name = 'Game Name is required';
    }
    if (!formData.price) {
      errors.price = 'Price is required';
    }
    if (!formData.condition) {
      errors.condition = 'Condition is required';
    }



    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before submitting
    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('convention_game_id', game_id);
    formDataToSend.append('convention_id', convention_id);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('currency', formData.currency);
    formDataToSend.append('currency_tag', formData.currency_tag);  // Appending the updated value
    formDataToSend.append('condition', formData.condition);
    formDataToSend.append('desc', formData.desc);

    // Append only changed images and their respective IDs
    formData.game_images.forEach((file, index) => {
      if (file) {
        // Append file if changed
        formDataToSend.append(`game_images[${index}]`, file);

        // Append image_id only if it exists (it means the image was changed)
        if (formData.game_image_id[index] !== null) {
          formDataToSend.append(`game_image_id[${index}]`, formData.game_image_id[index]);
        }
      }
    });

    // console.log("Submitting form data:", Object.fromEntries(formDataToSend.entries())); // Log form data

    try {
      const response = await fetch(`${API_BASE_URL}/user/update_convention_game`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formDataToSend,
      });

      // console.log('Form data updated:', formData);

      if (response.ok) {
        const result = await response.json();
        // console.log("Success response:", result); // Log the success response
        toastr.success('Game updated successfully!');

        // Clear form fields, image preview, and form errors
        setFormData({
          name: '',
          price: '',
          currency: '',
          currency_tag: '',
          condition: '',
          desc: '',
          game_images: [], // Store images as an array
          game_image_id: [],
        });
        setImagePreviews(null);
        setFormErrors({});
        nav(`/game/sale/${convention_id}`);
      }

      if (!response.ok) {
        const result = await response.json();
        // console.log("Error response:", result); // Log the error response
        if (result.errors) {
          setFormErrors(result.errors);
        } else {
          toastr.error('Failed to update game.'); // A more generic error message
        }
      }





    } catch (error) {
      // console.error('Error creating accommodation:', error);
      toastr.error('Failed to create accommodation.');
    }
  };

  return (
    <div className="flex flex-col w-[100vw] h-[100vh] overflow-y-auto">
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
        </div>
      )}
      <Navbar type={"verified"} />

      <div className="bg-black md:px-[2rem] px-[1rem] flex items-center gap-x-4 py-3 ">
        <a href="/profile" className="text-white">Account</a>
        <BsFillCaretDownFill className="text-lightOrange -rotate-90" />
        <a href="/user/convention" className="text-white">Your conventions</a>
      </div>

      <div className="md:px-[2rem] px-[1rem] bg-darkBlue md:h-[86vh] w-[100vw] py-3 flex justify-center md:items-center overflow-y-auto">
        <form
          className="sm:w-[50%] w-[100%] h-[50rem] bg-[#0d2539] px-3 py-5 rounded-md mt-6"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-center items-center">
            <div className="w-[3rem] h-[3rem] rounded-full bg-lightOrange flex justify-center items-center">
              UKGE
            </div>
            <div className="w-[3rem] h-[3rem] rounded-full bg-lightOrange flex justify-center items-center">
              <FaList className="text-white" />
            </div>
          </div>

          <div className="pb-4">
            <h1 className="text-3xl mt-3 text-center text-white font-semibold">
              Edit Game
            </h1>
          </div>

          <div className="pb-2">
            <Input
              name={"name"}
              placeholder={"Game Name"}
              type={"text"}
              value={formData.name}
              onChange={handleChange}
              className={`w-[100%] h-[3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`}
            />
            {formErrors.name && <p className="text-red">{formErrors.name}</p>}
          </div>

          <div className="flex justify-center items-center md:flex-row flex-col mt-2 gap-x-4 pb-2">
            {/* Price Input with Dynamic Currency Symbol */}
            <div className="flex justify-between relative rounded-md w-[100%]">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                {/* Dynamic currency symbol based on selected currency */}
                <span className="text-gray-500 text-white">
                  {getCurrencySymbol(formData.currency)}
                </span>
              </div>
              <input
                type="number"
                name="price"
                id="price"
                value={formData.price}
                onChange={handleChange}
                className="block w-full py-1.5 pl-7 pr-20 h-[3rem] w-[100%] cursor-pointer rounded-md text-white px-4 outline-none bg-darkBlue"
                placeholder="price..."
              />
              <div className="absolute inset-y-0 right-0 flex items-center text-white">
                <div className="relative">
                  {/* Currency Dropdown */}
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}  // Update currency on change
                    className="h-full appearance-none rounded-md py-0 pl-2 pr-8 text-white outline-none bg-darkBlue"
                  >
                    <option selected value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <img
                      className="w-3 h-3 text-white"
                      src={IconCaretSvg}
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Display validation error */}
            {formErrors.price && <p className="text-red">{formErrors.price}</p>}

            {/* Condition Dropdown */}
            <div className="relative w-[100%]">
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="h-[3rem] w-full rounded-md text-white bg-darkBlue outline-none"
              >
                <option value="" disabled>
                  Select Condition
                </option>
                {CONDITIONS.map((condition, index) => (
                  <option key={index} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
              {formErrors.condition && (
                <p className="text-red">{formErrors.condition}</p>
              )}
            </div>
          </div>

          <div className="pb-2">
            <textarea
              name="desc"
              id="description"
              value={formData.desc}
              placeholder="Description"
              onChange={handleChange}
              className={`w-[100%] h-[10rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue resize-none`}
            />
            {formErrors.desc && <p className="text-red">{formErrors.desc}</p>}
          </div>
          <div className="flex flex-col items-center">
            <div className="flex flex-wrap justify-center">
              {imagePreviews.map((imagePreview, index) => (
                <div key={index} className="flex flex-col items-center relative mb-4 mx-2">
                  <img
                    src={imagePreview || ConventionImage} // Always use the current preview
                    alt={`Preview ${index + 1}`}
                    className="w-[10rem] h-[10rem] rounded-full object-cover"
                  />
                  <input
                    type="file"
                    id={`locationPictureInput${index}`}
                    className="hidden"
                    onChange={(event) => handleFileChange(event, index)} // Ensure the index is passed
                    accept="image/png, image/jpeg"
                  />
                  <label
                    htmlFor={`locationPictureInput${index}`}
                    className="w-[8rem] mt-2 h-[2.3rem] text-white border border-[#F77F00] rounded-md flex items-center justify-center cursor-pointer"
                  >
                    Upload Image
                  </label>
                  <FaTrash
                    onClick={() => handleDeleteImage(formData.game_image_id[index], index)} // Pass the image ID and index
                    className="absolute top-2 right-[4.5rem] text-red cursor-pointer hover:text-lightOrange"
                    size={20}
                  />
                </div>
              ))}
            </div>

            {/* Add new image button */}
            {imagePreviews.length < 4 && ( // Limit to 4 images
              <FaPlus
                onClick={handleAddImage} // Implement this function if necessary
                className="text-white cursor-pointer hover:text-green-500 mt-4"
                size={30}
              />
            )}
          </div>



          <div className="flex justify-center items-center mt-4">
            <Button
              type="submit"
              title={"Update Game"}
              className={`w-[12rem] h-[3rem] rounded-md text-white bg-lightOrange`}
            />
          </div>
        </form>
      </div>
    </div>
  );

};

export default EditGame;
