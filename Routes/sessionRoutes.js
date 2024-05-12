import express from "express";
import { 
    logIn,
    logOut,
    register,
    changeUserRole // Asegúrate de que esta función esté definida en sessionController.js
} from "../Controllers/sessionController.js";
import CheckAuth from "../middleware/checkAuth.js"; // Importa el middleware de autenticación
import authorize from "../middleware/authorize.js"; // Importa el middleware de autorización

const router = express.Router();

// Endpoint para iniciar sesión
router.post('/login', logIn);

// Endpoint para registrarse
router.post('/register', register);

// Endpoint para cerrar sesión
router.get('/logout', logOut);

// Ruta para cambiar el rol de un usuario, accesible solo por administradores
router.post('/premium/:uid', CheckAuth, authorize('Admin'), changeUserRole);

export default router;
