import Product from '../Models/Product.js';
import productManager from '../src/ProductManager.js'







const createProduct = async (req, res) => {
  const newProduct = new Product(req.body)

  try {
    await newProduct.save();
    return res.json({ msg: 'Producto creado'})
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


const getProducts = async (req, res) => {
  const { limit, page } = req.query;

  try {
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    };

    const product = await Product.paginate({ category: "Tecnologia" }, options);

    // Ordenar utilizando aggregation pipeline
    const sortedProducts = await Product.aggregate([
      { $match: { category: "Tecnologia" } }, // Filtrar por categoría si es necesario
      { $sort: { price: -1 } }, // Ordena por precio de mayor a menor
      { $skip: (options.page - 1) * options.limit }, // Saltar documentos según la página actual
      { $limit: options.limit }, // Limitar el número de documentos por página
    ]);

    res.render('products', {
      status: 'success',
      products: sortedProducts,
      totalPages: product.totalPages,
      prevPage: product.prevPage,
      nextPage: product.nextPage,
      page: product.page,
      hasPrevPage: product.hasPrevPage,
      hasNextPage: product.hasNextPage,
      prevLink: product.prevLink,
      nextLink: product.nextLink,
      limit: limit
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Error en el servidor al conseguir los productos' });
  }
};


  
  const getRealTimeProducts = (req, res, io) => {
    const { limit } = req.query;
    const products = productManager.getProducts(limit);
    res.render('realTimeProducts', { title: 'Lista de Productos en Tiempo Real', products });
  };




const getProductById = async (req, res) => {
    const { pid } = req.params;
    
    const product = await Product.findById(pid)
    

    if (!product) {
      return res.status(400).json({ msg: 'ID del producto no válido' });
    }
  
    try {
      res.render('productDetail',{ product });
    } catch (error) {
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

// Función para obtener la vista de los productos
const getProductsView = (req, res) => {
  res.render('product'); // 'chat' debe coincidir con el nombre de tu archivo de vista Handlebars
};


  export{
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProducts,
    getRealTimeProducts,
    getProductsView
  }
