
import express from 'express';
import productManager from './src/ProductManager.js'

const app = express();
const PORT = 3000; 

// Middleware para procesar JSON
app.use(express.json());


app.get('/products', (req, res) => {
  const { limit } = req.query;
  const products = productManager.getProducts(limit);
  res.json({ products });
});



app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    const product = productManager.getProductById(id);
    if (product) {
        res.json({ product });
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
   
  });


app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
