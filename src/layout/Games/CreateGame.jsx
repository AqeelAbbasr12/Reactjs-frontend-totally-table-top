import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { FaList } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
import Button from "../../components/Button";
import Input from "../../components/Input";
import IconCaretSvg from "../../assets/icon-caret-down.svg";
import ConventionImage from '../../assets/convention.jpeg'
import toastr from 'toastr';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CreateGame = () => {
  const nav = useNavigate();
  const { convention_id } = useParams();
  const [loading, setLoading] = useState();
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
    currency: '',
    currency_tag: '',
    condition: '',
    desc: '',
    game_image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({}); // State for form errors

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


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      game_image: file,
    }));
    setImagePreview(URL.createObjectURL(file));
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
    formDataToSend.append('convention_id', convention_id);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('currency', formData.currency);
    formDataToSend.append('currency_tag', formData.currency_tag);  // Appending the updated value
    formDataToSend.append('condition', formData.condition);
    formDataToSend.append('desc', formData.desc);

    if (formData.game_image) {
      formDataToSend.append('game_image', formData.game_image);
    }

    console.log("Submitting form data:", Object.fromEntries(formDataToSend.entries())); // Log form data

    try {
      const response = await fetch(`${API_BASE_URL}/user/convention_game`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formDataToSend,
      });

      console.log('Form data submitted:', formData);

      if (response.ok) {
        const result = await response.json();
        console.log("Success response:", result); // Log the success response
        toastr.success('Game added successfully!');

        // Clear form fields, image preview, and form errors
        setFormData({
          name: '',
          price: '',
          currency: '',
          currency_tag: '',
          condition: '',
          desc: '',
          game_image: null,
        });
        setImagePreview(null);
        setFormErrors({});
        nav(`/game/sale/${convention_id}`);
      }

      if (!response.ok) {
        const result = await response.json();
        console.log("Error response:", result); // Log the error response
        if (result.errors) {
          setFormErrors(result.errors);
        } else {
          toastr.error('Failed to create accommodation.'); // A more generic error message
        }
      }





    } catch (error) {
      console.error('Error creating accommodation:', error);
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
        <span className="text-white">Account</span>
        <BsFillCaretDownFill className="text-lightOrange -rotate-90" />
        <span className="text-white">Your conventions</span>
        <BsFillCaretDownFill className="text-lightOrange -rotate-90" />
        <span className="text-white">UK Games Expo 2024</span>
      </div>

      <div className="md:px-[2rem] px-[1rem] bg-darkBlue md:h-[86vh] w-[100vw] py-3 flex justify-center md:items-center overflow-y-auto">
        <form
          className="sm:w-[50%] w-[100%] bg-[#0d2539] px-3 py-5 rounded-md mt-6"
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
              placeholder="Description"
              onChange={handleChange}
              className={`w-[100%] h-[10rem] rounded-md text-white px-4 mt-2 outline-none bg-darkBlue resize-none`}
            />
            {formErrors.desc && <p className="text-red">{formErrors.desc}</p>}
          </div>

          <div className="sm:mt-5 mt-2 flex flex-col items-center">
            <img
              src={imagePreview || ConventionImage}
              alt="Preview"
              className="w-[10rem] h-[10rem] rounded-full mb-2"
            />
            <input
              type="file"
              id="locationPictureInput"
              className="hidden"
              onChange={handleFileChange}
              accept="image/png, image/jpeg"
            />
            <label
              htmlFor="locationPictureInput"
              className="w-[8rem] mt-2 h-[2.3rem] text-white border border-[#F77F00] rounded-md flex items-center justify-center cursor-pointer"
            >
              Upload Image
            </label>
          </div>

          <div className="flex justify-center items-center mt-4">
            <Button
              type="submit"
              title={"List Game"}
              className={`w-[12rem] h-[3rem] rounded-md text-white bg-lightOrange`}
            />
          </div>
        </form>
      </div>
    </div>
  );

};

export default CreateGame;
