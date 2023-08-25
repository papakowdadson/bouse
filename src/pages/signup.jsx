import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
import {db} from '../firebase.config';
import { setDoc,doc,serverTimestamp } from "firebase/firestore";
import VisibilityIcon from '../assets/svg/visibilityIcon.svg';
import VisibilityOff from '../assets/svg/VisibilityOff.svg';

import { ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import OAuth from "../component/OAuth";


function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;
  const onSubmit = async(e) =>{
    e.preventDefault();
    try{
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user;
      
      updateProfile(auth.currentUser,{
        displayName:name
      })
      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.timestamp= serverTimestamp()
      await setDoc(doc(db,'users',user.uid),formDataCopy);
      navigate('/')
      toast.success('Account created')
    }catch(error){
      toast.error('Couldn\'t create account')
      console.log(error);
      // const errorCode = error.code;
      // const errorMessage = error.message;

    }
    
  }

  const Onchange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  
  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Create Account</p>
        </header>
        <form onSubmit={onSubmit}>
          {/* <label name="name">Name</label> */}
          <input
          placeholder="name"
            type="text"
            name="name"
            id="name"
            onChange={Onchange}
            value={name}
            className='nameInput'
          />
          {/* <label name="email">Email</label> */}
          <input
            placeholder="email"
            type="email"
            name="email"
            id="email"
            onChange={Onchange}
            value={email}
            className="emailInput"
          />
          <div className="passwordInputDiv">
            {/* <label name="Password">Password</label> */}
            <input
              type={showPassword ? "text" : "password"}
              name="Password"
              id="password"
              onChange={Onchange}
              value={password}
              placeholder="password"
              className="passwordInput"
            />
            <img
              src={showPassword? VisibilityIcon: VisibilityOff}
              className="showPassword"
              alt="password"
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          </div>
          <div className="signInBar">
          <p className="signInText">Sign Up</p>
          <button type="submit" className="signInButton">
          <ArrowRightIcon fill='#ffffff' width='34px' height='34px'/>
        </button>
          </div>
        </form>
        <OAuth/>
        {/* <GoogleIcon width='34px' height='34px' /> */}
        <Link to={"/signIn"} className='registerLink'>Login Instead</Link>
      </div>
    </>
  );
}

export default Signup;
