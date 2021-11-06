const api_url = "http://localhost:3000/api/products";
const itemsElements = document.getElementById("items");

async function getProductsData() {
  // appel de l'api pour obtenir les données des produits
  let data = await fetch(api_url).then(function (data) {
    return data.json();
  });
  return data;
}
function generateProductHTML(produit) {
  // utilisation des données du produit pour generer le code html du produit
  let productHTML = '<a href="./product.html?id=' + produit["_id"] + '">';
  productHTML +=
    '<article> <img src="' +
    produit["imageUrl"] +
    '" alt="' +
    produit["altTxt"] +
    '">';
  productHTML += '<h3 class="productName">' + produit["name"] + "</h3>";
  productHTML +=
    '<p class="productDescription">' + produit["description"] + "</p>";
  productHTML += "</article></a>";
  return productHTML;
}

window.onload = async function () {
  // recuperation de toutes les données des produits en question
  let produits = await getProductsData();

  produits.forEach(function (produit) {
    // affichage de l'html sur la page
    let html = generateProductHTML(produit);
    itemsElements.innerHTML += html;
  });
};
