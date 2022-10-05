import { getAuth,updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import React from "react";
import {useNavigate} from 'react-router-dom';
import  {updateDoc,doc} from 'firebase/firestore';
import { db } from "../firebase.config";
import { toast } from "react-toastify";

const Profile = () => {
  const auth = getAuth();
  const [changeDetails,setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const {name,email} = formData

  // useEffect(()=>{
  //     setUser(auth.currentUser);
  // },[])
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
      </main>
    </div>
  );
};
export default Profile;
