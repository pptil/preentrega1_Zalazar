const socket = io()

const contenedorProductos = document.querySelector('.products-container')

socket.on('home', (data) => {
    contenedorProductos.innerHTML = '';
    data.forEach(product => {
        const div = document.createElement('div');
        div.classList.add('col-lg-4', 'col-md-6', 'mb-4');

        const card = document.createElement('div');
        card.classList.add('card', 'h-100');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.innerText = product.title;

        const description = document.createElement('p');
        description.classList.add('card-text');
        description.innerText = product.description;

        const price = document.createElement('p');
        price.classList.add('card-text', 'text-primary', 'font-weight-bold');
        price.innerText = '$' + product.price;

        cardBody.appendChild(title);
        cardBody.appendChild(description);
        cardBody.appendChild(price);

        card.appendChild(cardBody);
        div.appendChild(card);

        contenedorProductos.appendChild(div);
    });
});