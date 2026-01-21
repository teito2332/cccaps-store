document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener los datos de la URL (lo que viene después del signo ?)
    const params = new URLSearchParams(window.location.search);

    const nombre = params.get("nombre");
    const precio = params.get("precio");
    const img1 = params.get("img1"); // Foto frontal
    const img2 = params.get("img2"); // Foto dorsal (puede no estar)
    const descripcion = params.get("desc") || "Sin descripción disponible.";

    // 2. Rellenar la página con los datos
    if(nombre) document.getElementById("nombre-producto").textContent = nombre;
    if(precio) document.getElementById("precio-producto").textContent = "$" + Number(precio).toLocaleString("es-AR");
    if(descripcion) document.getElementById("descripcion-producto").textContent = descripcion;

    // Manejo de imágenes
    const imgPrincipal = document.getElementById("img-principal");
    const imgSecundaria = document.getElementById("img-secundaria");

    if(img1) imgPrincipal.src = img1;
    
    if(img2 && img2 !== "null") {
        imgSecundaria.src = img2;
        imgSecundaria.style.display = "block";
    }

    // 3. Lógica del botón "AGREGAR AL CARRITO" (Igual que en la tienda)
    const btnAgregar = document.getElementById("btn-agregar-detalle");
    
    btnAgregar.addEventListener("click", () => {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const precioNum = parseInt(precio);

        // Verificar si ya existe
        const existe = carrito.find(item => item.nombre === nombre);
        if (existe) {
            existe.cantidad++;
        } else {
            carrito.push({ nombre, precio: precioNum, cantidad: 1 });
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        
        // Feedback visual
        const textoOriginal = btnAgregar.textContent;
        btnAgregar.textContent = "¡AGREGADO! 🛒";
        btnAgregar.style.background = "#25D366"; // Verde WhatsApp momentáneo
        btnAgregar.style.color = "white";
        
        setTimeout(() => { 
            btnAgregar.textContent = textoOriginal; 
            btnAgregar.style.background = "";
            btnAgregar.style.color = "";
        }, 1500);
    });
});