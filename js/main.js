let productosGlobal = [];

async function cargarProductos() {
    try {
        const respuesta = await fetch('data/products.json?t=' + new Date().getTime());

        if (!respuesta.ok) {
            throw new Error('No se pudo cargar el JSON');
        }

        const productos = await respuesta.json();

        productosGlobal = productos.filter(p => p.ESTADO === 1);

        inicializarFiltros(productosGlobal);
        renderProductos(productosGlobal);

    } catch (error) {
        console.error("Error al cargar los productos:", error);
        document.getElementById('catalog').innerHTML = `
            <div class="alert alert-danger text-center">
                No se pudieron cargar los productos.
            </div>
        `;
    }
}

function inicializarFiltros(productos) {
    const selectTipo = document.getElementById('filterTipo');
    const selectUso = document.getElementById('filterUso');
    const selectTamano = document.getElementById('filterTamano');

    selectTipo.innerHTML = '<option value="Todos">Todos</option>';

    const tipos = [...new Set(productos.map(p => p.TIPO))].sort();

    tipos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        selectTipo.appendChild(option);
    });

    selectTipo.addEventListener('change', () => {
        actualizarFiltroUso();
        actualizarFiltroTamano();
        aplicarFiltros();
    });

    selectUso.addEventListener('change', aplicarFiltros);
    selectTamano.addEventListener('change', aplicarFiltros);

    document.getElementById('btnLimpiar')
        .addEventListener('click', limpiarFiltros);

    actualizarFiltroUso();
    actualizarFiltroTamano();
}

function actualizarFiltroTamano() {
    const selectTipo = document.getElementById('filterTipo');
    const selectTamano = document.getElementById('filterTamano');

    const tipoSeleccionado = selectTipo.value;

    let productosFiltrados = productosGlobal;

    if (tipoSeleccionado !== 'Todos') {
        productosFiltrados = productosGlobal.filter(p => p.TIPO === tipoSeleccionado);
    }

    const tamanos = [...new Set(productosFiltrados.map(p => p.TAMANO))]
        .sort((a, b) => a - b);

    selectTamano.innerHTML = '<option value="Todos">Todos</option>';

    tamanos.forEach(tamano => {
        const option = document.createElement('option');
        option.value = tamano;
        option.textContent = tamano + " oz";
        selectTamano.appendChild(option);
    });

    selectTamano.value = 'Todos';
}

function actualizarFiltroUso() {
    const selectTipo = document.getElementById('filterTipo');
    const selectUso = document.getElementById('filterUso');

    const tipoSeleccionado = selectTipo.value;

    let productosFiltrados = productosGlobal;

    if (tipoSeleccionado !== 'Todos') {
        productosFiltrados = productosGlobal.filter(p => p.TIPO === tipoSeleccionado);
    }

    const usos = [...new Set(productosFiltrados.map(p => p.USO))].sort();

    selectUso.innerHTML = '<option value="Todos">Todos</option>';

    usos.forEach(uso => {
        const option = document.createElement('option');
        option.value = uso;
        option.textContent = uso;
        selectUso.appendChild(option);
    });

    selectUso.value = 'Todos';
}

function aplicarFiltros() {
    const tipoSeleccionado = document.getElementById('filterTipo').value;
    const usoSeleccionado = document.getElementById('filterUso').value;
    const tamanoSeleccionado = document.getElementById('filterTamano').value;

    let filtrados = productosGlobal;

    if (tipoSeleccionado !== 'Todos') {
        filtrados = filtrados.filter(p => p.TIPO === tipoSeleccionado);
    }

    if (usoSeleccionado !== 'Todos') {
        filtrados = filtrados.filter(p => p.USO === usoSeleccionado);
    }

    if (tamanoSeleccionado !== 'Todos') {
        filtrados = filtrados.filter(p => p.TAMANO == tamanoSeleccionado);
    }

    renderProductos(filtrados);
}

function limpiarFiltros() {
    document.getElementById('filterTipo').value = 'Todos';
    document.getElementById('filterUso').value = 'Todos';
    document.getElementById('filterTamano').value = 'Todos';

    actualizarFiltroUso();
    actualizarFiltroTamano();
    renderProductos(productosGlobal);
}

function renderProductos(productos) {
    const catalogo = document.getElementById('catalog');
    catalogo.innerHTML = '';

    if (productos.length === 0) {
        catalogo.innerHTML = `
            <div class="container text-center py-5">
                <h4>No se encontraron productos</h4>
            </div>
        `;
        return;
    }

    const fragment = document.createDocumentFragment();

    productos
        .sort((a, b) => {
            const tipoCompare = a.TIPO.localeCompare(b.TIPO, 'es', { sensitivity: 'base' });
            if (tipoCompare !== 0) return tipoCompare;
            return a.TAMANO - b.TAMANO;
        })
        .forEach(producto => {

            const div = document.createElement('div');
            div.classList.add('container', 'py-2');

            div.innerHTML = `
                <div class="row justify-content-center">
                    <div class="col-lg-12">
                        <div class="card product-card shadow-lg border-0 rounded-4 overflow-hidden">
                            <div class="row g-0 align-items-center">

                                <div class="col-md-8 text-center bg-light p-4 d-flex align-items-center justify-content-center">
                                    <div id="carousel-${producto.ID}" class="carousel slide w-100">
                                        <div class="carousel-inner">
                                            <div class="carousel-item active">
                                                <img src="images/${producto.ID}/image-1.png" class="d-block mx-auto img-fluid" alt="${producto.DESCRIPCION}" style="max-height: 600px; object-fit: contain;">
                                            </div>
                                            <div class="carousel-item">
                                                <img src="images/${producto.ID}/image-2.png" class="d-block mx-auto img-fluid" alt="${producto.DESCRIPCION}" style="max-height: 600px; object-fit: contain;">
                                            </div>
                                            <div class="carousel-item">
                                                <img src="images/${producto.ID}/image-3.png" class="d-block mx-auto img-fluid" alt="${producto.DESCRIPCION}" style="max-height: 600px; object-fit: contain;">
                                            </div>
                                            <div class="carousel-item">
                                                <img src="images/${producto.ID}/image-4.png" class="d-block mx-auto img-fluid" alt="${producto.DESCRIPCION}" style="max-height: 600px; object-fit: contain;">
                                            </div>
                                        </div>
                                        <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${producto.ID}" data-bs-slide="prev">
                                            <i class="bi bi-chevron-left text-black fs-2"></i>
                                            <span class="visually-hidden">Previous</span>
                                        </button>
                                        <button class="carousel-control-next" type="button" data-bs-target="#carousel-${producto.ID}" data-bs-slide="next">
                                            <i class="bi bi-chevron-right text-black fs-2"></i>
                                            <span class="visually-hidden">Next</span>
                                        </button>
                                    </div>
                                </div>

                                <div class="col-md-4 p-5">                                    
                                    <h1 class="fw-bold mb-3">${producto.DESCRIPCION}</h1>

                                    <div class="product-info p-3 bg-light rounded-3 mb-4">
                                        <ul class="list-unstyled mb-0">
                                            <li><strong>Color:</strong> ${producto.COLOR}</li>                                            
                                            <li><strong>Uso:</strong> ${producto.USO}</li>
                                            <li><strong>Capacidad:</strong> ${producto.TAMANO} oz</li>
                                        </ul>
                                    </div>

                                    <div class="product-price mb-4">
                                        <span class="current-price">$${producto["PRECIO VENTA"]}</span>
                                    </div>

                                    <button class="btn btn-primary w-100 btn-space-catalog" style="font-size: 0.9rem; padding: 0.5rem 1rem;">
                                        <i class="bi bi-cart-plus me-2"></i>SELECCIONAR
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            `;

            const buyButton = div.querySelector('.btn-primary');
            if (buyButton) {
                buyButton.addEventListener('click', () => {
                    window.location.href = `compra.html?id=${producto.ID}`;
                });
            }

            fragment.appendChild(div);
        });

    catalogo.appendChild(fragment);
}

cargarProductos();

const btnScrollTop = document.getElementById('btnScrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        btnScrollTop.style.display = 'block';
    } else {
        btnScrollTop.style.display = 'none';
    }
});

btnScrollTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
