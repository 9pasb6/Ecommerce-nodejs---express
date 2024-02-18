import mongoose from 'mongoose'
import Cart from '../Models/Cart.js'
import cartManager from '../src/CartManager.js'
import productManager from '../src/ProductManager.js'
import Product from '../Models/Product.js'






const createCart = async (req, res) =>{

   try {
    const newCart = await Cart.create({
        products: [],
        total: 0
    })
    return res.status(201).json(newCart);
   } catch (error) {
    return res.status(500).json({ error: 'Error al crear el carrito.' });
   }
//    const newCart = await cartManager.createCart()

//     if(newCart){
//         res.json({
//             msg:'Carrito creado'
//            })
//     }else{
//         res.status(404).json({ error: 'Error al crear el carrito' });
//     }
}

const addProductToCart= async(req, res)=>{

    const { pid } = req.params;
    const { cid } = req.params;
    const {quantity} = req.body;

    const findProduct = await Product.findById(pid);
    const findCart = await Cart.findById(cid);

    if (!findProduct) {
        return res.status(400).json({ msg: 'ID del producto no válido' });
    }

    if (!findCart) {
        return res.status(400).json({ msg: 'ID del carrito no válido' });
    }



    try {
       
        if (findCart.products.length !== 0) {
            console.log('carrito no esta vacio')

        const existingProduct = findCart.products.find(product => product._id.equals(findProduct._id));
        console.log(existingProduct)

    // if (existingProduct) {
    //     // Si el producto ya existe, incrementa la cantidad
    //     existingProduct.quantity += quantity;
    // } else {
    //     // Si no existe, agrega un nuevo objeto al array
    //     findCart.products.push({
    //         product: productId,
    //         quantity: quantity
    //     });
    // }
            
        }

        const newProduct = {
            product: findProduct._id, 
            quantity: quantity
        };
    
        findProduct.stock = findProduct.stock - quantity;
        findProduct.save()

        findCart.products.push(newProduct);

        await findCart.save();
        return res.json({ msg: 'Producto agregado al carrito con exito v2'});

    } catch  {
        const error = new Error('Acción no valida desde el getTask');
        return res.status(401).json({ msg: error.message})
    }

    // const findProduct = productManager.getProductById(pid);
  
    // if (findProduct) {
    //     const productToAdd = cartManager.addProductToCart(cid,findProduct, quantity);
    //     if(productToAdd){
    //         res.json({
    //             msg:'Producto agregado al carrito'
    //         })
    //     }else{
    //         res.status(404).json({ error: 'Stock del producto insuficiente' });
    //     }
    // }else{
    //     res.status(404).json({ error: 'Error al encontrar el producto' });

    // }
}
    
  const getProductsToCart = async (req, res) =>{

    const { cid } = req.params;

    if(!mongoose.isValidObjectId(cid)){
        return res.status(400).json({ msg: 'ID del carrito no válido' });
    }

    const cart = await Cart.findById(id);
    console.log(`Carrito id ${cart}`)

    //obtener los productos de ese carrito en especifico
    const product = await Product.find().where("cart").equals(cart._id);
    res.json({
        cart,
        product
    })

    // const findCart = cartManager.getProductsToCart(cid)

    // if(findCart){
    //     res.json({
    //         findCart
    //     })  
    // }else{
    //     res.status(404).json({ error: 'Error al encontrar el carrito' });
    // }


  }



export {

    createCart,
    addProductToCart,
    getProductsToCart
    
}