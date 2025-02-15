import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Left from '../../components/Left'
import FaceImage from '../../assets/profile.jpeg'
import { FaRegStar } from 'react-icons/fa'
import { FaMessage } from 'react-icons/fa6'
import ImageCross from '../../assets/red-cross.png'
import { fetchWithAuth } from '../../services/apiService';
import { formatDistanceToNow, parseISO } from 'date-fns';
import PostImageDefault from "../../assets/post.jpeg"; // Default image
import toastr from 'toastr';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Layout = () => {
  const nav = useNavigate()
  const [showData, setshowData] = useState(true)
  const [loading, setLoading] = useState();
  const [activityFeeds, setActivityFeed] = useState([]);
  const [content, setContent] = useState('');
  const [PostImage, setPostImage] = useState(null); // Store the uploaded file
  const [PostImagePreview, setPostImagePreview] = useState(""); // Store preview URL
  const data = [1, 2, 3, 4, 5, 6, 7]

  useEffect(() => {
    fetchActivityFeed();

  }, []);

  const fetchActivityFeed = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/user/activityfeed`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        setActivityFeed(data);
      }

    } catch (error) {
      // console.error('Error fetching friends data:', error);
    }
    finally {
      setLoading(false);
    }
  };

  const formatDescription = (content) => {
    if (!content) return null; // Handle case where content is undefined or null

    // Regex to detect URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Split the content into lines and map over them
    return content.split(/[\r\n]+/).map((line, index) => {
      // Replace URLs with clickable links
      const formattedLine = line.split(urlRegex).map((part, i) => {
        if (urlRegex.test(part)) {
          return (
            <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-lightOrange underline break-all">
              {part}
            </a>
          );
        }
        return part;
      });

      // Return the formatted line with <br /> at the end
      return (
        <React.Fragment key={index}>
          {formattedLine}
          <br />
        </React.Fragment>
      );
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
    const day = date.getDate();
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
    const year = date.getFullYear();

    // Add the 'st', 'nd', 'rd', 'th' suffix
    const suffix = day % 10 === 1 && day !== 11 ? 'st' :
      day % 10 === 2 && day !== 12 ? 'nd' :
        day % 10 === 3 && day !== 13 ? 'rd' : 'th';

    return `${weekday}, ${day}${suffix}, ${month}, ${year}`;
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
      fetchActivityFeed();
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



  return (
    <div className='flex flex-col w-[100vw] min-h-[100vh] max-h-fit overflow-y-auto bg-darkBlue'>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-darkBlue bg-opacity-75 z-50">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-lightOrange"></div>
        </div>
      )}
      <Navbar type={"verified"} />
      <div className='pt-[2.3rem] flex  justify-between items-start md:flex-row flex-col bg-darkBlue md:px-[2rem] flex-1 h-[fit] w-[100vw] gap-x-6'>

        {/* LEFT  */}
        <Left />

        {/* RIGHT  */}
        <div className='flex-1 rounded-md px-2 mb-2 w-full min-w-full md:min-w-[80rem] md:mt-0 mt-4'>
        <form className="w-[100%] mt-4 mb-4 bg-[#0d2539] rounded-md p-6" onSubmit={handlePost}>
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
          {/* <div className='sm:flex pb-7 justify-between items-center'>
                        <h1 className='text-white text-2xl font-semibold'>Your activity feed</h1>
                        <div className='flex items-center gap-x-4 sm:mt-0 mt-2'>
                            <div onClick={() => setshowData(!showData)} className='flex justify-between px-2 items-center w-[11rem] h-[2.3rem] rounded-md border border-gray-300 cursor-pointer'>
                                <p className='text-white'>Show everything</p>
                                <BsFillCaretDownFill className='text-white ' />
                            </div>
                            <Button title={"Post update"} className={'w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange'} />

                        </div>
                    </div> */}

          {
            !showData ?
              <div className='w-[100%] h-[52.5vh] mt-4 bg-[#0d2539] rounded-md flex justify-center items-center flex-col'>
                {/* <ImCross className='text-red text-6xl border border-red rounded-full' /> */}
                <img className='justify-center' src={ImageCross} alt="" />
                <h1 className='text-lg text-center font-semibold mt-3 mb-5 text-white'>No activity</h1>
                <p className='text-white mb-0'>Important updates notification and</p>
                <p className='text-white mb-4'>more from friends will appear here</p>
                <Button title={"Find friends"} className={'w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange'} />
              </div> :
              activityFeeds.map((feedItem) => (
                <div key={feedItem.id} className=''>
                  {(() => {
                    switch (feedItem.type) {
                      case 'convention_attendance':
                        return (
                          <>
                            {
                              (
                                feedItem.convention_attendance &&
                                (feedItem.convention_attendance.attendance_privacy === 'friends_only' &&
                                  feedItem.is_friend === 'true') ||
                                feedItem.convention_attendance?.attendance_privacy === 'anyone'
                              ) ? (
                                <>
                                  <div className='w-[100%] bg-[#0d2539] py-3 px-4 mt-0 rounded-md mb-2'>
                                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
                                      <div className='flex items-center gap-x-3'>
                                        <div className='flex items-center'>
                                          <img
                                            src={feedItem.convention_attendance.profile_picture || FaceImage}
                                            alt=""
                                            className='w-[3rem] h-[3rem] rounded-full object-cover'
                                          />
                                          <div className='w-[3rem] h-[3rem] rounded-full flex justify-center items-center bg-lightOrange'>
                                            <img
                                              src={feedItem.convention_attendance.convention_logo || FaceImage}
                                              alt=""
                                              className='w-[3rem] h-[3rem] rounded-full object-cover'
                                            />
                                          </div>
                                        </div>
                                        <div>
                                          <p className='text-white'>
                                            <span className='text-lightOrange'>
                                              {feedItem.convention_attendance.user_name}
                                            </span> is attending
                                            <span
                                              onClick={() => nav(`/convention/attendance/${feedItem.convention_attendance.convention_id}`)}
                                              className='text-lightOrange underline ml-1 cursor-pointer'
                                            >
                                              {feedItem.convention_attendance.convention_name}
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                      <p className='text-white mt-2 md:mt-0'>
                                        {formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}
                                      </p>
                                    </div>
                                    <p className='text-white mt-3'>
                                      {feedItem.convention_attendance.user_name} will attend {feedItem.convention_attendance.convention_name} on {feedItem.convention_attendance.attendance_date}
                                    </p>
                                    <div className='flex items-center gap-x-4 mt-4'>
                                      <div className='flex items-center gap-x-2'>
                                        <FaMessage className='text-white' />
                                        <p className='text-white'>0</p>
                                      </div>
                                      <FaRegStar className='text-white' />
                                    </div>
                                  </div>
                                </>
                              ) : null}
                          </>
                        );



                      case 'post_creation':
                        return (
                          <>
                            {(
                              (feedItem.post.post_privacy === 'friends_only' && feedItem.is_friend === 'true') ||
                              feedItem.post.post_privacy === 'anyone'
                            ) ? (
                              <>
                                <div className='w-[100%] bg-[#0d2539] py-3 px-4 mt-0 rounded-md mb-2'>
                                  {/* Header Section */}
                                  <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
                                    <div className='flex items-center gap-x-3'>
                                      <img
                                        src={feedItem.post.profile_picture || FaceImage}
                                        alt="Profile"
                                        className='w-[3rem] h-[3rem] rounded-full object-cover'
                                      />
                                      <div>
                                        <p className='text-white'>
                                          <span className='text-lightOrange'>{feedItem.post.user_name}</span> posted an update:
                                        </p>
                                      </div>
                                    </div>
                                    <p className='text-white mt-2 md:mt-0'>
                                      {formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}
                                    </p>
                                  </div>

                                  {/* Content Section */}
                                  <div className="flex flex-col-reverse md:flex-row-reverse items-start md:gap-x-4 mt-3">
                                    {/* Post Image */}
                                    {feedItem.post.image && (
                                      <img
                                        src={feedItem.post.image}
                                        alt="Post"
                                        className='rounded-md object-cover w-full h-auto md:w-[13rem] md:h-[10rem] mt-3 md:mt-0'
                                      />
                                    )}

                                    {/* Post Content */}
                                    <div className='overflow-y-auto'>
                                      <p className='text-white break-words whitespace-pre-wrap'>{formatDescription(feedItem.post.content)}</p>
                                    </div>

                                  </div>

                                  {/* Icons Section */}
                                  <div className='flex items-center gap-x-4 mt-4'>
                                    <div className='flex items-center gap-x-2'>
                                      <FaMessage className='text-white' />
                                      <p className='text-white'>0</p>
                                    </div>
                                    <FaRegStar className='text-white' />
                                  </div>
                                </div>
                              </>
                            ) : null}
                          </>
                        );




                      case 'convention_accommodation':
                        return (
                          <>
                            {/* Check accommodation privacy */}
                            {(
                              feedItem.convention_accommodation.accommodation_privacy === 'friends_only' &&
                              feedItem.is_friend === 'true'
                            ) || feedItem.convention_accommodation.accommodation_privacy === 'anyone' ? (
                              <>
                                <div className='w-[100%] bg-[#0d2539] py-3 px-4 mt-0 rounded-md mb-2'>
                                  <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
                                    <div className='flex items-start md:items-center gap-x-3'>
                                      <div className='flex items-center'>
                                        {/* Profile Picture or Default Image */}
                                        <img
                                          src={feedItem.convention_accommodation.profile_picture || FaceImage}
                                          alt=""
                                          className='w-[3rem] h-[3rem] rounded-full object-cover'
                                        />
                                        {/* UKGE Placeholder */}
                                        <div className='w-[3rem] h-[3rem] rounded-full flex justify-center items-center bg-lightOrange'>
                                          <img
                                            src={feedItem.convention_accommodation.convention_logo || FaceImage}
                                            alt=""
                                            className='w-[3rem] h-[3rem] rounded-full object-cover'
                                          />
                                        </div>
                                      </div>

                                      {/* User & Location Info */}
                                      <div className='mt-2 md:mt-0'>
                                        <p className='text-white'>
                                          <span className='text-lightOrange'>
                                            {feedItem.convention_accommodation.user_name}
                                          </span> is staying at{' '}
                                          <span className='text-lightOrange'>
                                            {feedItem.convention_accommodation.location_name}
                                          </span>
                                        </p>
                                      </div>
                                    </div>

                                    {/* Timestamp */}
                                    <p className='text-white mt-2 md:mt-0'>
                                      {formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}
                                    </p>
                                  </div>

                                  {/* Date Range and Convention Name */}
                                  <p className='text-white mt-3'>
                                    From{' '}
                                    <span className='text-lightOrange'>
                                      {formatDate(feedItem.convention_accommodation.from_date)}
                                    </span>{' '}
                                    To{' '}
                                    <span className='text-lightOrange'>
                                      {formatDate(feedItem.convention_accommodation.to_date)}
                                    </span>{' '}
                                    for
                                    <span
                                      onClick={() => nav(`/convention/attendance/${feedItem.convention_id}`)}
                                      className='text-lightOrange underline ml-1 cursor-pointer'
                                    >
                                      {feedItem.convention_accommodation.convention_name}
                                    </span>
                                  </p>

                                  {/* Location Website */}
                                  <p className='text-white break-words whitespace-pre-wrap max-w-full'>
                                    {formatDescription(feedItem.convention_accommodation.location_website)}
                                  </p>

                                  {/* Icons and Interactions */}
                                  <div className='flex items-center gap-x-4 mt-4'>
                                    <div className='flex items-center gap-x-2'>
                                      <FaMessage className='text-white' />
                                      <p className='text-white'>0</p>
                                    </div>
                                    <FaRegStar className='text-white' />
                                  </div>
                                </div>
                              </>
                            ) : null}
                          </>
                        );



                      case 'profile_update':
                        return (
                          <>
                            {(feedItem.user.profile_privacy === 'friends_only' && feedItem.is_friend === 'true') || feedItem.user.profile_privacy === 'anyone' ? (
                              <>
                                <div className='w-[100%] bg-[#0d2539] py-3 px-4 mt-0 rounded-md mb-2'>
                                  <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
                                    <div className='flex items-start md:items-center gap-x-3'>
                                      <img
                                        src={feedItem.user.profile_picture || FaceImage}
                                        alt=""
                                        className='w-[3rem] h-[3rem] rounded-full object-cover'
                                      />
                                      <div className='mt-2 md:mt-0'>
                                        <p className='text-white'>
                                          <span className='text-lightOrange'>{feedItem.user.user_name} </span>
                                          updated their <span className='text-lightOrange'>Profile</span>
                                        </p>
                                      </div>
                                    </div>
                                    <p className='text-white mt-2 md:mt-0'>
                                      {formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}
                                    </p>
                                  </div>
                                  <div className='flex items-center gap-x-4 mt-4'>
                                    <div className='flex items-center gap-x-2'>
                                      <FaMessage className='text-white' />
                                      <p className='text-white'>0</p>
                                    </div>
                                    <FaRegStar className='text-white' />
                                  </div>
                                </div>
                              </>
                            ) : null}
                          </>
                        );




                      case 'convention_game':
                        return (
                          <>
                            <div className='w-[100%] bg-[#0d2539] py-3 px-4 mt-0 rounded-md mb-2'>
                              <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
                                <div className='flex items-start md:items-center gap-x-3'>
                                  <img src={feedItem.convention_game.profile_picture || FaceImage} alt="" className='w-[3rem] h-[3rem] rounded-full object-cover' />
                                  <div className='mt-2 md:mt-0'>
                                    <p className='text-white'>
                                      <span className='text-lightOrange'>{feedItem.convention_game.user_name} </span> is selling
                                      <span
                                        onClick={() => nav(`/game/single/${feedItem.convention_game.id}`)}
                                        className='text-lightOrange underline ml-1 cursor-pointer'
                                      >
                                        {feedItem.convention_game.game_name}
                                      </span> under
                                      <span
                                        onClick={() => nav(`/convention/attendance/${feedItem.convention_id}`)}
                                        className='text-lightOrange underline ml-1 cursor-pointer'
                                      >
                                        {feedItem.convention_game.convention_name}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <p className='text-white mt-2 md:mt-0'>
                                  {formatDistanceToNow(parseISO(feedItem.created_at), { addSuffix: true })}
                                </p>
                              </div>
                              <p className='text-white mt-3'>
                                <b>{feedItem.convention_game.game_currency_tag}{feedItem.convention_game.game_price}</b> ({feedItem.convention_game.game_condition})
                              </p>
                              <p className='text-white mt-3 break-words whitespace-pre-wrap max-w-full'>
                                {formatDescription(feedItem.convention_game.game_desc)}
                              </p>
                              <div className='flex items-center gap-x-4 mt-4'>
                                <div className='flex items-center gap-x-2'>
                                  <FaMessage className='text-white' />
                                  <p className='text-white'>0</p>
                                </div>
                                <FaRegStar className='text-white' />
                              </div>
                            </div>
                          </>
                        );


                      // Handle other types (like 'convention_game', 'convention_accommodation', etc.) similarly.

                      default:
                        return null;
                    }
                  })()}

                  {/* This part stays the same across all feed types */}

                </div>
              ))
          }

        </div>


      </div>

    </div>
  )
}

export default Layout
