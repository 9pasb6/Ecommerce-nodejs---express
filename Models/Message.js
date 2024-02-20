import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
             
    user:{
        type:String,
        required: true,
        trim: true 
    },
    message: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true // crea las conlumnas de creado y actualizado
    }  
)

const Message = mongoose.model("Message",messageSchema)

export default Message;
