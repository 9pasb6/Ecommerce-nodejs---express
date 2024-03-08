
import express from 'express';
import http from 'http'; 
import { Server } from 'socket.io'; 
import productRoutes from './Routes/productRoutes.js'
import cartRoutes from './Routes/cartRoutes.js'
import messageRoutes from './Routes/messageRoutes.js'
import cookieRoutes from './Routes/cookieRoutes.js'
import sessionRoutes from './Routes/sessionRoutes.js'
import viewRoutes from './Routes/viewRoutes.js'
import handlebars from 'express-handlebars'
import productManager from './src/ProductManager.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connectDB from './Config/db.js';
import  dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser'
import session from 'express-session';
import MongoStore from 'connect-mongo';




const app = express();
const PORT = 3000; 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Middleware para procesar JSON
app.use(express.json());

// para las variables de entorno
dotenv.config(); 
 //conección de la BD mongodb
connectDB();

// Crear un servidor HTTP utilizando el servidor Express
const server = http.createServer(app);

// Configurar Socket.IO en el servidor
const io = new Server(server);

// Configuración del cookie parser
app.use(cookieParser(process.env.COOKIE_KEY)); // llave de acceso a la cookie

// configuración del session
app.use(session({
  store:MongoStore.create({
    mongoUrl:`${process.env.MONGO_URI}`,
    ttl:60

  }),
    secret: `${process.env.SECRET_SESSION}`,
    resave: false,
    saveUninitialized: false
  }))

// endpoint para los productos
app.use('/api/products', productRoutes);

// endpoint para el cart
app.use('/api/cart', cartRoutes);

// endpoint para el message
app.use('/api/message', messageRoutes);

// endpoint para la cookie
app.use('/api/cookie', cookieRoutes);

// endpoint para la session
app.use('/api/session', sessionRoutes);

// endpoint para la vista
app.use('/api/view', viewRoutes);










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
