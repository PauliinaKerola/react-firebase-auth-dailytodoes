import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../Config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  fullName: yup.string().required("Nimi on pakollinen."),
  email: yup.string().email().required(),
  password: yup.string().min(4).max(20).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Salasanat eivät täsmää!")
    .required(),
});

export const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const usersCollectionRef = collection(db, "users");

  const registerHandler = async (data, event) => {
    event.preventDefault();
    const { fullName, email, password } = data;
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await addDoc(usersCollectionRef, {
        Id: user.uid,
        Name: fullName,
        Email: email,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const cancelRegistration = () => {
    navigate("/login");
  };

  return (
    <>
      <div className="register-container">
        <div className="form-container">
          <form
            autoComplete="off"
            className="form-group"
            onSubmit={handleSubmit(registerHandler)}
          >
            <h2>Rekisteröidy</h2>

            <label>Etu- ja sukunimi</label>
            <input
              type="text"
              className="form-control"
              {...register("fullName")}
            />
            <p className="taskError">{errors.fullName?.message}</p>

            <label>Sähköpostiosoite</label>
            <input
              type="email"
              className="form-control"
              {...register("email")}
            />
            <p className="taskError">{errors.email?.message}</p>

            <label>Salasana</label>

            <input
              type="password"
              className="form-control"
              {...register("password")}
            />
            <p className="taskError">{errors.password?.message}</p>

            <label>Vahvista salasana</label>
            <input
              type="password"
              className="form-control"
              {...register("confirmPassword")}
            />
            <p className="taskError">{errors.confirmPassword?.message}</p>

            <button className="btn btn-primary btn-sm" type="submit">
              REKISTERÖI
            </button>

            <button
              onClick={cancelRegistration}
              className="btn btn-secondary btn-sm"
              type="button"
            >
              PERUUTA
            </button>
          </form>
        </div>
      </div>
      <p className="signIn-text">
        Onko sinulla jo tili? Kirjaudu sisään<Link to="/login"> tästä</Link>
      </p>
    </>
  );
};
