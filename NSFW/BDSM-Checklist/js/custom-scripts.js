let items = [];           // Array plano de actividades (normalizadas)
let categorias = [];      // Array de objetos { id, display_name, emoji }
let indiceItemActual = 0;
let inmersivoModalInstance;
let tooltipTriggerList = [];

const DEFAULT_IMG = "assets/default.png";

// ======================== FUNCIONES AUXILIARES ========================
function getIconoInteres(interes) {
    switch(interes) {
        case "Odio": return '<i class="fas fa-ban"></i>';
        case "No me gusta": return '<i class="fas fa-thumbs-down"></i>';
        case "Curiosidad": return '<i class="fas fa-question"></i>';
        case "Me gusta": return '<i class="fas fa-thumbs-up"></i>';
        case "Amo": return '<i class="fas fa-heart"></i>';
        default: return '';
    }
}

function getClaseInteres(interes) {
    switch(interes) {
        case "Odio": return "interes-Odio";
        case "No me gusta": return "interes-No-me-gusta";
        case "Curiosidad": return "interes-Curiosidad";
        case "Me gusta": return "interes-Me-gusta";
        case "Amo": return "interes-Amo";
        default: return "";
    }
}

function escapeHtml(str) {
    return String(str).replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function reasignarIds() {
    if (!items || !Array.isArray(items)) {
        items = [];
        return;
    }
    items.forEach((item, idx) => { item.id = idx + 1; });
}

function guardarEnLocalStorage() {
    const dataToStore = {
        items: items,
        categorias: categorias
    };
    localStorage.setItem('eventoActividades', JSON.stringify(dataToStore));
}

// Transforma el formato anidado (categorías con items) a los arrays planos
function transformarDesdeFormatoAnidado(data) {
    categorias = [];
    items = [];
    if (!data.categorias || !Array.isArray(data.categorias)) return;

    for (const grupo of data.categorias) {
        const catId = grupo.id;
        const catDisplay = grupo.display_name;
        const catEmoji = grupo.emoji || '';
        categorias.push({
            id: catId,
            display_name: catDisplay,
            emoji: catEmoji
        });

        if (grupo.items && Array.isArray(grupo.items)) {
            for (const act of grupo.items) {
                items.push({
                    id: null,
                    categoria: catId,
                    actividad: act.name,
                    emoji: act.emoji || '',
                    // IMPORTANTE: leer imagenes como array
                    imagenes: Array.isArray(act.imagenes) ? act.imagenes : (act.imagen ? [act.imagen] : []),
                    descripcion: act.descripcion || '',
                    ejemplo_notas: act.ejemplo_notas || '',
                    external_links: Array.isArray(act.external_links) ? act.external_links : [],
                    experiencia: '',
                    interes: '',
                    rol: '',
                    notas: ''
                });
            }
        }
    }
    reasignarIds();
}

// Cargar datos (desde localStorage o data.json)
async function cargarDatosIniciales() {
    const stored = localStorage.getItem('eventoActividades');
    if (stored) {
        try {
            const data = JSON.parse(stored);
            if (data.items && data.categorias) {
                items = data.items;
                categorias = data.categorias;
            } else {
                // formato antiguo o incorrecto, lo ignoramos y recargamos
                throw new Error('Formato inválido');
            }
        } catch(e) {
            items = [];
            categorias = [];
        }
    } else {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            transformarDesdeFormatoAnidado(data);
            guardarEnLocalStorage();
        } catch(e) {
            console.error('Error cargando data.json', e);
            items = [];
            categorias = [];
        }
    }
    reasignarIds();
    renderizarTablas();
}

// Obtener el ID del contenedor HTML para una categoría
function getContainerId(categoriaId) {
    return `categoria-${categoriaId}`;
}

// Renderizar todas las tablas a partir de los arrays items y categorias
function renderizarTablas() {
    for (const cat of categorias) {
        const containerId = getContainerId(cat.id);
        const container = document.getElementById(containerId);
        if (!container) continue;

        const itemsFiltrados = items.filter(item => item.categoria === cat.id);
        if (itemsFiltrados.length === 0) {
            container.innerHTML = '<div class="alert alert-secondary">No hay actividades en esta categoría</div>';
            continue;
        }

        let html = `
            <div class="section-title">
                <h3>${cat.display_name}</h3>
            </div>
            <div class="table-responsive">
                <table class="table table-hover table-bordered align-middle">
                    <thead class="table-dark">
                        <tr><th>Icono</th><th>Actividad</th><th>Experiencia</th><th>Interés</th><th>Rol</th><th>Notas</th><th></th></tr>
                    </thead>
                    <tbody>
        `;

        for (const item of itemsFiltrados) {
            const globalIndex = items.findIndex(i => i.id === item.id);
            const claseFila = getClaseInteres(item.interes);
            const iconoInteres = getIconoInteres(item.interes);

            html += `
                <tr class="${claseFila}">
                    <td>${item.emoji || ''}</td>
                    <td><span class="actividad-tooltip" data-bs-toggle="tooltip" title="${escapeHtml(item.descripcion)}">${escapeHtml(item.actividad)}</span></td>
                    <td>${item.experiencia || ''}</td>
                    <td>${iconoInteres ? `<span class="interes-icono-tabla">${iconoInteres}</span> ` : ''}${item.interes || ''}</td>
                    <td>${item.rol || ''}</td>
                    <td>${item.notas || ''}</td>
                    <td><button class="btn-editar-fila" data-index="${globalIndex}"><i class="fas fa-edit"></i></button></td>
                </tr>
            `;
        }

        html += `</tbody></div>`;
        container.innerHTML = html;
    }

    // Reinicializar tooltips
    if (window.bootstrap && bootstrap.Tooltip) {
        const tooltips = document.querySelectorAll('.actividad-tooltip');
        tooltips.forEach(el => new bootstrap.Tooltip(el));
    }

    // Eventos para botones de editar
    document.querySelectorAll('.btn-editar-fila').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(btn.getAttribute('data-index'));
            if (!isNaN(idx)) {
                indiceItemActual = idx;
                cargarItemEnModal(indiceItemActual);
                inmersivoModalInstance.show();
            }
        });
    });

    generarDropdownCategorias();
}

// Generar dropdown en la navbar
function generarDropdownCategorias() {
    const dropdownMenu = document.getElementById('tematicasDropdown');
    if (!dropdownMenu) return;
    dropdownMenu.innerHTML = '';
    for (const cat of categorias) {
        const containerId = getContainerId(cat.id);
        const container = document.getElementById(containerId);
        if (!container) continue;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.className = 'dropdown-item';
        a.href = `#${containerId}`;
        a.textContent = cat.display_name;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            container.scrollIntoView({ behavior: 'smooth' });
        });
        li.appendChild(a);
        dropdownMenu.appendChild(li);
    }
}



// Cargar datos de un item en el modal inmersivo
function cargarItemEnModal(index) {
    const item = items[index];
    if (!item) {
        console.error("Item no encontrado en índice", index);
        return;
    }

    console.log("Cargando item:", item);

    // Actualizar textos
    const tituloElem = document.getElementById('modalTitulo');
    if (tituloElem) tituloElem.innerText = item.actividad;
    const subtituloElem = document.getElementById('modalSubtitulo');
    if (subtituloElem) {
        const nombreCategoria = categorias.find(c => c.id === item.categoria)?.display_name || item.categoria;
        subtituloElem.innerText = nombreCategoria;
    }
    const descElem = document.getElementById('modalDescripcion');
    if (descElem) descElem.innerText = item.descripcion || '';

    // --- Generar carrusel ---
    const carruselInner = document.getElementById('carruselInner');
    if (!carruselInner) {
        console.error("No se encontró el elemento #carruselInner en el DOM");
        return;
    }

    const imagenes = item.imagenes || [];
    console.log("Imágenes a cargar:", imagenes);

    if (imagenes.length === 0) {
        carruselInner.innerHTML = `<div class="carousel-item active">
            <img src="${DEFAULT_IMG}" class="d-block w-100" alt="Sin imagen" style="border-radius: 12px;">
        </div>`;
    } else {
        let slidesHtml = '';
        imagenes.forEach((imgUrl, idx) => {
            const activeClass = idx === 0 ? 'active' : '';
            slidesHtml += `
                <div class="carousel-item ${activeClass}">
                    <img src="${imgUrl}" class="d-block w-100" alt="Imagen ${idx+1}" style="border-radius: 12px; object-fit: cover; max-height: 300px;"
                         onerror="this.onerror=null; this.src='${DEFAULT_IMG}'">
                </div>
            `;
        });
        carruselInner.innerHTML = slidesHtml;
    }

    // Reiniciar el carrusel (para que empiece desde la primera)
    const carouselElement = document.getElementById('carruselActividad');
    if (carouselElement && window.bootstrap) {
        try {
            const bsCarousel = bootstrap.Carousel.getOrCreateInstance(carouselElement);
            bsCarousel.to(0);
        } catch(e) {
            console.warn("No se pudo reiniciar el carrusel", e);
        }
    }

    // Cargar valores en los campos editables
    document.getElementById('editExperiencia').value = item.experiencia || '';
    document.getElementById('editInteres').value = item.interes || '';
    actualizarBotonesInteres(item.interes);
    document.getElementById('editRol').value = item.rol || '';
    document.getElementById('editNotas').value = item.notas || '';
    document.getElementById('ejemploNotasTexto').innerText = item.ejemplo_notas || '';

    // Enlaces externos
    const urlsContainer = document.getElementById('urlsEjemploContainer');
    if (urlsContainer) {
        urlsContainer.innerHTML = '';
        if (item.external_links && item.external_links.length) {
            item.external_links.forEach(link => {
                const a = document.createElement('a');
                a.href = link.url;
                a.target = '_blank';
                a.className = 'btn btn-sm btn-outline-primary me-1 mb-1';
                a.textContent = link.texto_visible || 'Enlace';
                urlsContainer.appendChild(a);
            });
        } else {
            urlsContainer.innerHTML = '<span class="text-muted">Sin enlaces externos</span>';
        }
    }

    document.getElementById('contadorModal').innerText = `${index+1}/${items.length}`;
}

function generarCarrusel(imagenes, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (!imagenes || imagenes.length === 0) {
        container.innerHTML = `<img src="${DEFAULT_IMG}" class="d-block w-100 img-preview-modal" alt="Imagen por defecto">`;
        return;
    }
    let itemsHtml = '';
    imagenes.forEach((imgUrl, idx) => {
        const activeClass = idx === 0 ? 'active' : '';
        itemsHtml += `
            <div class="carousel-item ${activeClass}">
                <img src="${imgUrl}" class="d-block w-100 img-preview-modal" alt="Imagen ${idx+1}" onerror="this.src='${DEFAULT_IMG}'">
            </div>
        `;
    });
    container.innerHTML = `
        <div id="carruselActividad" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
                ${itemsHtml}
            </div>
            ${imagenes.length > 1 ? `
            <button class="carousel-control-prev" type="button" data-bs-target="#carruselActividad" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Anterior</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carruselActividad" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Siguiente</span>
            </button>
            ` : ''}
        </div>
    `;
}

function actualizarBotonesInteres(interesValor) {
    document.querySelectorAll('.interes-boton').forEach(btn => {
        btn.classList.remove('activo');
        if (btn.getAttribute('data-valor') === interesValor) {
            btn.classList.add('activo');
        }
    });
}

function guardarItemDesdeModal() {
    if (indiceItemActual < 0 || indiceItemActual >= items.length) return;
    const item = items[indiceItemActual];
    item.experiencia = document.getElementById('editExperiencia').value;
    item.interes = document.getElementById('editInteres').value;
    item.rol = document.getElementById('editRol').value;
    item.notas = document.getElementById('editNotas').value;
    renderizarTablas();
    guardarEnLocalStorage();
}

// ======================== EVENTOS DEL MODAL ========================
document.getElementById('btnAnteriorItem').addEventListener('click', () => {
    if (indiceItemActual > 0) {
        guardarItemDesdeModal();
        indiceItemActual--;
        cargarItemEnModal(indiceItemActual);
    } else alert("Primera actividad");
});
document.getElementById('btnSiguienteItem').addEventListener('click', () => {
    if (indiceItemActual < items.length - 1) {
        guardarItemDesdeModal();
        indiceItemActual++;
        cargarItemEnModal(indiceItemActual);
    } else alert("Última actividad");
});
document.getElementById('btnGuardarItemModal').addEventListener('click', () => {
    guardarItemDesdeModal();
    inmersivoModalInstance.hide();
    alert("Cambios guardados");
});
document.getElementById('modoInmersivoBtn').addEventListener('click', () => {
    indiceItemActual = 0;
    cargarItemEnModal(indiceItemActual);
    inmersivoModalInstance.show();
});

// Sincronización select <-> botones
document.getElementById('editInteres').addEventListener('change', (e) => {
    actualizarBotonesInteres(e.target.value);
});
document.querySelectorAll('.interes-boton').forEach(btn => {
    btn.addEventListener('click', () => {
        const valor = btn.getAttribute('data-valor');
        document.getElementById('editInteres').value = valor;
        actualizarBotonesInteres(valor);
    });
});

// ======================== EXPORTACIONES ========================
function exportarExcel() {
    const wb = XLSX.utils.book_new();
    // Una hoja por categoría
    for (const cat of categorias) {
        const itemsFiltrados = items.filter(i => i.categoria === cat.id);
        if (itemsFiltrados.length === 0) continue;
        const data = itemsFiltrados.map(i => ({
            "Icono": i.emoji,
            "Actividad": i.actividad,
            "Descripción": i.descripcion,
            "Experiencia": i.experiencia,
            "Interés": i.interes,
            "Rol": i.rol,
            "Notas": i.notas,
            "Ejemplo Notas": i.ejemplo_notas
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, cat.display_name.slice(0, 31));
    }
    const usuarioData = [{
        "Nombre": document.getElementById('nombreUsuario').value,
        "Edad": document.getElementById('edadUsuario').value,
        "Pronombres": document.getElementById('pronombresUsuario').value,
        "Apodo": document.getElementById('apodoUsuario').value,
        "Palabra clave": document.getElementById('palabraClaveUsuario').value,
        "Cuidado posterior": document.getElementById('cuidadoPosterior').value,
        "Energía (0-10)": document.getElementById('energiaSlider').value,
        "Enfermedades": document.getElementById('enfermedadesUsuario').value,
        "Disclaimer1": document.getElementById('checkDisclaimer1').checked,
        "Disclaimer2": document.getElementById('checkDisclaimer2').checked
    }];
    const wsUser = XLSX.utils.json_to_sheet(usuarioData);
    XLSX.utils.book_append_sheet(wb, wsUser, "Info_Usuario");
    XLSX.writeFile(wb, `evento_actividades_${new Date().toISOString().slice(0,19)}.xlsx`);
}
document.getElementById('exportarExcelBtn').addEventListener('click', exportarExcel);

async function exportarPDF() {
    const pdfContent = document.createElement('div');
    pdfContent.style.padding = '20px';
    pdfContent.style.backgroundColor = 'white';
    pdfContent.style.fontFamily = 'Arial';
    pdfContent.style.width = '100%';

    const style = document.createElement('style');
    style.textContent = `
        .interes-Odio { background-color: #f8d7da !important; }
        .interes-No-me-gusta { background-color: #ffe5b4 !important; }
        .interes-Curiosidad { background-color: #fff3cd !important; }
        .interes-Me-gusta { background-color: #d1e7dd !important; }
        .interes-Amo { background-color: #f8c8e8 !important; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
        th { background-color: #f2f2f2; }
        .tabla-pdf th:nth-child(1), .tabla-pdf td:nth-child(1) { width: 60px; }
        .tabla-pdf th:nth-child(2), .tabla-pdf td:nth-child(2) { width: 25%; }
        .tabla-pdf th:nth-child(3), .tabla-pdf td:nth-child(3) { width: 100px; }
        .tabla-pdf th:nth-child(4), .tabla-pdf td:nth-child(4) { width: 150px; }
        .tabla-pdf th:nth-child(5), .tabla-pdf td:nth-child(5) { width: 80px; }
        .tabla-pdf th:nth-child(6), .tabla-pdf td:nth-child(6) { width: auto; }
        .interes-icono-tabla { margin-right: 6px; font-size: 0.9rem; display: inline-block; width: 1.2rem; text-align: center; }
    `;
    pdfContent.appendChild(style);

    // Datos del usuario
    const nombre = document.getElementById('nombreUsuario').value || "No especificado";
    const edad = document.getElementById('edadUsuario').value || "—";
    const pronombres = document.getElementById('pronombresUsuario').value || "—";
    const apodo = document.getElementById('apodoUsuario').value || "—";
    const palabraClave = document.getElementById('palabraClaveUsuario').value || "—";
    const cuidadoPosterior = document.getElementById('cuidadoPosterior').value || "—";
    const energia = document.getElementById('energiaSlider') ? document.getElementById('energiaSlider').value : "5";
    const enf = document.getElementById('enfermedadesUsuario').value || "—";
    const disclaimer1 = document.getElementById('checkDisclaimer1').checked ? 'Aceptado' : 'No';
    const disclaimer2 = document.getElementById('checkDisclaimer2').checked ? 'Aceptado' : 'No';

    let mainHtml = `<h2>Lista de Actividades</h2>
    <p><strong>Nombre:</strong> ${nombre} | <strong>Edad:</strong> ${edad} | <strong>Pronombres:</strong> ${pronombres} | <strong>Apodo:</strong> ${apodo} | <strong>Palabra clave:</strong> ${palabraClave}</p>
    <p><strong>Cuidado posterior:</strong> ${cuidadoPosterior} | <strong>Nivel de energía:</strong> ${energia}/10</p>
    <p><strong>Enfermedades/condiciones:</strong> ${enf}</p>
    <p><strong>Disclaimers:</strong> ${disclaimer1} / ${disclaimer2}</p>
    <hr>`;

    for (const cat of categorias) {
        const itemsFiltrados = items.filter(i => i.categoria === cat.id);
        if (!itemsFiltrados.length) continue;
        let tabla = `<h3>${cat.display_name}</h3>
        <table class="tabla-pdf">
            <thead><tr><th>Icono</th><th>Actividad</th><th>Experiencia</th><th>Interés</th><th>Rol</th><th>Notas</th></tr></thead>
            <tbody>`;
        for (const i of itemsFiltrados) {
            const clase = getClaseInteres(i.interes);
            const iconoInteres = getIconoInteres(i.interes);
            const celdaInteres = iconoInteres ? `<span class="interes-icono-tabla">${iconoInteres}</span> ${i.interes || ''}` : (i.interes || '');
            tabla += `<tr class="${clase}">
                        <td>${i.emoji || ''}</td>
                        <td>${escapeHtml(i.actividad)}</td>
                        <td>${i.experiencia || ''}</td>
                        <td>${celdaInteres}</td>
                        <td>${i.rol || ''}</td>
                        <td>${i.notas || ''}</td>
                       </tr>`;
        }
        tabla += `</tbody></table>`;
        mainHtml += tabla;
    }

    pdfContent.innerHTML += mainHtml;
    document.body.appendChild(pdfContent);
    try {
        const canvas = await html2canvas(pdfContent, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save(`evento_${new Date().toISOString().slice(0,19)}.pdf`);
    } catch(e) {
        console.error(e);
        alert("Error al generar PDF");
    }
    document.body.removeChild(pdfContent);
}
document.getElementById('exportarPdfBtn').addEventListener('click', exportarPDF);

function exportarJson() {
    // Exportar el estado actual (items + categorías) como JSON plano (compatible con guardado)
    const dataToExport = { items, categorias };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evento_actividades_${new Date().toISOString().slice(0,19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}
document.getElementById('exportarJsonBtn').addEventListener('click', exportarJson);

async function resetearDatos() {
    localStorage.removeItem('eventoActividades');
    await cargarDatosIniciales();
    renderizarTablas();
    alert("Datos restablecidos desde data.json");
}
document.getElementById('resetJsonBtn').addEventListener('click', resetearDatos);

// ======================== INICIALIZACIÓN ========================
window.addEventListener('load', async () => {
    await cargarDatosIniciales();
    inmersivoModalInstance = new bootstrap.Modal(document.getElementById('inmersivoModal'));

    const welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'), { backdrop: 'static' });
    welcomeModal.show();
    document.getElementById('btnSiModal').onclick = () => welcomeModal.hide();
    document.getElementById('btnNoModal').onclick = () => welcomeModal.hide();

    // Controles de teclado
    document.addEventListener('keydown', function(e) {
        const modalElement = document.getElementById('inmersivoModal');
        if (!modalElement.classList.contains('show')) return;
        switch(e.key) {
            case 'ArrowLeft': e.preventDefault(); document.getElementById('btnAnteriorItem').click(); break;
            case 'ArrowRight': e.preventDefault(); document.getElementById('btnSiguienteItem').click(); break;
            case 'Enter': e.preventDefault(); document.getElementById('btnGuardarItemModal').click(); break;
            case 'Escape': inmersivoModalInstance.hide(); break;
        }
    });

    // Slider de energía
    const slider = document.getElementById('energiaSlider');
    const valorSpan = document.getElementById('energiaValor');
    if (slider && valorSpan) {
        slider.addEventListener('input', function() { valorSpan.innerText = this.value; });
    }
    // Edad por defecto
    const edadInput = document.getElementById('edadUsuario');
    if (edadInput && (edadInput.value === '' || edadInput.value === null)) {
        edadInput.value = '18';
    }
});