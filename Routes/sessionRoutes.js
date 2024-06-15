import express from "express";
import { 
    logIn,
    logOut,
    register,
    changeUserRole // Asegúrate de que esta función esté definida en sessionController.js
} from "../Controllers/sessionController.js";
import CheckAuth from "../middleware/checkAuth.js"; // Importa el middleware de autenticación
import authorize from "../middleware/authorize.js"; // Importa el middleware de autorización
import upload from '../Config/multerConfig.js'; // Importa la configuración de Multer

const router = express.Router();

// Endpoint para iniciar sesión
router.post('/login', logIn);

// Endpoint para registrarse
router.post('/register', register);

// Endpoint para cerrar sesión
router.get('/logout', logOut);

// Ruta para cambiar el rol de un usuario, accesible solo por administradores
router.post('/premium/:uid', CheckAuth, authorize('Admin'), changeUserRole);

// Endpoint para subir documentos
router.post('/api/users/:uid/documents', upload.array('document', 10), async (req, res) => {
    try {
        const { uid } = req.params;
        const files = req.files;

        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        files.forEach(file => {
            user.documents.push({
                name: file.originalname,
                reference: file.path
            });
        });

        await user.save();
        res.status(200).json({ message: 'Documentos subidos y guardados correctamente', documents: user.documents });
    } catch (error) {
        res.status(500).json({ message: 'Error al subir los documentos', error });
    }
});

export default router;
