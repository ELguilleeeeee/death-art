import { useEffect, useState } from "react";
import "../../styles/AdminDashboard.css";
export default function DashboardAdmin() {
  const [datos, setDatos] = useState({ artistas: 0, usuarios: 0, eventos: 0, galeria: 0 });
  const [error, setError] = useState("");
  useEffect(() => {
    let activo = true;
    fetch("/api/admin/dashboard", { cache: "no-store" })
      .then(async res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then(data => { if (activo) setDatos({ artistas: Number(data.artistas) || 0, usuarios: Number(data.usuarios) || 0, eventos: Number(data.eventos) || 0, galeria: Number(data.galeria) || 0 }); })
      .catch(e => { if (activo) { console.error(e); setError("No se pudieron consultar las estadísticas."); } });
    return () => { activo = false; };
  }, []);
  return (
    <div className="dashboard-admin">
      <h1>Panel de Administración</h1>
      {error && <p role="alert">{error}</p>}
      <div className="cards-dashboard">
        {[["🎨", "artistas", "Artistas"], ["👥", "usuarios", "Usuarios"], ["📅", "eventos", "Eventos"], ["🖼️", "galeria", "Galería"]].map(([emoji, clave, titulo]) => (
          <div key={clave} className="card-dashboard"><h2>{emoji}</h2><h3>{datos[clave]}</h3><p>{titulo}</p></div>
        ))}
      </div>
      <div className="actividad"><h2>Actividad reciente</h2><ul>
        <li>✔ Bienvenido al panel de administración.</li>
        <li>✔ Desde aquí podrás administrar todo el sistema.</li>
        <li>✔ Próximamente aparecerán las últimas actividades.</li>
      </ul></div>
    </div>
  );
}
