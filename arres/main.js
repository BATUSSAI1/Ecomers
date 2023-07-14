// const BaseUrl = "https://ecommercebackend.fundamentos-29.repl.co/";
const BaseUrl = "https://services-academlo-shopping.onrender.com/";

async function GetUrl() {
  try {
    const data = await fetch(BaseUrl);
    // console.log(data);

    const obj = await data.json();

    window.localStorage.setItem("ecomers", JSON.stringify(obj));

    return obj;
  } catch (erorr) {}

  console.log(error);
}

GetUrl();

function printObjet(database, array) {
  const containerHTML = document.querySelector(".container");

  let html = "";
  
  for (const products of database.objets || array) {
    html += `
         <div class = product>
  
         <div class="product_imagen">
         <img src="${products.image}" alt="imagen">
         </div>
  
         <div class="product_info">
         
         <h3> ${products.name} </h3>
         
         <p>
         <b>$${products.price}</b> | <span>Stock:${products.quantity}</span>
         </p>
  
         <div>
         ${
           products.quantity
             ? ` <i class='bx bx-plus' id="${products.id}"></i>`
             : "<span class= soldOut> soldOut</span>"
         }
         </div>
         </div>
         </div>
         
      </div>
      `;
  }

  containerHTML.innerHTML = html;
}

function printCars() {
  const iconCars = document.querySelector(".bx-cart");
  const carsHTML = document.querySelector(".cars");

  iconCars.addEventListener("click", function () {
    carsHTML.classList.toggle("cars_show");
  });
}

function printaddtoCars(database) {
  const containerHTML = document.querySelector(".container");

  containerHTML.addEventListener("click", function (e) {
    if (e.target.classList.contains("bx-plus")) {
      const id = Number(e.target.id);
      // console.log(id);

      let idproduct = null;

      for (const merca of database.objets) {
        if (merca.id === id) {
          idproduct = merca;
          break;
        }
      }

      if (database.cars[idproduct.id]) {
        if (idproduct.quantity === database.cars[idproduct.id].amount) {
          return alert("NO HAY MAS DISPONIBLE");
        }
        database.cars[idproduct.id].amount++;
      } else {
        database.cars[idproduct.id] = { ...idproduct, amount: 1 };
      }

      window.localStorage.setItem("caris", JSON.stringify(database.cars));
      printItemToCars(database);
      printTotalmenu(database);
      amounCars(database);
    }
  });
}

function printItemToCars(database) {
  const carItems = document.querySelector(".menuProduct");
  let html = "";

  for (const items in database.cars) {
    const { quantity, price, name, image, id, amount } = database.cars[items];

    html += `
    <div class="menu_Product">
      <div class="menu_Product_img">
        <img src="${image}" alt="imagen">
      </div>

      <div class="menu_Product_total">
      <div class="menu_Product_body">          
        <h4>${name}   $${price}</h4>
        <p>Stock: ${quantity} </p>
      </div>

      <div class="menu_Product_stock" id=${id}>

      <i class='bx bxs-shield-plus'></i>
      <h4>${amount} unit</h4>
      <i class='bx bxs-shield-minus' ></i>
      <i class='bx bxs-trash'></i>
     
      
      </div>
      </div>       
    </div>
    `;
  }

  carItems.innerHTML = html;
}

function printPlusMinusCars(database) {
  const menuProduct = document.querySelector(".menuProduct");

  menuProduct.addEventListener("click", function (e) {
    if (e.target.classList.contains("bxs-shield-plus")) {
      const id = Number(e.target.parentElement.id);

      const productfind = database.objets.find(
        (products) => products.id === id
      );

      if (productfind.quantity === database.cars[productfind.id].amount)
        return alert("NO HAY MAS DISPONIBLE");

      database.cars[id].amount++;
    }
    if (e.target.classList.contains("bxs-shield-minus")) {
      const idCars = Number(e.target.parentElement.id);

      if (database.cars[idCars].amount === 1) {
        const response = confirm(
          "Estas Seguro que deseas Eliminar este producto"
        );
        if (!response) return;
        delete database.cars[idCars];
      } else {
        database.cars[idCars].amount--;
      }
    }

    if (e.target.classList.contains("bxs-trash")) {
      const idCars = Number(e.target.parentElement.id);
      const response = confirm(
        "Estas Seguro que deseas Eliminar este producto"
      );
      if (!response) return;
      delete database.cars[idCars];
    }

    window.localStorage.setItem("caris", JSON.stringify(database.cars));
    printItemToCars(database);
    printTotalmenu(database);
    amounCars(database);
  });
}

function printTotalmenu(database) {
  const menuCantidadHTML = document.querySelector(".menuCantidad");
  const menuPrecioHTML = document.querySelector(".menuPrecio");

  let totalmenuCantidad = 0;
  let totalmenuPrecio = 0;

  for (const items in database.cars) {
    const { amount, price } = database.cars[items];
    totalmenuCantidad += amount;
    totalmenuPrecio += price * amount;
  }
  menuCantidadHTML.textContent = totalmenuCantidad + " unit";
  menuPrecioHTML.textContent = "$ " + totalmenuPrecio + ".00";

  window.localStorage.setItem("caris", JSON.stringify(database.cars));
}

function SoldItems(database) {
  const Btnbuy = document.querySelector(".Btn_buy");

  Btnbuy.addEventListener("click", function () {
    if (!Object.values(database.cars).length)
      return alert("ESO ES GRATIS! NO PAGUES");

    const respuesta = confirm("DESEA COMPRAR");
    if (!respuesta) return;

    const stockremove = [];

    for (const items of database.objets) {
      const itemscars = database.cars[items.id];
      if (items.id === itemscars?.id) {
        stockremove.push({
          ...items,
          quantity: items.quantity - itemscars.amount,
        });
      } else {
        stockremove.push(items);
      }
    }
    database.objets = stockremove;
    database.cars = {};

    window.localStorage.setItem("ecomers", JSON.stringify(database.objets));
    window.localStorage.setItem("caris", JSON.stringify(database.cars));

    printTotalmenu(database);
    printItemToCars(database);
    printObjet(database);
    amounCars(database);
  });
}

function amounCars(database) {
  const sumaAmount = document.querySelector(".sumaCars");

  let amount = 0;

  for (const item in database.cars) {
    amount += database.cars[item].amount;
  }
  sumaAmount.textContent = amount;
}

function botonFilter(database) {
  const botonesHTML = document.querySelectorAll(".botones .btn");

  botonesHTML.forEach(function (boton) {
    boton.addEventListener("click", function (e) {
      const botoFilter = e.target.id;
      if (botoFilter === "all") {
        printObjet(database);
      } else {
        const items = database.objets.filter((item) => {
          return item.category === botoFilter;
        });
        printObjet(false, items);
      }
    });
  });
}

async function star() {
  const database = {
    objets:
      JSON.parse(window.localStorage.getItem("ecomers")) || (await GetUrl()),
    cars: JSON.parse(window.localStorage.getItem("caris")) || {},
  };

  printObjet(database);
  printCars();
  printaddtoCars(database);
  printItemToCars(database);
  printPlusMinusCars(database);
  printTotalmenu(database);
  SoldItems(database);
  amounCars(database);
  botonFilter(database);
}

star();
