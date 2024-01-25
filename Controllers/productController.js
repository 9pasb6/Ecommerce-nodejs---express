import productManager from '../src/ProductManager.js'


const getProducts = (req, res) => {
    const { limit } = req.query;
    const products = productManager.getProducts(limit);
    res.json({ products });
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

const createProduct = (req, res) => {
    const {title, description, price, thumbnail, code, stock} = req.body;

    const newProduct = productManager.addProduct(title, description, price, thumbnail, code, stock);
    console.log(newProduct)

    if (newProduct) {
        res.json({ msg: 'Producto creado'});
      }else{
        res.status(404).json({ error: 'Error al crear el producto' });

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
    const deleteProducts = productManager.deleteProducts(pid)

    if (deleteProducts) {
        res.json({ msg: 'Producto eliminado con exito'});
      } else {
        res.status(404).json({ error: 'Producto no eliminado' });
      }
}

  export{
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProducts
  }
