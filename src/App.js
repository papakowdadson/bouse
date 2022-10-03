import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavMenu from "./component/navMenu";


import Explore from "./pages/explore";
import Offer from "./pages/offer";
import Profile from "./pages/profile";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/offer" element={<Offer />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <NavMenu></NavMenu>
      </Router>
      
    </>
  );
}

export default App;
