//#region "Imports"
import express from 'express';
import handlebars from 'express-handlebars';
import {
    Server
} from 'socket.io';
import {
    __dirname
} from './utils.js';
import ProductRoute from './routes/product.router.js';
import CartRoute from './routes/cart.router.js';
import HomeRoute from './routes/home.router.js';
import RealTimeProductsRoute from './routes/realtimeproducts.router.js';
import mongoose from 'mongoose';
import {
    ProductModel
} from "./models/Product.Model.js";
import {
    CartModel
} from "./models/Cart.Model.js";
//#endregion

const app = express();
const uri = "mongodb+srv://Cluster69925:zumndMKHsBlfpYnD@coderzalazar.xiqba.mongodb.net/?retryWrites=true&w=majority&appName=CoderZalazar";

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
const server = app.listen(8080);
export const socketServer = new Server(server);

socketServer.on('connection', async (socket) => {
    const productsList = await ProductModel.find()
    socket.emit('home', productsList)
    socket.emit('realtime', productsList)
    const cid = "66b96f59ff778833a40eba3b"
    const newCart = await CartModel.findById(cid).populate('products.product')
    socketServer.emit('cart', newCart)
    socket.on('nuevo-producto', async (product) => {
        await ProductModel.create(product)
        const productsList = await ProductModel.find()
        socket.emit('realtime', productsList)
    })
    socket.on('modificar-producto', async ({
        id,
        productData
    }) => {
        await ProductModel.findByIdAndUpdate(id, {
            ...productData
        })
        const productsList = await ProductModel.find()
        socket.emit('realtime', productsList)
    })
    socket.on('eliminar-producto', async (id) => {
        await ProductModel.findByIdAndDelete(id)
        const productsList = await ProductModel.find()
        socket.emit('realtime', productsList)
    });

    socket.on('addCart', async (pid) => {
        try {
            const cid = "66b96f59ff778833a40eba3b";
            console.log("entró");

            const cartSelect = await CartModel.findById(cid);

            if (!cartSelect) {
                console.error(`Carrito con ID ${cid} no encontrado.`);
                return;
            }

            const indexProd = cartSelect.products.findIndex(prod => prod.product.toString() === pid);

            if (indexProd === -1) {
                cartSelect.products.push({
                    product: pid,
                    quantity: 1
                });
            } else {
                cartSelect.products[indexProd].quantity += 1;
            }

            const newCart = await CartModel.findByIdAndUpdate(cid, cartSelect, {
                new: true
            }).populate('products.product');

            socketServer.emit('cart', newCart);
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
        }
    })

});

mongoose.connect(uri, {
    dbName: 'ecommerce'
})
//#endregion