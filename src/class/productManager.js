import fs from 'node:fs'
class ProductManager{
    constructor(path){
        this.path = path;
        this.productList = [];
    }
    
    async getProductList(){
        try {
            const list = await fs.promises.readFile(this.path, 'utf-8')
        this.productList = [...JSON.parse(list).data]
        return [...this.productList]
        } catch (error) {
            if (error.code === 'ENOENT') {
                // El archivo no existe, así que lo creamos con una lista vacía
                await fs.promises.writeFile(this.path, JSON.stringify({data: []}));
                this.productList = [];
            } else {
                // Otro error ocurrió, lo lanzamos
                throw error;
            }
        }


        
    }

    async getProductByID(id){
        await this.getProductList();
        console.log(this.productList)
        return this.productList.find(p=>p.id==id)
        
    }

    async addProduct(product) {
        await this.getProductList();
        
        const maxId = this.productList.length > 0 
            ? Math.max(...this.productList.map(p => p.id)) 
            : 0;  
        
        product.id = maxId + 1;  
        
        const valido = this.validar(product);
        const code = product.code;
        const index = this.productList.findIndex(p => p.code === code);
        
        if (index !==-1) 
        throw new Error(`El producto con el código ${id} ya se encuentra en la lista`);

        if (valido) {
            const productoValidado= {
                id: product.id,  
                ...product
            };
        
            this.productList.push(productoValidado);
            await fs.promises.writeFile(this.path, JSON.stringify({ data: this.productList }));
        }       
    }

    async updateProduct(updatedProduct, id) {
        await this.getProductList();
        const index = this.productList.findIndex(p=> p.id == id);
        if (index === -1) 
            throw new Error(`No se encontró el producto con el id: ${id} `);


            updatedProduct.id = id;
            if (this.validar(updatedProduct)) {
                const productoValidado= {
                    id: updatedProduct.id,  
                    ...updatedProduct
                };
                this.productList[index] = productoValidado;

                
                await fs.promises.writeFile(this.path, JSON.stringify({ data: this.productList }));
            }
    }

    async deleteProductByID(id) {
        await this.getProductList();
        const index = this.productList.findIndex(p => p.id == id);
        if (index === -1) 
            throw new Error(`No se encontró el producto con el id: ${id} `);
        
        this.productList.splice(index, 1);
        await fs.promises.writeFile(this.path, JSON.stringify({data:this.productList}));
    }

    validar(productFields) {

        const { id, title, description, code, price, status = true, stock, category, thumbnails = [] } = productFields;

        if (!title || typeof title !== 'string') throw new Error('Nombre de producto requerido');
        if (!description || typeof description !== 'string') throw new Error('Descripción requerida');
        if (!code || typeof code !== 'string') throw new Error('Código de producto requerido');
        if (typeof price !== 'number') throw new Error('El precio es requerido y debe ser numérico');
        if (typeof stock !== 'number') throw new Error('Stock es requerido y debe ser un numérico');
        if (!category || typeof category !== 'string') throw new Error('Categoria requerida');
    
        const product = {
            id,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        };
        return product;
    }
}

export default ProductManager