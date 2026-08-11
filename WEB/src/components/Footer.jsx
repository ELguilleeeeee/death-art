import { Link } from "react-router-dom";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-logo">
        <h2>Death Art</h2>
      </div>

      <div className="footer-links">

        <Link to="/">
          Inicio
        </Link>

        <Link to="/privacy">
          Aviso de Privacidad
        </Link>

        <Link to="/terms">
          Términos y Condiciones
        </Link>

      </div>

      <div className="footer-socials">

        <span>Correo</span>

        <span>Direccion</span>

        <span>Numero</span>

      </div>

      <p>
        © 2026 Elguillee. Todos los derechos reservados.
      </p>

    </footer>
  );
}