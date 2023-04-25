import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../Config/firebase";
import { Link, useNavigate } from "react-router-dom";

export const AuthDetails = () => {
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setAuthUser(currentUser);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  const userSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="loginContainer">
      {authUser && (
        <>
          <div className="userName">{authUser.email}</div>
          <img
            className="userImage"
            src={
              authUser.photoURL
                ? authUser.photoURL
                : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
            }
            alt="userImage"
          />
          <button onClick={userSignOut} className="btn btn-primary btn-sm">
            Logout
          </button>
        </>
      )}
    </div>
  );
};
