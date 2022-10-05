import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { db } from "../firebase.config";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

import { ReactComponent as GoogleIcon } from "../assets/svg/googleIcon.svg";

function OAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      //check for user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      //if user exists
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
      toast.success('Login succesful')
    } catch (error) {
      console.log(error)
      toast.error('Error signing In with google')
    }
  };
  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === "/signUp" ? "Up" : "In"} with</p>
      <button className="socialIconDiv" onClick={onGoogleClick}>
        <img
          className="socialIconImg"
          src={require("../assets/svg/googleIcon.svg")}
          alt="Google Icon"
          width="36px"
          height="36px"
        >
          {/* <GoogleIcon width="36px" height="36px" /> */}
        </img>
      </button>
    </div>
  );
}

export default OAuth;
