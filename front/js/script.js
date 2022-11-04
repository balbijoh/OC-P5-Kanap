// Récupération des données de l'API via requête Fetch
fetch("http://localhost:3000/api/products")
.then(function(result) {
    if (result.ok) {
        // console.log(result);
        return result.json();
    }    
})
.then(function(value) {
    console.log(value);
})
.catch(function(error) {
    console.log("Error : " + error);
})