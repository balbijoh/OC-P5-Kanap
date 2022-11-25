// Récupération de l'ID du canapé figurant sur la page produit
let currentUrl = window.location.href;
let url = new URL(currentUrl);
let kanapId = url.searchParams.get('id');

// TODO Gérer les cas d'erreur : redirection si page non existante, si le canapé n'existe pas

// Récupération des données de l'API via Fetch
fetch('http://localhost:3000/api/products/' + kanapId)
.then(function(result) {
    if (result.ok) {
        return result.json();
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


// On écoute l'événement au clic sur le bouton "Ajouter au panier"
document.getElementById('addToCart').addEventListener('click', function() {
    Product_SubmitChoice();
})


// On récupère les informations saisies par l'utilisateur (couleur, quantité) via le LocalStorage
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


// TODO Gérer cas d'erreur : bouton disabled si champs non renseignés