// script.js
const formularioProducto = document.getElementById("formulario-producto");
const listaProductos = document.getElementById("lista-productos");

// Función para obtener productos del servidor
async function obtenerProductos() {
    try {
        const respuesta = await fetch("http://localhost:3000/productos", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (respuesta.ok) {
            const productos = await respuesta.json();
            productos.forEach(producto => agregarProductoDOM(producto));
        } else {
            console.error("Error al obtener los productos.");
        }
    } catch (error) {
        console.error("Error de red:", error);
    }
}

// Función para agregar un producto al DOM
function agregarProductoDOM(producto) {
    const tarjetaProducto = document.createElement("div");
    tarjetaProducto.classList.add("tarjeta-producto");

    tarjetaProducto.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>$${parseFloat(producto.precio).toFixed(2)}</p>
        <button class="boton-eliminar">
            <img src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" alt="Eliminar" class="icono-basurero">
        </button>
    `;

    // Agregar evento para eliminar producto
    tarjetaProducto.querySelector(".boton-eliminar").addEventListener("click", () => {
        eliminarProducto(producto.id, tarjetaProducto);
    });

    listaProductos.appendChild(tarjetaProducto);
}

// Función para enviar un producto al servidor
async function agregarProductoServidor(producto) {
    try {
        const respuesta = await fetch("http://localhost:3000/productos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(producto)
        });

        if (respuesta.ok) {
            const productoGuardado = await respuesta.json();
            agregarProductoDOM(productoGuardado);
        } else {
            console.error("Error al agregar el producto.");
        }
    } catch (error) {
        console.error("Error de red:", error);
    }
}

// Función para eliminar un producto del servidor
async function eliminarProducto(id, tarjetaProducto) {
    try {
        const respuesta = await fetch(`http://localhost:3000/productos/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (respuesta.ok) {
            listaProductos.removeChild(tarjetaProducto);
        } else {
            console.error("Error al eliminar el producto.");
        }
    } catch (error) {
        console.error("Error de red:", error);
    }
}

// Manejar el envío del formulario
formularioProducto.addEventListener("submit", (e) => {
    e.preventDefault();

    const producto = {
        nombre: document.getElementById("nombre-producto").value,
        precio: document.getElementById("precio-producto").value,
        imagen: document.getElementById("imagen-producto").value
    };

    agregarProductoServidor(producto);
    formularioProducto.reset();
});

// Obtener los productos al cargar la página
obtenerProductos();
