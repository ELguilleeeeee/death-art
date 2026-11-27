import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import "./../styles/Login.css";
import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [procesando, setProcesando] = useState(false);
  const handleChange = e => setLoginData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleLogin = async () => {
    if (procesando) return;
    if (!loginData.email.trim() || !loginData.password) {
      alert("Ingresa tu correo y contraseña."); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email.trim())) {
      alert("Ingresa un correo electrónico válido."); return;
    }
    setProcesando(true);
    try {
      const respuesta = await fetch("/api/login", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      });
      const data = await respuesta.json();
      if (!respuesta.ok) {
        alert(data.message || "No fue posible iniciar sesión"); return;
      }
      localStorage.setItem("usuario", JSON.stringify({ id: data.id, nombre: data.nombre, tipo: data.tipo }));
      alert(data.message);
      navigate(data.tipo === "admin" ? "/home-admin" : data.tipo === "artista" ? "/home-artista" : "/home", { replace: true });
    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor");
    } finally { setProcesando(false); }
  };
  return (
    <div className="login-page">
      <header className="navbar">
        <img src={logo} alt="logo" className="logo" />
        <Link to="/register"><button className="nav-btn">SIGN UP</button></Link>
      </header>
      <motion.div className="login-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
        <h1>LOGIN</h1>
        <input type="email" name="email" placeholder="Email" value={loginData.email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={loginData.password} onChange={handleChange} />
        <button className="main-btn" disabled={procesando} onClick={handleLogin}>{procesando ? "INGRESANDO..." : "LOG IN"}</button>
        <Link to="/register" className="link">Don't have an account? Sign Up</Link>
      </motion.div>
    </div>
  );
}
