// Récupération des données de l'API via Fetch
fetch('http://localhost:3000/api/products/')
.then(function(result) {
    if (result.ok) {
        return result.json();
    }
})
.then(function(apiResult) {
    if (localStorage.length == 0) {
        window.alert("Votre panier est vide. Vous allez être redirigé(e) vers l'accueil.");
        location.href="./index.html"
        return;
    }
    // Fonction permettant d'afficher les produits du panier via le localStorage
    Cart_DatasForDOM(apiResult);
    Cart_UserInformations();
})
.catch(function(error) {
    console.log('Error (fetch request): ' + error);
})


// Fonction permettant d'utiliser les données du localStorage et de l'API
function Cart_DatasForDOM(apiResult) {
    let products = JSON.parse(localStorage.getItem('kanap'));
    products.forEach(kanap => {
        // On récupère les données de l'API pour le kanap en question
        let apiIndex = apiResult.map(data => data._id).indexOf(kanap.id);

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

        // Actualisation du localStorage
        Cart_RefreshLocalStorage(kanap, kanapQuantity);

        // Actualisation de la quantité totale et du prix total
        Cart_DisplayTotalInDOM();
    })
}


// Fonction permettant de supprimer une ligne produit au "click"
function Cart_DeleteProduct(kanap, apiResult, apiIndex, pDelete, article) {
    let kanapQuantity = kanap.quantity;
    let orderPrice = apiResult[apiIndex].price * kanapQuantity;

    pDelete.addEventListener("click", function(args) {
        kanapQuantity = 0;
        orderPrice = 0;
        article.remove();
        
        // Actualisation du localStorage
        Cart_RefreshLocalStorage(kanap, kanapQuantity);

        // Actualisation de la quantité totale et du prix total
        Cart_DisplayTotalInDOM();
    })
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
    spanTotalQuantity.innerText = totalQuantity;
    // --------------------------------------------------

    // <span id="totalPrice"><!-- 84,00 --></span>
    const spanTotalPrice = document.getElementById('totalPrice');
    let totalPrice = 0;
    document.querySelectorAll('article').forEach(article => {
        let articlePrice = article.querySelector('.cart__item__content__description p ~ p').innerHTML;
        totalPrice += parseFloat(articlePrice);
    })
    spanTotalPrice.innerText = totalPrice;
    // --------------------------------------------------

    setTimeout(function() {
        if (localStorage.length == 0) {
        window.alert("Votre panier est vide. Vous allez être redirigé(e) vers l'accueil.");
        location.href="./index.html"
        }
    }, 500);
}


// Fonction permettant de gérer le localStorage
function Cart_RefreshLocalStorage(kanap, kanapQuantity) {
    let myStorage = [];
    let kanapId = kanap.id;

    // On stocke le contenu du localStorage dans myStorage
    let previousChoices = JSON.parse(localStorage.getItem("kanap"));
    previousChoices.forEach(element => {
        myStorage.push(element);
    })

    // On récupère l'index du kanap dans myStorage
    let storageKanapIndex = myStorage.findIndex(function (item) {
        return item.id === kanap.id;
    });

    // Si la quantité est > 0, on la modifie dans myStorage ; sinon, on enlève le kanap de myStorage
    if (kanapQuantity != 0) {
        myStorage[storageKanapIndex].quantity = kanapQuantity;
    } else {
        myStorage.splice(storageKanapIndex, 1);
    }

    // Si myStorage est vide, on clear le localStorage ; sinon on stocke myStorage dans le localStorage
    if (myStorage.length == 0) {
        localStorage.clear();
    } else {
        localStorage.setItem("kanap", JSON.stringify(myStorage));
    }
}


// TODO Récupérer les infos de l'utilisateur pour valider la commande
function Cart_UserInformations() {
    let userFirstName = document.getElementById('firstName');
    let userLastName = document.getElementById('lastName');
    let userAddress = document.getElementById('address');
    let userCity = document.getElementById('city');
    let userMail = document.getElementById('email');

    // Fonctions permettant de vérifier le format de la saisie de l'utilisateur
    Cart_RegExp(/^[a-zA-Zà-öÀ-Ö]+$/, userFirstName, 'firstNameErrorMsg', 'un prénom');
    Cart_RegExp(/^[a-zA-Zà-öÀ-Ö]+$/, userLastName, 'lastNameErrorMsg', 'un nom de famille');
    Cart_RegExp(/^[a-zA-Zà-öÀ-Ö0-9 '-]+$/, userAddress, 'addressErrorMsg', 'une adresse');
    Cart_RegExp(/^[a-zA-Zà-öÀ-Ö '-]+$/, userCity, 'cityErrorMsg', 'un nom de ville');
    Cart_RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, userMail, 'emailErrorMsg', 'une adresse e-mail');
    
    // Renvoyer un objet "contact" contenant "firstName", "lastName", "address", "city" et "email"
    let contact = {
        firstName: userFirstName.value,
        lastName: userLastName.value,
        address: userAddress.value,
        city: userCity.value,
        email: userMail.value
    }
    // console.log("contact : ", contact);

    // Renvoyer un tableau produits sous forme d'un array "orderId" constitué de strings product-ID

    // Requête POST : http://localhost:3000/api/products/order ?
}


// Fonction permettant de vérifier le format de la saisie dans un champ donné
function Cart_RegExp(regexp, element, divMsg, field) {
    let enableBtn = 0;

    element.addEventListener('keyup', function(args)  {
        console.log(args.target.value);
        if (regexp.test(args.target.value) == false) {
            document.getElementById(divMsg).innerText = `Veuillez saisir ${field} valide.`;
            document.getElementById('order').disabled = true;
            document.getElementById('order').classList.add('order--invalid');
        } else {
            document.getElementById(divMsg).innerText = '';
            document.getElementById('order').disabled = false;
            document.getElementById('order').classList.remove('order--invalid');
        };
    });
}

// TODO Gestion des cas d'erreur : pas de couleur, quantité à 0