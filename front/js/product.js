const api_url = "http://localhost:3000/api/products";
const itemAddToCart = document.querySelector("#addToCart");
// récupération de l'item panier pour le modifier 
let cart = localStorage.getItem("cart");

// check pour regarder si un panier est déja existant sinon passage a l'etape suivante
if (cart) {
  cart = JSON.parse(cart);
} else {
  cart = [];
}

function getUrlProductId() {
  // récupération des id via url
  const urlParam = new URLSearchParams(window.location.search);
  return urlParam.get("id");
}

async function getProductData(id) {
  // récupération des données par l'ID du produit
  const data = await fetch(api_url + "/" + id).then(function (data) {
    return data.json();
  });
  return data;
}
function updateProductHTML(product) {
  // création de l'html en fonction du produit
  const itemImage = document.querySelector(".item__img");
  const itemTitle = document.querySelector("#title");
  const itemPrice = document.querySelector("#price");
  const itemDescription = document.querySelector("#description");
  const itemColors = document.querySelector("#colors");
  const itemQuantity = document.querySelector("#quantity");

  itemImage.innerHTML =
    '<img src="' + product["imageUrl"] + '" alt="' + product["altTxt"] + '">';
  itemTitle.innerHTML = product["name"];
  itemPrice.innerHTML = product["price"];
  itemDescription.innerHTML = product["description"];

  product.colors.forEach(function (color) {
    itemColors.innerHTML +=
      '<option value="' + color + '">' + color + "</option>";
  });
  itemQuantity.value = "1";
}

function addItemToCart(product) {
  // définition du produit à ajouter au panier en récupérant ces données puis envoie de ce dernier dans le panier
  const itemColors = document.querySelector("#colors");
  const itemQuantity = document.querySelector("#quantity");
  const cartItem = {
    _id: product["_id"],
    altTxt: product["altTxt"],
    imageUrl: product["imageUrl"],
    name: product["name"],
    price: product["price"],
    color: itemColors.value,
    quantity: parseInt(itemQuantity.value),
  };
  if (cartItem.color == "") {
    alert("SVP, choisissez une couleur");
    return false;
  }

  const itemIndex = cart.findIndex(function (item) {
    return item["_id"] === cartItem["_id"];
  });

  if (itemIndex === -1) {
    cart.push(cartItem);
  } else {
    colorindex = cart.findIndex(function (item) {
      return (
        item["_id"] === cartItem["_id"] && item["color"] === cartItem["color"]
      );
    });

    if (colorindex === -1) {
      cart.push(cartItem);
    } else {
      cart[colorindex].quantity += cartItem.quantity;
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}

window.onload = async function () {
  // récupération des données générales du produit avec un check 
  const id = getUrlProductId();
  const product = await getProductData(id);

  // actualisation de l'html en fonction du produit
  updateProductHTML(product);
  itemAddToCart.onclick = function () {
    addItemToCart(product);
  };
};