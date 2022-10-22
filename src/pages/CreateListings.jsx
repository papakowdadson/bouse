import React from "react";
import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Spinner from "../component/Spinner";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db } from "../firebase.config";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";


function CreateListings() {
  // console.log(process.env.React_App_YOUR_GOOGLE_API_KEY)
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedroom: 1,
    bathroom: 1,
    parking: false,
    furnished: false,
    address: "",
    offer: false,
    regularPrice: "",
    discountedPrice: "",
    images: {},
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    bedroom,
    bathroom,
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
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
      console.log(e.target.files);
      console.log(images);
    }

    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: bool !== Boolean && e.target.value,
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (discountedPrice >= regularPrice) {
      setLoading(false);
      toast.error("Discounted price should be less than regular price");
    }
    console.log(formData);
    if (images.length > 6) {
      setLoading(false);
      toast.error("Max of 6 images");
    }
    let geolocation = {};
    let location;
    // if (address != null) {

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.React_App_YOUR_GOOGLE_API_KEY}`
      );
      const data = await response.json();
      console.log(data);
      geolocation.lat = data.results[0].geometry.location.lat;
      geolocation.lng = data.results[0].geometry.location.lng;
      console.log(
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      );
      console.log(geolocation.lat);
      console.log(data.status);
      location =
        data.status == "ZERO_RESULTS"
          ? undefined
          : data.results[0].formatted_address;
      if (location == undefined || location.includes("undefined")) {
        setLoading(false);
        toast.error("area does not match");
      }
    } catch (error) {
      toast.error("area does not match");
    }

    //s store image to firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, "images/" + fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
              console.log("File available at", downloadURL);
              // return downloadURL;
              
            });
          }
        );
      });
    };

    const imageUrls = await Promise.all(
      [...images].map((image) => {
        return storeImage(image);
      })
    )
      // .then(() => {
      //   console.log("urlready " + imageUrls);
      //   return uploadingListings(imageUrls);
      // })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        toast.error("Couldn't upload listing");
        return;
      });
      console.log("urlready " + imageUrls);
      const formDataCopy = {
        ...formData,
        imageUrls,
        geolocation,
        timestamp: serverTimestamp(),
      };
      console.log(formDataCopy);
      formDataCopy.location = address;
      delete formDataCopy.address;
      delete formDataCopy.images;
      !formDataCopy.offer && delete formDataCopy.discountedPrice;
      console.log("this is" + formDataCopy);

      const docRef = await addDoc(
        collection(db, "listings"),
        formDataCopy
      )
        console.log(docRef);
        setLoading(false);
        toast.success("Created a listing");
        navigate(`/category/${formDataCopy.type}/${docRef.id}`);
      
    
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
                    type === "sell" ? "formButtonActive" : "formButton"
                  }
                  onClick={onChange}
                  id="type"
                  value="sell"
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
                id="bedroom"
                onChange={onChange}
                value={bedroom}
                min="1"
                max="50"
                required
              />
              <label className="formLabel">Bathrooms</label>
              <input
                className="formInputSmall"
                type="number"
                id="bathroom"
                onChange={onChange}
                value={bathroom}
                min="1"
                max="50"
                required
              />
              <label className="formLabel">Parking</label>
              <div className="formButtons">
                <button
                  type="button"
                  className={
                    parking && parking != null
                      ? "formButtonActive"
                      : "formButton"
                  }
                  onClick={onChange}
                  id="parking"
                  value={true}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={
                    !parking && parking != null
                      ? "formButtonActive"
                      : "formButton"
                  }
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

              {/* <div className="formLatLng flex">
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
              </div> */}
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
                onChange={onChange}
                multiple
                required
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
                  defaultValue="40"
                  min="40"
                  max="4000"
                  required
                />
                {type === "rent" && <p className="formPriceText"> $ / Month</p>}
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
