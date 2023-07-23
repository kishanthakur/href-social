import React from "react";

const ErrorPage = () => {
  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center mt-10">
      <div className="container flex flex-col md:flex-row items-center justify-center px-5 text-gray-700">
        <div className="max-w-md">
          <div className="text-9xl font-dark font-bold">404</div>
          <p className="text-3xl md:text-3xl font-light leading-normal mt-1">
            Oops.This profile does not exists
          </p>
          <p className="mb-8 mt-1">
            You may have mistyped the username, please try again.
          </p>
        </div>
        <div className="max-w-lg">
          <img alt="Error" src="/error-icon.png" />
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
