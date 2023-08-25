import React from "react";
import { useState, useEffect } from "react";
import { db } from "../firebase.config";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "swiper/swiper-bundle.css";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import Spinner from "../component/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import GoogleMapDraw from "../component/GoogleMapDraw";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
const Listing = () => {
  // Todo: Add leaflet cdn to index in the public folder

  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  console.log('Params:',params);
  const auth = getAuth();
  console.log('auth:',auth)

  const fetchListing = async () => {
    // get listing
    const listingRef = doc(db, "listings", params.listingId);

    //Execute querry
    const docSnap = await getDoc(listingRef);
    if (docSnap.exists()) {
      console.log("single listing" + docSnap.data());
      setListing(docSnap.data());
      setLoading(false);
      console.log(listing);
      // TODO:fix listing being null,loading state not setting
    }
    else{
    toast.error("Couldn't load data");
    setLoading(false);}
  };

  useEffect(() => {
    fetchListing();
   
  }, [navigate, params.listingId]);
  if (loading){return<Spinner/>}
  
    
  return(
    <main style={{padding:'5px'}}>
      <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {listing.imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
          {/* TODO:fix slider image */}
            <div
              className="swiperSlideDiv"
              style={{
                background: `url(${url}) center no-repeat `,
                backgroundSize: "100% auto",
              }}
            >
            {/* <img src={url} alt="" srcset="" />
            {console.log('url')}
            {console.log(url)} */}
            </div>
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
      { console.log(listing)}
      {shareLinkCopied && <p className="linkCopied">Link Copied</p>}
      <div className="listingDetails">
        <p className="listingName">
          {listing.name}-$
          {listing.offer=='true'
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{' '}{listing.type === 'rent' && '/ month'}
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">For {listing.type==='rent'?'rent':'sale'}</p>
        {listing.offer=='true' && (
          <p>${listing.regularPrice - listing.discountedPrice} discount</p>
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
        <div className="leafletContainer">
        
       <GoogleMapDraw data={listing}/>  
        </div>
        {auth.currentUser&&( auth.currentUser.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className="primaryButton"
          >
            Contact Landlord
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Listing;
