import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { App, Credentials } from "realm-web";
import { useSelector } from "react-redux";
import "tailwindcss/tailwind.css";
import Loading from "./Loading";
import { STORE_DATA_IN_STATE, STORE_TOTAL_CUSTOM_LINKS } from "../Reducers";
import { useDispatch } from "react-redux";

export default function Profile() {
  const DATA_FROM_STATE = useSelector((state) => state.DATA.FORM_DATA);
  const location = useLocation();
  const colorbg = "bg-yellow-600";
  const colorText = "text-yellow-100";
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (DATA_FROM_STATE.name) {
      console.log("inside if");
      setProfileData(DATA_FROM_STATE);
      setLoading(false);
    } else {
      async function fetchData() {
        const app = new App({ id: "href-social-qmufp" });
        await app.logIn(Credentials.anonymous());
        const mongoClient = app.currentUser.mongoClient("mongodb-atlas");
        const collections = mongoClient
          .db("href-social-db")
          .collection("href-social-collection");
        const username = location.pathname.split("/")[1];

        const dataByUserName = await collections.findOne({
          username: `${username}`,
        });

        setProfileData(dataByUserName);
        setLoading(false);
        const { _id, ...updatedDataByUsername } = dataByUserName;
        dispatch(STORE_DATA_IN_STATE(updatedDataByUsername));
        console.log(updatedDataByUsername);
        dispatch(
          STORE_TOTAL_CUSTOM_LINKS(updatedDataByUsername.totalCustomLinks)
        );
      }
      fetchData();
    }
  }, [DATA_FROM_STATE, dispatch, location.pathname]);

  const navigate = useNavigate();

  const newStoredData = { ...profileData };
  const links = Object.fromEntries(
    Object.entries(newStoredData).filter(([key, value]) => {
      return (
        value !== "" &&
        key !== "name" &&
        key !== "username" &&
        key !== "description" &&
        key !== "bgcolor" &&
        key !== "photo" &&
        key !== "_id" &&
        key !== "totalCustomLinks"
      );
    })
  );

  useEffect(() => {
    if (location.pathname === "/preview") {
      if (!DATA_FROM_STATE.name) navigate("/");
    }
  }, [DATA_FROM_STATE, navigate, location]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function iconExists(iconClass) {
    iconClass = iconClass.toLowerCase().trim().replace(" ", "-");
    const iconElement = document.createElement("i");
    iconElement.className = "fa fa-" + iconClass;
    document.body.appendChild(iconElement);
    const content = window.getComputedStyle(iconElement, "::before").content;
    document.body.removeChild(iconElement);
    if (content !== "none") return "fa fa-" + iconClass;
    else return "fa fa-link";
  }

  const newLinks = Object.fromEntries(
    Object.entries(links).reduce((acc, [key, value]) => {
      if (key.includes("customlink")) {
        const newKey = `customname${key.replace("customlink", "")}`;
        acc.push([links[newKey], links[key]]);
      } else if (key.includes("Email")) {
        acc.push([key, `mailto:${value}`]);
      } else if (!key.includes("customname")) {
        acc.push([key, value]);
      }
      return acc;
    }, [])
  );

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col justify-center items-center ">
          <img
            className="rounded-full w-32 h-32 mt-24"
            src="/Kishan-pp.png"
            alt="Profile"
          />
          <p className="mt-5 mb-0 font-semibold text-xl text-center w-3/4 ">
            {profileData.name}
          </p>
          <p className="mt-3 mb-2 line-clamp-5 italic font-mono text-lg text-center w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4  ">
            {profileData.description}
          </p>

          {Object.entries(newLinks).map(([key, value], index) => {
            return (
              <div
                key={index}
                className="flex flex-wrap justify-center w-full mt-0.5 mb-3.5"
              >
                <a
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  className="w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3"
                >
                  <div
                    className={`${colorbg} ${colorText} text-center font-bold p-4 rounded`}
                  >
                    <div className="flex items-center space-x-2 justify-center">
                      <i className={iconExists(key)}></i>
                      <p>{key}</p>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
