import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { ReactComponent as Explore } from "../assets/svg/exploreIcon.svg";
import { ReactComponent as Offer } from "../assets/svg/localOfferIcon.svg";
import { ReactComponent as Profile } from "../assets/svg/personOutlineIcon.svg";

function NavMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };
  return (
    <footer className="navbar">
      <nav className="navbarNav">
        <ul className="navbarListItems">
          <li className="navbarListItem" onClick={() => navigate("/")}>
            <Explore
              fill={pathMatchRoute("/") ? "#2c2c2c" : "#8f8f8f"}
              width="34px"
              height="34px"
            />
            <p className={pathMatchRoute("/") ? "navbarListItemNameActive" : "navbarListItemName" }>Explore</p>
          </li>
          <li className="navbarListItem" onClick={() => navigate("/offer")}>
            <Offer
              fill={pathMatchRoute("/offer") ? "#2c2c2c" : "#8f8f8f"}
              width="34px"
              height="34px"
            />
            <p className={pathMatchRoute("/offer") ? "navbarListItemNameActive" : "navbarListItemName" }>Offer</p>
          </li>
          <li className="navbarListItem" onClick={() => navigate("/profile")}>
            <Profile
              fill={pathMatchRoute("/profile") ? "#2c2c2c" : "#8f8f8f"}
              width="34px"
              height="34px"
            />
            <p className={pathMatchRoute("/profile") ? "navbarListItemNameActive" : "navbarListItemName" }>Profile</p>
          </li>
        </ul>
      </nav>
    </footer>
  );
}

export default NavMenu;
