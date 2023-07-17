import React from "react";
import "tailwindcss/tailwind.css";

const Footer = () => {
  const getYear = () => {
    return new Date().getFullYear();
  };

  return (
    <div className="footer px-8 py-16 flex justify-center align-center flex-col bg-neutral-800">
      <div className="mx-auto text-3xl text-neutral-400 mb-8 space-x-10">
        <a
          rel="noreferrer"
          href="https://github.com/kishanthakur/href-social"
          target="_blank"
        >
          <i className="devicon-github-original"></i>
        </a>
      </div>
      <span className="text-sm text-center text-neutral-600">
        © {getYear()} - Made with ReactJS & Tailwind CSS
      </span>
    </div>
  );
};

export default Footer;
