// Récupération des données de l'API via Fetch
fetch('http://localhost:3000/api/products')
.then(function(result) {
    if (result.ok) {
        return result.json();
    }    
})
.then(function(apiResult) {
    // On crée les cartes produits de la page d'accueil
    Homepage_CreateCards(apiResult);
})
.catch(function(error) {
    console.log('Error (fetch request): ' + error);
})


// Fonction permettant de remplir les cards de la page d'accueil avec les informations du catalogue
function Homepage_CreateCards(apiResult) {
    // On crée une card pour chaque produit de la liste provenant de l'API
    apiResult.forEach(kanap => {
        const kanapItems = document.getElementById('items');

        // On créé les différentes balises pour chaque card : a, article, image, titre, description
        const cardLink = document.createElement('a');
        cardLink.setAttribute('href', window.location.href.replace('/index.html', `/product.html?id=${kanap._id}`));

        const kanapCard = document.createElement('article');

        const kanapImg = document.createElement('img');
        kanapImg.setAttribute('src', kanap.imageUrl);
        kanapImg.setAttribute('alt', kanap.altTxt);

        const kanapTitle = document.createElement('h3');
        kanapTitle.textContent = kanap.name;
        kanapTitle.setAttribute('class', 'productName');

        const kanapDescription = document.createElement('p');
        kanapDescription.textContent = kanap.description;
        kanapDescription.setAttribute('class', 'productDescription');

        // On injecte les balises créées dans le DOM
        kanapCard.append(kanapImg, kanapTitle, kanapDescription);
        cardLink.appendChild(kanapCard);
        kanapItems.appendChild(cardLink);
    });
}