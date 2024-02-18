import mongoose from "mongoose";

const cartSchema = mongoose.Schema({

    products: [{
        _id: false,
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    total:{
        type:Number,
        require: true
    }
},{
    timestamps: true // crea las conlumnas de creado y actualizado
    });


const Cart = mongoose.model("Cart",cartSchema)

export default Cart