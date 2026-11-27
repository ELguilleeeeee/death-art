import { useEffect, useState } from "react";
import "../../styles/ArtistasAdmin.css";

export default function ArtistasAdmin() {
  const [artistas, setArtistas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const obtenerArtistas = async () => {
    try {
      const res = await fetch("/api/artistas-pendientes", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Datos inválidos");
      setArtistas(data); setError("");
    } catch (err) { console.error(err); setArtistas([]); setError("No se pudieron cargar las solicitudes."); }
  };
  useEffect(() => { obtenerArtistas(); }, []);

  const cambiarEstado = async (id, accion) => {
    if (!window.confirm(`¿${accion === "aprobar" ? "Aprobar" : "Rechazar"} artista?`)) return;
    try {
      const res = await fetch(`/api/${accion}-artista/${id}`, { method: "PUT" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
      alert(data.message);
      await obtenerArtistas();
    } catch (err) { alert(`No se pudo completar la operación: ${err.message}`); }
  };
  const filtrados = artistas.filter(a =>
    (a.nombre || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (a.correo || "").toLowerCase().includes(busqueda.toLowerCase())
  );
  return (
    <div className="artistas-admin">
      <h1>Solicitudes de Artistas</h1>
      <input className="buscar" placeholder="Buscar artista..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
      {error && <p role="alert">{error}</p>}
      <div className="cards-artistas">
        {filtrados.map(artista => (
          <div className="card-artista" key={artista.id}>
            <div className="avatar">🎨</div>
            <h3>{artista.nombre}</h3>
            <p>{artista.correo}</p>
            <span className="estado">{artista.estado}</span>
            <div className="acciones">
              <button className="aprobar" onClick={() => cambiarEstado(artista.id, "aprobar")}>✔ Aprobar</button>
              <button className="rechazar" onClick={() => cambiarEstado(artista.id, "rechazar")}>✖ Rechazar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
