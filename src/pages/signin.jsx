import React, { useState } from "react";
import {toast} from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { ReactComponent as GoogleIcon } from "../assets/svg/googleIcon.svg";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";

function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const { email, password } = formData;

  const Onchange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if(user != null){
        toast.success('Successful login')
        navigate('/')
      }
      
    } catch (error) {
      toast.error('Bad User Credentials')
      console.log(error);
      const errorCode = error.code;
      const errorMessage = error.message;
    }
  };

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Welcome Back!</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          {/* <label name="email">Email</label> */}
          <input
            type="email"
            name="email"
            className="emailInput"
            id="email"
            value={email}
            placeholder="Email"
            onChange={Onchange}
          />

          {/* <label name="Password">Password</label> */}
          <div className="passwordInputDiv">
            <input
              type={showPassword ? "text" : "password"}
              name="Password"
              className="passwordInput"
              id="password"
              value={password}
              placeholder="Password"
              onChange={Onchange}
            />
            <img
              src={require("../assets/svg/visibilityIcon.svg")}
              alt="show password"
              onClick={() => setShowPassword((prevState) => !prevState)}
              className="showPassword"
            />
          </div>
          <Link to="/forgetPassword" className="forgotPasswordLink">
            Forget password
          </Link>
          <div className="signInBar">
            <p className="signInText">Sign In</p>
            <button type="submit" className="signInButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>
        <p>Continue With</p>
        <GoogleIcon width="36px" height="36px" />
        <Link to="/signUp" className="registerLink">
          SignUp Instead
        </Link>
      </main>
    </div>
  );
}

export default Signin;
