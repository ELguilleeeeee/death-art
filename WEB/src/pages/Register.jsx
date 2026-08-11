import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

import "./../styles/Register.css";
import logo from "../assets/logo.png";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
  name: "",
  birthDate: "",
  category: "",
  accountType: "",
  email: "",
  password: ""
});
const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};
const handleRegister = async () => {

  try {

    const response = await fetch(
      "http://localhost:5000/register",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(formData)
      }
    );

    const data = await response.json();

if (response.ok) {

  if (formData.accountType === "organizador") {

    alert(
      "Tu solicitud fue enviada correctamente.\n\nUn administrador revisará tu registro. Recibirás un correo electrónico cuando tu solicitud sea aprobada o rechazada."
    );

  } else {

    alert("Cuenta creada correctamente.");

  }

  setFormData({
    name: "",
    birthDate: "",
    category: "",
    accountType: "",
    email: "",
    password: ""
  });

  navigate("/login");

} else {

  alert(data.message);

}
  } catch (error) {

    console.error(error);

    alert("Error al conectar con el servidor");

  }

};

  return (

    <div className="register-page">

      <header className="navbar">

        <img
          src={logo}
          alt="logo"
          className="logo"
        />

        <Link to="/login">
          <button className="nav-btn">
            LOGIN
          </button>
        </Link>

      </header>

      <motion.div

        className="register-card"

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

        <h1>SIGN UP</h1>

        <input
  type="text"
  name="name"
  placeholder="Name"
  value={formData.name}
  onChange={handleChange}
/>

        <input
  type="date"
  name="birthDate"
  value={formData.birthDate}
  onChange={handleChange}
/>

        
       <select
  name="accountType"
  value={formData.accountType}
  onChange={handleChange}
>
  <option value="">
    Select account type
  </option>

  <option value="usuario">
    Usuario
  </option>

  <option value="artista">
    Artista
  </option>
</select>

        <input
  type="email"
  name="email"
  placeholder="Email"
  value={formData.email}
  onChange={handleChange}
/>

        <input
  type="password"
  name="password"
  placeholder="Password"
  value={formData.password}
  onChange={handleChange}
/>

        <button
  className="main-btn"
  onClick={handleRegister}
>
  CREATE ACCOUNT
</button>

        <Link
          to="/login"
          className="link"
        >
          Already have an account? Login
        </Link>

      </motion.div>

    </div>

  );

}