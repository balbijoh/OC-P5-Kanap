// Récupération de l'id de commande passé dans l'URL
let currentUrl = window.location.href;
let url = new URL(currentUrl);
let orderId = url.searchParams.get('orderId');

Confirmation_DisplayDatasInDOM(orderId);

// Fonction permettant d'ajouter le n° de commande au DOM et réinitialiser le localStorage
function Confirmation_DisplayDatasInDOM(orderId) {
    // <span id="orderId"><!-- 65431343444684674 --></span>
    let spanOrderId = document.getElementById('orderId');
    spanOrderId.innerText = orderId;
    // ---------------------------------------------------

    localStorage.clear();
}