import "./App.css";
import Form from "./components/Form";
import Profile from "./components/Profile";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route>
          <Route exact path="/" element={<Form />}></Route>
          <Route exact path="/profile" element={<Profile />}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
