const socket = io()

const productContainerRealTime = document.querySelector('.rtp-container');

socket.on('realtime', (data) => {
    productContainerRealTime.innerHTML = '';
    data.forEach(product => {
        const div = document.createElement('div');
        div.classList.add(`${product._id}`, 'cart', 'col-md-4', 'mb-4');

        const card = document.createElement('div');
        card.classList.add('card', 'h-100');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const id = document.createElement('h5');
        id.classList.add('card-title');
        id.innerText = `ID: ${product._id}`;

        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.innerText = product.title;

        const description = document.createElement('p');
        description.classList.add('card-text');
        description.innerText = product.description;

        const price = document.createElement('p');
        price.classList.add('card-text');
        price.innerHTML = `<strong>Precio:</strong> $${product.price}`;

        const code = document.createElement('p');
        code.classList.add('card-text');
        code.innerHTML = `<strong>Código:</strong> ${product.code}`;

        const stock = document.createElement('p');
        stock.classList.add('card-text');
        stock.innerHTML = `<strong>Stock:</strong> ${product.stock}`;

        const category = document.createElement('p');
        category.classList.add('card-text');
        category.innerHTML = `<strong>Categoría:</strong> ${product.category}`;

        cardBody.appendChild(id);
        cardBody.appendChild(title);
        cardBody.appendChild(description);
        cardBody.appendChild(price);
        cardBody.appendChild(code);
        cardBody.appendChild(stock);
        cardBody.appendChild(category);
        card.appendChild(cardBody);
        div.appendChild(card);
        productContainerRealTime.appendChild(div);
    });
});

const addProduct = () => {

    const title = document.querySelector('#add-title').value
    const description = document.querySelector('#add-description').value
    const price = document.querySelector('#add-price').value
    const code = document.querySelector('#add-code').value
    const stock = document.querySelector('#add-stock').value
    const category = document.querySelector('#add-category').value

    const productData = {
        title,
        description,
        price,
        code,
        stock,
        category
    }

    console.log('product: ' + productData)
    socket.emit("nuevo-producto", productData)

    document.querySelector('#add-title').value = ""
    document.querySelector('#add-description').value = ""
    document.querySelector('#add-price').value = ""
    document.querySelector('#add-code').value = ""
    document.querySelector('#add-stock').value = ""
    document.querySelector('#add-category').value = ""
}
const updateProduct = () => {
    const id = document.querySelector('#update-id').value
    const title = document.querySelector('#update-title').value
    const description = document.querySelector('#update-description').value
    const price = document.querySelector('#update-price').value
    const code = document.querySelector('#update-code').value
    const stock = document.querySelector('#update-stock').value
    const category = document.querySelector('#update-category').value

    const productData = {
        title,
        description,
        price,
        code,
        stock,
        category
    }

    console.log(productData)

    socket.emit("modificar-producto", {
        productData,
        id
    })

    document.querySelector('#update-id').value = ""
    document.querySelector('#update-title').value = ""
    document.querySelector('#update-description').value = ""
    document.querySelector('#update-price').value = ""
    document.querySelector('#update-code').value = ""
    document.querySelector('#update-stock').value = ""
    document.querySelector('#update-category').value = ""
}
const deleteProduct = () => {
    const id = document.querySelector('#delete-id').value
    socket.emit("eliminar-producto", id)
    document.querySelector('#delete-id').value = ""
}