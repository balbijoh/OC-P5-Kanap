// Récupération de l'ID du canapé figurant sur la page produit
let currentUrl = window.location.href;
let url = new URL(currentUrl);
let kanapId = url.searchParams.get('id');


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