import {Router} from 'express';
import { __dirname } from '../utils.js';
import CartManager from '../class/cartManager.js';
const router = Router();


const cartManager = new CartManager(__dirname + '/data/cart.json');
router.get('/', async (req, res)=>{
    try {
        const cartList = await cartManager.getCartList();
        res.status(201).json({
            carritos: cartList
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

router.get('/:cid', async (req, res)=>{
    try {
        const {cid} = req.params
        const cart = await cartManager.getCartByID(cid)
        res.status(201).json({
            carritos: cart
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

router.post('/', async (req, res)=>{
    try {
        const newCart = req.body
        await cartManager.addCart(newCart);
        res.status(201).json({
            message: 'Añadido!'
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})


router.put('/:cid', async (req, res)=>{
    try {
        const { cid } = req.params;
        const carrito = req.body;
        await cartManager.updateCart(carrito, cid)
        res.status(201).json({
            message: "carrito actualizado!"
        }) 
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

router.delete('/:cid', async (req, res)=>{
    try {
        const {cid} = req.params
        await cartManager.deleteCartByID(cid)
        res.status(201).json({
            message: "carrito eliminado!"
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})
router.post('/:cid/products/:pid', async (req, res)=>{
    try {
        const {cid, pid} = req.params
        //TODO: Metodo cartManager.addProductCarrito
    
        res.status(201).json({
            payload: cart
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

export default router;