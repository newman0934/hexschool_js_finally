let chartCategory = [];
let orderPageTable = document.querySelector(".orderPage-table");
let discardAllBtn = document.querySelector(".discardAllBtn");
let baseUrl =
  "https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/caesar/orders";
// order
function getOrder() {
  axios
    .get(baseUrl, {
      headers: {
        Authorization: "IQYx0EuhVvg0pY7acFBvPOsClbt2",
      },
    })
    .then((res) => {
      let data = res.data.orders;
      renderOrder(data);
      chartData(data);
    })
    .catch((error) => {
      console.log(error);
    });
}
function renderOrder(data) {
  let str = `<thead>
                    <tr>
                        <th>訂單編號</th>
                        <th>聯絡人</th>
                        <th>聯絡地址</th>
                        <th>電子郵件</th>
                        <th>訂單品項</th>
                        <th>訂單日期</th>
                        <th>訂單狀態</th>
                        <th>操作</th>
                    </tr>
                </thead>`;
  data.forEach((item) => {
    let orderTimeStamp = new Date(item.createdAt * 1000);
    let orderYear = orderTimeStamp.getFullYear();
    let orderMonth = orderTimeStamp.getMonth() + 1;
    let orderDate = orderTimeStamp.getDate();
    str += `
    <tr>
                    <td>${item.id}</td>
                    <td>
                      <p>${item.user.name}</p>
                      <p>${item.user.tel}</p>
                    </td>
                    <td>${item.user.address}</td>
                    <td>${item.user.email}</td>
                    <td>
                    ${item.products
                      .map((product) => `<p>${product.title}</p>`)
                      .join("")}
                    </td>
                    <td>${orderYear}/${orderMonth}/${orderDate}</td>
                    <td class="orderStatus">
                      <a href="#">${item.paid ? "以處理" : "未處理"}</a>
                    </td>
                    <td>
                      <input type="button" class="delSingleOrder-Btn" data-id=${
                        item.id
                      } value="刪除">
                    </td>
                </tr>`;
  });
  orderPageTable.innerHTML = str;
}
function deleteOrders() {
  axios
    .delete(baseUrl, {
      headers: {
        Authorization: "IQYx0EuhVvg0pY7acFBvPOsClbt2",
      },
    })
    .then((res) => {
      getOrder();
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
}
function deleteOrder(data) {
  console.log(`${baseUrl}/${data}`);
  axios
    .delete(`${baseUrl}/${data}`, {
      headers: {
        Authorization: "IQYx0EuhVvg0pY7acFBvPOsClbt2",
      },
    })
    .then((res) => {
      console.log(res);
      getOrder();
    })
    .catch((error) => {
      console.log(error);
    });
}
getOrder();

// chart
function chartData(data) {
  let obj = {};
  data.forEach((item) => {
    item.products.forEach((product) => {
      if (obj[product.category] === undefined) {
        obj[product.category] = 1;
      } else {
        obj[product.category] += 1;
      }
    });
  });
  chartCategory = Object.entries(obj);
  renderChart();
}
function renderChart() {
  let chart = c3.generate({
    bindto: "#chart",
    data: {
      type: "pie",
      columns: chartCategory,
    },
  });
}

discardAllBtn.addEventListener("click", function (e) {
  e.preventDefault();
  deleteOrders();
});
orderPageTable.addEventListener("click", function (e) {
  e.preventDefault();
  deleteOrder(e.target.dataset.id);
});
