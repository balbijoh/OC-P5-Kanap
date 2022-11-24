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
    // console.log('apiResult : ', apiResult);
    let products = JSON.parse(localStorage.getItem('kanap'));
    products.forEach(kanap => {
        // console.log("kanap : ", kanap);
        // On récupère les données de l'API pour le kanap en question
        let apiIndex = apiResult.map(data => data._id).indexOf(kanap.id);
        // console.log('resultat api : ', apiResult[apiIndex]);

        Cart_DisplayProductsInDOM(kanap, apiResult, apiIndex);        
    });

    // Affichage de la quantité totale et du prix total du panier
    Cart_DisplayTotalInDOM();
}

// Fonction permettant de créer les éléments du DOM pour chaque ligne produit
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

    // Fonctions permettant de mettre à jour les données du panier (modification, suppression de ligne produit)
    Cart_RefreshPrice(kanap, apiResult, apiIndex, inputQuantity, p2Description);
    Cart_DeleteProduct(kanap, apiResult, apiIndex, pDelete, article);
}

// Fonction permettant d'actualiser le prix de la ligne produit au "onchange"
function Cart_RefreshPrice(kanap, apiResult, apiIndex, inputQuantity, p2Description) {
    let kanapQuantity = kanap.quantity;
    let orderPrice = apiResult[apiIndex].price * kanapQuantity;

    inputQuantity.addEventListener("change", function(args) {
        kanapQuantity = args.target.value;
        orderPrice = apiResult[apiIndex].price * kanapQuantity;
        p2Description.innerText = (orderPrice) + '€';

        // Actualisation de la quantité totale et du prix total
        Cart_DisplayTotalInDOM();
    })

    // TODO Mettre à jour le localStorage
}

// Fonction permettant de supprimer une ligne produit au "click"
function Cart_DeleteProduct(kanap, apiResult, apiIndex, pDelete, article) {
    let kanapQuantity = kanap.quantity;
    let orderPrice = apiResult[apiIndex].price * kanapQuantity;

    pDelete.addEventListener("click", function(args) {
        console.log("Delete !");
        kanapQuantity = 0;
        orderPrice = 0;
        article.remove();

        // Actualisation de la quantité totale et du prix total
        Cart_DisplayTotalInDOM();
    })

    // TODO Mettre à jour le localStorage
}

// Fonction permettant d'afficher le prix total et la quantité totale du panier
function Cart_DisplayTotalInDOM() {
    // <span id="totalQuantity"><!-- 2 --></span>
    const spanTotalQuantity = document.getElementById('totalQuantity');
    let totalQuantity = 0;
    document.querySelectorAll('.itemQuantity').forEach(input => {
        let articleQuantity = input.value;
        totalQuantity += parseInt(articleQuantity);
    })
    // console.log("totalQuantity : ", totalQuantity);
    spanTotalQuantity.innerText = totalQuantity;
    // --------------------------------------------------

    // <span id="totalPrice"><!-- 84,00 --></span>
    const spanTotalPrice = document.getElementById('totalPrice');
    let totalPrice = 0;
    document.querySelectorAll('article').forEach(article => {
        let articlePrice = article.querySelector('.cart__item__content__description p ~ p').innerHTML;
        totalPrice += parseFloat(articlePrice);
    })
    // console.log(totalPrice);
    spanTotalPrice.innerText = totalPrice;
    // --------------------------------------------------
}

// TODO Rediriger vers la page d'accueil si panier vide
function Cart_Redirect() {
    // Si localStorage vide, alors on redirige vers l'accueil
}

// TODO Récupérer les infos de l'utilisateur pour valider la commande

// Fonction permettant de gérer le localStorage
function Cart_RefreshLocalStorage() {
    let myStorage = [];

    // Si le localStorage n'est pas vide
    if(localStorage.length != 0) {
        console.log("localStorage non vide");

        // On stocke le contenu du localStorage dans myStorage
        let previousChoices = JSON.parse(localStorage.getItem("kanap"));
        previousChoices.forEach(element => {
            myStorage.push(element);
        })

    } else {
        // localStorage vide -> rediriger vers l'accueil
    }

    // On stocke le tableau myStorage dans le localStorage
    localStorage.setItem("kanap", JSON.stringify(myStorage));
    console.log(localStorage);
}