import {Router} from 'express';
import { __dirname } from '../utils.js';
import ProductManager from '../class/productManager.js';
const router = Router();


const productManager = new ProductManager(__dirname + '/data/product.json');
router.get('/', async (req, res)=>{
    try {
        const productList = await productManager.getProductList();
        res.status(201).json({
            productos: productList
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

router.get('/:pid', async (req, res)=>{
    try {
        const {pid} = req.params
        const product = await productManager.getProductByID(pid)
        res.status(201).json({
            productos: product
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

router.post('/', async (req, res)=>{
    try {
        const newProduct = req.body
        await productManager.addProduct(newProduct);
        res.status(201).json({
            message: 'Añadido!'
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})


router.put('/:id', async (req, res)=>{
    try {
        const { id } = req.params;
        const producto = req.body;
        await productManager.updateProduct(producto, id)
        res.status(201).json({
            message: "Producto actualizado!"
        }) 
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

router.delete('/:id', async (req, res)=>{
    try {
        const {id} = req.params
        await productManager.deleteProductByID(id)
        res.status(201).json({
            message: "Producto eliminado!"
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

export default router;