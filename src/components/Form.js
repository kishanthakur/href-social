import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { App, Credentials } from "realm-web";
import {
  STORE_DATA_IN_STATE,
  STORE_TOTAL_CUSTOM_LINKS,
  STORE_IMAGE_URL,
} from "../Reducers";
import AWS from "aws-sdk";
import Loading from "./Loading";
import DialogBox from "./DialogBox";

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

  const watchInputs = watch();

  const app = new App({ id: "href-social-qmufp" });

  const DATA_FROM_STATE = useSelector((state) => state.DATA.FORM_DATA);
  const CUSTOM_LINKS = useSelector((state) => state.DATA.TOTAL_CUSTOM_LINKS);
  const PREVIEW = useSelector((state) => state.DATA.PREVIEW);

  const [links, setLinks] = useState(CUSTOM_LINKS);
  const [linkError, setLinkError] = useState(false);
  const [showModal, setShowModal] = useState();
  const [submit, setSubmit] = useState(false);
  const [deleteBtn, setDeleteBtn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [checkUsername, setCheckUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [update, setUpdate] = useState(false);

  const dispatchData = () => {
    const data = getValues();
    const { link, customName, photo, ...newDataWithOutPhoto } = data;
    let fileList = "";

    if (watchInputs["photo"][0].name) {
      fileList = data.photo[0].name;
    } else {
      fileList = DATA_FROM_STATE.photo;
    }
    const newDataWithPhoto = {
      ...newDataWithOutPhoto,
      photo: fileList,
    };

    dispatch(STORE_DATA_IN_STATE(newDataWithPhoto));
    dispatch(STORE_TOTAL_CUSTOM_LINKS(links));

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

  // if a user directly tries to open edit form then it will navigate to home
  useEffect(() => {
    if (location.pathname.includes("/edit")) {
      if (!DATA_FROM_STATE.name) navigate("/");
    }
  }, [DATA_FROM_STATE, navigate, location]);

  const [isUploading, setIsUploading] = useState(false);

  const onSubmit = async (data) => {
    addPhoto(data);

    if (update) {
      if (PREVIEW) {
        if (!isUploading) {
          navigate("/preview");
        }
      } else {
        if (hasChanged) {
          for (let key in watchInputs) {
            if (key !== "securityQuestion" && key !== "securityKey") {
              let inputs = watchInputs[key];
              if (key === "photo") {
                inputs = watchInputs["photo"][0].name;
              }
              if (inputs !== DATA_FROM_STATE[key]) {
                setLoading(true);

                const app = new App({ id: "href-social-qmufp" });
                await app.logIn(Credentials.anonymous());
                const mongoClient =
                  app.currentUser.mongoClient("mongodb-atlas");
                const collection = mongoClient
                  .db("href-social-db")
                  .collection("href-social-collection");

                if (key === "photo") {
                  await collection.updateOne(
                    { username: DATA_FROM_STATE["username"] },
                    { $set: { [key]: watchInputs["photo"][0].name } }
                  );
                } else {
                  await collection.updateOne(
                    { username: DATA_FROM_STATE["username"] },
                    { $set: { [key]: watchInputs[key] } }
                  );
                }
              }
            }
          }
          setLoading(false);
          if (!isUploading) {
            navigate(`/${DATA_FROM_STATE.username}`);
          }
        }
      }
    } else {
      if (!isUploading) {
        if (Object.keys(errors).length === 0 && !submit) {
          navigate("/preview");
        } else {
          setShowModal(true);
        }
      }
    }

    dispatchData();
  };

  // when updating the data, it will check if any input is changed
  useEffect(() => {
    if (watchInputs.name) {
      for (const key in watchInputs) {
        if (key !== "securityQuestion" && key !== "securityKey") {
          if (DATA_FROM_STATE[key] !== watchInputs[key]) {
            setHasChanged(true);
            return;
          }
        }
      }
    }
    setHasChanged(false);
  }, [DATA_FROM_STATE, watchInputs]);

  const addCustomLinkTextBox = () => {
    const data = getValues();
    if (data.customName !== "" && data.link !== "") {
      setLinkError(false);
      setLinks({ ...links, [data.customName]: data.link });
      setValue("customName", "");
      setValue("link", "");
    } else {
      setLinkError(true);
    }
  };

  const deleteCustomLink = ({ key }) => {
    const { [key]: valueToDelete, ...newObj } = links;
    setLinks(newObj);
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

  const validateUsername = async () => {
    if (!location.pathname.includes("/edit") && !usernameAvailable) {
      setCheckUsername(true);
      setUsernameAvailable(false);
      const username = watch("username");

      const collections = await connectToDatabase();
      const usernameAvailable = await collections.findOne({
        username: `${username}`,
      });

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

  // if errors are still there, don't show the Dialog box
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setShowModal(false);
      setSubmit(false);
    }
  }, [errors]);

  const handleSubmitClick = (e) => {
    setSubmit(true);
    if (e.target.value === "Update") {
      setUpdate(true);
    }
  };

  const handlePreviewClick = (e) => {
    setSubmit(false);
    if (e.target.value === "Cancel") {
      if (PREVIEW) {
        navigate("/preview");
      } else {
        navigate(`/${DATA_FROM_STATE.username}`);
      }
    }
  };

  // when user clicks on edit profile, the user is redirected to home page with  all the inputs populated
  useEffect(() => {
    if (location.pathname !== "/") {
      for (let key in DATA_FROM_STATE) {
        setValue(key, DATA_FROM_STATE[key]);
      }
    }
  }, [DATA_FROM_STATE, setValue, location]);

  // upload photo to s3
  async function addPhoto(data) {
    if (data.username && data.photo && document.getElementById("photo")) {
      //setIsUploading(true);
      AWS.config.update({
        accessKeyId: process.env.REACT_APP_AWS_APIKEY,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET,
        region: process.env.REACT_APP_AWS_REGION,
      });
      let albumBucketName = "href-social";
      var files = document.getElementById("photo").files;

      var file = files[0];
      var originalFileName = file.name;
      var fileExtension = originalFileName.split(".").pop();

      var newFileName =
        originalFileName.split(".")[0] +
        "_" +
        data.username +
        "." +
        fileExtension;

      var photoKey = "users/photos/" + newFileName;

      // Use S3 ManagedUpload class as it supports multipart uploads
      var upload = new AWS.S3.ManagedUpload({
        params: {
          Bucket: albumBucketName,
          Key: photoKey,
          Body: file,
        },
      });

      try {
        await upload.promise();
        console.log("Successfully uploaded photo");
        const s3Url = `https://${albumBucketName}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${photoKey}`;
        dispatch(STORE_IMAGE_URL(s3Url));
        setIsUploading(false);
      } catch (err) {
        setIsUploading(false);
        console.log(err.message);
        alert(err.message + " Try again");
      }
    }
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
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
                      <div className="mt-2 flex justify-start space-x-1">
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
                  {location.pathname.includes("/edit") && deleteBtn ? (
                    <div className="flex flex-row items-center space-x-7 justify-start">
                      <span>{DATA_FROM_STATE.photo}</span>
                      <button
                        className="text-white bg-red-600 hover:bg-red-700 rounded-lg text-sm w-20 h-8"
                        type="button"
                        onClick={() => setDeleteBtn(false)}
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      id="photo"
                      {...register("photo", {
                        required: "Photo is required",
                        validate: validateFileExtension,
                      })}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 sm:w-3/4 lg:w-3/4 xl:w-full p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-black dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  )}
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
            <div>
              {Object.entries(links).map(([key, value], index) => (
                <div key={index}>
                  <div className="mt-5">
                    <div className="flex flex-wrap justify-center items-center mt-3">
                      <div className="flex flex-col w-80 sm:w-3/4 lg:w-3/4 xl:w-2/3">
                        <label
                          htmlFor={`${key}`}
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                        >
                          {key} Link
                        </label>
                        <input
                          type="url"
                          id={`${key}`}
                          {...register(`${key}`)}
                          value={`${value}`}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 sm:w-3/4 lg:w-3/4 xl:w-full p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="https://www.youtube.com/..."
                        />
                        <button
                          type="button"
                          onClick={() => deleteCustomLink({ key })}
                          className="text-white bg-red-600 hover:bg-red-700 rounded-lg text-sm w-20 h-8 mt-2"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  <div></div>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center mt-6 w-full">
              <div className="w-80 sm:w-3/4 lg:w-3/4 xl:w-2/3 mx-auto">
                <div className="flex flex-col mb-3">
                  <label
                    htmlFor="customName"
                    className="mb-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Custom Link
                  </label>
                  <input
                    type="text"
                    id="customName"
                    {...register("customName")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Name"
                  />
                </div>
                <div className="flex flex-col mb-3">
                  <input
                    type="url"
                    id="link"
                    {...register("link")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="https://www.example.com"
                  />
                </div>
                {linkError && (
                  <p className="text-red-600 font-semibold">
                    *Please enter Name & Link both*
                  </p>
                )}
              </div>
            </div>
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
              <button
                type="submit"
                onClick={handlePreviewClick}
                value={
                  location.pathname.includes("/edit") ? "Cancel" : "Preview"
                }
                className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg mr-5 text-sm w-60 sm:w-auto px-5 py-2.5 text-center "
              >
                {location.pathname.includes("/edit") ? "Cancel" : "Preview"}
              </button>

              <button
                type="submit"
                onClick={handleSubmitClick}
                value={
                  location.pathname.includes("/edit") ? "Update" : "Submit"
                }
                className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm w-60 sm:w-auto px-5 py-2.5 text-center "
              >
                {location.pathname.includes("/edit") ? "Update" : "Submit"}
              </button>

              {showModal && submit && Object.keys(errors).length === 0 && (
                <DialogBox />
              )}
            </div>
            {update && !hasChanged && (
              <p className="flex flex-col justify-center items-center mb-3 -mt-4 text-red-500 font-semibold">
                *Please modify something or click on CANCEL*
              </p>
            )}
          </div>
        </form>
      )}
    </>
  );
}
