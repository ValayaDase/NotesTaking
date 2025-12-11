import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";

function App() {
  return (
    <>
    <ToastContainer />
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />        {/* Home page */}
        <Route path="/" element={<Login />} />  {/* Sign in page */}
        <Route path="/signup" element={<Signup />} /> {/* Sign up page */}
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
