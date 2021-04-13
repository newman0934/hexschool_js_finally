let baseUrl =
  "https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/caesar";
const productWrap = document.querySelector(".productWrap");
const shoppingCart = document.querySelector(".shoppingCart-table");
const sendOrder = document.querySelector(".orderInfo-btn");

// product
function getProducts() {
  axios
    .get(`${baseUrl}/products`)
    .then((res) => {
      let data = res.data.products;
      renderProducts(data);
    })
    .catch(function (e) {
      console.log(e);
    });
}
function renderProducts(data) {
  let str = "";
  data.forEach((item) => {
    str += `<li class="productCard">
                <h4 class="productType">新品</h4>
                <img src=${item.images} alt="">
                <a href="#" id="addCardBtn" data-id=${item.id}>加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT$${item.origin_price}</del>
                <p class="nowPrice">NT$${item.price}</p>
            </li>
    `;
  });
  productWrap.innerHTML = str;
}
getProducts();

// cart
function getCarts() {
  axios
    .get(`${baseUrl}/carts`)
    .then((res) => {
      let data = res.data.carts;
      console.log(data);
      renderCarts(data);
    })
    .catch(function (e) {
      console.log(e);
    });
}
function renderCarts(data) {
  let str = "";
  let totlePrice = 0;
  str += `
                      <tr>
                    <th width="40%">品項</th>
                    <th width="15%">單價</th>
                    <th width="15%">數量</th>
                    <th width="15%">金額</th>
                    <th width="15%"></th>
                </tr>
  `;
  data.forEach((item) => {
    let itemPrice = item.product.price * item.quantity;
    totlePrice += itemPrice;
    str += `

    <tr>
                    <td>
                        <div class="cardItem-title">
                            <img src="https://i.imgur.com/HvT3zlU.png" alt="">
                            <p${item.product.title}</p>
                        </div>
                    </td>
                    <td>${item.product.price}</td>
                    <td>${item.quantity}</td>
                    <td>${itemPrice}</td>
                    <td class="discardBtn">
                        <a href="#" class="material-icons" data-id=${item.id}>
                            clear
                        </a>
                    </td>
                </tr>

    `;
  });
  str += `
                  <tr class="item-list">
                    <td>
                        <a href="#" class="discardAllBtn">刪除所有品項</a>
                    </td>
                    <td></td>
                    <td></td>
                    <td>
                        <p>總金額</p>
                    </td>
                    <td>NT$${totlePrice}</td>
                </tr>
  `;
  shoppingCart.innerHTML = str;
}
function addCarts(id) {
  let data = {
    data: {
      productId: id,
      quantity: 1
    }
  };
  axios
    .post(`${baseUrl}/carts`, data)
    .then((res) => {
      getCarts();
    })
    .catch(function (err) {
      console.log(err);
    });
}
function deleteCarts() {
  axios.delete(`${baseUrl}/carts`).then((res) => {
    console.log(res);
    getCarts();
  });
}
function deleteCart(id) {
  axios.delete(`${baseUrl}/carts/${id}`).then((res) => {
    getCarts();
  });
}
getCarts();

// order
function postOrder(data) {
  axios
    .post(
      "https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/caesar/orders",
      data
    )
    .then((res) => {
      console.log(res.data);
      deleteCarts();
    })
    .catch((err) => {
      console.log(err);
    });
}

productWrap.addEventListener("click", function (e) {
  if (e.target.nodeName === "A") {
    e.preventDefault();
    addCarts(e.target.dataset.id);
  }
});
shoppingCart.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.getAttribute("class") === "discardAllBtn") {
    deleteCarts();
  } else if (e.target.getAttribute("class") === "material-icons") {
    deleteCart(e.target.dataset.id);
  }
});
sendOrder.addEventListener("click", function (e) {
  e.preventDefault();
  let carthLength = document.querySelectorAll(".shoppingCart-table .item-list").length;
  if (carthLength == 0) {
    alert("請加入至少一個購物車品項！");
    return;
  }
  const customerName = document.querySelector("#customerName");
  const customerPhone = document.querySelector("#customerPhone");
  const customerEmail = document.querySelector("#customerEmail");
  const customerAddress = document.querySelector("#customerAddress");
  const tradeWay = document.querySelector("#tradeWay");
  if (
    customerName == "" ||
    customerPhone == "" ||
    customerEmail == "" ||
    customerAddress == ""
  ) {
    alert("請輸入訂單資訊！");
    return;
  }
  let data = {
    data: {
      user: {
        name: customerName.value.trim(),
        tel: customerPhone.value.trim(),
        email: customerEmail.value.trim(),
        address: customerAddress.value.trim(),
        payment: tradeWay.value.trim()
      }
    }
  };
  postOrder(data);
  customerName.value = ""
  customerPhone.value = ""
  customerEmail.value = ""
  customerAddress.value = ""
  alert("訂單已送出")
});
