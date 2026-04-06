function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarTelefono(telefono) {
    const regex = /^\d{7,15}$/;
    return regex.test(telefono);
}

function actualizarTotal(cantidad, precio) {
    const totalSpan = document.getElementById('total');

    if (totalSpan) {
        const total = precio * cantidad;

        totalSpan.textContent = total.toLocaleString("es-PA", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}

function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

async function cargarProducto(id) {
    try {
        document.getElementById('product-detail').innerHTML = `
        <div class="text-center p-5">
        <div class="spinner-border"></div>
        <p>Cargando producto...</p>
        </div>
        `;
        const respuesta = await fetch(`data/products.json?t=${Date.now()}`);
        if (!respuesta.ok) {
            throw new Error('No se pudo cargar el JSON');
        }
        const productos = await respuesta.json();
        const producto = productos.find(p => String(p.ID) === String(id) && p.ESTADO === 1);
        if (!producto) {
            throw new Error('Producto no encontrado');
        }
        renderProductoDetalle(producto);
    } catch (error) {
        console.error("Error al cargar el producto:", error);
        document.getElementById('product-detail').innerHTML = `
            <div class="alert alert-danger text-center">
                No se pudo cargar el producto seleccionado.
            </div>
        `;
    }
}

function renderProductoDetalle(producto) {
    const precioFormateado = parseFloat(producto["PRECIO VENTA"]).toLocaleString("es-PA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const cont = document.getElementById('product-detail');
    cont.innerHTML = ``;

    const div = document.createElement('div');
    div.classList.add('container', 'py-5');
    div.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-lg-12">
                <div class="card">
                    <div class="row g-0 align-items-center">
                        <div class="col-md-6 p-4">
                            <img class="img-fluid product-img mb-4" 
                                 src="images/${producto.ID}/image-1.png"
                                 alt="${producto.DESCRIPCION}">                            
                        </div>
                        <div class="col-md-6 p-5">
                            <h1 class="fw-bold mb-3">${producto.DESCRIPCION}</h1>
                            <div class="product-info p-3 bg-light rounded-3 mb-4">
                                <ul class="list-unstyled mb-0">
                                    <li><strong>Precio:</strong> $${precioFormateado}</li>
                                    <li><strong>Color:</strong> ${producto.COLOR}</li>                                    
                                    <li><strong>Uso:</strong> ${producto.USO}</li>
                                    <li><strong>Capacidad:</strong> ${producto.TAMANO} oz</li>                                    
                                </ul>
                            </div>                            

                            <div class="mb-4">
                                <label for="cantidad" class="form-label fw-bold">Cantidad</label>
                                <div class="input-group" style="width: fit-content;">
                                    <button class="btn btn-outline-secondary" type="button" id="btn-minus">-</button>
                                    <input type="number" class="form-control text-center" id="cantidad" value="1" min="1" max="99" readonly style="width: 60px;">
                                    <button class="btn btn-outline-secondary" type="button" id="btn-plus">+</button>
                                </div>
                            </div>

                            <div class="mb-4">
                                <label for="cantidad" class="form-label fw-bold">Total</label>
                                <div class="estimated-price">$<span id="total" class="estimated-price">${(parseFloat(producto["PRECIO VENTA"]) * 1).toFixed(2)}</span></div>
                            </div>

                            <div class="mb-4">
                                <form id="compra-form">
                                    <fieldset class="border rounded-3 p-3 mb-3">
                                        <legend class="float-none w-auto px-2 fs-6 fw-bold">
                                            Datos del cliente
                                        </legend>

                                        <div class="row">
                                            <div class="col-md-12 p-2">
                                                <label for="email" class="form-label">Correo electrónico</label>
                                                <input type="email" class="form-control" id="email"
                                                    placeholder="Correo electronico" required>
                                            </div>

                                            <div class="col-md-12 p-2">
                                                <label for="nombre" class="form-label">Nombre completo</label>
                                                <input type="text" class="form-control" id="nombre"
                                                    placeholder="Nombre completo" required>
                                            </div>

                                            <div class="col-md-12 p-2">
                                                <label for="telefono" class="form-label">Número de telefono</label>
                                                <input type="text" class="form-control" id="telefono"
                                                    placeholder="Número de telefono" required>
                                            </div>
                                        </div>
                                    </fieldset>                                    

                                    <fieldset class="border rounded-3 p-3 mb-3">
                                        <legend class="float-none w-auto px-2 fs-6 fw-bold">
                                            Añade una nota a tu pedido
                                        </legend>                                        

                                        <textarea class="form-control" id="notaPedido" rows="3" maxlength="200" style="resize: none;"></textarea>

                                    </fieldset>
                                    
                                    <div class="row mt-3">
                                        <div class="col-12 text-end">
                                            <button id="btnConfirmar" class="btn btn-primary btn-space-catalog">
                                                <i class="bi bi-check-circle me-2"></i>Solicitar x WhatsApp
                                            </button>
                                        </div>
                                    </div>                                
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>        
    `;    
    
    const btnMinus = div.querySelector('#btn-minus');
    const btnPlus = div.querySelector('#btn-plus');
    const cantidadInput = div.querySelector('#cantidad');
    const precioVenta = parseFloat(producto["PRECIO VENTA"]);
    
    if (btnMinus && btnPlus && cantidadInput) {
        btnMinus.addEventListener('click', () => {
            let val = parseInt(cantidadInput.value);
            if (val > 1) {
                cantidadInput.value = val - 1;
                actualizarTotal(parseInt(cantidadInput.value), precioVenta);
            }
        });
        
        btnPlus.addEventListener('click', () => {
            let val = parseInt(cantidadInput.value);
            if (val < 10) {
                cantidadInput.value = val + 1;
                actualizarTotal(parseInt(cantidadInput.value), precioVenta);
            }
        });
        
        actualizarTotal(parseInt(cantidadInput.value), precioVenta);
    }

    cont.appendChild(div);
    setupPaymentAccordion();

    const compraForm = document.getElementById('compra-form');
    if (compraForm) {
        compraForm.addEventListener('submit', function(e) {
            e.preventDefault(); 

            const cantidadInput = document.getElementById('cantidad');
            let cantidad = parseInt(cantidadInput.value);
            if (isNaN(cantidad) || cantidad < 1 || cantidad > 10) {
                alert('La cantidad debe ser un número entre 1 y 10.');
                return;
            }

            const metodoPagoSeleccionado = document.querySelector('input[name="metodoPago"]:checked');
            if (!metodoPagoSeleccionado) {
                alert('Por favor, seleccione un método de pago antes de continuar.');
                return;
            }

            const nombre = document.getElementById('nombre').value;
            const telefono = document.getElementById('telefono').value;
            const email = document.getElementById('email').value;
            const nota = document.getElementById('notaPedido').value;

            if (!validarEmail(email)) {
                alert('Por favor ingrese un correo electrónico válido.');
                return;
            }

            if (!validarTelefono(telefono)) {
                alert('Por favor ingrese un número de celular válido (solo números).');
                return;
            }

            let mensaje = `Nuevo pedido:\n\n`;
            mensaje += `Producto: ${producto.DESCRIPCION}\n`;
            mensaje += `Codigo: ${producto.ASIN}\n`;
            mensaje += `Cantidad: ${cantidad}\n`;
            mensaje += `Precio unitario: $${precioVenta.toFixed(2)}\n`;
            mensaje += `Método de pago: ${metodoPagoSeleccionado.value}\n\n`;
            mensaje += `Cliente:\nNombre: ${nombre}\nTeléfono: ${telefono}\nEmail: ${email}\n`;
            if (nota) mensaje += `Nota: ${nota}\n`;

            const numeroWhatsApp = '50766783861';
            const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

            window.open(url, '_blank');
        });
    }
}

const productId = getQueryParam('id');
if (productId) {
    cargarProducto(productId);
}

function setupPaymentAccordion() {
    const yappy = document.getElementById('optYappy');
    const transfer = document.getElementById('optTransferencia');
    const nota = document.getElementById('optNota');

    const detY = document.getElementById('detalleYappy');
    const detT = document.getElementById('detalleTransferencia');
    const detN = document.getElementById('detalleNota');

    function ocultarTodo() {
        if (detY) detY.classList.remove('show');
        if (detT) detT.classList.remove('show');
    }

    if (yappy) {
        yappy.addEventListener('change', () => {
            ocultarTodo();
            if (yappy && yappy.checked) {
                detY.classList.add('show');
            }
        });
    }

    if (transfer) {
        transfer.addEventListener('change', () => {
            ocultarTodo();
            if (transfer && transfer.checked) {
                detT.classList.add('show');
            }
        });
    }

    if (nota && detN) {
        nota.addEventListener('change', () => {
            detN.classList.toggle('show', nota.checked);
        });
    }
}

document.addEventListener('DOMContentLoaded', setupPaymentAccordion);
