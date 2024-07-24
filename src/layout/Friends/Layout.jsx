import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Left from "../../components/Left";
import { ImCross } from "react-icons/im";
import { BsFillCaretDownFill } from "react-icons/bs";
import FaceImage from "../../assets/face.avif";
import IconMessage from "../../assets/Icon-message.png";
import IconUsrCircle from "../../assets/Icon-user-circle.png";

import { FaRegStar, FaUser } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { TbGridDots } from "react-icons/tb";
import { IoListSharp } from "react-icons/io5";

const Layout = () => {
  const nav = useNavigate();
  const data = [1, 2, 3, 4, 5, 6, 7, 8];
  const [currentView, setCurrentView] = useState("grid");
  return (
    <div className="flex flex-col w-[100vw] overflow-y-auto">
      <Navbar type={"verified"} />
      <div className="pt-[2.3rem] flex  justify-between items-start md:flex-row flex-col bg-darkBlue md:px-[2rem] flex-1 h-[fit] md:h-[86rem] w-[100vw] gap-x-6">
        {/* LEFT  */}
        <Left />

        {/* RIGHT  */}
        <div className="flex-1 rounded-md px-2 mb-2 w-full md:mt-0 mt-4">
          <div className="sm:flex justify-between items-center">
            <h1 className="text-white text-2xl font-semibold">Friends (47)</h1>
            <div className="flex items-center gap-x-4 sm:mt-0 mt-2">
              <Button
                title={"Online"}
                className={
                  "w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange"
                }
              />
              <Button
                title={"Offline"}
                className={
                  "w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange"
                }
              />
              {/* <Button onClickFunc={()=>nav("/feed")} title={"Post update"} className={'w-[8rem] h-[2.3rem] rounded-md text-white border border-lightOrange'} /> */}

              <div className="border border-lightOrange flex items-center w-[fit] justify-center h-[2rem]">
                <IoListSharp
                  onClick={() => setCurrentView("list")}
                  className={`text-white h-full w-[2rem] p-2 cursor-pointer ${
                    currentView === "list" && " bg-lightOrange"
                  }`}
                />
                <TbGridDots
                  onClick={() => setCurrentView("grid")}
                  className={`text-white h-full w-[2rem] p-2 cursor-pointer ${
                    currentView === "grid" && " bg-lightOrange"
                  }`}
                />
              </div>
            </div>
          </div>

          {currentView === "grid" ? (
            <div className="flex justify-between items-center gap-[2rem] flex-wrap mt-6">
              {data.map((i, index) => (
                <div
                  key={i}
                  className="bg-[#0d2539] w-[15rem] h-[15rem] rounded-md p-3 flex justify-center items-center flex-col"
                >
                  <div className="flex justify-center items-center">
                    <img
                      src={FaceImage}
                      alt=""
                      className="w-[6rem] h-[6rem] rounded-full"
                    />
                  </div>
                  <p className="text-white mt-3 font-bold ">Marry Cane</p>
                  <p className="text-white mt-1 font-thin ">@marry-cane</p>
                  <div className="flex justify-center items-center gap-x-4 mt-4">
                    <img className="w-[20px] h-[20px]" src={IconUsrCircle} alt="" />
                    <img className="w-[20px] h-[20px]" src={IconMessage} alt="" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 md:order-1 order-2 mt-6">
              {data.map((i, index) => (
                <div
                  onClick={() => {
                    nav("/game/single");
                  }}
                  key={i}
                  className="rounded-md bg-[#0D2539] cursor-pointer flex justify-between gap-x-5 items-left mb-2 p-3"
                >
                    <div className="flex gap-x-12">
                  <img
                    src={FaceImage}
                    alt=""
                    className="w-[6rem] h-[6rem] rounded-full"
                  />
                  <div>
                    <p className="text-white mt-3 font-bold ">Marry Cane</p>
                    <p className="text-white mt-1 font-thin ">@marry-cane</p>
                  </div>

                    </div>

                  <div className="flex items-center gap-x-4 mr-4">
                    <img className="w-[20px] h-[20px]" src={IconUsrCircle} alt="" />
                    <img className="w-[20px] h-[20px]" src={IconMessage} alt="" />
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
