import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import "tailwindcss/tailwind.css";

export default function Profile() {
  const storedData = useSelector((state) => state.data.storedData);
  const colorbg = "bg-yellow-600";
  const colorText = "text-yellow-100";

  const navigate = useNavigate();

  const newStoredData = { ...storedData };
  const links = Object.fromEntries(
    Object.entries(newStoredData).filter(([key, value]) => {
      return (
        value !== "" &&
        key !== "name" &&
        key !== "username" &&
        key !== "description" &&
        key !== "bgcolor" &&
        key !== "photo"
      );
    })
  );

  useEffect(() => {
    if (!storedData.name) {
      navigate("/");
    }
  }, [storedData.name, navigate]);

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
      <div className="flex flex-col justify-center items-center ">
        <img
          className="rounded-full w-32 h-32 mt-8"
          src="/Kishan-pp.png"
          alt="Profile"
        />
        <p className="mt-5 mb-0 font-semibold text-xl text-center w-3/4 ">
          {storedData.name}
        </p>
        <p className="mt-3 mb-2 line-clamp-5 italic font-mono text-lg text-center w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4  ">
          {storedData.description}
        </p>
      </div>
      {Object.entries(newLinks).map(([key, value], index) => {
        return (
          <div key={index} className="flex flex-wrap justify-center mt-3.5">
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3"
            >
              <div
                className={`${colorbg} ${colorText}  text-center font-bold p-4 rounded`}
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
    </>
  );
}
