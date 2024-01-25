
import express from 'express';
// import productManager from './src/ProductManager.js'
import productRoutes from './Routes/productRoutes.js'
import cartRoutes from './Routes/cartRoutes.js'

const app = express();
const PORT = 3000; 
// const PORT = 8080; 

// Middleware para procesar JSON
app.use(express.json());

// endpoint para los productos
app.use('/api/products', productRoutes);

// endpoint par el cart
app.use('/api/cart', cartRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
