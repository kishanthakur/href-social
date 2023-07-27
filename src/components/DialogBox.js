import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useHmac } from "react-hash";
import { App, Credentials } from "realm-web";
import { STORE_DATA_IN_STATE } from "../Reducers";
import { CopyToClipboard } from "react-copy-to-clipboard";

const DialogBox = () => {
  const [modal, setModal] = useState(true);
  const [submit, setSubmit] = useState(true);
  const [securityQ, setSecurityQ] = useState("");
  const [securityKey, setSecurityKey] = useState("");
  const [error, setError] = useState(false);
  const [data, setData] = useState(false);
  const [hmac, setHmacAlgo, setHmacMessage, setHmacSecret] = useHmac();
  const hmacRef = useRef(null);
  const [verifyKey, setVerifyKey] = useState(false);
  const [verifyKeyError, setVerifyKeyError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [secret, setSecret] = useState(false);
  const [hasDispatched, setHasDispatched] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const DATA_FROM_STATE = useSelector((state) => state.DATA.FORM_DATA);
  const VERIFY_KEY = useSelector((state) => state.DATA.VERIFY_KEY);
  const IMG_URL = useSelector((state) => state.DATA.IMAGE);

  const goToMyProfile = () => {
    navigate(`/${DATA_FROM_STATE.username}`);
  };

  const handlOkGotItClick = () => {
    setModal(false);
    if (location.pathname === "/preview") {
      navigate(`/${DATA_FROM_STATE.username}`);
    }
  };

  const handleSubmit = () => {
    setModal(true);

    if (VERIFY_KEY) {
      console.log("Inside verify");
      if (securityKey === "") {
        setError(true);
      } else {
        setVerifyKey(true);
        setError(false);
        console.log("Inside verify else");
        console.log(DATA_FROM_STATE.securityKey.hmac + " ==== " + securityKey);
        if (DATA_FROM_STATE.securityKey.hmac === securityKey) {
          console.log("Inside true");
          setVerifyKeyError(false);
          setSubmit(false);
          setVerifyKey(false);
          setModal(false);
          navigate(`/edit/${DATA_FROM_STATE.username}`);
        } else {
          console.log("Inside verify error");
          setVerifyKey(false);
          setVerifyKeyError(true);
          console.log(verifyKeyError);
        }
      }
    } else {
      if (securityQ === "") {
        setError(true);
      } else {
        setError(false);
        setSubmit(false);
        setHmacAlgo("HmacMD5");
        setHmacMessage(`/${DATA_FROM_STATE.username}`);
        setHmacSecret(securityQ);
      }
    }
  };

  // check if hmac is updated with new value
  useEffect(() => {
    if (hmac && securityQ.length > 0 && !submit) {
      setData(true);
      setSecret(true);
    }
  }, [hmac, securityQ, submit]);

  useEffect(() => {
    if (data && secret && !hasDispatched) {
      const updatedData = {
        ...DATA_FROM_STATE,
        securityKey: { hmac },
        securityQuestion: securityQ,
        ImgUrl: IMG_URL,
      };

      // Check if data has genuinely changed
      if (JSON.stringify(updatedData) !== JSON.stringify(DATA_FROM_STATE)) {
        console.log("INSIDE DISPATCH DATA");
        dispatch(STORE_DATA_IN_STATE(updatedData));
        setHasDispatched(true);
      }
    }
  }, [
    DATA_FROM_STATE,
    IMG_URL,
    data,
    dispatch,
    hasDispatched,
    hmac,
    secret,
    securityQ,
  ]);

  useEffect(() => {
    async function storeDataToDB() {
      if (data && secret && hasDispatched) {
        const app = new App({ id: "href-social-qmufp" });
        await app.logIn(Credentials.anonymous());
        const mongoClient = app.currentUser.mongoClient("mongodb-atlas");
        const collection = mongoClient
          .db("href-social-db")
          .collection("href-social-collection");

        await collection.insertOne(DATA_FROM_STATE);

        console.log("Db updatedddd");
        setHasDispatched(false); // Reset after DB update
      }
    }
    storeDataToDB();
  }, [data, secret, hasDispatched, DATA_FROM_STATE]);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <>
      {modal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-3/4 sm:w-3/4 lg:w-1/2 xl:w-1/3 my-10 mx-auto ">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex flex-col items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  {VERIFY_KEY ? (
                    <h3 className="text-xl sm:text-xl lg:text-2xl xl:text-3xl font=semibold">
                      VERIFICATION
                    </h3>
                  ) : (
                    <>
                      <h3 className="text-xl sm:text-xl lg:text-2xl xl:text-3xl font=semibold">
                        Congratulations!
                      </h3>
                      <h5 className="text-sm mt-1 text-gray-500 font=semibold">
                        Now, you have all your social links at one place.
                      </h5>
                    </>
                  )}
                </div>
                <div className="relative p-5 flex-auto">
                  {VERIFY_KEY ? (
                    <>
                      <input
                        type="text"
                        value={securityKey}
                        placeholder="Enter your security key"
                        className="w-full p-2 border rounded"
                        onChange={(e) => setSecurityKey(e.target.value)}
                      />
                      {error && (
                        <p className="text-red-600 mt-1">
                          Please enter security key
                        </p>
                      )}
                      {verifyKey && (
                        <p className="text-green-600 mt-1">
                          Verifying security key...
                        </p>
                      )}
                      {verifyKeyError && (
                        <p className="text-red-600 mt-1">
                          The security key does not match
                        </p>
                      )}
                    </>
                  ) : submit ? (
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
                    <div className="flex flex-col sm:flex-row items-center">
                      <div className="flex flex-col items-center">
                        <p className="text-gray-500 text-sm mb-1">
                          *Save this key to edit your profile*
                        </p>
                        <p
                          className="mb-0  border-dashed border-black border-2 p-2 text-sm sm:text-lg"
                          ref={hmacRef}
                        >
                          {hmac}
                        </p>
                      </div>

                      <CopyToClipboard text={hmac}>
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="mt-2 sm:mt-0 ml-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded hover:from-purple-600 hover:to-blue-500 transform hover:scale-105 active:scale-95 transition-all duration-300"
                        >
                          {isCopied ? "Copied" : "Copy"}
                        </button>
                      </CopyToClipboard>
                    </div>
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

                  {location.pathname !== "/preview" &&
                  !submit &&
                  !VERIFY_KEY ? (
                    <button
                      className="text-white bg-yellow-500 active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      onClick={goToMyProfile}
                    >
                      Go to my Profile
                    </button>
                  ) : null}
                  {VERIFY_KEY ? (
                    <button
                      className="text-white bg-blue-600 active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      onClick={() => setModal(false)}
                    >
                      Cancel
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
