import React from "react";
import { useState, useEffect } from "react";
import { db } from "../firebase.config";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "swiper/swiper-bundle.css";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperLide, SwiperSlide } from "swiper/react";

import Spinner from "../component/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
const Listing = () => {
  // Todo: Add leaflet cdn to index in the public folder

  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  const fetchListings = async () => {
    try {
      // get listing
      const listingRef = doc(db, "listings", params.listingId);

      //Execute querry
      const querySnap = await getDoc(listingRef);
      if (querySnap.exists()) {
        setLoading(false);
        console.log("single listing" + querySnap.data());
        setListing(querySnap.data());
        console.log(listing);
        // TODO:fix listing being null,loading state not setting
      }
    } catch (error) {
      console.log(error);
      toast.error("Couldn't load data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [navigate, params.listingId]);

  return { loading } ? (
    <Spinner />
  ) : (
    <main>
      <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {listing.imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="swiperSlideDiv"
              style={{
                background: `url(${listing.imageUrls[index]}) center no-repeat `,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="share Icon" />
      </div>
      {shareLinkCopied && <p className="linkCopied">Link Copied</p>}
      <div className="listingDetails">
        <p className="listingName">
          {listing.name}-$
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">For {listing.type}</p>
        {listing.offer && (
          <p>${listing.regularPrice - listing.discountedPrice}discount</p>
        )}
        <ul className="listingDetailsList">
          <li>
            {listing.bedroom > 1
              ? `${listing.bedroom} bedrooms`
              : `${listing.bedroom} bedroom`}
          </li>
          <li>
            {listing.bathroom > 1
              ? `${listing.bathroom} bathrooms`
              : `${listing.bathroom} bathroom`}
          </li>
          <li>{listing.parking && "Parking space"}</li>
          <li>{listing.furnished && "Furnished"}</li>
        </ul>
        <p className="listingLocationTitle">Location</p>
        {/* map */}
        {auth.currentUser.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className="primaryButton"
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  );
};

export default Listing;
