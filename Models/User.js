import mongoose from "mongoose";


const userSchema = mongoose.Schema({
            
    first_name:{
        type:String,
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
        type:Number,
        required: true
    },
    password: {
        type:String,
        required: true
    },
    role:{
        type: String,
        required: true,
        enum: ['Admin','User'],
        default: 'User'
    }
}, {
    timestamps: true // crea las conlumnas de creado y actualizado
    }  
)

const User = mongoose.model("User", userSchema)

export default User