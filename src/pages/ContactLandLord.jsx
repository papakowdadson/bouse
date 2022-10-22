import React, { useState, useEffect } from "react";
import { db } from "../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useParams, useSearchParams } from "react-router-dom";

function ContactLandLord() {
  const [message, setMessage] = useState("");
  const [landlord, setLandlord] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    getLandlord();
  }, [params.landlordid]);

  const getLandlord = async () => {
    const docRef = doc(db, "users", params.landlordid);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      setLandlord(docSnapshot.data());
      console.log(setLandlord)
    } else {
      toast.error("could not get lanlord data");
    }
  };

  const onchange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact landlord</p>
      </header>

      {landlord !== null && (
        <main>
          <div className="container">
            <p className="landlordName">Contact {landlord.name}</p>
          </div>
          <form onSubmit={"#"} className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message">message</label>
              <textarea
                className="textarea"
                name="message"
                id="message"
                value={message}
                onChange={onchange}
              ></textarea>
            </div>
            <a
              href={`mailto:${landlord.email}?subject=${searchParams.get(
                "listingName"
              )}&body=${message}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button type="button" className="primaryButton">
                SendMessage
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
}

export default ContactLandLord;
