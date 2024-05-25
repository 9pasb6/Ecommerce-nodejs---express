import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import productRoutes from './Routes/productRoutes.js';
import cartRoutes from './Routes/cartRoutes.js';
import messageRoutes from './Routes/messageRoutes.js';
import cookieRoutes from './Routes/cookieRoutes.js';
import sessionRoutes from './Routes/sessionRoutes.js';
import viewRoutes from './Routes/viewRoutes.js';
import handlebars from 'express-handlebars';
import productManager from './src/ProductManager.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connectDB from './Config/db.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use(cookieParser(process.env.COOKIE_KEY));

app.use(session({
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 60
  }),
  secret: process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized: false
}));

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/cookie', cookieRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/view', viewRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'handlebars');

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('Usuario conectado');

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

export default app;
