// Récupération de l'id de commande passé dans l'URL
const currentUrl = window.location.href;
const url = new URL(currentUrl);
const orderId = url.searchParams.get('orderId');

Confirmation_DisplayDatasInDOM(orderId);

// Fonction permettant d'ajouter le n° de commande au DOM et réinitialiser le localStorage
function Confirmation_DisplayDatasInDOM(orderId) {
    // <span id="orderId"><!-- 65431343444684674 --></span>
    const spanOrderId = document.getElementById('orderId');
    spanOrderId.innerText = orderId;
    // ---------------------------------------------------

    localStorage.clear();
}