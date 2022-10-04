import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import NavMenu from "./component/navMenu";


import Explore from "./pages/explore";
import ForgetPassword from "./pages/forgetPassword";
import Offer from "./pages/offer";
import Profile from "./pages/profile";
import Signin from "./pages/signin";
import Signup from "./pages/signup";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/offer" element={<Offer />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signUp" element={<Signup/>} />
          <Route path="/signIn" element={<Signin/>} />
          <Route path="/forgetPassword" element={<ForgetPassword/>}/>
        </Routes>
        <NavMenu></NavMenu>
      </Router>
      <ToastContainer/>
      
    </>
  );
}

export default App;
