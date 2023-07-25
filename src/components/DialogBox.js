import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useHmac } from "react-hash";
import { App, Credentials } from "realm-web";

const DialogBox = () => {
  const [modal, setModal] = useState(true);
  const [submit, setSubmit] = useState(true);
  const [securityQ, setSecurityQ] = useState("");
  const [error, setError] = useState(false);
  const [data, setData] = useState(false);
  const [hmac, setHmacAlgo, setHmacMessage, setHmacSecret] = useHmac();

  const navigate = useNavigate();
  const location = useLocation();

  const DATA_FROM_STATE = useSelector((state) => state.DATA.FORM_DATA);

  const goToMyProfile = () => {
    navigate(`/${DATA_FROM_STATE.username}`);
  };

  const handlOkGotItClick = () => {
    setModal(false);
    if (location.pathname === "/preview") {
      navigate(`/${DATA_FROM_STATE.username}`);
    }
  };

  const handleSubmit = async () => {
    setModal(true);
    if (securityQ === "") {
      setError(true);
    } else {
      setError(false);
      setSubmit(false);
      setHmacAlgo("HmacMD5");
      setHmacMessage(`/${DATA_FROM_STATE.username}`);
    }
  };

  // check if hmac is updated with new value
  useEffect(() => {
    setHmacSecret(securityQ);
    if (hmac && securityQ.length > 0 && !submit) {
      setData(true);
    }
  }, [hmac, securityQ, setHmacSecret, submit]);

  // store all the data to db
  useEffect(() => {
    async function storeData() {
      if (data) {
        const updatedData = {
          ...DATA_FROM_STATE,
          securityKey: { hmac },
          securityQuestion: securityQ,
        };

        const app = new App({ id: "href-social-qmufp" });
        await app.logIn(Credentials.anonymous());
        const mongoClient = app.currentUser.mongoClient("mongodb-atlas");
        const collection = mongoClient
          .db("href-social-db")
          .collection("href-social-collection");

        await collection.insertOne(updatedData);
      }
    }
    storeData();
  }, [DATA_FROM_STATE, data, hmac, securityQ]);

  return (
    <>
      {modal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-3/4 sm:w-3/4 lg:w-1/2 xl:w-1/3 my-10 mx-auto ">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex flex-col items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-xl sm:text-xl lg:text-2xl xl:text-3xl font=semibold">
                    Congratulations!
                  </h3>
                  <h5 className="text-sm mt-1 text-gray-500 font=semibold">
                    Now, you have all your social links at one place.
                  </h5>
                </div>
                <div className="relative p-5 flex-auto">
                  {submit ? (
                    <>
                      <p className="text-gray-600 mb-4">
                        *Enter the security question to generate your security
                        key. Make sure you remember this question, this will
                        help restore the key if forgotten*
                      </p>
                      <input
                        type="text"
                        value={securityQ}
                        placeholder="Enter your security question"
                        className="w-full p-2 border rounded"
                        onChange={(e) => setSecurityQ(e.target.value)}
                      />
                      {error && (
                        <p className="text-red-600 mt-1">
                          Please enter security question
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="mb-0">{hmac}</p>
                  )}
                </div>
                <div className="flex items-center justify-end p-3 border-t border-solid border-blueGray-200 rounded-b">
                  {!submit &&
                  securityQ &&
                  hmac &&
                  location.pathname.includes("/preview") ? (
                    <button
                      className="text-white bg-blue-500 active:bg-blue-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      onClick={handlOkGotItClick}
                    >
                      ok, Got it
                    </button>
                  ) : null}

                  {location.pathname !== "/preview" && !submit ? (
                    <button
                      className="text-white bg-yellow-500 active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      onClick={goToMyProfile}
                    >
                      Go to my Profile
                    </button>
                  ) : null}
                  {submit ? (
                    <button
                      className="text-white bg-green-600 active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default DialogBox;
