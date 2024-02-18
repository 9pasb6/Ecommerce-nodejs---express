
import express from 'express';
import http from 'http'; 
import { Server } from 'socket.io'; 
import productRoutes from './Routes/productRoutes.js'
import cartRoutes from './Routes/cartRoutes.js'
import handlebars from 'express-handlebars'
import productManager from './src/ProductManager.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connectDB from './Config/db.js';
import  dotenv from 'dotenv';



const app = express();
const PORT = 3000; 


// para las variables de entorno
dotenv.config(); 
 //conección de la BD mongodb
connectDB();

// Crear un servidor HTTP utilizando el servidor Express
const server = http.createServer(app);

// Configurar Socket.IO en el servidor
const io = new Server(server);


// Middleware para procesar JSON
app.use(express.json());

// endpoint para los productos
app.use('/api/products', productRoutes);

// endpoint para el cart
app.use('/api/cart', cartRoutes);

//render del home.handlebars
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'handlebars');


// coneccion con socket.io
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // seteando los datos
  socket.on('createProduct', (newProductData) => {
  
    productManager.addProduct(
      newProductData.title,
      newProductData.description,
      newProductData.price,
      newProductData.thumbnail,
      newProductData.code,
      newProductData.stock
    );
    io.emit('updateProduct', productManager.getProducts());
  });

  socket.on('deleteProduct', (productIdToDelete) => {
   
    const success = productManager.deleteProducts(productIdToDelete);
    if (success) {
      io.emit('updateProduct', productManager.getProducts());
    }
    
  });
 
  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
