import React, { useState } from "react";
import "../App.css";
import { auth } from "../Config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthDetails } from "./authDetails";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export const Header = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  // onAuthStateChanged(auth, (currentUser) => {
  //   setUser(currentUser);
  // });

  return (
    <div className="header">
      <Link to="/">
        <img src={logo} className="logo" alt="Logo" />
      </Link>
      <AuthDetails />
    </div>
  );
};
