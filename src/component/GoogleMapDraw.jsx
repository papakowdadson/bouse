import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import Spinner from "./Spinner";
import React from "react";

const GoogleMapDraw = ({data}) => {
  console.log('=========geolocation googlemapdraw========');
  console.log(data.geolocation)
  console.log(process.env.REACT_APP_GOOGLE_API_KEY);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });
  const center = useMemo(() => ({ lat: data.geolocation._lat, lng: data.geolocation._long }), []);

  return (
    <div className="App">
      {!isLoaded ? (
        <Spinner/>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"
          center={center}
          zoom={10}
        >
          <Marker position={{ lat: data.geolocation._lat, lng: data.geolocation._long  }} />
        </GoogleMap>
      )}
    </div>
  );
};

export default GoogleMapDraw ;