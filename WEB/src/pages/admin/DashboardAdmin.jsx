import { useEffect, useState } from "react";

import "../../styles/AdminDashboard.css";

export default function DashboardAdmin() {

    const [datos, setDatos] = useState({

        artistas:0,
        usuarios:0,
        eventos:0,
        galeria:0

    });

    useEffect(()=>{

        fetch("https://death-art.onrender.com/admin/dashboard")

        .then(res=>res.json())

        .then(data=>setDatos(data));

    },[]);

    return(

        <div className="dashboard-admin">

            <h1>

                Panel de Administración

            </h1>

            <div className="cards-dashboard">

                <div className="card-dashboard">

                    <h2>🎨</h2>

                    <h3>{datos.artistas}</h3>

                    <p>Artistas</p>

                </div>

                <div className="card-dashboard">

                    <h2>👥</h2>

                    <h3>{datos.usuarios}</h3>

                    <p>Usuarios</p>

                </div>

                <div className="card-dashboard">

                    <h2>📅</h2>

                    <h3>{datos.eventos}</h3>

                    <p>Eventos</p>

                </div>

                <div className="card-dashboard">

                    <h2>🖼️</h2>

                    <h3>{datos.galeria}</h3>

                    <p>Galería</p>

                </div>

            </div>

            <div className="actividad">

                <h2>

                    Actividad reciente

                </h2>

                <ul>

                    <li>✔ Bienvenido al panel de administración.</li>

                    <li>✔ Desde aquí podrás administrar todo el sistema.</li>

                    <li>✔ Próximamente aparecerán las últimas actividades.</li>

                </ul>

            </div>

        </div>

    );

}