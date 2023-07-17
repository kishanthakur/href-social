import React from "react";
import { useSelector } from "react-redux";
import "tailwindcss/tailwind.css";

export default function Profile() {
  const storedData = useSelector((state) => state.data.storedData);
  const colorbg = "bg-yellow-600";
  const colorText = "text-yellow-100";

  const newStoredData = { ...storedData };
  const links = Object.fromEntries(
    Object.entries(newStoredData).filter(([key, value]) => {
      return (
        value !== "" &&
        key !== "name" &&
        key !== "mainlink" &&
        key !== "description" &&
        key !== "bgcolor" &&
        key !== "photo"
      );
    })
  );

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
      <div className="flex flex-col justify-center items-center mt-16">
        <img
          className="rounded-full w-36 h-36"
          src="/Kishan-pp.png"
          alt="Profile"
        />
        <p className="mt-5 mb-0 font-semibold text-xl text-center w-3/4 ">
          {storedData.name}
        </p>
        <p className="mt-3 mb-4 font-sans line-clamp-5 italic text-lg text-center w-1/4 ">
          {storedData.description}
        </p>
      </div>
      {Object.entries(newLinks).map(([key, value], index) => {
        return (
          <a href={value} key={index} target="_blank" rel="noreferrer">
            <div className="flex flex-wrap justify-center mt-0">
              <div
                className={`${colorbg} ${colorText} m-4 w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 text-center font-bold p-4 rounded`}
              >
                <p>{key}</p>
              </div>
            </div>
          </a>
        );
      })}
    </>
  );
}
