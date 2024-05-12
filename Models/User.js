import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    role: {
        type: String,
        required: true,
        enum: ['Admin', 'User'],
        default: 'User'
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
}, {
    timestamps: true // Crea las columnas de creado y actualizado
});

// Hook de bcrypt para cifrar el password de los usuarios
userSchema.pre('save', async function(next) {
    // Este código se ejecutará antes de hacer un registro de un usuario en la BD
    if (!this.isModified("password")) {
        // Verifica que el password no ha sido modificado, es decir, si no se ha modificado el password, no hagas nada
        next();
    }
    const salt = await bcrypt.genSalt(10);
    // Finalmente
    this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar el password form con el hasheado en la base de datos
userSchema.methods.confirmPassword = async function(passwordForm) {
    return await bcrypt.compare(passwordForm, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
