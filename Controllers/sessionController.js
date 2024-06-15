import User from "../Models/User.js";
import generateJWT from "../Helpers/generateJWT.js";
import generateId from "../Helpers/generateId.js";
import nodemailer from 'nodemailer'; // Asegúrate de haber instalado nodemailer

// Configuración del transporter para nodemailer con Sendinblue
const transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure: false, 
    auth: {
        user: process.env.SEND_IN_BLUE_EMAIL, // Correo electrónico registrado en Sendinblue
        pass: process.env.SEND_IN_BLUE_PASSWORD // Contraseña SMTP de Sendinblue
    }
});

// Función para enviar el correo de restablecimiento de contraseña
function sendResetEmail(to, token) {
    const mailOptions = {
        from: process.env.SEND_IN_BLUE_EMAIL,
        to: to,
        subject: 'Restablecimiento de contraseña',
        text: `Usa el siguiente token para restablecer tu contraseña: ${token}`
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email enviado: ' + info.response);
        }
    });
}

// Función para generar un token de restablecimiento
function generateResetToken() {
    return generateId(); 
}

// Método para solicitar el restablecimiento de contraseña
const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    user.resetPasswordToken = generateResetToken();
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await user.save();
    sendResetEmail(user.email, user.resetPasswordToken);
    res.json({ msg: 'Correo de restablecimiento enviado' });
};

// Método para restablecer la contraseña
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
        return res.status(400).json({ msg: 'Token inválido o expirado' });
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ msg: 'Contraseña actualizada' });
};

// Método de inicio de sesión
const logIn = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ msg: `Usuario no existe` });
    }
    if (await user.confirmPassword(password)) {
        user.token = generateJWT(user._id);
        user.last_connection = new Date(); // Actualiza la última conexión
        await user.save();
        res.json({ msg: "Ingreso exitoso", token: user.token });
    } else {
        res.status(401).json({ msg: 'Contraseña incorrecta' });
    }
};


// Método de registro de usuario
const register = async (req, res) => {
    const newUser = new User(req.body);
    newUser.token = generateId(); // Opcional: Genera un ID para otras necesidades, podría omitirse
    try {
        await newUser.save();
        res.redirect('/api/view/login');
    } catch (error) {
        res.status(404).json({ msg: 'Error al crear usuario', error: error });
    }
};

// Método para cerrar sesión
const logOut = async (req, res) => {
    if (!req.session.user) {
        return res.json({ msg: `La sesión no existe` });
    }
    const { _id } = req.session.user;
    const user = await User.findById(_id);
    req.session.destroy(async (error) => {
        if (!error) {
            user.token = " ";
            user.last_connection = new Date(); // Actualiza la última conexión
            await user.save();
            res.redirect('/api/view/login');
        } else {
            res.json({ msg: `Problemas al cerrar sesión` });
        }
    });
};


// Método para cambiar el rol de un usuario
const changeUserRole = async (req, res) => {
    const { uid } = req.params;
    const { newRole } = req.body;

    try {
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        if (newRole === 'Premium') {
            const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
            const userDocuments = user.documents.map(doc => doc.name);
            const hasAllDocuments = requiredDocuments.every(doc => userDocuments.includes(doc));

            if (!hasAllDocuments) {
                return res.status(400).json({ msg: 'El usuario no ha terminado de procesar su documentación' });
            }
        }

        user.role = newRole;
        await user.save();
        res.json({ msg: 'Rol actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar el rol', error: error });
    }
};



// Vistas del usuario
const loginView = (req, res) => {
    res.render("login");
};

const registerView = (req, res) => {
    res.render('register');
};

const profileView = (req, res) => {
    const user = req.session.user;
    res.render('profile', { user });
};

export {
   
    logIn,
    logOut,
    register,
    loginView,
    registerView,
    profileView,
    requestPasswordReset,
    resetPassword,
    changeUserRole
};
