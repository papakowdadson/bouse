import {getAuth} from 'firebase/auth';
import { useEffect,useState } from 'react';
import React from "react";

const Profile =()=>{
    const [user,setUser] = useState(null)
    const auth = getAuth();
    useEffect(()=>{
        setUser(auth.currentUser);
    },[])
    return (
        user ?
        <div>{user.displayName}</div>: <div>not signed in</div>
    )
}
export default Profile