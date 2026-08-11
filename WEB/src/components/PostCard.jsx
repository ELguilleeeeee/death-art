import "./../styles/PostCard.css";
import { useNavigate } from "react-router-dom";

export default function PostCard({ post }) {
  const navigate = useNavigate();

  const enviarMensaje = async () => {

    const usuario = JSON.parse(
      localStorage.getItem("usuario")
    );

    if (!usuario) {

      alert("Debes iniciar sesión.");

      return;

    }

    if (usuario.id === post.artista_id) {

      alert("No puedes enviarte mensajes a ti mismo.");

      return;

    }

    try {

      const response = await fetch(

        "http://localhost:5000/mensajes",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify({

            remitente_id: usuario.id,

            receptor_id: post.artista_id,

            mensaje:
              `Hola ${post.nombre}, me interesa tu obra "${post.titulo}". ¿Podemos ponernos en contacto?`

          })

        }

      );

      const data = await response.json();

      alert(data.message);

    } catch (error) {

      console.log(error);

      alert("Error al enviar el mensaje.");

    }

  };

  return (

    <div className="post-card">

      <div className="post-header">

        <div className="post-user">

          <img
            className="avatar"
            src={
              post.foto
                ? `http://localhost:5000/uploads/perfiles/${post.foto}`
                : "/user.png"
            }
            alt={post.nombre}
          />

          <div>

            <h3>{post.nombre}</h3>

            <span className="post-date">

              {post.fecha}

            </span>

          </div>

        </div>

      </div>

      <div className="post-image-container">

        <img
          className="post-image"
          src={`http://localhost:5000/uploads/obras/${post.imagen}`}
          alt={post.titulo}
        />

        <div className="post-overlay">

          <button>

            Ver Obra

          </button>

        </div>

      </div>

      <div className="post-body">

        <h2>{post.titulo}</h2>

        <h4> {post.categoria}</h4>

        <p>{post.descripcion}</p>

      </div>

      <div className="post-footer">

        <button>

           Me gusta

        </button>

        <button>

           Comentarios

        </button>

        <button
onClick={()=>
navigate(`/chat/${post.artista_id}`)
}
>

 Contactar

</button>

      </div>

    </div>

  );

}