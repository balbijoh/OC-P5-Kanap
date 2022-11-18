// Récupération des données de l'API via Fetch
fetch('http://localhost:3000/api/products/')
.then(function(result) {
    if (result.ok) {
        return result.json();
    }    
})
.then(function(apiResult) {
    // Fonction permettant d'afficher les produits du panier via le localStorage
    Cart_DatasForDOM(apiResult);
})
.catch(function(error) {
    console.log('Error (fetch request): ' + error);
})


// Fonction permettant d'utiliser les données du localStorage et de l'API
function Cart_DatasForDOM(apiResult) {
    console.log('apiResult : ', apiResult);

    let products = JSON.parse(localStorage.getItem('kanap'));
    products.forEach(kanap => {
        console.log("kanap : ", kanap);
        // On récupère les données de l'API pour le kanap en question
        let apiIndex = apiResult.map(data => data._id).indexOf(kanap.id);
        console.log('resultat api : ', apiResult[apiIndex]);

        Cart_DisplayProductsInDOM(kanap, apiResult, apiIndex);        
    });
}

// Fonction permettant de créer les éléments du DOM
function Cart_DisplayProductsInDOM(kanap, apiResult, apiIndex) {
    // <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
    const article = document.createElement('article');
    article.setAttribute('class', 'cart__item');
    article.setAttribute('data-id', kanap.id,);
    article.setAttribute('data-color', kanap.color);
    // --------------------------------------------------

    // <div class="cart__item__img">
    const divImg = document.createElement('div');
    divImg.setAttribute('class', 'cart__item__img');

    const productImg = document.createElement('img');
    productImg.setAttribute('src', apiResult[apiIndex].imageUrl);
    productImg.setAttribute('alt', apiResult[apiIndex].altTxt);
    // --------------------------------------------------
    
    // <div class="cart__item__content">
    const divCart = document.createElement('div');
    divCart.setAttribute('class', 'cart__item__content');
    // --------------------------------------------------

    // <div class="cart__item__content__description">
    const divDescription = document.createElement('div');
    divDescription.setAttribute('class', 'cart__item__content__description');

    const h2Description = document.createElement('h2');
    h2Description.innerText = apiResult[apiIndex].name;

    const p1Description = document.createElement('p');
    p1Description.innerText = kanap.color;

    const p2Description = document.createElement('p');
    p2Description.innerText = (apiResult[apiIndex].price * kanap.quantity) + '€';
    // --------------------------------------------------

    // <div class="cart__item__content__settings">
    const divSettings = document.createElement('div');
    divSettings.setAttribute('class', 'cart__item__content__settings');
    // --------------------------------------------------

    // <div class="cart__item__content__settings__quantity">
    const divSettingsQuantity = document.createElement('div');
    divSettingsQuantity.setAttribute('class', 'cart__item__content__settings__quantity');

    const inputQuantity = document.createElement('input');
    Object.assign(inputQuantity, {
        type: 'number',
        className: 'itemQuantity',
        name: 'itemQuantity',
        min: '1',
        max: '100',
        value: kanap.quantity
    });

    const pQuantity = document.createElement('p');
    pQuantity.innerText = 'Qté : ';
    // --------------------------------------------------

    // <div class="cart__item__content__settings__delete">
    const divSettingsDelete = document.createElement('div');
    divSettingsDelete.setAttribute('class', 'cart__item__content__settings__delete');

    const pDelete = document.createElement('p');
    pDelete.setAttribute('class', 'deleteItem');
    pDelete.innerText = 'Supprimer';
    // --------------------------------------------------

    divImg.appendChild(productImg);
    divDescription.append(h2Description, p1Description, p2Description);
    divCart.appendChild(divDescription);
    divSettingsQuantity.append(pQuantity, inputQuantity);
    divSettingsDelete.appendChild(pDelete);
    divSettings.append(divSettingsQuantity, divSettingsDelete);
    divCart.appendChild(divSettings);
    article.append(divImg, divCart);
    document.getElementById('cart__items').appendChild(article);
}

// TODO Actualiser le prix du canapé au "onchange" de la quantité

// TODO Supprimer un kanap

// TODO Actualiser le prix total aux changements de quantité et/ou à la suppression

// TODO Rediriger vers la page d'accueil si panier vide