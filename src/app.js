//#region "Imports"
import express from 'express';
import handlebars from 'express-handlebars';
import {
    Server
} from 'socket.io';
import {
    __dirname
} from './utils.js';
import ProductManager from './class/productManager.js';

import ProductRoute from './routes/product.router.js';
import CartRoute from './routes/cart.router.js';
import HomeRoute from './routes/home.router.js';
import RealTimeProductsRoute from './routes/realtimeproducts.router.js';
//#endregion

const app = express();
const productManager = new ProductManager(`${__dirname}/data/product.json`);

// #region "Handlebars"
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');
//#endregion

//#region "Middlewares"
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(`${__dirname}/public`));
//#endregion

//#region "Routes"
app.use('/api/products', ProductRoute);
app.use('/api/carts', CartRoute);
app.use('/', HomeRoute);
app.use('/realtimeproducts', RealTimeProductsRoute);
//#endregion

//#region "Server"
const httpServer = app.listen(8080, () => {
    console.log('-Server ON-');
});

export const socketServer = new Server(httpServer);

socketServer.on('connection', async (socket) => {
    console.log(`Device ${socket.id} connected.`);
    const productsList = await productManager.getProductList();
    socket.emit('home', productsList);
    socket.emit('realtime', productsList);

    socket.on('nuevo-producto', async (producto) => {
        await productManager.addProduct(producto);
        console.log(producto);
        const updatedProductsList = await productManager.getProductList();
        socket.emit('realtime', updatedProductsList);
    });

    socket.on('modificar-producto', async (producto) => {
        await productManager.updateProduct(producto, producto.id);
        console.log(producto.id);
        const updatedProductsList = await productManager.getProductList();
        socket.emit('realtime', updatedProductsList);
    });

    socket.on('eliminar-producto', async (id) => {
        await productManager.deleteProductByID(id);
        const updatedProductsList = await productManager.getProductList();
        socket.emit('realtime', updatedProductsList);
    });
});
//#endregion