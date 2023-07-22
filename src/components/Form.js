import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { storeData } from "../Reducers";
import "tailwindcss/tailwind.css";
import DialogBox from "./DialogBox";
import { App, Credentials } from "realm-web";
import { useSelector } from "react-redux";

export default function Form() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const app = new App({ id: "href-social-qmufp" });

  const storedData = useSelector((state) => state.data.storedData);

  const [customLink, setCustomLink] = useState([]);
  const [showModal, setShowModal] = useState();
  const [submit, setSubmit] = useState(false);

  const dispatchData = () => {
    const data = getValues();
    const { photo, ...newDataWithOutPhoto } = data;
    const fileList = data.photo[0].name;
    const newDataWithPhoto = {
      ...newDataWithOutPhoto,
      photo: fileList,
    };
    dispatch(storeData(newDataWithPhoto));
    reset();
  };

  const connectToDatabase = async () => {
    await app.logIn(Credentials.anonymous());
    const mongoClient = app.currentUser.mongoClient("mongodb-atlas");
    const collection = mongoClient
      .db("href-social-db")
      .collection("href-social-collection");
    return collection;
  };

  const onSubmit = async (data) => {
    console.log(data);
    if (Object.keys(errors).length === 0 && !submit) navigate("/preview");
    else {
      setShowModal(true);
    }
    dispatchData();

    const collections = await connectToDatabase();

    await collections.insertOne(data);
  };

  const addCustomLinkTextBox = () => {
    setCustomLink([...customLink, customLink.length + 1]);
  };

  const deleteCustomLink = () => {
    setCustomLink(customLink.slice(0, -1));
  };

  const validateFileExtension = () => {
    const files = watch("photo");
    if (files && files.length > 0) {
      const fileExtension = files[0].name.split(".").pop().toLowerCase();
      const allowedExtensions = ["jpg", "png"];
      if (!allowedExtensions.includes(fileExtension)) {
        return "Invalid file extension, Allowed extensions are jpg, png";
      }
    }
  };

  const [checkUsername, setCheckUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);

  const validateUsername = async () => {
    if (!location.pathname.includes("/edit")) {
      setCheckUsername(true);
      setUsernameAvailable(false);
      const username = watch("username");
      const collections = await connectToDatabase();
      const usernameAvailable = await collections.findOne({
        username: `${username}`,
      });
      //console.log(usernameAvailable.name);
      if (usernameAvailable !== null) {
        setCheckUsername(false);
        setUsernameAvailable(false);
        return "Username already taken";
      } else {
        setCheckUsername(false);
        setUsernameAvailable(true);
      }
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setShowModal(false);
      setSubmit(false);
    }
  }, [errors]);

  const handleSubmitClick = (e) => {
    setSubmit(true);
    console.log(e.target.value);
  };

  useEffect(() => {
    //console.log("Redux : " + storedData);
    if (location.pathname !== "/") {
      if (storedData.name) {
        for (let key in storedData) {
          setValue(key, storedData[key]);
        }
      } else {
        async function fetchData() {
          const app = new App({ id: "href-social-qmufp" });
          await app.logIn(Credentials.anonymous());
          const mongoClient = app.currentUser.mongoClient("mongodb-atlas");
          const collections = mongoClient
            .db("href-social-db")
            .collection("href-social-collection");
          const username = location.pathname.split("/")[2];

          const dataByUserName = await collections.findOne({
            username: `${username}`,
          });
          return dataByUserName;
        }

        const dataObj = fetchData();
        for (let key in dataObj) {
          setValue(key, storedData[key]);
        }
      }
    }
  }, [storedData, setValue, location]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className=" bg-white">
        <div className="flex flex-wrap justify-center items-center mt-24">
          <div className="flex flex-col w-80 sm:w-3/4 lg:w-3/4 xl:w-2/3">
            <label
              htmlFor="name"
              className="mb-2 text-sm font-medium text-gray-900 dark:text-black self-start"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name", {
                required: "Name is required",
              })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 sm:w-3/4 lg:w-3/4 xl:w-full p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Kishan Thakur"
            />
            {errors.name && (
              <p className="text-red-600">{errors.name.message}</p>
            )}
          </div>
        </div>
        <div className="mt-5">
          <div className="flex flex-wrap justify-center items-center mt-3">
            <div className="flex flex-col w-80 sm:w-3/4 lg:w-3/4 xl:w-2/3">
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                {...register("username", {
                  required: "Username is required",
                  validate: validateUsername,
                })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 sm:w-3/4 lg:w-3/4 xl:w-full p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="kishathakur"
              />
              {errors.username &&
                checkUsername === false &&
                usernameAvailable === false && (
                  <p className="text-red-600 font-semibold mt-1">
                    {errors.username.message}
                  </p>
                )}
              {checkUsername && usernameAvailable === false && (
                <>
                  <div className="mt-2 flex justify-start mt-1 space-x-1">
                    <div className="animate-spin border-t-2 border-b-2 border-blue-500 w-5 h-5 rounded-full"></div>
                    <p className="font-semibold"> Checking the Username</p>
                  </div>
                </>
              )}

              {usernameAvailable && (
                <p className="text-green-600 font-semibold mt-1">
                  Username available
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex flex-wrap justify-center items-center mt-3">
            <div className="flex flex-col w-80 sm:w-3/4 lg:w-3/4 xl:w-2/3">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                {...register("description", {
                  required: "Description is required",
                })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 sm:w-3/4 lg:w-3/4 xl:w-full p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Coder, Cricketer, Teacher"
              />
              {errors.description && (
                <p className="text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex flex-wrap justify-center items-center mt-3">
            <div className="flex flex-col w-80 sm:w-3/4 lg:w-3/4 xl:w-2/3">
              <label
                htmlFor="photo"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Photo
              </label>
              <input
                type="file"
                id="photo"
                {...register("photo", {
                  required: "Photo is required",
                  validate: validateFileExtension,
                })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 sm:w-3/4 lg:w-3/4 xl:w-full p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-black dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              {errors.photo && (
                <p className="text-red-600">{errors.photo.message}</p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex flex-wrap justify-center items-center mt-3">
            <div className="flex flex-col w-80 sm:w-3/4 lg:w-3/4 xl:w-2/3">
              <label
                htmlFor="Email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Email
              </label>
              <input
                type="email"
                id="Email"
                {...register("Email", {
                  required: "Email is required",
                })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 sm:w-3/4 lg:w-3/4 xl:w-full p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="kishanthakur@gmail.com"
              />
              {errors.Email && (
                <p className="text-red-600">{errors.Email.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex flex-wrap justify-center items-center mt-3">
            <div className="flex flex-col w-80 sm:w-3/4 lg:w-3/4 xl:w-2/3">
              <label
                htmlFor="Twitter"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Twitter Link
              </label>
              <input
                type="url"
                id="Twitter"
                {...register("Twitter")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 sm:w-3/4 lg:w-3/4 xl:w-full p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="https://www.twitter.com/..."
              />
            </div>{" "}
          </div>
        </div>
        <div className="mt-5">
          <div className="flex flex-wrap justify-center items-center mt-3">
            <div className="flex flex-col w-80 sm:w-3/4 lg:w-3/4 xl:w-2/3">
              <label
                htmlFor="Linkedin"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Linkedin Link
              </label>
              <input
                type="url"
                id="Linkedin"
                {...register("Linkedin")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 sm:w-3/4 lg:w-3/4 xl:w-full p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="https://www.linkedin.com/..."
              />
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex flex-wrap justify-center items-center mt-3">
            <div className="flex flex-col w-80 sm:w-3/4 lg:w-3/4 xl:w-2/3">
              <label
                htmlFor="Instagram"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Instagram Link
              </label>
              <input
                type="url"
                id="Instagram"
                {...register("Instagram")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 sm:w-3/4 lg:w-3/4 xl:w-full p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="https://www.instagram.com/..."
              />
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex flex-wrap justify-center items-center mt-3">
            <div className="flex flex-col w-80 sm:w-3/4 lg:w-3/4 xl:w-2/3">
              <label
                htmlFor="Youtube"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Youtube Link
              </label>
              <input
                type="url"
                id="Youtube"
                {...register("Youtube")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 sm:w-3/4 lg:w-3/4 xl:w-full p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="https://www.youtube.com/..."
              />
            </div>
          </div>
        </div>
        {customLink.map((item, index) => (
          <div key={index} className="flex flex-col items-center mt-6 w-full">
            <div className="w-80 sm:w-3/4 lg:w-3/4 xl:w-2/3 mx-auto">
              <div className="flex flex-col mb-3">
                <label
                  htmlFor={`customlink${item}`}
                  className="mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Custom Link #{item}
                </label>
                <input
                  type="text"
                  id={`customname${item}`}
                  {...register(`customname${item}`)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Name"
                />
              </div>
              <div className="flex flex-col mb-3">
                <input
                  type="url"
                  id={`customlink${item}`}
                  {...register(`customlink${item}`)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="https://www.example.com"
                />
              </div>
              <button
                type="button"
                onClick={deleteCustomLink}
                className="text-white bg-red-600 hover:bg-red-700 rounded-lg text-sm w-20 h-8 mx-auto"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        <div className="flex flex-col items-center mt-1 w-full">
          <div className="w-80 sm:w-3/4 lg:w-3/4 xl:w-2/3 mx-auto">
            <div className="mt-6 mb-10">
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-52 px-5 py-2.5 text-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-700"
                onClick={addCustomLinkTextBox}
              >
                + Add Custom Link
              </button>
            </div>
          </div>
        </div>
        {/* <div className="ml-9 sm:ml-9 md:ml-20 lg:ml-40 xl:ml-70 mt-3">
        <label
          htmlFor="bgcolor"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
        >
          Select Background Color
        </label>
        <div className="w-60">
          <select
            className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="bgcolor"
            name="bgcolor"
            {...register("bgcolor")}
          >
            <option value="" defaultValue>
              Select Background Color
            </option>
            <option value="bg-red-600">Red</option>
            <option value="bg-green-600">Green</option>
            <option value="bg-blue-600">Blue</option>
            <option value="bg-pink-600">Pink</option>
            <option value="bg-indigo-600">Indigo</option>
            <option value="bg-purple-600">Purple</option>
            <option value="bg-yellow-600">Yellow</option>
          </select>
        </div>
      </div> */}
        <div className="flex justify-center -mt-2 mb-10 ml-12 mr-12">
          {location.pathname === "/" ? (
            <button
              type="submit"
              onClick={() => setSubmit(false)}
              value="Preview"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg mr-5 text-sm w-60 sm:w-auto px-5 py-2.5 text-center "
            >
              Preview
            </button>
          ) : null}

          <button
            type="submit"
            onClick={handleSubmitClick}
            value={location.pathname.includes("/edit") ? "Update" : "Submit"}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm w-60 sm:w-auto px-5 py-2.5 text-center "
          >
            {location.pathname.includes("/edit") ? "Update" : "Submit"}
          </button>
          {showModal && submit && Object.keys(errors).length === 0 && (
            <DialogBox />
          )}
        </div>
      </div>
    </form>
  );
}
