// Récupération des données de l'API via Fetch
fetch('http://localhost:3000/api/products/')
.then(function(result) {
    if (result.ok) {
        return result.json();
    }
}).then(function(apiResult) {
    if (localStorage.length == 0) {
        window.alert("Votre panier est vide. Vous allez être redirigé(e) vers l'accueil.");
        location.href = "./index.html";
        return;
    }
    // On affiche les produits du panier via le localStorage
    Cart_DatasForDOM(apiResult);

    // On récupère les données saisies dans le formulaire de commande
    Cart_UserInformations();

    // Bouton de commande désactivé à l'initialisation de la page
    document.getElementById('order').disabled = true;
    document.getElementById('order').classList.add('order--invalid');
}).catch(function(error) {
    console.log('Error (fetch request GET): ' + error);
})

////////////////////////////////////////////////////////////////////////////////////////////////////
// FONCTIONS LIEES A L'AFFICHAGE DES LIGNES PRODUIT ////////////////////////////////////////////////

// Fonction permettant d'utiliser les données du localStorage et de l'API
function Cart_DatasForDOM(apiResult) {
    let products = JSON.parse(localStorage.getItem('kanap'));
    products.forEach(kanap => {
        // On récupère les données de l'API pour le kanap en question
        let apiIndex = apiResult.map(data => data._id).indexOf(kanap.id);

        Cart_DisplayProductsInDOM(kanap, apiResult, apiIndex);

        // Affichage de la quantité totale et du prix total du panier
        Cart_DisplayTotalInDOM(apiResult);
    });    
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
        value: kanap.quantity,
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
    Cart_RefreshPrice(kanap, apiResult, apiIndex, inputQuantity, p2Description, article);
    Cart_DeleteProduct(kanap, apiResult, apiIndex, pDelete, article);
}

// Fonction permettant d'actualiser le prix de la ligne produit au "onchange"
function Cart_RefreshPrice(kanap, apiResult, apiIndex, inputQuantity, p2Description, article) {
    let kanapQuantity = kanap.quantity;
    let orderPrice = apiResult[apiIndex].price * kanapQuantity;

    inputQuantity.addEventListener('change', function(args) {
        if (inputQuantity.value <= 0) {
            inputQuantity.value = null;
            document.getElementById('cart__items').removeChild(article);
        }
        if (inputQuantity.value > 100) {
            inputQuantity.value = 100;
        }
        kanapQuantity = args.target.value;
        orderPrice = apiResult[apiIndex].price * kanapQuantity;
        p2Description.innerText = (orderPrice) + '€';

        // Actualisation du localStorage
        Cart_RefreshLocalStorage(kanap, kanapQuantity);

        // Actualisation de la quantité totale et du prix total
        Cart_DisplayTotalInDOM(apiResult);        
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
        Cart_DisplayTotalInDOM(apiResult);
    })
}

// Fonction permettant d'afficher le prix total et la quantité totale du panier
function Cart_DisplayTotalInDOM(apiResult) {
    if (localStorage.length === 0) {
        return;
    }

    // <span id="totalQuantity"><!-- 2 --></span>
    const spanTotalQuantity = document.getElementById('totalQuantity');
    let totalQuantity = 0;
    document.querySelectorAll('.itemQuantity').forEach(input => {
        totalQuantity += parseInt(input.value);
    })
    spanTotalQuantity.innerText = totalQuantity;
    // --------------------------------------------------

    // <span id="totalPrice"><!-- 84,00 --></span>
    const spanTotalPrice = document.getElementById('totalPrice');
    let totalPrice = 0;
    let myStorage = JSON.parse(localStorage.getItem("kanap"));

    myStorage.forEach(kanap => {
        let apiIndex = apiResult.map(a => a._id).indexOf(kanap.id);
        totalPrice += apiResult[apiIndex].price * parseFloat(kanap.quantity);
    })
    
    spanTotalPrice.innerText = totalPrice;
    // --------------------------------------------------
}

// Fonction permettant de gérer le localStorage
function Cart_RefreshLocalStorage(kanap, kanapQuantity) {
    let myStorage = [];

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
    if (myStorage.length === 0) {
        localStorage.clear();
    } else {
        localStorage.setItem("kanap", JSON.stringify(myStorage));
    }

    if (localStorage.length === 0) {
        setTimeout(function() {
            window.alert("Votre panier est vide. Vous allez être redirigé(e) vers la page d'accueil.");
            location.href = "./index.html";
        }, 500);
    };
}



////////////////////////////////////////////////////////////////////////////////////////////////////
// FONCTIONS LIEES AU FORMULAIRE DE COMMANDE ///////////////////////////////////////////////////////

// Récupérer les infos de l'utilisateur pour valider la commande
function Cart_UserInformations() {
    const userFirstName = document.getElementById('firstName');
    const userLastName = document.getElementById('lastName');
    const userAddress = document.getElementById('address');
    const userCity = document.getElementById('city');
    const userMail = document.getElementById('email');

    // Fonctions permettant de vérifier le format de la saisie de l'utilisateur    
    Cart_RegExp(/^([A-Za-zà-öÀ-Ö-]{3,}|[\s]{1}[A-Za-zà-öÀ-Ö-]{1,})*$/, userFirstName, 'firstNameErrorMsg', 'un prénom', '(3-60 caractères)');
    Cart_RegExp(/^([A-Za-zà-öÀ-Ö-']{2,}|[\s]{1}[A-Za-zà-öÀ-Ö-']{1,})*$/, userLastName, 'lastNameErrorMsg', 'un nom de famille', '(2-100 caractères)');
    Cart_RegExp(/^[a-zA-Zà-öÀ-Ö0-9 '-]{5,150}$/, userAddress, 'addressErrorMsg', 'une adresse', '(5-150 caractères)');
    Cart_RegExp(/^([A-Za-zà-öÀ-Ö-']{2,}|[\s]{1}[A-Za-zà-öÀ-Ö-']{1,})*$/, userCity, 'cityErrorMsg', 'un nom de ville', '(2-100 caractères)');
    Cart_RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, userMail, 'emailErrorMsg', 'une adresse e-mail', '');

    // Au clic du bouton "Commander", on exécute la requête POST
    document.getElementById('order').addEventListener('click', function(event) {
        event.preventDefault();

        // On complète les paramètres pour effectuer la requête POST
        let contact = {
            firstName: userFirstName.value,
            lastName: userLastName.value,
            address: userAddress.value,
            city: userCity.value,
            email: userMail.value
        }

        let myStorage = JSON.parse(localStorage.getItem("kanap"));
        let productsId = [];
        myStorage.forEach(kanap => {
            productsId.push(kanap.id);
        })

        let paramsRequest = {
            contact: contact,
            products: productsId
        }

        let resultControl = Cart_EnableOrderBtn();
        if (resultControl === true) {
            Cart_FetchRequestPOST(paramsRequest);
        }
    })
}

// Fonction permettant de vérifier le format de la saisie dans un champ donné
function Cart_RegExp(regexp, element, divMsg, field, condition) {
    element.addEventListener('keyup', function(args)  {
        if (regexp.test(args.target.value) == false) {
            document.getElementById(divMsg).innerText = `Veuillez saisir ${field} valide. ${condition}`;
        } else {
            document.getElementById(divMsg).innerText = '';
        };

        Cart_EnableOrderBtn();
    });
}

// Fonction permettant d'activer le bouton de commande si les champs sont valides
function Cart_EnableOrderBtn() {
    if (document.getElementById('firstName').value !== '' && document.getElementById('firstNameErrorMsg').textContent === '' &&
        document.getElementById('lastName').value !== '' && document.getElementById('lastNameErrorMsg').textContent === '' &&
        document.getElementById('address').value !== '' && document.getElementById('addressErrorMsg').textContent === '' &&
        document.getElementById('city').value !== '' && document.getElementById('cityErrorMsg').textContent === '' &&
        document.getElementById('email').value !== '' && document.getElementById('emailErrorMsg').textContent === '') {
            document.getElementById('order').disabled = false;
            document.getElementById('order').classList.remove('order--invalid');
            return true;
    } else {
        document.getElementById('order').disabled = true;
        document.getElementById('order').classList.add('order--invalid');
        return false;
    }
}

// Requête POST permettant de soumettre les données de commandes et obtenir un numéro de commande
function Cart_FetchRequestPOST(paramsRequest) {
    fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(paramsRequest),
    }).then(function(result) {
        if (result.ok) {
            return result.json();
        }
    }).then(function(postResult) {
        const orderId = postResult.orderId;
        location.href = window.location.href.split('/cart.html')[0] + `/confirmation.html?orderId=${orderId}`;
    }).catch(function(error) {
        console.log('Error (fetch request POST): ' + error);
    })
}