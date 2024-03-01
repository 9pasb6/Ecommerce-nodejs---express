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




export {

    createCart,
    addProductToCart,
    getProductsToCart
    
}