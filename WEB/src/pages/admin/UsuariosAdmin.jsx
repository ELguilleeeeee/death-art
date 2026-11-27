
import { useEffect, useState } from "react";

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [editando, setEditando] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const obtenerUsuarios = async () => {
    setCargando(true);
    setError("");

    try {
      const respuesta = await fetch("/api/admin/usuarios", {
        credentials: "same-origin",
        cache: "no-store"
      });

      if (!respuesta.ok) {
        throw new Error(`HTTP ${respuesta.status}`);
      }

      const datos = await respuesta.json();

      if (!Array.isArray(datos)) {
        throw new Error("Respuesta inválida");
      }

      setUsuarios(datos);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const guardar = async () => {
    try {
      const respuesta = await fetch(
        `/api/admin/usuarios/${editando.id}`,
        {
          method: "PUT",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            nombre: editando.nombre,
            correo: editando.correo,
            estado: editando.estado
          })
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.message || "Error al guardar");
      }

      alert(datos.message);
      setEditando(null);
      await obtenerUsuarios();

    } catch (err) {
      alert(err.message);
    }
  };

  const eliminar = async (usuario) => {
    const confirmar = window.confirm(
      `¿Eliminar permanentemente a ${usuario.nombre}?`
    );

    if (!confirmar) return;

    try {
      const respuesta = await fetch(
        `/api/admin/usuarios/${usuario.id}`,
        {
          method: "DELETE",
          credentials: "same-origin"
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.message || "Error al eliminar");
      }

      alert(datos.message);
      await obtenerUsuarios();

    } catch (err) {
      alert(err.message);
    }
  };

  const filtrados = usuarios.filter((u) => {
    const coincideTipo =
      filtro === "todos" || u.tipo === filtro;

    const texto =
      `${u.nombre} ${u.correo}`.toLowerCase();

    return coincideTipo &&
      texto.includes(busqueda.toLowerCase());
  });

  const totalUsuarios = usuarios.filter(
    u => u.tipo === "usuario"
  ).length;

  const totalArtistas = usuarios.filter(
    u => u.tipo === "artista"
  ).length;

  return (
    <div className="usuarios-admin">
      <h1>Gestión de Usuarios</h1>

      <div className="usuarios-estadisticas">
        <div>
          <h2>{usuarios.length}</h2>
          <p>Total registrados</p>
        </div>
        <div>
          <h2>{totalUsuarios}</h2>
          <p>Usuarios normales</p>
        </div>
        <div>
          <h2>{totalArtistas}</h2>
          <p>Artistas</p>
        </div>
      </div>

      <div className="usuarios-filtros">
        <input
          placeholder="Buscar por nombre o correo..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />

        <select
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="usuario">Usuarios normales</option>
          <option value="artista">Artistas</option>
        </select>
      </div>

      {cargando && <p>Cargando usuarios...</p>}
      {error && <p role="alert">{error}</p>}

      {!cargando && !error && (
        <div className="usuarios-tabla-contenedor">
          <table className="usuarios-tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filtrados.map(usuario => (
                <tr key={usuario.id}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.correo}</td>
                  <td>{usuario.tipo}</td>
                  <td>{usuario.estado}</td>
                  <td>
                    <button
                      className="btn-editar"
                      onClick={() =>
                        setEditando({ ...usuario })
                      }
                    >
                      Editar
                    </button>

                    <button
                      className="btn-eliminar"
                      onClick={() => eliminar(usuario)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {filtrados.length === 0 && (
                <tr>
                  <td colSpan="5">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editando && (
        <div className="usuarios-modal-fondo">
          <div className="usuarios-modal">
            <h2>Editar usuario</h2>

            <label>Nombre</label>
            <input
              value={editando.nombre}
              onChange={e => setEditando({
                ...editando,
                nombre: e.target.value
              })}
            />

            <label>Correo electrónico</label>
            <input
              type="email"
              value={editando.correo}
              onChange={e => setEditando({
                ...editando,
                correo: e.target.value
              })}
            />

            <label>Tipo de cuenta</label>
            <input value={editando.tipo} disabled />

            {editando.tipo === "artista" && (
              <>
                <label>Estado</label>
                <select
                  value={editando.estado}
                  onChange={e => setEditando({
                    ...editando,
                    estado: e.target.value
                  })}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="aprobado">Aprobado</option>
                  <option value="rechazado">Rechazado</option>
                </select>
              </>
            )}

            <div className="usuarios-modal-acciones">
              <button onClick={guardar}>
                Guardar cambios
              </button>
              <button onClick={() => setEditando(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
