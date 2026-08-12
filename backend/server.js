require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const enviarCorreo = require("./mailer");

const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");

const app = express();

app.use(cors());
app.use(express.json());

const db = require("./db");


// ========================================
// CONFIGURACIÓN DE CLOUDINARY
// ========================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// ========================================
// CONFIGURACIÓN DE MULTER
// ========================================

// Las imágenes se mantienen temporalmente
// en memoria y NO se guardan en el disco
// de Render.

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage
});

const uploadObra = multer({
  storage: storage
});


// ========================================
// FUNCIÓN PARA SUBIR A CLOUDINARY
// ========================================

const subirACloudinary = (buffer, carpeta) => {

  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: carpeta,
        resource_type: "image"
      },
      (error, result) => {

        if (error) {

          reject(error);
          return;

        }

        resolve(result);

      }
    );

    stream.end(buffer);

  });

};


// ========================================
// ARCHIVOS ANTIGUOS
// ========================================

// Se conserva temporalmente para imágenes
// antiguas que todavía existan en /uploads.

app.use(
  "/uploads",
  express.static("uploads")
);

app.post("/register", async (req, res) => {

  try {

    const {

      name,
      birthDate,
      category,
      accountType,
      email,
      password

    } = req.body;

    // Encriptar contraseña

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Si es artista queda pendiente, usuario aprobado

    const estado =
      accountType === "artista"
        ? "pendiente"
        : "aprobado";

    // Insertar usuario

    const sqlUsuario = `
      INSERT INTO usuarios
      (
        nombre,
        correo,
        password,
        tipo,
        estado
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(

      sqlUsuario,

      [

        name,
        email,
        hashedPassword,
        accountType,
        estado

      ],

      (err, result) => {

        if (err) {

          console.log(err);

          return res.status(500).json({

            message:
              "Error al registrar usuario"

          });

        }

        // ID del usuario recién creado

        const usuarioId = result.insertId;

        // Buscar el ID del rol

        const sqlRol = `
          SELECT id
          FROM roles
          WHERE nombre = ?
        `;

        db.query(

          sqlRol,

          [accountType],

          (err, rol) => {

            if (err) {

              console.log(err);

              return res.status(500).json({

                message:
                  "Error al obtener el rol"

              });

            }

            if (rol.length === 0) {

              return res.status(404).json({

                message:
                  "Rol no encontrado"

              });

            }

            const rolId = rol[0].id;

            // Insertar relación usuario-rol

            const sqlUsuarioRol = `
              INSERT INTO usuario_rol
              (
                usuario_id,
                rol_id
              )
              VALUES (?, ?)
            `;

            db.query(

              sqlUsuarioRol,

              [

                usuarioId,
                rolId

              ],

              (err) => {

                if (err) {

                  console.log(err);

                  return res.status(500).json({

                    message:
                      "Error al asignar el rol"

                  });

                }

                res.status(201).json({

                  message:
                    "Usuario registrado correctamente"

                });

              }

            );

          }

        );

      }

    );

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Error interno"

    });

  }

});


app.post("/login", async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    const sql = `
      SELECT

        u.id,
        u.nombre,
        u.correo,
        u.password,
        u.estado,

        r.nombre AS rol

      FROM usuarios u

      INNER JOIN usuario_rol ur

        ON u.id = ur.usuario_id

      INNER JOIN roles r

        ON ur.rol_id = r.id

      WHERE u.correo = ?
    `;

    db.query(

      sql,

      [email],

      async (err, result) => {

        if (err) {

          console.log(err);

          return res.status(500).json({

            message: "Error del servidor"

          });

        }

        if (result.length === 0) {

          return res.status(404).json({

            message: "Usuario no encontrado"

          });

        }

        const user = result[0];

        const passwordMatch = await bcrypt.compare(

          password,

          user.password

        );

        if (!passwordMatch) {

          return res.status(401).json({

            message: "Contraseña incorrecta"

          });

        }

        if (

          user.rol === "artista" &&

          user.estado === "pendiente"

        ) {

          return res.status(403).json({

            message:
              "Tu cuenta está pendiente de aprobación"

          });

        }

        if (

          user.rol === "artista" &&

          user.estado === "rechazado"

        ) {

          return res.status(403).json({

            message:
              "Tu solicitud fue rechazada"

          });

        }

        res.status(200).json({

          message: "Inicio de sesión correcto",

          id: user.id,

          nombre: user.nombre,

          tipo: user.rol

        });

      }

    );

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Error interno"

    });

  }

});

app.get("/artistas-pendientes", (req, res) => {

  const sql = `
    SELECT
      id,
      nombre,
      correo,
      estado
    FROM usuarios
    WHERE tipo = 'artista'
    AND estado = 'pendiente'
  `;

  db.query(sql, (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Error al obtener artistas"
      });

    }

    res.json(result);

  });

});

app.put("/aprobar-artista/:id", (req, res) => {

  const { id } = req.params;

  const obtenerUsuario = `
    SELECT nombre, correo
    FROM usuarios
    WHERE id=?
  `;

  db.query(obtenerUsuario, [id], async (err, usuario) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Error al obtener usuario"
      });

    }

    if (usuario.length === 0) {

      return res.status(404).json({
        message: "Usuario no encontrado"
      });

    }

    const actualizar = `
      UPDATE usuarios
      SET estado='aprobado'
      WHERE id=?
    `;

    db.query(actualizar, [id], async (err) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          message: "Error al aprobar artista"
        });

      }

      try {

        await enviarCorreo(

          usuario[0].correo,

          "Solicitud aprobada",

          `Hola ${usuario[0].nombre},

¡Felicidades!

Tu solicitud para convertirte en artista de Death-Art ha sido APROBADA.

Ya puedes iniciar sesión y comenzar a publicar tus eventos.

Gracias por formar parte de nuestra comunidad.

Equipo Death-Art`

        );

      } catch (correoError) {

        console.log(correoError);

      }

      res.json({

        message: "Artista aprobado correctamente"

      });

    });

  });

});

app.put("/rechazar-artista/:id", (req, res) => {

  const { id } = req.params;

  const obtenerUsuario = `
    SELECT nombre, correo
    FROM usuarios
    WHERE id=?
  `;

  db.query(obtenerUsuario, [id], async (err, usuario) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Error al obtener usuario"
      });

    }

    if (usuario.length === 0) {

      return res.status(404).json({
        message: "Usuario no encontrado"
      });

    }

    const actualizar = `
      UPDATE usuarios
      SET estado='rechazado'
      WHERE id=?
    `;

    db.query(actualizar, [id], async (err) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          message: "Error al rechazar artista"
        });

      }

      try {

        await enviarCorreo(

          usuario[0].correo,

          "Solicitud rechazada",

          `Hola ${usuario[0].nombre},

Gracias por registrarte como artista en Death-Art.

Después de revisar tu solicitud, lamentablemente no ha sido aprobada en esta ocasión.

Puedes volver a intentarlo más adelante actualizando tu información.

Gracias por tu interés.

Equipo Death-Art`

        );

      } catch (correoError) {

        console.log(correoError);

      }

      res.json({

        message: "Artista rechazado correctamente"

      });

    });

  });

});

app.get("/test-email", async (req, res) => {

  try {

    await enviarCorreo(

      "TU_CORREO_PERSONAL@gmail.com",

      "Prueba Death-Art",

      "Si recibiste este correo, Nodemailer funciona correctamente."

    );

    res.json({

      message: "Correo enviado correctamente"

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Error al enviar correo"

    });

  }

});

app.get("/galeria-mes/:mes", (req, res) => {

  const { mes } = req.params;

  const sql = `
    SELECT *
    FROM galeria_mes
    WHERE mes = ?
    LIMIT 1
  `;

  db.query(sql, [mes], (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Error al obtener la galería"
      });

    }

    if (result.length === 0) {

      return res.status(404).json({
        message: "No hay galería para este mes"
      });

    }

    res.json(result[0]);

  });

});

app.get("/galeria-mes", (req, res) => {

  const sql = `
    SELECT *
    FROM galeria_mes
    ORDER BY mes
  `;

  db.query(sql, (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Error al obtener la galería"
      });

    }

    res.json(result);

  });

});

app.post(
  "/galeria-mes",
  upload.single("imagen"),
  async (req, res) => {

    try {

      const {
        mes,
        movimiento,
        artista,
        frase
      } = req.body;

      let imagen = null;

      // Si viene una imagen, se sube a Cloudinary
      if (req.file) {

        const resultado = await subirACloudinary(
          req.file.buffer,
          "death-art/galeria"
        );

        imagen = resultado.secure_url;

      }

      const sql = `
        INSERT INTO galeria_mes
        (
          mes,
          movimiento,
          artista,
          frase,
          imagen
        )
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [
          mes,
          movimiento,
          artista,
          frase,
          imagen
        ],
        (err) => {

          if (err) {

            console.log(err);

            return res.status(500).json({
              message: "Error al guardar la galería"
            });

          }

          res.status(201).json({
            message: "Galería guardada correctamente",
            imagen: imagen
          });

        }
      );

    } catch (error) {

      console.log(
        "Error al subir imagen a Cloudinary:",
        error
      );

      res.status(500).json({
        message: "Error al subir la imagen"
      });

    }

  }
);

app.delete("/galeria-mes/:id", (req, res) => {

  const { id } = req.params;

  const sql = `
    DELETE
    FROM galeria_mes
    WHERE id = ?
  `;

  db.query(
    sql,
    [id],
    (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          message: "Error al eliminar la galería"
        });

      }

      if (result.affectedRows === 0) {

        return res.status(404).json({
          message: "Galería no encontrada"
        });

      }

      res.json({
        message: "Galería eliminada correctamente"
      });

    }
  );

});

app.put(
  "/galeria-mes/:id",
  upload.single("imagen"),
  async (req, res) => {

    try {

      const { id } = req.params;

      const {
        mes,
        movimiento,
        artista,
        frase
      } = req.body;

      let sql;
      let datos;

      // Si seleccionaron una imagen nueva
      if (req.file) {

        const resultado = await subirACloudinary(
          req.file.buffer,
          "death-art/galeria"
        );

        const imagen = resultado.secure_url;

        sql = `
          UPDATE galeria_mes
          SET
            mes = ?,
            movimiento = ?,
            artista = ?,
            frase = ?,
            imagen = ?
          WHERE id = ?
        `;

        datos = [
          mes,
          movimiento,
          artista,
          frase,
          imagen,
          id
        ];

      }

      // Si NO seleccionaron una imagen nueva
      else {

        sql = `
          UPDATE galeria_mes
          SET
            mes = ?,
            movimiento = ?,
            artista = ?,
            frase = ?
          WHERE id = ?
        `;

        datos = [
          mes,
          movimiento,
          artista,
          frase,
          id
        ];

      }

      db.query(
        sql,
        datos,
        (err, result) => {

          if (err) {

            console.log(err);

            return res.status(500).json({
              message: "Error al actualizar la galería"
            });

          }

          if (result.affectedRows === 0) {

            return res.status(404).json({
              message: "Galería no encontrada"
            });

          }

          res.json({
            message: "Galería actualizada correctamente"
          });

        }
      );

    } catch (error) {

      console.log(
        "Error al subir imagen a Cloudinary:",
        error
      );

      res.status(500).json({
        message: "Error al subir la imagen"
      });

    }

  }
);



app.get("/admin/dashboard", (req, res) => {

  const dashboard = {};

  db.query(
    "SELECT COUNT(*) total FROM usuarios WHERE tipo='artista'",
    (err, artistas) => {

      if (err) return res.sendStatus(500);

      dashboard.artistas = artistas[0].total;

      db.query(
        "SELECT COUNT(*) total FROM usuarios",
        (err, usuarios) => {

          if (err) return res.sendStatus(500);

          dashboard.usuarios = usuarios[0].total;

          db.query(
            "SELECT COUNT(*) total FROM eventos",
            (err, eventos) => {

              if (err) return res.sendStatus(500);

              dashboard.eventos = eventos[0].total;

              db.query(
                "SELECT COUNT(*) total FROM galeria_mes",
                (err, galeria) => {

                  if (err) return res.sendStatus(500);

                  dashboard.galeria = galeria[0].total;

                  res.json(dashboard);

                }
              );

            }
          );

        }
      );

    }
  );

});

// ========================================
// OBTENER TODAS LAS OBRAS
// ========================================

app.get("/obras", (req, res) => {

  const sql = `
    SELECT

      obras.id,
      obras.titulo,
      obras.descripcion,
      obras.categoria,
      obras.imagen,

      DATE_FORMAT(
        obras.fecha_publicacion,
        '%d/%m/%Y %H:%i'
      ) AS fecha,

      usuarios.id AS artista_id,
      usuarios.nombre,
      usuarios.foto

    FROM obras

    INNER JOIN usuarios
      ON obras.artista_id = usuarios.id

    ORDER BY obras.fecha_publicacion DESC
  `;

  db.query(sql, (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Error al obtener obras"
      });

    }

    res.json(result);

  });

});


// ========================================
// OBTENER OBRAS DE UN ARTISTA
// ========================================

app.get("/obras-artista/:id", (req, res) => {

  const { id } = req.params;

  const sql = `
    SELECT *
    FROM obras
    WHERE artista_id = ?
    ORDER BY fecha_publicacion DESC
  `;

  db.query(
    sql,
    [id],
    (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          message: "Error al obtener las obras del artista"
        });

      }

      res.json(result);

    }
  );

});


// ========================================
// PUBLICAR NUEVA OBRA
// ========================================

app.post(
  "/obras",
  uploadObra.single("imagen"),
  async (req, res) => {

    try {

      const {
        titulo,
        descripcion,
        categoria,
        artista_id
      } = req.body;

      let imagen = null;

      // Si el usuario seleccionó una imagen
      if (req.file) {

        const resultado = await subirACloudinary(
          req.file.buffer,
          "death-art/obras"
        );

        imagen = resultado.secure_url;

      }

      const sql = `
        INSERT INTO obras
        (
          titulo,
          descripcion,
          categoria,
          imagen,
          artista_id
        )
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [
          titulo,
          descripcion,
          categoria,
          imagen,
          artista_id
        ],
        (err, result) => {

          if (err) {

            console.log(err);

            return res.status(500).json({
              message: "Error al guardar la obra"
            });

          }

          res.status(201).json({
            message: "Obra publicada correctamente",
            id: result.insertId,
            imagen: imagen
          });

        }
      );

    } catch (error) {

      console.log(
        "Error al subir obra a Cloudinary:",
        error
      );

      res.status(500).json({
        message: "Error al subir la imagen de la obra"
      });

    }

  }
);

app.post("/mensajes", (req, res) => {

  const {

    remitente_id,

    receptor_id,

    mensaje

  } = req.body;

  // Primero guardamos el mensaje del usuario

  const guardarMensaje = `
    INSERT INTO mensajes
    (
      remitente_id,
      receptor_id,
      mensaje
    )
    VALUES (?, ?, ?)
  `;

  db.query(

    guardarMensaje,

    [

      remitente_id,

      receptor_id,

      mensaje

    ],

    (err) => {

      if (err) {

        console.log(err);

        return res.status(500).json({

          message: "Error al enviar mensaje"

        });

      }

      // Verificamos si ya existía conversación antes
      const verificar = `
        SELECT COUNT(*) total
        FROM mensajes
        WHERE
        (
          remitente_id = ?
          AND receptor_id = ?
        )
        OR
        (
          remitente_id = ?
          AND receptor_id = ?
        )
      `;

      db.query(

        verificar,

        [

          remitente_id,

          receptor_id,

          receptor_id,

          remitente_id

        ],

        (err, resultado) => {

          if (err) {

            console.log(err);

            return res.json({

              message: "Mensaje enviado correctamente"

            });

          }

          const total = resultado[0].total;

          /*
            Si hay más de 2 mensajes significa
            que la conversación ya existía.

            1 = mensaje del usuario
            2 = respuesta automática

            A partir del tercero ya no enviamos
            respuesta automática.
          */

          if (total > 1) {

            return res.json({

              message: "Mensaje enviado correctamente"

            });

          }

          // Obtenemos el nombre del artista

          const obtenerArtista = `
            SELECT nombre
            FROM usuarios
            WHERE id = ?
          `;

          db.query(

            obtenerArtista,

            [receptor_id],

            (err, artista) => {

              if (err) {

                console.log(err);

                return res.json({

                  message: "Mensaje enviado correctamente"

                });

              }

              const nombreArtista =

                artista.length > 0

                  ? artista[0].nombre

                  : "el artista";

              const respuesta = `Hola 👋

Soy ${nombreArtista}.

Gracias por comunicarte conmigo.

He recibido tu mensaje correctamente.

En cuanto revise tu mensaje me pondré en contacto contigo.

¡Saludos y gracias por visitar Death-Art!`;

              const guardarRespuesta = `
                INSERT INTO mensajes
                (
                  remitente_id,
                  receptor_id,
                  mensaje
                )
                VALUES (?, ?, ?)
              `;

              db.query(

                guardarRespuesta,

                [

                  receptor_id,

                  remitente_id,

                  respuesta

                ],

                (err) => {

                  if (err) {

                    console.log(err);

                  }

                  res.json({

                    message: "Mensaje enviado correctamente"

                  });

                }

              );

            }

          );

        }

      );

    }

  );

});

app.get("/mensajes/:id", (req, res) => {

  const { id } = req.params;

  const sql = `
    SELECT

      mensajes.*,

      usuarios.nombre

    FROM mensajes

    INNER JOIN usuarios

      ON mensajes.remitente_id = usuarios.id

    WHERE receptor_id = ?

    ORDER BY fecha_envio DESC
  `;

  db.query(sql,[id],(err,result)=>{

    if(err){

      console.log(err);

      return res.status(500).json({

        message:"Error"

      });

    }

    res.json(result);

  });

});

app.get("/artista/:id", (req, res) => {

  const { id } = req.params;

  const sql = `
    SELECT
      id,
      nombre,
      foto
    FROM usuarios
    WHERE id = ?
    AND tipo = 'artista'
  `;

  db.query(sql, [id], (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Error"
      });

    }

    if (result.length === 0) {

      return res.status(404).json({
        message: "Artista no encontrado"
      });

    }

    res.json(result[0]);

  });

});

app.get("/chat/:remitente/:receptor", (req, res) => {

  const {

    remitente,

    receptor

  } = req.params;

  const sql = `

    SELECT *

    FROM mensajes

    WHERE

      (

        remitente_id = ?

        AND receptor_id = ?

      )

      OR

      (

        remitente_id = ?

        AND receptor_id = ?

      )

    ORDER BY fecha_envio ASC

  `;

  db.query(

    sql,

    [

      remitente,

      receptor,

      receptor,

      remitente

    ],

    (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json({

          message: "Error"

        });

      }

      res.json(result);

    }

  );

});





app.get("/", (req, res) => {

  res.json({
    message: "API Eventos funcionando 🚀"
  });

});

app.listen(process.env.PORT, () => {

  console.log(
    `Servidor ejecutándose en puerto ${process.env.PORT}`
  );

});