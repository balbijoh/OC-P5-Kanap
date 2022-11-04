let currentUrl = window.location.href;
let url = new URL(currentUrl);
let kanapId = url.searchParams.get("id");
console.log("kanapId : ", kanapId);