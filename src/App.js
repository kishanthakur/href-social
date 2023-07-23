import Form from "./components/Form";
import Profile from "./components/Profile";
import { Routes, Route } from "react-router-dom";
import "tailwindcss/tailwind.css";
import Footer from "./components/Footer";
import Headers from "./components/Header";
import ErrorPage from "./components/ErrorPage";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  const colorText =
    location.pathname === "/" || location.pathname.includes("/edit")
      ? "bg-white-50"
      : "bg-yellow-100";

  return (
    <>
      <Headers />
      <div className={`${colorText} min-h-screen`}>
        <Routes>
          <Route>
            <Route exact path="/" element={<Form />}></Route>
            <Route exact path="/preview" element={<Profile />}></Route>
            <Route exact path="/:username" element={<Profile />}></Route>
            <Route exact path="/edit/:username" element={<Form />}></Route>
            <Route exact path="/error" element={<ErrorPage />}></Route>
          </Route>
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
