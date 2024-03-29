import React from "react";
import { useState, useEffect } from "react";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import { getDocs, collection, orderBy, query, limit } from "firebase/firestore";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y,Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import Spinner from "../component/Spinner";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y,Autoplay]);

function Slider() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, []);
  const fetchListings = async () => {
    const listingsRef = collection(db, "listings");
    const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
    const querySnap = await getDocs(q);

    let listings = [];
    querySnap.forEach((doc) => {
      return listings.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    setListings(listings);    
    console.log(listings[0].data.regularPrice);

    setLoading(false);
  };
  if (loading) {
    return <Spinner />;
  }
  return (
    listings && (
      <>
        <p className="exploreHeading">Recommendation</p>
        <Swiper slidesPerView={1} pagination={{ clickable: true }} loop={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false
                }}>
          {listings.slice(0,3).map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => {
                navigate(`/category/${data.type}/${id}`);
              }}
            >
             <div className="swiperSlideDiv" style={{background:`url(${data.imageUrls[0]})no-repeat center`,backgroundSize:'cover' }} >
                <p className="swiperSlideText">{data.name}</p>
                <p className="swiperSlidePrice">${data.offer=='true' ? data.discountedPrice : data.regularPrice}{' '}{data.type === 'rent' && '/ month'}</p>
             </div>   
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}

export default Slider;
