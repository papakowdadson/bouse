import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import Spinner from "./Spinner";
import React from "react";

const GoogleMapDraw = ({data}) => {
  console.log(data.geolocation)
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });
  const center = useMemo(() => ({ lat: data.geolocation.lat, lng: data.geolocation.lat }), []);

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
          <Marker position={{ lat: data.geolocation.lat, lng: data.geolocation.lat  }} />
        </GoogleMap>
      )}
    </div>
  );
};

export default GoogleMapDraw ;