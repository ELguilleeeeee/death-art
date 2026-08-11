import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

import "./../styles/Login.css";
import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();

const [loginData, setLoginData] = useState({
  email: "",
  password: ""
});
const handleChange = (e) => {

  setLoginData({
    ...loginData,
    [e.target.name]: e.target.value
  });

};
const handleLogin = async () => {

  try {

    const response = await fetch(
      "http://localhost:5000/login",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(loginData)
      }
    );

    const data = await response.json();

    alert(data.message);

    if (response.ok) {

      localStorage.setItem(
        "usuario",
        JSON.stringify(data)
      );

      if (data.tipo === "admin") {

        navigate("/home-admin");

      }

      else if (data.tipo === "artista") {

        navigate("/home-artista");

      }

      else {

        navigate("/home");

      }

    }

  } catch (error) {

    console.error(error);

    alert("Error al conectar con el servidor");

  }

};

  return (

    <div className="login-page">

      <header className="navbar">

        <img
          src={logo}
          alt="logo"
          className="logo"
        />

        <Link to="/register">
          <button className="nav-btn">
            SIGN UP
          </button>
        </Link>

      </header>

      <motion.div

        className="login-card"

        initial={{
          opacity:0,
          y:30
        }}

        animate={{
          opacity:1,
          y:0
        }}

        transition={{
          duration:.6
        }}

      >

        <h1>LOGIN</h1>

        <input
  type="email"
  name="email"
  placeholder="Email"
  value={loginData.email}
  onChange={handleChange}
/>

        <input
  type="password"
  name="password"
  placeholder="Password"
  value={loginData.password}
  onChange={handleChange}
/>

        <button
  className="main-btn"
  onClick={handleLogin}
>
  LOG IN
</button>

        <Link
          to="/register"
          className="link"
        >
          Don't have an account? Sign Up
        </Link>

      </motion.div>

    </div>

  );

}