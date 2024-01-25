import cartManager from '../src/CartManager.js'
import productManager from '../src/ProductManager.js'


const createCart = (req, res) =>{
   const newCart = cartManager.createCart()
    if(newCart){
        res.json({
            msg:'Carrito creado'
           })
    }else{
        res.status(404).json({ error: 'Error al crear el carrito' });
    }
}

const addProductToCart=(req, res)=>{

    const { pid } = req.params;
    const { cid } = req.params;
    const {quantity} = req.body;

    const findProduct = productManager.getProductById(pid);
  
    if (findProduct) {
        const productToAdd = cartManager.addProductToCart(cid,findProduct, quantity);
        if(productToAdd){
            res.json({
                msg:'Producto agregado al carrito'
            })
        }else{
            res.status(404).json({ error: 'Stock del producto insuficiente' });
        }
    }else{
        res.status(404).json({ error: 'Error al encontrar el producto' });

    }
}
    
  const getProductsToCart = (req, res) =>{

    const { cid } = req.params;

    const findCart = cartManager.getProductsToCart(cid)

    if(findCart){
        res.json({
            findCart
        })  
    }else{
        res.status(404).json({ error: 'Error al encontrar el carrito' });
    }


  }



export {

    createCart,
    addProductToCart,
    getProductsToCart
    
}