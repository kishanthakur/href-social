import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DialogBox from "./DialogBox";
import { useSelector } from "react-redux";

export default function Headers() {
  const param = useLocation();
  const navigate = useNavigate();

  const DATA_FROM_STATE = useSelector((state) => state.DATA.FORM_DATA);
  const EDIT_PROFILE = useSelector((state) => state.DATA.EDIT_PROFILE);

  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-yellow-50 -mt-1 fixed top-0 left-0 w-full">
        <div className="flex justify-between items-center p-1">
          <img
            src="/href-logo-3.svg"
            alt="href social"
            className="w-36 sm:w-44 md:w-44 lg:w-48 xl:w-52 h-16"
          />

          <div className="space-x-2 mr-2">
            {param.pathname !== "/" &&
            !param.pathname.includes("/edit") &&
            !param.pathname.includes("/error") &&
            EDIT_PROFILE === true ? (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => navigate(`/edit/${DATA_FROM_STATE.username}`)}
              >
                Edit Profile
              </button>
            ) : null}
            {param.pathname === "/preview" ? (
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => setShowModal(true)}
              >
                Submit
              </button>
            ) : null}
            {showModal && <DialogBox />}
          </div>
        </div>
      </div>
    </>
  );
}
