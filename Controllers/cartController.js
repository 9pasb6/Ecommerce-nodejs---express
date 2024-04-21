import mongoose from 'mongoose'
import Cart from '../Models/Cart.js'
import cartManager from '../src/CartManager.js'
import productManager from '../src/ProductManager.js'
import Product from '../Models/Product.js'
import Ticket from '../Models/Ticket.js';






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

const addProductToCart = async (req, res) => {
    const { pid } = req.params;
    const { cid } = req.params;
    const quantityParam = req.query.quantity;

    // Convertir quantityParam a un número
    const quantity = parseInt(quantityParam, 10);

    console.log('ID del producto:', pid);
    console.log('ID del carrito:', cid);
    console.log('Cantidad solicitada:', quantity);
    

    try {
        const findProduct = await Product.findById(pid);
        const findCart = await Cart.findById(cid);

        console.log('Producto encontrado:', findProduct);
    console.log('Carrito encontrado:', findCart);

        if (!findProduct) {
            return res.status(400).json({ msg: 'ID del producto no válido' });
        }

        if (!findCart) {
            return res.status(400).json({ msg: 'ID del carrito no válido' });
        }

        if(findProduct.stock<quantity){
            return res.status(400).json({ msg: 'Stock insuficiente' });
        }

        if (findCart.products.length !== 0) {
            console.log('El carrito no está vacío');

            const existingProductIndex = findCart.products.findIndex(product => product.product.equals(findProduct._id));

            if (existingProductIndex !== -1) {
                // Si el producto ya existe, incrementa la cantidad
                findCart.products[existingProductIndex].quantity += quantity;
                console.log('El producto ya existe en el carrito, se ha actualizado la cantidad:', findCart.products[existingProductIndex]);
            } else {
                // Si no existe, agrega un nuevo objeto al array
                const newProduct = {
                    product: findProduct._id,
                    quantity: quantity,
                };
                findCart.products.push(newProduct);
                await findCart.save();
                return res.json({ msg: 'Producto nuevo agregado al carrito con éxito' });
            }
        }else{
             // Resta la cantidad del producto al stock
        
        // Si no existe, agrega un nuevo objeto al array
        const newProduct = {
            product: findProduct._id,
            quantity: quantity,
        };
       findCart.products.push(newProduct);
       
        }

       
        findProduct.stock = findProduct.stock - quantity;
        await findProduct.save();
        // Guarda el carrito actualizado
        await findCart.save();
        return res.json({ msg: 'Producto agregado al carrito con éxito' });
        // return res.render('products',{ msg: 'Producto agregado al carrito con éxito' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error en el servidor' });
    }
}

    
const getProductsToCart = async (req, res) => {
    const { cid } = req.params;

    if (!mongoose.isValidObjectId(cid)) {
        return res.status(400).json({ msg: 'ID del carrito no válido' });
    }

    try {
        const cart = await Cart.findById(cid).populate('products');
        console.log(`Carrito id ${cart}`);

        // Renderizar la vista con los datos del carrito y los productos
        // En tu controlador
    res.render('cart', {cart: cart });

        //res.json( { cart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error al mostrar los productos del carrito' });
    }
};


const deleteAllProducts = async (req,res) =>{

    const {cid} = req.params

    const findCart = await Cart.findById(cid).populate('products');

    if (!findCart) {
        return res.status(400).json({ msg: 'ID del carrito no válido' });
    }

    try {
        
        findCart.products = []
        await findCart.save()
        res.json({ msg: "Productos eliminados del carrito"})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error del servidor' });
    }

}



const deleteOneProduct = async (req, res) =>{

    const {cid} = req.params
    const {pid} = req.params

    const findCart = await Cart.findById(cid)
    const findProduct = await Product.findById(pid);
    

    if (!findCart) {
        return res.status(400).json({ msg: 'ID del carrito no válido' });
    }

    if (!findProduct) {
        return res.status(400).json({ msg: 'ID del producto no válido' });
    }

    try {

       const cartUpdate = await Cart.updateOne(
            { _id: cid },
            { $pull: { products: { product: pid } } })

            if ( cartUpdate) {
                res.json({ msg: "Producto eliminado del carrito 🥵"})
            }
        
        
    
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error del servidor' });
    }


}


const finalizePurchase = async (req, res) => {
    const { cid } = req.params;
    try {
      const cart = await Cart.findById(cid).populate('products.product');
      if (!cart) {
        return res.status(404).json({ msg: 'Carrito no encontrado' });
      }
      
      let totalAmount = 0;
      const unavailableProducts = [];
      const updatedProducts = [];
  
      // Revisar el stock de cada producto en el carrito
      for (let item of cart.products) {
        if (item.product.stock < item.quantity) {
          unavailableProducts.push(item.product._id);
        } else {
          item.product.stock -= item.quantity;
          updatedProducts.push(item.product);
          totalAmount += item.quantity * item.product.price;
        }
      }
  
      if (unavailableProducts.length > 0) {
        return res.status(400).json({ msg: 'No hay suficiente stock para algunos productos', productIds: unavailableProducts });
      }
  
      // Guardar los productos actualizados
      for (let product of updatedProducts) {
        await product.save();
      }
  
      // Crear el ticket de compra
      const ticket = new Ticket({
        amount: totalAmount,
        purchaser: req.user.email // Asegúrate de que el email del usuario está disponible en req.user
      });
      await ticket.save();
  
      // Limpiar los productos del carrito que se compraron
      cart.products = cart.products.filter(item => unavailableProducts.includes(item.product._id));
      await cart.save();
  
      res.status(201).json({ ticket, msg: 'Compra realizada con éxito' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error del servidor al finalizar la compra' });
    }
  };
  

export {

    createCart,
    addProductToCart,
    getProductsToCart,
    deleteAllProducts,
    deleteOneProduct,
    finalizePurchase
    
}