import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import ModalNuevaObra from "../components/ModalNuevaObra";

import "../styles/Home.css";
import "../styles/MisObras.css";

export default function MisObras() {

    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [obras, setObras] = useState([]);
    const [mostrarModal,setMostrarModal]=useState(false);

    useEffect(() => {

        obtenerObras();

    }, []);

    const obtenerObras = () => {

        fetch(
            `https://death-art.onrender.com/obras-artista/${usuario.id}`
        )

        .then(res => res.json())

        .then(data => {

            setObras(data);

        })

        .catch(err => console.log(err));

    };

    return (

        <div className="home-page">

            <Navbar
                openSidebar={() => setSidebarOpen(true)}
            />

            <Sidebar
                isOpen={sidebarOpen}
                closeSidebar={() => setSidebarOpen(false)}
            />

            <div className="mis-obras">

                <div className="mis-obras-header">

                    <div>

                        <h1>

                            🎨 Mis Obras

                        </h1>

                        <p>

                            Administra todas tus publicaciones.

                        </p>

                    </div>

                   <button

    className="nueva-obra-btn"

    onClick={()=>

        setMostrarModal(true)

    }

>

    + Publicar Obra

</button>

                </div>

                {

                    obras.length === 0 ?

                    (

                        <div className="sin-obras">

                            <h2>

                                Aún no has publicado ninguna obra.

                            </h2>

                            <p>

                                Comienza compartiendo tu primer trabajo artístico.

                            </p>

                        </div>

                    )

                    :

                    (

                        <div className="obras-grid">

                            {

                                obras.map(obra => (

                                    <div
                                        className="obra-card"
                                        key={obra.id}
                                    >

                                        <img

                                            src={
  obra.imagen?.startsWith("http")
    ? obra.imagen
    : `https://death-art.onrender.com/uploads/obras/${obra.imagen}`
}

                                            alt={obra.titulo}

                                        />

                                        <div className="obra-info">

                                            <h3>

                                                {obra.titulo}

                                            </h3>

                                            <p>

                                                {obra.categoria}

                                            </p>

                                            <div className="botones">

                                                <button
                                                    className="editar"
                                                >

                                                    ✏️ Editar

                                                </button>

                                                <button
                                                    className="eliminar"
                                                >

                                                    🗑 Eliminar

                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                ))

                            }

                        </div>

                    )

                }

            </div>
            {

    mostrarModal &&

    <ModalNuevaObra

        cerrar={()=>

            setMostrarModal(false)

        }

        actualizar={

            obtenerObras

        }

    />

}

            <Footer/>

        </div>

    );

}