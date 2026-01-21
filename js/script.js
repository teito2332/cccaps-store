document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. CONFIGURACIÓN Y SELECTORES
    // =========================================
    const productos = document.querySelectorAll('.producto');
    const botonesFiltro = document.querySelectorAll('.filtro');
    const botonesAgregar = document.querySelectorAll('.add-cart');
    
    // Elementos del Carrito
    const carritoDiv = document.getElementById('carrito');
    const listaCarrito = document.getElementById('lista-carrito');
    const totalSpan = document.getElementById('total');
    const badge = document.getElementById('badge');
    const btnVaciar = document.getElementById('vaciar');
    const btnFinalizar = document.getElementById('finalizar-compra');
    const toggleCarrito = document.getElementById('toggle-carrito');
    const cerrarCarrito = document.getElementById('cerrar-carrito');

    // Estado del carrito (Carga del almacenamiento local o inicia vacío)
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Número de WhatsApp (Tu número)
    const NUMERO_WHATSAPP = "5493516455375"; 

    // =========================================
    // 2. LÓGICA DE FILTROS (TIENDA)
    // =========================================
    if(botonesFiltro.length > 0) {
        botonesFiltro.forEach(btn => {
            btn.addEventListener('click', () => {
                // Quitar clase activa a todos
                botonesFiltro.forEach(b => b.classList.remove('activo'));
                // Poner clase activa al clickeado
                btn.classList.add('activo');

                const categoria = btn.dataset.cat;

                productos.forEach(prod => {
                    if (categoria === 'todos') {
                        prod.style.display = 'block';
                    } else {
                        // Si la categoría coincide, mostrar. Si no, ocultar.
                        prod.style.display = prod.dataset.cat === categoria ? 'block' : 'none';
                    }
                });
            });
        });
    }

    // =========================================
    // 3. LÓGICA DEL CARRITO
    // =========================================

    // Función: Actualizar la interfaz del carrito (HTML)
    function renderizarCarrito() {
        listaCarrito.innerHTML = '';
        let precioTotal = 0;
        let cantidadTotal = 0;

        carrito.forEach((item, index) => {
            const subtotal = item.precio * item.cantidad;
            precioTotal += subtotal;
            cantidadTotal += item.cantidad;

            const li = document.createElement('li');
            li.innerHTML = `
                <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                    <div>
                        <span style="font-weight: bold; color: white;">${item.nombre}</span> <br>
                        <small style="color: #ccc;">$${item.precio.toLocaleString('es-AR')} x ${item.cantidad}</small>
                    </div>
                    <button class="eliminar" data-index="${index}" style="color: #ff4d4d; background:none; border:none; font-size: 1.2rem; cursor: pointer;">&times;</button>
                </div>
            `;
            listaCarrito.appendChild(li);
        });

        // Actualizar Total y Badge
        totalSpan.textContent = `$${precioTotal.toLocaleString('es-AR')}`;
        if(badge) badge.textContent = cantidadTotal;

        // Guardar en memoria del navegador
        localStorage.setItem('carrito', JSON.stringify(carrito));

        // Activar botones de eliminar
        document.querySelectorAll('.eliminar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.dataset.index;
                carrito.splice(idx, 1); // Borrar elemento
                renderizarCarrito();
            });
        });
    }

    // Función: Agregar producto
    botonesAgregar.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const nombre = btn.dataset.nombre;
            const precio = parseInt(btn.dataset.precio);

            // Verificar si ya existe en el carrito
            const existe = carrito.find(item => item.nombre === nombre);

            if (existe) {
                existe.cantidad++;
            } else {
                carrito.push({ nombre, precio, cantidad: 1 });
            }

            renderizarCarrito();
            
            // Abrir carrito automáticamente al agregar (Opcional)
            carritoDiv.classList.add('visible');
            
            // Feedback visual simple
            const textoOriginal = btn.textContent;
            btn.textContent = "¡AGREGADO!";
            setTimeout(() => { btn.textContent = textoOriginal; }, 1000);
        });
    });

    // Vaciar carrito
    if(btnVaciar) {
        btnVaciar.addEventListener('click', () => {
            if(confirm('¿Estás seguro de vaciar el carrito?')) {
                carrito = [];
                renderizarCarrito();
            }
        });
    }

    // Abrir/Cerrar Carrito visualmente
    if(toggleCarrito) {
        toggleCarrito.addEventListener('click', () => {
            carritoDiv.classList.toggle('visible');
        });
    }
    if(cerrarCarrito) {
        cerrarCarrito.addEventListener('click', () => {
            carritoDiv.classList.remove('visible');
        });
    }

    // =========================================
    // 4. CHECKOUT (WHATSAPP)
    // =========================================
    if(btnFinalizar) {
        btnFinalizar.addEventListener('click', () => {
            if (carrito.length === 0) {
                alert("El carrito está vacío.");
                return;
            }

            let mensaje = "Hola CCCAPS, quiero realizar el siguiente pedido:%0A%0A";
            let total = 0;

            carrito.forEach(item => {
                const subtotal = item.precio * item.cantidad;
                total += subtotal;
                // Formato: - Remera Bangkok x1 ($28.000)
                mensaje += `- *${item.nombre}* x${item.cantidad} ($${subtotal.toLocaleString('es-AR')})%0A`;
            });

            mensaje += `%0A*TOTAL FINAL: $${total.toLocaleString('es-AR')}*%0A`;
            mensaje += `%0A¿Cómo coordinamos el pago y el envío?`;

            // Abrir WhatsApp
            window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`, '_blank');
        });
    }

    // Inicializar al cargar la página
    renderizarCarrito();
});