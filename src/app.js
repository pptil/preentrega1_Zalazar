//#region "Imports"
import express from 'express'
import ProductRoute from './routes/product.router.js'
import CartRoute from './routes/cart.router.js'
//#endregion

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/products', ProductRoute)
app.use('/api/carts', CartRoute)

app.listen(8080, ()=>{
    console.log("Servidor activo.")
})
