let productos = [];

fetch("./JS/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);    
    });

    


const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#tituloPrincipal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numero= document.querySelector("#numero");

botonesCategorias.forEach(boton =>boton.addEventListener("click",() => {
    aside.classList.remove("aside-visible");
}));
console.log(botonesCategorias);

function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML = "";



    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");

        div.innerHTML = `<img class= "producto-imagen"src="${producto.imagen}" alt="${producto.titulo}">
 <div class="producto-detalle">
    <h3 class="producto-titulo"> ${producto.titulo} </h3>
    <p class="producto-precio"> ${producto.precio} </p>
    <button class="producto-agregar" id="${producto.id}"> Agregar </button>
 </div>`;
        contenedorProductos.append(div);

    }) 

    

    actualizarBotonesAgregar();
}

cargarProductos(productos);

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos") {
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = productoCategoria.categoria.nombre;
            
            const productoBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);

            cargarProductos(productoBoton);
            

        } else {
            cargarProductos(productos);
            tituloPrincipal.innerText = "todos los productos"
            
        }
    })

});


function actualizarBotonesAgregar(){
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);

    });
};

    let productoEnCarrito=[];

    const productoEnCarritoLS= JSON.parse(localStorage.getItem("productos-en-carrito"));
    if (productoEnCarritoLS){
        productoEnCarrito = productoEnCarritoLS;
        actualizarNumero();
    }
    else{
        productoEnCarrito=[];
    };

    function agregarAlCarrito(e){
        const idBoton = e.currentTarget.id;
        const productoAgregado = productos.find(producto => producto.id === idBoton);
        
       if (productoEnCarrito.some(producto => producto.id === idBoton)){
           const index= productoEnCarrito.findIndex(producto => producto.id === idBoton);
           productoEnCarrito[index].cantidad++;

       }else{
        productoAgregado.cantidad = 1 ;
        productoEnCarrito.push(productoAgregado);
    }

    actualizarNumero();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productoEnCarrito));

    }
    function actualizarNumero(){
        let nuevoNumero = productoEnCarrito.reduce((acc, productos) => acc + productos.cantidad ,0);
        numero.innerText = nuevoNumero;
    }

    
