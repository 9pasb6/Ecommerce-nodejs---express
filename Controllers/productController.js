import Product from '../Models/Product.js';
import productManager from '../src/ProductManager.js'







const createProduct = async (req, res) => {
  const newProduct = new Product(req.body)

  try {
    await newProduct.save();
    return res.json({ msg: 'Prodcuto creado'})
  } catch  {
    res.status(404).json({ error: 'Error al crear el producto' });
  }
  // const { title, description, price, thumbnail, code, stock } = req.body;
  // const newProduct = productManager.addProduct(title, description, price, thumbnail, code, stock);

  // if (newProduct) {
  //   io.emit('updateProduct', productManager.getProducts());
  //   res.json({ msg: 'Producto creado' });
  // } else {
  //   res.status(404).json({ error: 'Error al crear el producto' });
  // }
}



const getProducts = (req, res) => {
    const { limit } = req.query;
    const products = productManager.getProducts(limit);
    //res.json({ products });
    res.render('home', { title: 'Lista de Productos', products });
  };

  
  const getRealTimeProducts = (req, res, io) => {
    const { limit } = req.query;
    const products = productManager.getProducts(limit);
    res.render('realTimeProducts', { title: 'Lista de Productos en Tiempo Real', products });
  };




const getProductById = (req, res) => {
    const { pid } = req.params;
    const product = productManager.getProductById(pid);
    if (product) {
        res.json({ product });
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
   
}

const updateProduct = (req, res) => {

     const { pid } = req.params;

    const updateProduct = productManager.updateProducts( pid,req.body)
    if (updateProduct) {
        res.json({ msg: 'Producto actualizado con exito' });
      } else {
        res.status(404).json({ error: 'Producto no actualizado' });
      }

}

const deleteProducts = (req, res) => {
  const { pid } = req.params;
  const deleteProduct = productManager.deleteProducts(pid);

  if (deleteProduct) {
     io.emit('updateProduct', productManager.getProducts());
    res.json({ msg: 'Producto eliminado con éxito' });
  } else {
    res.status(404).json({ error: 'Producto no eliminado' });
  }
}

  export{
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProducts,
    getRealTimeProducts
  }
