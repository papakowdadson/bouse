import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../component/Spinner";
import ListingItem from "../component/ListingItem";

function Offer() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  console.log(params);

  const fetchListings = async () => {
    try {
      // get reference
      const listingsRef = collection(db, "listings");
      // create a querry
      const q = query(
        listingsRef,
        where("offer", "==", 'true'),
        orderBy("timestamp", "desc"),
        limit(10)
      );
      //Execute querry
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        console.log(doc.data());
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Couldn't load data");
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          Offers
        </p>
      </header>
      
          {loading ? (
            <Spinner />
          ) : listings && listings.length > 0 ? (
            <>
                <main>
                <ul className="categoryListings">
                
                    {listings.map((listing)=>
                        
                         <ListingItem key={listing.id} data={listing.data} id={listing.id} />
                    )}
                </ul>
                </main>
            </>
          ) : (
            <p>No listings for Offers</p>
          )}
        
    </div>
  );
}

export default Offer;
