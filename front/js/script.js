// Récupération des données de l'API via requête Fetch
fetch('http://localhost:3000/api/products')
.then(function(result) {
    if (result.ok) {
        // console.log(result);
        return result.json();
    }    
})
.then(function(apiResult) {
    console.log(apiResult);
    // On complète les cards de la page d'accueil
    Homepage_CreateCards(apiResult);
})
.catch(function(error) {
    console.log('Error (fetch request): ' + error);
})


// Fonction permettant de remplir les cards de la page d'accueil avec les informations du catalogue
function Homepage_CreateCards(apiResult) {
    // On crée une card pour chaque produit de la liste provenant de l'API
    apiResult.forEach(kanap => {
        console.log(kanap.name);
        const kanapItems = document.getElementById('items');

        // On créé les différentes balises pour chaque card : a, article, image, titre, description
        let cardLink = document.createElement('a');
        cardLink.setAttribute('href', window.location.href.replace('/index.html', `/product.html?id=${kanap._id}`));

        let kanapCard = document.createElement('article');

        let kanapImg = document.createElement('img');
        kanapImg.setAttribute('src', kanap.imageUrl);
        kanapImg.setAttribute('alt', kanap.altTxt);
        kanapCard.appendChild(kanapImg);

        let kanapTitle = document.createElement('h3');
        kanapTitle.textContent = kanap.name;
        kanapTitle.setAttribute('class', 'productName');
        kanapCard.appendChild(kanapTitle);

        let kanapDescription = document.createElement('p');
        kanapDescription.textContent = kanap.description;
        kanapDescription.setAttribute('class', 'productDescription');
        kanapCard.appendChild(kanapDescription);

        cardLink.appendChild(kanapCard);
        console.log(cardLink);

        // On ajoute chaque card à la section dédiée
        kanapItems.appendChild(cardLink);
    });
}