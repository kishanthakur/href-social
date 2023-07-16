import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { storeData } from "../Reducers";

export default function Form() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmitForm = (data, e) => {
    e.preventDefault();
    const selectedFile = watch("file");

    const { photo, ...newDataWithOutPhoto } = data;
    const newDataWithPhoto = {
      ...newDataWithOutPhoto,
      photo: selectedFile[0],
    };
    dispatch(storeData(newDataWithPhoto));
    reset();
    setTimeout(() => navigate("/profile"), 500);

    console.log(data);
  };

  const [customLink, setCustomLink] = useState([]);
  const addCustomLinkTextBox = () => {
    setCustomLink([...customLink, customLink.length + 1]);
  };

  const deleteCustomLink = () => {
    setCustomLink(customLink.slice(0, -1));
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <div className="ml-9 sm:ml-9 md:ml-20 lg:ml-40 xl:ml-70 mt-10">
        <label
          htmlFor="name"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          {...register("name", {
            required: "Name is required",
          })}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 sm:w-3/4 lg:w-3/4 xl:w-1/2 p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Kishan Thakur"
        />
        {errors.name && <p className="text-red-600">{errors.name.message}</p>}
      </div>
      <div className="ml-9 sm:ml-9 md:ml-20 lg:ml-40 xl:ml-70 mt-6">
        <label
          htmlFor="mainlink"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
        >
          Main Link
        </label>
        <input
          type="url"
          id="mainlink"
          {...register("mainlink", {
            required: "Main Link is required",
          })}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 sm:w-3/4 lg:w-3/4 xl:w-1/2 p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="www.kishathakur.com"
        />
        {errors.mainlink && (
          <p className="text-red-600">{errors.mainlink.message}</p>
        )}
      </div>
      <div className="ml-9 sm:ml-9 md:ml-20 lg:ml-40 xl:ml-70 mt-6">
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
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 sm:w-3/4 lg:w-3/4 xl:w-1/2 p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Coder, Cricketer, Teacher"
        />
        {errors.description && (
          <p className="text-red-600">{errors.description.message}</p>
        )}
      </div>
      <div className="ml-9 sm:ml-9 md:ml-20 lg:ml-40 xl:ml-70 mt-6">
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
          })}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 sm:w-3/4 lg:w-3/4 xl:w-1/2 p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-black dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        {errors.photo && <p className="text-red-600">{errors.photo.message}</p>}
      </div>
      <div className="ml-9 sm:ml-9 md:ml-20 lg:ml-40 xl:ml-70 mt-6">
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register("email", {
            required: "Email is required",
          })}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 sm:w-3/4 lg:w-3/4 xl:w-1/2 p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="kishanthakur@gmail.com"
        />
        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
      </div>

      <div className="ml-9 sm:ml-9 md:ml-20 lg:ml-40 xl:ml-70 mt-6">
        <label
          htmlFor="twitterlink"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
        >
          Twitter Link
        </label>
        <input
          type="url"
          id="twitterlink"
          {...register("twitterlink")}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 sm:w-3/4 lg:w-3/4 xl:w-1/2 p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="www.twitter.com/..."
        />
      </div>
      <div className="ml-9 sm:ml-9 md:ml-20 lg:ml-40 xl:ml-70 mt-6">
        <label
          htmlFor="linkedinlink"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
        >
          Linkedin Link
        </label>
        <input
          type="url"
          id="linkedinlink"
          {...register("linkedinlink")}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 sm:w-3/4 lg:w-3/4 xl:w-1/2 p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="www.linkedin.com/..."
        />
      </div>
      <div className="ml-9 sm:ml-9 md:ml-20 lg:ml-40 xl:ml-70 mt-6">
        <label
          htmlFor="instagramlink"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
        >
          Instagram Link
        </label>
        <input
          type="url"
          id="instagramlink"
          {...register("instagramlink")}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 sm:w-3/4 lg:w-3/4 xl:w-1/2 p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="www.instagram.com/..."
        />
      </div>
      <div className="ml-9 sm:ml-9 md:ml-20 lg:ml-40 xl:ml-70 mt-6">
        <label
          htmlFor="youtubelink"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
        >
          Youtube Link
        </label>
        <input
          type="url"
          id="youtubelink"
          {...register("youtubelink")}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 sm:w-3/4 lg:w-3/4 xl:w-1/2 p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="www.youtube.com/..."
        />
      </div>
      {customLink.map((item, index) => (
        <div
          key={index}
          className="ml-9 sm:ml-9 md:ml-20 lg:ml-40 xl:ml-70 mt-6"
        >
          <label
            htmlFor="youtubelink"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
          >
            Custom Link #{item}
          </label>
          <div className="flex flex-col space-x-0">
            <input
              type="text"
              id={`customlink${item}`}
              {...register(`customlink${item}name`)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 mb-3 sm:w-3/4 lg:w-3/4 xl:w-1/2 p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Name"
            />
            <input
              type="url"
              id={`customlink${item}`}
              {...register(`customlink${item}link`)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 mb-3 sm:w-3/4 lg:w-3/4 xl:w-1/2 p-2.5 dark:bg-gray-200 dark:border-gray-50 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Link"
            />
            <button
              type="button"
              onClick={deleteCustomLink}
              className="text-white bg-red-600 hover:bg-red-700 rounded-lg text-sm w-20 h-8 "
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      <div className="ml-9 sm:ml-9 md:ml-20 lg:ml-40 xl:ml-70 mt-6 mb-10">
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-50  sm:w-auto px-5 py-2.5 text-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-700"
          onClick={addCustomLinkTextBox}
        >
          + Add Custom Link
        </button>
      </div>
      <div className="ml-9 sm:ml-9 md:ml-20 lg:ml-40 xl:ml-70 mt-3">
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
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
          </select>
        </div>
      </div>
      <div className="ml-9 sm:ml-9 md:ml-20 lg:ml-40 xl:ml-70 mt-6 mb-10">
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-50  sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
