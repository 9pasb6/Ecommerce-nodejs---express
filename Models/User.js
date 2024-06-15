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
    },
    documents: [{
        name: String,
        reference: String
    }],
    last_connection: {
        type: Date
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.confirmPassword = async function(passwordForm) {
    return await bcrypt.compare(passwordForm, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
