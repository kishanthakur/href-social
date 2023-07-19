import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DialogBox = () => {
  const [modal, setModal] = useState(true);
  const navigate = useNavigate();

  const goToMyProfile = () => {
    navigate("/profile");
  };

  return (
    <>
      {modal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-3/4 sm:w-3/4 lg:w-1/2 xl:w-1/3 my-10 mx-auto ">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-xl sm:text-xl lg:text-2xl xl:text-3xl font=semibold">
                    Congratulations!
                  </h3>
                </div>
                <div className="relative p-6 flex-auto"></div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-white bg-blue-500 active:bg-blue-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setModal(false)}
                  >
                    ok, Got it
                  </button>
                  <button
                    className="text-white bg-yellow-500 active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={goToMyProfile}
                  >
                    Go to my Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default DialogBox;