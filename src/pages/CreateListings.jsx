import React from "react";
import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Spinner from "../component/Spinner";

function CreateListings() {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    offer: false,
    regularPrice: "",
    discountedPrice: "",
    images:{},
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;
  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/signIn");
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  const onChange = (e) => {
    let bool = null;
    if (e.target.value === "true") {
      bool = true;
    }
    if (e.target.value === "false") {
      bool = false;
    }
    if (e.target.file) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.file
      }))
    }

    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]:bool !== Boolean && e.target.value

      }))
    }

  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(formData)
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="profile">
          <header className="pageHeader">Create a Listing</header>
          <main>
            <form onSubmit={onSubmit}>
              <label className="formLabel">Sell/Rent</label>
              <div className="formButtons">
                <button
                  type="button"
                  className={
                    type === "sale" ? "formButtonActive" : "formButton"
                  }
                  onClick={onChange}
                  id="type"
                  value="sale"
                >
                  sell
                </button>
                <button
                  type="button"
                  className={
                    type === "rent" ? "formButtonActive" : "formButton"
                  }
                  onClick={onChange}
                  id="type"
                  value="rent"
                >
                  Rent
                </button>
              </div>

              <label className="formLabel">name</label>
              <input
                className="formInputName"
                type="text"
                id="name"
                onChange={onChange}
                value={name}
                min="10"
                max="50"
                required
              />
              <label className="formLabel">Bedrooms</label>
              <input
                className="formInputSmall"
                type="number"
                id="bedrooms"
                onChange={onChange}
                value={bedrooms}
                min="1"
                max="50"
                required
              />
              <label className="formLabel">Bathrooms</label>
              <input
                className="formInputSmall"
                type="number"
                id="bathrooms"
                onChange={onChange}
                value={bathrooms}
                min="1"
                max="50"
                required
              />
              <label className="formLabel">Parking</label>
              <div className="formButtons">
                <button
                  type="button"
                  className={parking && parking !=null ? "formButtonActive" : "formButton"}
                  onClick={onChange}
                  id="parking"
                  value={true}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={!parking && parking !=null ? "formButtonActive" : "formButton"}
                  onClick={onChange}
                  id="parking"
                  value={false}
                >
                  No
                </button>
              </div>

              <label className="formLabel">Furnished</label>
              <div className="formButtons">
                <button
                  type="button"
                  className={furnished ? "formButtonActive" : "formButton"}
                  onClick={onChange}
                  id="furnished"
                  value={true}
                >
                  yes
                </button>
                <button
                  type="button"
                  className={!furnished ? "formButtonActive" : "formButton"}
                  onClick={onChange}
                  id="furnished"
                  value={false}
                >
                  no
                </button>
              </div>

              <label className="formLabel">Address</label>
              <input
                className="formInputSmall"
                type="address"
                id="address"
                onChange={onChange}
                value={address}
                min="1"
                max="50"
                required
              />

              <div className="formLatLng flex">
                <label className="formLabel">Latitude</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="latitude"
                  value={latitude}
                  onChange={onChange}
                  required
                />
                <label className="formLabel">Longitude</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="longitude"
                  value={longitude}
                  onChange={onChange}
                  required
                />
              </div>
              <label className="formLabel">Offer</label>
              <div className="formButtons">
                <button
                  type="button"
                  className={offer ? "formButtonActive" : "formButton"}
                  onClick={onChange}
                  id="offer"
                  value={true}
                >
                  yes
                </button>
                <button
                  type="button"
                  className={!offer ? "formButtonActive" : "formButton"}
                  onClick={onChange}
                  id="offer"
                  value={false}
                >
                  no
                </button>
              </div>
              <label className="formLabel">Upload images</label>
              <p className="imagesInfo">A maximum of 6</p>
              <input
              className="formInputFile"
                type="file"
                id="images"
                name="images"
                max="6"
                accept=".png,.jpg,.jpeg"
                
                multiple
              />

              <label className="formLabel">Regular price</label>
              <div className="formPriceDiv">
              <input 
              className="formInputSmall"
                type="number"
                name="regularPrice"
                id="regularPrice"
                onChange={onChange}
                value={regularPrice}
                defaultValue='40'
                min='40'
                max='4000'
                
                required
              />
              {type === "rent" && <p className="formPriceText">      $ / Month</p>}
              </div>
              {offer && (
                <>
                  <label className="formLabel">Discount</label>
                  <input
                  className="formInputSmall"
                    type="number"
                    name="discountedPrice"
                    id="discountedPrice"
                    onChange={onChange}
                    value={discountedPrice}
                    required={offer}
                  />
                </>
              )}
              <button
                type="submit"
                className="primaryButton createListingButton"
              >
                Create listing
              </button>
            </form>
          </main>
        </div>
      )}
    </>
  );
}

export default CreateListings;
