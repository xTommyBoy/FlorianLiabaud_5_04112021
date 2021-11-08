const api_url = "http://localhost:3000/api/products";
const itemsElements = document.getElementById("items");

async function getProductsData() {
  // appel de l'api pour obtenir les données des products
  let data = await fetch(api_url).then(function (data) {
    return data.json();
  });
  return data;
}
function generateProductHTML(product) {
  // utilisation des données du product pour generer le code html du product
  let productHTML = '<a href="./product.html?id=' + product["_id"] + '">';
  productHTML +=
    '<article> <img src="' +
    product["imageUrl"] +
    '" alt="' +
    product["altTxt"] +
    '">';
  productHTML += '<h3 class="productName">' + product["name"] + "</h3>";
  productHTML +=
    '<p class="productDescription">' + product["description"] + "</p>";
  productHTML += "</article></a>";
  return productHTML;
}

window.onload = async function () {
  // recuperation de toutes les données des products en question
  let products = await getProductsData();

  products.forEach(function (product) {
    // affichage de l'html sur la page
    let html = generateProductHTML(product);
    itemsElements.innerHTML += html;
  });
};
