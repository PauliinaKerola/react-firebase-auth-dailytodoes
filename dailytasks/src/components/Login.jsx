import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, db, googleProvider } from "../Config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import googleLogo from "../assets/googleLogo.png";
import "../App.css";

const schema = yup.object().shape({
  email: yup.string().email().required("Email on pakollinen"),
  password: yup.string().required("Salasana on pakollinen"),
});

export const Login = () => {
  const [registrationError, setRegistrationError] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const usersCollectionRef = collection(db, "users");

  const signInWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      const userRef = doc(usersCollectionRef, user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          Id: user.uid,
          Name: user.displayName,
          Email: user.email,
          Password: password,
        });
      }
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };
  // const Login = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await signInWithEmailAndPassword(auth, email, password);
  //     navigate("/");
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const Login = async () => {
    try {
      // Get the user data from Firebase by email
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(usersCollectionRef, user.uid);
      const userDoc = await getDoc(userRef);

      // Authenticate the password
      await signInWithEmailAndPassword(auth, user.email, password);
      navigate("/");
    } catch (err) {
      setRegistrationError("Tarkista käyttäjätunnus ja salasana!");

      console.error(err);
    }
  };
  return (
    <div className="login-bg">
      <div className="welcome-text">
        Hei, kirjaudu sisään käyttääksesi MyDailyTasks-sovellusta.
      </div>
      <div className="register-container">
        <div className="form-container">
          <form
            autoComplete="off"
            className="form-group"
            onSubmit={handleSubmit(Login)}
          >
            <h2>Kirjaudu sisään</h2>
            <label>Sähköposti</label>
            <input
              type="email"
              className="form-control"
              {...register("email")}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <p className="taskError">{errors.email?.message}</p>

            <label>Salasana</label>
            <input
              type="password"
              className="form-control"
              {...register("password")}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <p className="taskError">{errors.password?.message}</p>

            <button className="btn btn-primary btn-sm" type="submit">
              KIRJAUDU
            </button>
            <p style={{ color: "red", marginTop: 20 }}>{registrationError}</p>
          </form>
        </div>
      </div>

      <div className="google-container">
        <div className="signIn-google">
          <div>
            <img src={googleLogo} className="googleLogo" />
          </div>
          <div className="signInGoogle-text">
            <button
              className="
              btn"
              onClick={signInWithGoogle}
            >
              Kirjaudu sisään Google-tunnuksillasi
            </button>
          </div>
        </div>
        <p className="signIn-text">
          Eikö sinulla ole vielä tiliä? Rekisteröidy
          <Link to="/register"> tästä</Link>
        </p>
      </div>
    </div>
  );
};
