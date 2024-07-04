import fs from 'node:fs'
class CartManager{
    constructor(path){
        this.path = path;
        this.cartList=[];
    }

    async getCartList(){
        const list = await fs.promises.readFile(this.path, 'utf-8')
        this.cartList = [...JSON.parse(list).data]
        return [...this.cartList]
    }

    async getCartByID(id){
        await this.getCartList();
        return this.cartList.find(p=>p.id==id)
    }

    async addCart(cart){
        await this.getCartList();
        const maxId = this.productList.length > 0 
        ? Math.max(...this.productList.map(p => p.id)) 
        : 0;  
    
        cart.id = maxId + 1; 

        if(validar)
            this.cartList.push(cart)
        await fs.promises.writeFile(this.path, JSON.stringify({data:this.cartList}))
    }


    async addProductOnCart(cid,pid){
        //recuperar el archivo y guardar en this.cartlist. 
        // this.carts.map(cart=>{
        //     if(cart.id=/=cid) return cart
        // })
    }

    validar(cartFields) {
        const { id, products } = cartFields;

        if (!products || typeof products == null) throw new Error('Necesita ingresar un producto');
    
        const cart = {
            id,
            products
        };
        return cart;
    }
}

export default CartManager