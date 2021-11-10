const api_url = "http://localhost:3000/api/products";
const cartItemsEl = document.querySelector("#cart__items");
const formEl = document.querySelector(".cart__order__form");
const orderIdEl = document.querySelector("#orderId");
let cart = localStorage.getItem("cart");

// check du panier si il y'en a déja un ou pas
if (cart) {
  cart = JSON.parse(cart);
} else {
  cart = [];
}

function getCartItemHTML(product) {
  // creation de l'html en fonction des données du produit
  let itemHTML =
    '<article class="cart__item" data-id="' +
    product["_id"] +
    '"><div class="cart__item__img">';
  itemHTML +=
    '<img src="' +
    product["imageUrl"] +
    '" alt="' +
    product["altTxt"] +
    '"></div><div class="cart__item__content"><div class="cart__item__content__titlePrice"></div>';
  itemHTML += " <h2>" + product["name"] + "</h2>";
  itemHTML += "<p>" + product["price"] + " €</p>";
  itemHTML +=
    '</div><div class="cart__item__content__settings"><div class="cart__item__content__settings__quantity"><p>Qté : </p>';
  itemHTML +=
    '<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="' +
    product["quantity"] +
    '"></div>';
  itemHTML +=
    ' <div class="cart__item__content__settings__color"><p>Color : <span id="color-value">' +
    product["color"] +
    "</span></p></div>";
  itemHTML +=
    ' <div class="cart__item__content__settings__delete"><p class="deleteItem">Supprimer</p></div></div></div></article>';
  return itemHTML;
}
function getCartTotal() {
  // total du panier
  const total = cart.reduce(function (a, b) {
    return a + b["price"] * b["quantity"];
  }, 0);
  return total;
}

function updateCartTotalHTML() {
  // résultat du total et du nombre de produits
  document.querySelector("#totalQuantity").innerHTML = cart.length;
  document.querySelector("#totalPrice").innerHTML = getCartTotal();
}

function updateCartItemsHTML() {
  // ajout des articles du panier dans l'html
  cartItemsEl.innerHTML = "";
  cart.forEach(function (product) {
    cartItemsEl.innerHTML += getCartItemHTML(product);
  });

  // ajout des events pour la suppresion et la quantité des produits
  const cartItemEls = document.querySelectorAll(".cart__item");
  cartItemEls.forEach(function (itemEl) {
    const id = itemEl.getAttribute("data-id");
    const color = itemEl.querySelector("#color-value").innerHTML;

    const deleteBtn = itemEl.querySelector(".deleteItem");
    const quantityEl = itemEl.querySelector(".itemQuantity");

    deleteBtn.onclick = function () {
      // suppresion des produits
      const itemIndex = cart.findIndex(function (el) {
        return el["_id"] == id && el["color"] === color;
      });
      if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
        itemEl.remove();
        updateCartTotalHTML();
      }
      localStorage.setItem("cart", JSON.stringify(cart));
    };
    quantityEl.onchange = function () {
      // mis à jour de la quantités de produits
      const itemIndex = cart.findIndex(function (el) {
        return el["_id"] == id && el["color"] === color;
      });

      if (itemIndex !== -1) {
        cart[itemIndex].quantity = parseInt(quantityEl.value);
        updateCartTotalHTML();
      }
      localStorage.setItem("cart", JSON.stringify(cart));
    };
  });
  updateCartTotalHTML();
}
function getUrlOrderId() {
  // obtention de l'id par l'url
  const urlParam = new URLSearchParams(window.location.search);
  return urlParam.get("orderId");
}

function isOrderFormValid() {
  // parametrage de la form d'inscription et sécurisation de celui ci
  let isValid = true;
  const firstNameErrorEl = document.querySelector("#firstNameErrorMsg");
  const lastNameErrorEl = document.querySelector("#lastNameErrorMsg");
  const addressErrorEl = document.querySelector("#addressErrorMsg");
  const cityErrorMsg = document.querySelector("#cityErrorMsg");
  const emailErrorEl = document.querySelector("#emailErrorMsg");
  let nameRegex = /^[a-z]+$/i;
  let emailRegex = /^\w+@\w+.[a-z]{2,}$/i;

  if (!nameRegex.test(formEl["firstName"].value)) {
    isValid = false;
    firstNameErrorEl.innerHTML = "Votre prénom n'est pas valide";
  } else {
    firstNameErrorEl.innerHTML = "";
  }

  if (!nameRegex.test(formEl["lastName"].value)) {
    isValid = false;
    lastNameErrorEl.innerHTML = "Votre nom n'est pas valide";
  } else {
    lastNameErrorEl.innerHTML = "";
  }

  if (formEl["address"].value === "") {
    isValid = false;
    addressErrorEl.innerHTML = "L'adresse est invalide ou inexistante";
  } else {
    addressErrorEl.innerHTML = "";
  }

  if (formEl["city"].value === "") {
    isValid = false;
    cityErrorMsg.innerHTML = "L'adresse de votre ville est invalide";
  } else {
    cityErrorMsg.innerHTML = "";
  }

  if (!emailRegex.test(formEl["email"].value)) {
    isValid = false;
    emailErrorEl.innerHTML = "Votre Email est invalide";
  } else {
    emailErrorEl.innerHTML = "";
  }

  return isValid;
}

function orderFormSubmit(e) {
  // soumettre la commande
  e.preventDefault();
  // récupération des ID de tout les articles dans le panier
  const productIds = cart.map(function (el) {
    return el["_id"];
  });
  const data = {
    contact: {
      firstName: formEl["firstName"].value,
      lastName: formEl["lastName"].value,
      address: formEl["address"].value,
      city: formEl["city"].value,
      email: formEl["email"].value,
    },
    products: productIds,
  };
  if (!isOrderFormValid()) {
    return false;
  }
  // envoie de la commande
  fetch(api_url + "/order", {
    method: "Post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(function (data) {
      return data.json();
    })
    .then(function (data) {
      // commande réussie
      if (data["orderId"]) {
        localStorage.setItem("cart", JSON.stringify([]));
        window.location.href = "./confirmation.html?orderId=" + data["orderId"];
      }
    });
  return false;
}
window.onload = function () {
  // check pour regardder sil il y'a des produits dans le panier
  if (cartItemsEl) {
    updateCartItemsHTML();
  }

  // check pour regarder si il y'a une commande 
  if (formEl) {
    formEl.onsubmit = orderFormSubmit;
  }

  // check de l'id via l'url
  if (orderIdEl) {
    orderIdEl.innerHTML = getUrlOrderId();
  }
};