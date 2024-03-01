import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

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
    },
    category:{
        type: String,
        required: true,
        enum: ['Comida','Tecnologia','Ropa']
    }
}, {
    timestamps: true // crea las conlumnas de creado y actualizado
    }  
)
productSchema.plugin(mongoosePaginate)
const Product = mongoose.model("Product", productSchema)

export default Product