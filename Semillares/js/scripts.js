/*!
* Start Bootstrap - Business Frontpage v5.0.8 (https://startbootstrap.com/template/business-frontpage)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-business-frontpage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

let productos = [];

fetch("./JSON/productos.json")
    .then(res => res.json())
    .then(data => {
        productos = data;
        //console.log(productos);
        cargarProductos(productos);
        // console.log(data);
    });

const contenedorProductos = document.querySelector("#contenedorProductos");
const botonesCategorias = document.querySelectorAll(".botones-categorias");
let productosEnCarrito = [];
const numerito = document.getElementById("numerito");
let botonesAgregar = document.querySelectorAll(".producto-agregar");

function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";


    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("mb-5");
        div.classList.add("col");


        div.innerHTML = `
    
    <div class="card h-100">
    <!-- Product image-->
    <img class="card-img-top rounded-0" src="${producto.imagen}" alt="..." />
    <!-- Product details-->
    <div class="card-body p-4">
        <div class="text-center">
            <!-- Product name-->
            <h5 class="fw-bolder">${producto.nombre}</h5>
            <!-- Product price-->
           <div><span> $ </span> ${producto.precio}
           </div>
        </div>
    </div>
    <!-- Product actions-->
    <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
        <div class="text-center"><button class="btn btn-outline-dark mt-auto producto-agregar" id="${producto.id}" href="">Ver Opciones</button></div>
    </div>
</div>
</div>
    `;
        contenedorProductos.append(div);


    });
    actualizarBotonesAgregar();

}

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        // botonesCategorias.forEach(boton => boton.classList.remove("active"));
        //e.currentTarget.classList.add("active"); 
        console.log("anda");

        if (e.currentTarget.id != "todos") {
            const productoCategoria = productos.find(producto => producto.categoria === e.currentTarget.id);
            //console.log(productoCategoria);

            const productosBoton = productos.filter(producto => producto.categoria === e.currentTarget.id);
            // console.log("funciona");
            cargarProductos(productosBoton);
        } else {
            cargarProductos(productos);
            //console.log("tercera");
        };


    })
});

const productosEnCarritoLS = JSON.parse(localStorage.getItem("productos-en-carrito"));
if (productosEnCarritoLS) {
     productosEnCarrito = productosEnCarritoLS;

    actualizarNumerito();
}
else {
    productosEnCarrito = [];
}

//agrega productos al carrito

function agregarAlCarrito(e) {
    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);
    // console.log(productoAgregado)
    
   
    if (productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
         productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }
    //modifica la cantidad de productos existentes en el carrito  
    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
};

