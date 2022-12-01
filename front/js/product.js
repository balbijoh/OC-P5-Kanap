// Récupération de l'ID du canapé figurant sur la page produit
let currentUrl = window.location.href;
let url = new URL(currentUrl);
let kanapId = url.searchParams.get('id');


// Récupération des données de l'API via Fetch
fetch('http://localhost:3000/api/products/' + kanapId)
.then(function(result) {
    if (result.ok) {
        return result.json();
    } else {
        window.alert("La page demandée n'existe pas ou n'existe plus. Vous allez être redirigé(e) vers l'accueil.");
        location.href = "./index.html";
        return;
    }
})
.then(function(apiResult) {
    Product_AddDatas(apiResult);
})
.catch(function(error) {
    console.log('Error (fetch request): ' + error);
})


// Fonction qui injecte les données du produit dans les balises dédiées
function Product_AddDatas(apiResult) {
    // On complète le <title> de la page
    document.querySelector('title').textContent = apiResult.name;

    // On complète la description du produit
    let kanapImg = document.createElement('img');
    kanapImg.setAttribute('src', apiResult.imageUrl);
    kanapImg.setAttribute('alt', apiResult.altTxt);
    document.querySelector('.item__img').appendChild(kanapImg);

    document.getElementById('title').textContent = apiResult.name;
    document.getElementById('price').textContent = apiResult.price;
    document.getElementById('description').textContent = apiResult.description;

    // On injecte les différents choix de couleurs dans la liste déroulante
    apiResult.colors.forEach(color => {
        let colorOption = document.createElement('option');
        colorOption.setAttribute('value', color);
        colorOption.textContent = color;
        document.getElementById('colors').appendChild(colorOption);
    })
}


// Fonction qui récupère les informations saisies par l'utilisateur (couleur, quantité) via le LocalStorage
function Product_SubmitChoice() {
    let myStorage = [];

    // Créer un objet contenant le nouveau choix de l'utilisateur
    let newKanap = {
        id: kanapId,
        color: document.getElementById('colors').value, 
        quantity: Number(document.getElementById('quantity').value)
    };

    // Si le localStorage n'est pas vide
    if(localStorage.length != 0) {
        // On stocke le contenu du localStorage dans myStorage
        let previousChoices = JSON.parse(localStorage.getItem("kanap"));
        previousChoices.forEach(element => {
            myStorage.push(element);
        })

        // On cherche si l'id existe déjà dans le storage
        let kanapIndex = myStorage.map(a => a.id).indexOf(newKanap.id);

        // Si l'id existe et que la couleur est la même, on incrémente la liste de la valeur souhaitée
        if (myStorage[kanapIndex] && myStorage[kanapIndex].color == newKanap.color) {
            myStorage[kanapIndex].quantity = Number(myStorage[kanapIndex].quantity) + Number(newKanap.quantity);
        } else {
            // Si l'id n'existe pas et/ou que la couleur n'est pas la même, on ajoute une nouvelle ligne dans le storage
            myStorage.push(newKanap);
        }
    } else {
        myStorage.push(newKanap);
    }

    // On stocke le tableau myStorage dans le localStorage
    localStorage.setItem("kanap", JSON.stringify(myStorage));
}


// Fonction permettant de vérifier les champs couleur/quantité avant l'ajout au panier
function Product_CheckInputsValues() {
    let addBtn = document.getElementById('addToCart');
    addBtn.disabled = true;
    addBtn.classList.add('add-btn--invalid');

    let colorField = document.getElementById('colors');
    let colorSelect = document.querySelector('.item__content__settings__color select');
    let quantityField = document.getElementById('quantity');
    let quantityInput = document.querySelector('.item__content__settings__quantity input');

    colorField.addEventListener('change', function(event) {
        if (colorField.value == '' || colorField.value == null) {
            colorSelect.classList.add('input--invalid');
            addBtn.disabled = true;
            addBtn.classList.add('add-btn--invalid');
        } else if (colorField.value != '' && quantityField.value <= 0 || quantityField.value > 100) {
            quantityInput.classList.add('input--invalid');
            colorSelect.classList.remove('input--invalid');
            addBtn.disabled = true;
            addBtn.classList.add('add-btn--invalid');
        } else {
            colorSelect.classList.remove('input--invalid');
            quantityInput.classList.remove('input--invalid');
            addBtn.disabled = false;
            addBtn.classList.remove('add-btn--invalid');
        }
    });

    quantityField.addEventListener('change', function(event) {
        if (quantityField.value <= 0 || quantityField.value > 100 || quantityField.value == null) {
            quantityInput.classList.add('input--invalid');
            addBtn.disabled = true;
            addBtn.classList.add('add-btn--invalid');
        } else if (quantityField.value > 0 && colorField.value == '') {
            colorSelect.classList.add('input--invalid');
            quantityInput.classList.remove('input--invalid');
            addBtn.disabled = true;
            addBtn.classList.add('add-btn--invalid');
        } else {
            colorSelect.classList.remove('input--invalid');
            quantityInput.classList.remove('input--invalid');
            addBtn.disabled = false;
            addBtn.classList.remove('add-btn--invalid');
        }
    });
}

Product_CheckInputsValues();

// On écoute l'événement au clic sur le bouton "Ajouter au panier"
document.getElementById('addToCart').addEventListener('click', function(event) {
    Product_SubmitChoice();
    Product_ToastAddToCart();
})


// Toast pour indiquer que le produit a bien été ajouté au panier
function Product_ToastAddToCart() {
    let toastDiv = document.createElement('div');
    toastDiv.classList.add('toast');
    let toastText = document.createElement('p');
    toastText.classList.add('toast-text');
    toastText.innerText = 'Produit ajouté au panier';
    let toastCloseBtn = document.createElement('button');
    toastCloseBtn.classList.add('toast-button');
    toastCloseBtn.innerText = 'X';

    toastDiv.append(toastText, toastCloseBtn);
    document.querySelector('.limitedWidthBlock').appendChild(toastDiv);

    toastDiv.addEventListener('click', function(event) {
        document.querySelector('.limitedWidthBlock').removeChild(toastDiv);
    })
}