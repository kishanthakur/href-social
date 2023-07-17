import "./App.css";
import Form from "./components/Form";
import Profile from "./components/Profile";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

function App() {
  const storedData = useSelector((state) => state.data.storedData);
  console.log(storedData.bgcolor);
  const colorText = storedData.bgcolor
    ? `bg-${storedData.bgcolor}-200`
    : "bg-white-100";

  return (
    <>
      <div className={`${colorText} min-h-screen`}>
        <Routes>
          <Route>
            <Route exact path="/" element={<Form />}></Route>
            <Route exact path="/profile" element={<Profile />}></Route>
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
