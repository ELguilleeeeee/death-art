
const admin = require("firebase-admin");

function iniciarFirebase() {
    if (admin.apps.length > 0) {
        return admin;
    }

    const credenciales =
        process.env.FIREBASE_SERVICE_ACCOUNT;

    if (!credenciales) {
        console.log(
            "Firebase no configurado todavía"
        );
        return null;
    }

    try {
        const serviceAccount =
            JSON.parse(credenciales);

        admin.initializeApp({
            credential: admin.credential.cert(
                serviceAccount
            )
        });

        console.log(
            "Firebase Admin inicializado"
        );

        return admin;

    } catch (error) {
        console.error(
            "Error al inicializar Firebase:",
            error.message
        );

        return null;
    }
}

module.exports = iniciarFirebase;
