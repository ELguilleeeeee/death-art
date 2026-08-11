import { useState } from "react";

export default function ModalNuevaObra({

    cerrar,

    actualizar

}){

    const usuario = JSON.parse(

        localStorage.getItem("usuario")

    );

    const [titulo,setTitulo]=useState("");

    const [categoria,setCategoria]=useState("");

    const [descripcion,setDescripcion]=useState("");

    const [imagen,setImagen]=useState(null);

    const publicar=async()=>{

        try{

            const formData=new FormData();

            formData.append(

                "titulo",

                titulo

            );

            formData.append(

                "categoria",

                categoria

            );

            formData.append(

                "descripcion",

                descripcion

            );

            formData.append(

                "artista_id",

                usuario.id

            );

            formData.append(

                "imagen",

                imagen

            );

            const response=await fetch(

                "https://death-art.onrender.com/obras",

                {

                    method:"POST",

                    body:formData

                }

            );

            const data=await response.json();

            alert(data.message);

            actualizar();

            cerrar();

        }

        catch(error){

            console.log(error);

        }

    };

    return(

        <div className="modal-overlay">

            <div className="modal-publicar">

                <h2>

                    Publicar nueva obra

                </h2>

                <input

                    type="text"

                    placeholder="Título"

                    value={titulo}

                    onChange={(e)=>

                        setTitulo(e.target.value)

                    }

                />

                <input

                    type="text"

                    placeholder="Categoría"

                    value={categoria}

                    onChange={(e)=>

                        setCategoria(e.target.value)

                    }

                />

                <textarea

                    placeholder="Descripción"

                    value={descripcion}

                    onChange={(e)=>

                        setDescripcion(e.target.value)

                    }

                />

                <input

                    type="file"

                    accept="image/*"

                    onChange={(e)=>

                        setImagen(

                            e.target.files[0]

                        )

                    }

                />

                {

                    imagen &&

                    <img

                        className="preview-img"

                        src={

                            URL.createObjectURL(imagen)

                        }

                        alt="preview"

                    />

                }

                <div className="modal-buttons">

                    <button

                        className="guardar-btn"

                        onClick={publicar}

                    >

                        Publicar

                    </button>

                    <button

                        className="cancel-btn"

                        onClick={cerrar}

                    >

                        Cancelar

                    </button>

                </div>

            </div>

        </div>

    );

}