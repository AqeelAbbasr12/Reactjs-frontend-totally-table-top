import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { FaList } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { FaSpinner } from 'react-icons/fa'; // For a spinner icon
import IconCaretSvg from "../../assets/icon-caret-down.svg";
import ConventionImage from '../../assets/traditional.png'
import toastr from 'toastr';
import { FaTrash, FaPlus } from 'react-icons/fa';
import imageCompression from 'browser-image-compression';
import { fetchWithAuth } from "../../services/apiService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CreateGame = () => {
  const nav = useNavigate();
  const { convention_id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState();
  const [convention, setConvention] = useState([]);
  const CONDITIONS = [
    "Brand new",
    "Excellent",
    "Good",
    "Fair",
    "Below Average",
  ];
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    currency: 'USD',
    currency_tag: '',
    condition: '',
    desc: '',
    game_images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([ConventionImage]);
  const [formErrors, setFormErrors] = useState({}); // State for form errors

  useEffect(() => {
    fetchConventions(convention_id);

    if (convention.state) {
      const countryCurrency = countryToCurrency[convention.state];
      if (countryCurrency) {
        setFormData(prevData => ({
          ...prevData,
          currency: countryCurrency
        }));
      }
    }
  }, [convention.state]);



  const countryToCurrency = {
    "Argentina": "ARS",
    "Australia": "AUD",
    "Austria": "EUR",
    "Belgium": "EUR",
    "Brazil": "BRL",
    "Bulgaria": "BGN",
    "Canada": "CAD",
    "Chile": "CLP",
    "Colombia": "COP",
    "Croatia": "HRK",
    "Cyprus": "CYP",
    "Czech Republic": "CZK",
    "Denmark": "DKK",
    "Estonia": "EEK",
    "Finland": "FIM",
    "France": "EUR",  // France uses Euro
    "Germany": "EUR", // Germany uses Euro
    "Greece": "EUR",  // Greece uses Euro
    "Hungary": "HUF",
    "Iceland": "ISK",
    "Ireland": "IEP",
    "Italy": "ITL",
    "Japan": "JPY",
    "Latvia": "LVL",
    "Lithuania": "LTL",
    "Luxembourg": "LUF",
    "Malta": "MTL",
    "Mexico": "MXN",
    "Netherlands": "NLG",
    "Norway": "NOK",
    "Peru": "PEN",
    "Poland": "PLN",
    "Portugal": "PTE",
    "Romania": "ROL",
    "Slovakia": "SKK",
    "Slovenia": "SIT",
    "Spain": "ESP",
    "Sweden": "SEK",
    "Switzerland": "CHF",
    "Thailand": "THB",
    "United Kingdom": "GBP",
    "USA": "USD",
    "Uruguay": "UYU",
    "Venezuela": "VEF"
  };

  const fetchConventions = async (convention_id) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/user/convention/${convention_id}`, {
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
      setConvention(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching conventions data:', error);
    } finally {
      setLoading(false);
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




  // OLD
  const handleFileChange = async (index, event) => {

    const file = event.target.files[0];

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
          fileType: 'image/jpeg', // Convert to JPEG
        };
        const compressedBlob = await imageCompression(file, options);

        // Create a new File object from the compressed blob, preserving the original file name and type
        const compressedFile = new File([compressedBlob], file.name, {
          type: file.type, // Preserve the original file type (mime type)
          lastModified: Date.now(), // Optional: Set the last modified time to now
        });


        // Update the image preview at the specified index
        const newImagePreviews = [...imagePreviews];
        newImagePreviews[index] = URL.createObjectURL(compressedFile);
        setImagePreviews(newImagePreviews);

        // Update formData with the new compressed image file
        setFormData((prevData) => {
          const updatedImages = [...prevData.game_images];
          updatedImages[index] = compressedFile; // Save as File object, not Blob
          return { ...prevData, game_images: updatedImages };
        });
      } catch (error) {
        console.error("Error compressing image:", error);
        toastr.error("Failed to compress the image.");
      }
    }
  };

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      currency_tag: getCurrencySymbol(prevState.currency),
    }));
  }, [formData.currency]);



  // Handle adding a new image section
  const handleAddImage = () => {
    if (imagePreviews.length < 4) { // Limit to 4 images
      setImagePreviews([...imagePreviews, null]);
      setFormData((prevData) => ({
        ...prevData,
        game_images: [...prevData.game_images, null],
      }));
    }
  };

  // Handle deleting an image preview
  const handleDeleteImage = (index) => {
    const newImagePreviews = [...imagePreviews];
    newImagePreviews.splice(index, 1); // Remove the selected image preview
    setImagePreviews(newImagePreviews);

    // Remove the corresponding file from formData
    setFormData((prevData) => {
      const updatedImages = [...prevData.game_images];
      updatedImages.splice(index, 1);
      return { ...prevData, game_images: updatedImages };
    });
  };

  // Dynamic currency symbol mapping
  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case "USD":
        return "$";
      case "ARS":
        return "$";
      case "AUD":
        return "A$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "BRL":
        return "R$";
      case "BGN":
        return "лв";
      case "CAD":
        return "C$";
      case "CLP":
        return "$";
      case "COP":
        return "$";
      case "HRK":
        return "kn";
      case "CYP":
        return "£";
      case "CZK":
        return "Kč";
      case "DKK":
        return "kr";
      case "EEK":
        return "kr";
      case "FIM":
        return "mk";
      case "FRF":
        return "₣";
      case "DEM":
        return "DM";
      case "GRD":
        return "₯";
      case "HUF":
        return "Ft";
      case "ISK":
        return "kr";
      case "IEP":
        return "£";
      case "ITL":
        return "₤";
      case "JPY":
        return "¥";
      case "LVL":
        return "Ls";
      case "LTL":
        return "Lt";
      case "LUF":
        return "₣";
      case "MTL":
        return "₤";
      case "MXN":
        return "$";
      case "NLG":
        return "ƒ";
      case "NOK":
        return "kr";
      case "PEN":
        return "S/.";
      case "PLN":
        return "zł";
      case "PTE":
        return "₣";
      case "ROL":
        return "lei";
      case "SKK":
        return "Sk";
      case "SIT":
        return "€";
      case "ESP":
        return "₧";
      case "SEK":
        return "kr";
      case "CHF":
        return "₣";
      case "THB":
        return "฿";
      case "UYU":
        return "$U";
      case "VEF":
        return "Bs";
      default:
        return "$"; // Fallback for unsupported currencies
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

    setIsLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('convention_id', convention_id);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('currency', formData.currency);
    formDataToSend.append('currency_tag', formData.currency_tag);
    formDataToSend.append('condition', formData.condition);
    formDataToSend.append('desc', formData.desc);

    // Append each game image file individually
    if (formData.game_images && formData.game_images.length > 0) {
      formData.game_images.forEach((file, index) => {
        formDataToSend.append(`game_images[${index}]`, file);
      });
    }

    // console.log("Submitting form data:", Object.fromEntries(formDataToSend.entries())); // Log form data

    try {
      const response = await fetch(`${API_BASE_URL}/user/convention_game`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formDataToSend,
      });

      // console.log('Form data submitted:', formData);

      if (response.ok) {
        const result = await response.json();
        // console.log("Success response:", result); // Log the success response
        toastr.success('Game added successfully!');

        // Clear form fields, image preview, and form errors
        setFormData({
          name: '',
          price: '',
          currency: '',
          currency_tag: '',
          condition: '',
          desc: '',
          game_images: [],
        });
        setImagePreviews([]);
        setFormErrors({});
        nav(`/game/sale/${convention_id}`);
      }

      if (!response.ok) {
        const result = await response.json();
        // console.log("Error response:", result); // Log the error response
        if (result.errors) {
          setFormErrors(result.errors);
        } else {
          toastr.error('Failed to create Game.'); // A more generic error message
        }
      }





    } catch (error) {
      // console.error('Error creating accommodation:', error);
      toastr.error('Failed to create Game.');
    } finally {
      setIsLoading(false); // Set loading to false when submission is complete
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
           className="sm:w-[50%] w-[100%] bg-[#0d2539] px-3 py-5 rounded-md mt-6 md:mt-36 min-h-screen overflow-auto"
           onSubmit={handleSubmit}
        >
          <div className="flex justify-center items-center">
            <div className="w-[3rem] h-[3rem] rounded-full bg-lightOrange flex justify-center items-center">
              <img src={convention.convention_logo || ConventionImage} alt="" className='w-[3rem] h-[3rem] rounded-full object-cover' />
            </div>
            <div className="w-[3rem] h-[3rem] rounded-full bg-lightOrange flex justify-center items-center">
              <FaList className="text-white" />
            </div>
          </div>

          <div className="pb-4">
            <h1 className="text-3xl mt-3 text-center text-white font-semibold">
              Add new game
            </h1>
          </div>

          <div className="pb-2">
            <Input
              name={"name"}
              placeholder={"Game Name"}
              type={"text"}
              onChange={handleChange}
              className={`w-[100%] h-[3rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue`}
            />
            {formErrors.name && <p className="text-red">{formErrors.name}</p>}
          </div>

          <div className="flex justify-center items-center md:flex-row flex-col mt-2 gap-x-4 pb-2">
            {/* Price Input with Dynamic Currency Symbol */}
            <div className="flex justify-between relative rounded-md w-[100%]">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                {/* Dynamic currency symbol based on selected currency */}
                <span className=" text-white">
                  {getCurrencySymbol(formData.currency)}
                </span>
              </div>
              <input
                type="number"
                name="price"
                id="price"
                value={formData.price}
                onChange={handleChange}
                className="block w-full py-1.5 pl-7 pr-20 h-[3rem] rounded-md text-white px-4 outline-none bg-darkBlue"
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
                    <option value="USD">USD</option>
                    <option value="ARS">ARS</option>
                    <option value="AUD">AUD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="BRL">BRL</option>
                    <option value="BGN">BGN</option>
                    <option value="CAD">CAD</option>
                    <option value="CLP">CLP</option>
                    <option value="COP">COP</option>
                    <option value="HRK">HRK</option>
                    <option value="CYP">CYP</option>
                    <option value="CZK">CZK</option>
                    <option value="DKK">DKK</option>
                    <option value="EEK">EEK</option>
                    <option value="FIM">FIM</option>
                    <option value="FRF">FRF</option>
                    <option value="DEM">DEM</option>
                    <option value="GRD">GRD</option>
                    <option value="HUF">HUF</option>
                    <option value="ISK">ISK</option>
                    <option value="IEP">IEP</option>
                    <option value="ITL">ITL</option>
                    <option value="JPY">JPY</option>
                    <option value="LVL">LVL</option>
                    <option value="LTL">LTL</option>
                    <option value="LUF">LUF</option>
                    <option value="MTL">MTL</option>
                    <option value="MXN">MXN</option>
                    <option value="NLG">NLG</option>
                    <option value="NOK">NOK</option>
                    <option value="PEN">PEN</option>
                    <option value="PLN">PLN</option>
                    <option value="PTE">PTE</option>
                    <option value="ROL">ROL</option>
                    <option value="SKK">SKK</option>
                    <option value="SIT">SIT</option>
                    <option value="ESP">ESP</option>
                    <option value="SEK">SEK</option>
                    <option value="CHF">CHF</option>
                    <option value="THB">THB</option>
                    <option value="GBP">GBP</option>
                    <option value="USD">USD</option>
                    <option value="UYU">UYU</option>
                    <option value="VEF">VEF</option>
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
                    src={imagePreview || ConventionImage} // Use a default if no preview available
                    alt={`Preview ${index + 1}`}
                    className="w-[10rem] h-[10rem] rounded-full object-cover"
                  />
                  <input
                    type="file"
                    id={`locationPictureInput${index}`}
                    className="hidden"
                    onChange={(event) => handleFileChange(index, event)}
                    accept="image/png, image/jpeg"
                  />
                  <label
                    htmlFor={`locationPictureInput${index}`}
                    className="w-[8rem] mt-2 h-[2.3rem] text-white border border-[#F77F00] rounded-md flex items-center justify-center cursor-pointer"
                  >
                    Upload Image
                  </label>
                  <FaTrash
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-2 right-[4.5rem] text-red cursor-pointer hover:text-lightOrange"
                    size={20}
                  />
                </div>
              ))}
            </div>
            <FaPlus
              onClick={handleAddImage}
              className="text-white cursor-pointer hover:text-green-500 mt-4"
              size={30}
            />
          </div>

          <div className="flex justify-center items-center mt-4">
            <button
              type="submit"
              className={`w-[12rem] h-[3rem] rounded-md text-white ${isLoading ? 'bg-gray-500' : 'bg-lightOrange'
                }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex justify-center items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Processing...
                </div>
              ) : (
                'List Game'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};

export default CreateGame;
