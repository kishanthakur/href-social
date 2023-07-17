import Form from "./components/Form";
import Profile from "./components/Profile";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import "tailwindcss/tailwind.css";
import Footer from "./components/Footer";
import Headers from "./components/Header";

function App() {
  const storedData = useSelector((state) => state.data.storedData);

  const colorText = storedData.name ? "bg-yellow-100" : "bg-white-50";

  return (
    <>
      <Headers />
      <div className={`${colorText} min-h-screen`}>
        <Routes>
          <Route>
            <Route exact path="/" element={<Form />}></Route>
            <Route exact path="/profile" element={<Profile />}></Route>
          </Route>
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
