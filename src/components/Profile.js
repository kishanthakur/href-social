import React from "react";
import { useSelector } from "react-redux";

export default function Profile() {
  const storedData = useSelector((state) => state.data.storedData);
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
      } else if (!key.includes("customname")) {
        acc.push([key, value]);
      }
      return acc;
    }, [])
  );

  const colorbg = `bg-${storedData.bgcolor}-600`;
  const colorText = `text-${storedData.bgcolor}-100`;
  return (
    <>
      <div>
        <div className="flex flex-col justify-center items-center mt-16">
          <img
            className="rounded-full w-44 h-44 "
            src="/Kishan-pp.png"
            alt="Profile"
          />
          <p className="mt-5 mb-5 font-sans line-clamp-5 text-center w-1/4 ">
            {storedData.description}
          </p>
        </div>
        {Object.entries(newLinks).map(([key, value]) => {
          if (key === "Email") {
            return (
              <a href={`mailto:${value}`} target="_blank" rel="noreferrer">
                <div className="flex flex-wrap justify-center mt-0">
                  <div
                    className={`m-4 ${colorbg} ${colorText} w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 text-center p-4 rounded`}
                  >
                    <p>{key}</p>
                  </div>
                </div>
              </a>
            );
          } else
            return (
              <a href={value} target="_blank" rel="noreferrer">
                <div className="flex flex-wrap justify-center mt-0">
                  <div
                    className={`m-4 ${colorbg} ${colorText} w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 text-center p-4 rounded`}
                  >
                    <p>{key}</p>
                  </div>
                </div>
              </a>
            );
        })}
      </div>
    </>
  );
}
