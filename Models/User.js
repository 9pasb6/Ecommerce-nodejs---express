import mongoose from "mongoose";
import bcrypt from "bcrypt";


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
    token: {
        type: String,
        
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

// hook de bcrypt para cifrar el password de los usuarios

userSchema.pre('save', async function(next){
    // este codigo se va ha ejecutar antes de hacer un registro de un usuario en la BD 
    
    if(!this.isModified("password"))
    {// verifica que el password no ha sido modificado, es decir, si no se ha  modificado el password, no hagas nada
        next();
    }
    const salt = await bcrypt.genSalt(10);
    // finalmente 
    this.password = await bcrypt.hash(this.password, salt)
    
    })
    
    
    
    
    
    userSchema.methods.confirmPassword = async function(passwordForm){
    //compare: compara un string que no esta hasheado con uno que si lo esta
        return await bcrypt.compare(passwordForm, this.password)
    
    }

const User = mongoose.model("User", userSchema)

export default User