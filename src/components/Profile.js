import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { App, Credentials } from "realm-web";
import { useSelector, useDispatch } from "react-redux";
import Loading from "./Loading";
import {
  STORE_EDIT_PROFILE_FLAG,
  STORE_DATA_IN_STATE,
  STORE_PREVIEW_FLAG,
} from "../Reducers";

export default function Profile() {
  const DATA_FROM_STATE = useSelector((state) => state.DATA.FORM_DATA);
  const IMG_URL = useSelector((state) => state.DATA.IMAGE);

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const colorbg = "bg-yellow-600";
  const colorText = "text-yellow-100";

  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorPage, setErrorPage] = useState(false);
  const [photoURL, setPhotoURL] = useState(null);

  // if the route is of preview, then update the redux store
  useEffect(() => {
    if (location.pathname === "/preview") {
      dispatch(STORE_PREVIEW_FLAG(true));
    } else {
      dispatch(STORE_PREVIEW_FLAG(false));
    }
  }, [dispatch, location]);

  // if state is available, then use the data from state otherwise fetch the data from db
  useEffect(() => {
    if (DATA_FROM_STATE.name) {
      setProfileData(DATA_FROM_STATE);
      setLoading(false);
      dispatch(STORE_EDIT_PROFILE_FLAG(true));
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

        if (dataByUserName === null) {
          setErrorPage(true);
        } else {
          setProfileData(dataByUserName);
          setLoading(false);
          dispatch(STORE_EDIT_PROFILE_FLAG(true));
          const { _id, ...updatedData } = dataByUserName;
          dispatch(STORE_DATA_IN_STATE(updatedData));
        }
      }
      fetchData();
    }
  }, [DATA_FROM_STATE, dispatch, location]);

  // create new object with just links
  const newStoredData = { ...profileData };
  const links = Object.fromEntries(
    Object.entries(newStoredData).filter(([key, value]) => {
      return (
        value !== "" &&
        key !== "name" &&
        key !== "username" &&
        key !== "description" &&
        key !== "photo" &&
        key !== "_id" &&
        key !== "securityKey" &&
        key !== "securityQuestion" &&
        key !== "ImgUrl"
      );
    })
  );

  useEffect(() => {
    async function updatePhoto() {
      const app = new App({ id: "href-social-qmufp" });
      await app.logIn(Credentials.anonymous());
      const mongoClient = app.currentUser.mongoClient("mongodb-atlas");
      const collection = mongoClient
        .db("href-social-db")
        .collection("href-social-collection");
      await collection.updateOne(
        { username: DATA_FROM_STATE["username"] },
        { $set: { ImgUrl: IMG_URL } }
      );
    }

    if (IMG_URL) {
      setPhotoURL(IMG_URL);
      setLoading(false);
      updatePhoto();
    } else if (profileData.ImgUrl) {
      setPhotoURL(profileData.ImgUrl);
      setLoading(false);
    }
  }, [DATA_FROM_STATE, IMG_URL, profileData]);

  // if user directly tries to access preview page, then navigate to home page
  useEffect(() => {
    if (location.pathname === "/preview") {
      if (!DATA_FROM_STATE.name) navigate("/");
    }
  }, [DATA_FROM_STATE, navigate, location]);

  // if username doesn't exists, then navigate to error page
  useEffect(() => {
    if (errorPage) {
      navigate("/error");
    }
  }, [errorPage, navigate]);

  // scroll the page to top on render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // check if a icon exists, if not display the link icon
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

  // modify the object to map name and link for the custom links
  const newLinks = Object.fromEntries(
    Object.entries(links).reduce((acc, [key, value]) => {
      if (key.includes("Email")) {
        acc.push([key, `mailto:${value}`]);
      } else {
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
            id="myImage"
            className="rounded-full w-32 h-32 mt-24"
            src={photoURL}
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
