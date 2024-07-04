import fs from "node:fs";
class CartManager {
    constructor(path) {
        this.path = path;
        this.cartList = [];
    }

    async getCartList() {
        try {
            const list = await fs.promises.readFile(this.path, "utf-8");
            this.cartList = [...JSON.parse(list).data];
            return [...this.cartList];
        } catch (error) {
            if (error.code === "ENOENT") {
                // El archivo no existe, así que lo creamos con una lista vacía
                await fs.promises.writeFile(
                    this.path,
                    JSON.stringify({
                        data: [],
                    })
                );
                this.cartList = [];
            } else {
                // Otro error ocurrió, lo lanzamos
                throw error;
            }
        }
    }

    async getCartByID(id) {
        await this.getCartList();
        return this.cartList.find((p) => p.id == id);
    }

    async addCart() {
        await this.getCartList();

        const maxId =
            this.cartList.length > 0 ?
            Math.max(...this.cartList.map((p) => p.id)) :
            0;

        const carrito = {
            id: maxId + 1,
            products: []
        };

        this.cartList.push(carrito);
        await fs.promises.writeFile(
            this.path,
            JSON.stringify({
                data: this.cartList,
            })
        );
    }

    async addProductOnCart(cid, pid, productList) {
        await this.getCartList();
        const carrito = this.cartList.find(c => c.id == cid);
        if (!carrito)
            throw new Error('No se encontró el carrito con id: ' + cid);

        const producto = productList.find(p => p.id == pid);
        if (!producto)
            throw new Error('No se encontró el producto con id: ' + pid);

        const productIndex = carrito.products.findIndex(p => p.pid == pid);
        if (productIndex > -1) {
            carrito.products[productIndex].quantity += 1;
        } else {
            carrito.products.push({
                pid: pid,
                quantity: 1
            });
        }

        const cIndex = this.cartList.findIndex(c => c.id == cid);
        this.cartList[cIndex] = carrito;

        await fs.promises.writeFile(this.path, JSON.stringify({
            data: this.cartList
        }));
    }

    validar(cartFields) {
        const {
            id,
            products
        } = cartFields;

        if (!products || typeof products == null)
            throw new Error("Necesita ingresar un producto");

        const cart = {
            id,
            products,
        };
        return cart;
    }
}

export default CartManager;