
const {
    initializeApp,
    getApps,
    cert
} = require("firebase-admin/app");

const {
    getMessaging
} = require("firebase-admin/messaging");

function iniciarFirebase() {

    try {

        // Evitar inicializar Firebase dos veces
        if (getApps().length > 0) {

            console.log("Firebase ya inicializado");

            return {
                messaging: () => getMessaging(getApps()[0])
            };
        }

        // Leer credenciales desde Render
        const credenciales =
            process.env.FIREBASE_SERVICE_ACCOUNT;

        if (!credenciales) {

            console.error(
                "Falta FIREBASE_SERVICE_ACCOUNT"
            );

            return null;
        }

        // Convertir el JSON en un objeto
        const serviceAccount =
            JSON.parse(credenciales);

        // Inicializar Firebase Admin
        const app = initializeApp({
            credential: cert(serviceAccount)
        });

        console.log(
            "Firebase Admin inicializado correctamente"
        );

        // Mantener compatibilidad con server.js
        return {
            messaging: () => getMessaging(app)
        };

    } catch (error) {

        console.error(
            "Error al inicializar Firebase:",
            error.message
        );

        return null;
    }
}

module.exports = iniciarFirebase;
