import React, { useState } from 'react';
import {getAuth,sendPasswordResetEmail} from 'firebase/auth';
import {toast} from 'react-toastify';

import {ReactComponent as Arrow} from '../assets/svg/keyboardArrowRightIcon.svg'
import { Link } from 'react-router-dom';
function ForgetPassword() {
  const [formData,setFormData] = useState({
    email:'',
  });
  
  const {email} = formData

  const onChange =(e)=>{
    setFormData(()=>({
      [e.target.id]: e.target.value
    }))

  }

  const onSubmit=async(e)=>{
    e.preventDefault();
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth,email)
      toast.success('email was sent')

      
    } catch (error) {
      console.log(error)
      toast.error('Something happened')
      
    }
  }
  return (
    <div className='pageContainer'>
    <header>
      <p className="pageHeader">Forgot password</p>
    </header>
    <main>
    <form onSubmit={onSubmit}>
    <input  type="email" name="" id="email" placeholder='email' className='emailInput' onChange={onChange} value={email}/>
    <Link className='forgotPasswordLink' to='/signIn'> SignIn</Link>
    <div className="signInBar">
      <div className="signInText">Send reset link</div>
      <button className="signInButton">
        <Arrow fill='#ffffff' width='34px' height="34px"/> 
      </button>
    </div>
    </form>
    </main>
    </div>
  )
}

export default ForgetPassword