import { getAuth,updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import React from "react";
import {useNavigate,Link} from 'react-router-dom';
import  {updateDoc,doc,collection,query,getDocs,where,orderBy,deleteDoc} from 'firebase/firestore';
import { db } from "../firebase.config";
import { toast } from "react-toastify";

import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';
import ListingItem from "../component/ListingItem";

const Profile = () => {
  const auth = getAuth();
  const [changeDetails,setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const [listings,setListings]=useState([])

  const {name,email} = formData

  useEffect(()=>{
      fetchListings();
      // setUser(auth.currentUser);
  },[])

  const navigate = useNavigate();
  const onLogout=()=>{
    auth.signOut()
    navigate('/')
  }
  const onSubmit=async()=>{
    try {
        if(auth.currentUser.displayName !== name){
            await updateProfile(auth.currentUser,{
                displayName:name
            })
            //update in firestore  
        const userRef = doc(db,'users',auth.currentUser.uid);
        await updateDoc(userRef,{
            name:name,
        })
        }
    } catch (error) {
        toast.error('couldn\'t update')
        console.log(error);
        
    }
  }

  const onChange= (e)=>{
    setFormData((prevState)=>({
        ...prevState,
        [e.target.id]:e.target.value

    }))

  }

  const onDelete=async(id)=>{
    console.log(listings.length)
    console.log('deletingggggggggggggggggggg')
    const reference = doc(db,'listings',id);
    await deleteDoc(reference);
setListings(listings.filter((listing)=>listing.id!=id).map((listing)=>listing))
console.log(setListings(listings.filter((listing)=>listing.id!=id).map((listing)=>listing)))
console.log(listings.length)
  }

  const fetchListings = async () => {
    try {
      // get reference
      const listingsRef = collection(db, "listings");
      // create a querry
      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc"),
    
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
      // setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Couldn't load data");
    }
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={onLogout}>logout</button>
      </header>
      <main>
        <div className="profileDetailsHeader">
            <p className="profileDetailsText">Personal Details</p>
            <p className="changePersonalDetails" onClick={()=> {
                changeDetails && onSubmit()
                setChangeDetails((prevState)=>!prevState)
            }}>
                {changeDetails ? 'Done':'change'}            </p>
        </div>
        <div className="profileCard">
            <form >
                <input type="text" id="name" placeholder="name" className={!changeDetails ? 'profileName' : 'profileNameActive'} 
                    disabled={!changeDetails}
                    value={name}
                    onChange={onChange}
                />
                <input type="text" id="email" placeholder="email" className={!changeDetails ? 'profileEmail' : 'profileEmailActive'} 
                    disabled={!changeDetails}
                    value={email}
                    onChange={onChange}
                />
            </form>
        </div>
        <Link to='/createListings' className="createListing" >
        <img src={homeIcon} alt='hone icon'/>
        <p>Rent or create Listings</p>
        <img src={arrowRight} alt='arrow right'/>

        </Link>
        {listings.length>0?listings.map((data,index)=>(<ListingItem key={index} id={data.id} data={data.data} onDelete={onDelete} index={index} />)):null}
      </main>
    </div>
  );
};
export default Profile;
