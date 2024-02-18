import mongoose from "mongoose";


// id: generateId(),
//       title,
//       description,
//       price,
//       thumbnail,
//       code,
//       stock,

const productSchema = mongoose.Schema({
            
    title:{
        type:String,
        required: true,
        trim: true 
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type:Number,
        required: true
    },
    thumbnail: {
        type:String,
        required: true
    },
    code: {
        type:String,
        required: true
    },
    stock: {
        type:Number,
        required: true
    }
}, {
    timestamps: true // crea las conlumnas de creado y actualizado
    }  
)

const Product = mongoose.model("Product", productSchema)

export default Product