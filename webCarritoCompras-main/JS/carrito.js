const productoEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito"));

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");

let botonesEliminar = document.querySelectorAll("carrito-producto-eliminar");
const botonVaciar= document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal= document.querySelector("#total");
const botonComprar= document.querySelector("#carrito-acciones-comprar");


function AgregarProductosEnCarrito() {
    if (productoEnCarrito && productoEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";


        productoEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `<img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
           <div class="carrito-producto-titulo">
           <small>Titulo </small>
           <h3>${producto.titulo}</h3>
           </div>
             <div class="carrito-producto-cantidad">
               <small>  Cantidad </small>
               <p> ${producto.cantidad} </p>
              </div>
            
           <div class="carrito-producto-precio">
               <small>  Precio </small>
               <p> ${producto.precio} </p>
           </div>

           <div class="carrito-producto-subtotal">
               <small>  Sub-total </small>
               <p> ${producto.precio * producto.cantidad} </p>
           </div>

           <butoon class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i>
           </butoon>`

            contenedorCarritoProductos.append(div);
        });

        actualizarBotonesEliminar();
        actualizarTotal();

    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");


    }

}

AgregarProductosEnCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);

    });
}

function eliminarDelCarrito(e) {
    const idBoton = e.currentTarget.id;
    const index = productoEnCarrito.findIndex(producto => producto.id === idBoton);
    console.log(productoEnCarrito);
    
    productoEnCarrito.splice(index, 1);
    AgregarProductosEnCarrito();
    

    localStorage.setItem("productos-en-carrito", JSON.stringify(productoEnCarrito));

}

botonVaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito(){
    productoEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productoEnCarrito));
    AgregarProductosEnCarrito();
}

function actualizarTotal(){
    const totalCalculado= productoEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText= `$${totalCalculado}`;
} 

    botonComprar.addEventListener("click", comprarCarrito);

function comprarCarrito(){
    productoEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productoEnCarrito));
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");
}