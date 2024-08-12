import {
    Router
} from 'express';
import {
    __dirname
} from '../utils.js';
import {
    CartModel
} from "../models/Cart.Model.js";
const router = Router();


router.get('/', async (req, res) => {
    try {
        const cartList = await CartModel.find().populate("products.product")
        res.status(200).json(cartList)
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

router.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid
        const cart = await CartModel.findById(cid).populate("products.product")
        res.status(200).json(cart)
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

router.post('/', async (req, res) => {
    try {
        await CartModel.create({
            products: []
        })
        res.status(201).json({
            "mensaje": "Cart created",
            "payload": {
                products: []
            }
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})


router.put('/:cid', async (req, res) => {
    try {
        const {
            cid,
            pid
        } = req.params;
        const cartSelect = await CartModel.findById(cid);
        const indexProd = cartSelect.products.findIndex(prod => prod.product.toString() === pid);
        if (indexProd === -1) {
            cartSelect.products.push({
                product: pid,
                quantity: 1
            })
        } else {
            cartSelect.products[indexProd] = {
                product: cartSelect.products[indexProd].product,
                quantity: cartSelect.products[indexProd].quantity + 1
            }

        }
        const cartUpdated = await CartModel.findByIdAndUpdate(cid, cartSelect, {
            new: true
        }).populate('products.product')
        res.status(200).json({
            "mensaje": "Product added to the cart",
            "payload": {
                cartUpdated
            }
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

router.delete('/:cid', async (req, res) => {
    try {
        const {
            cid
        } = req.params;

        await CartModel.findByIdAndDelete(cid)

        res.status(200).json({
            message: 'Cart deleted'
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const {
            cid,
            pid
        } = req.params;

        const carrito = await CartModel.findById(cid).lean();

        const cartFiltered = {
            ...carrito,
            products: carrito.products.filter(prod => prod.product.toString() !== pid)
        }

        const cartUpdated = await CartModel.findByIdAndUpdate(cid, cartFiltered, {
            new: true
        }).populate('products.product')

        res.status(200).json({
            message: 'Producto deleted from cart',
            cart: cartUpdated
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

export default router;