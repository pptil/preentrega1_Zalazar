import {
    Router
} from 'express';
import {
    __dirname
} from '../utils.js';

import {
    ProductModel
} from "../models/Product.Model.js";
const router = Router();

router.get('/', async (req, res) => {
    try {
        const {
            limit = 10, page = 1, sort = '', ...query
        } = req.query;
        const limitN = parseInt(limit);
        const pageN = parseInt(page);

        const sortManager = {
            'asc': 1,
            'desc': -1
        }
        const productos = await ProductModel.paginate({
            ...query
        }, {
            limit: limitN,
            page: pageN,
            ...(sort && {
                sort: {
                    price: sortManager[sort]
                }
            }),
            customLabels: {
                docs: 'Products'
            }
        })

        res.status(200).json({
            mensaje: 'Products finded',
            payload: productos
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const id = req.params.pid
        const producto = await ProductModel.findById(id)
        res.status(200).json({
            mensaje: 'Product finded',
            payload: producto
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

router.post('/', async (req, res) => {
    try {
        const newProduct = req.body
        await ProductModel.create(newProduct)
        console.log("se añadió")
        const productsList = await ProductModel.find()
        socketServer.emit('realtime', productsList)
        res.status(201).json({
            mensaje: 'Product Added succesfully.',
            payload: {
                newProduct
            }
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})


router.put('/:id', async (req, res) => {
    try {
        const id = req.params.pid
        const newProduct = req.body
        console.log(id + " info 2: " + newProduct)
        const updateProduct = await ProductModel.findByIdAndUpdate(id, {
            ...newProduct
        }, {
            new: true
        })
        const productsList = await ProductModel.find()
        socketServer.emit('realtime', productsList)
        res.status(200).json({
            mensaje: 'Product modified',
            payload: {
                updateProduct
            }
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.pid
        await ProductModel.findByIdAndDelete(id)
        const productsList = await ProductModel.find()
        socketServer.emit('realtime', productsList)
        res.status(200).json({
            "mensaje": `Product deleted`,
            payload: {
                id
            }
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

export default router;