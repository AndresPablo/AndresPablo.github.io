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

function getIconoInteresUnicode(interes) {
    switch(interes) {
        case "Odio": return "🚫";
        case "No me gusta": return "👎";
        case "Curiosidad": return "❓";
        case "Me gusta": return "👍";
        case "Amo": return "❤️";
        default: return "";
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
                    tags: act.tags,
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
                        <tr><th></th><th>Actividad</th><th>Experiencia</th><th>Interés</th><th>Rol</th><th>Notas</th><th></th></tr>
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

    // --- Generar carrusel USANDO LA FUNCIÓN generarCarrusel ---
    const imagenes = item.imagenes || [];
    console.log("Imágenes a cargar:", imagenes);
    
    // Llamar a la función generarCarrusel
    generarCarrusel(imagenes, 'carruselInner');

    // Cargar las tags apropiadas (si tienes esta función)
    if (typeof filterBadgesByTags === 'function') {
        filterBadgesByTags('warningBadgesContainerId', item);
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
        container.innerHTML = `<div class="carousel-item active">
            <img src="${DEFAULT_IMG}" class="d-block w-100 img-carrousel-modal" alt="Imagen por defecto">
        </div>`;
        return;
    }

    let itemsHtml = '';
    let indicatorsHtml = '';
    
    imagenes.forEach((imgUrl, idx) => {
        const activeClass = idx === 0 ? 'active' : '';
        const isGif = imgUrl.toLowerCase().endsWith('.gif');
        
        // Generar indicador
        indicatorsHtml += `
            <button type="button" data-bs-target="#carruselActividad" data-bs-slide-to="${idx}" 
                    class="${activeClass}" aria-label="Slide ${idx+1}"></button>
        `;
        
        // Generar slide
        if (isGif) {
            itemsHtml += `
                <div class="carousel-item ${activeClass}">
                    <div class="gif-container position-relative">
                        <img src="${DEFAULT_IMG}" data-gif-src="${imgUrl}" class="d-block w-100 img-carrousel-modal gif-img" alt="GIF">
                        <button class="gif-play-pause btn btn-primary btn-sm position-absolute" style="bottom: 10px; right: 10px; z-index: 10;">▶️ Play</button>
                    </div>
                </div>
            `;
        } else {
            itemsHtml += `
                <div class="carousel-item ${activeClass}">
                    <img src="${imgUrl}" class="d-block w-100 img-carrousel-modal" alt="Imagen ${idx+1}" onerror="this.src='${DEFAULT_IMG}'">
                </div>
            `;
        }
    });

    // Poblamos el carousel-inner existente
    container.innerHTML = itemsHtml;

    // Poblamos los indicadores si existen
    const indicatorsContainer = document.querySelector('#carruselActividad .carousel-indicators');
    if (indicatorsContainer) {
        indicatorsContainer.innerHTML = indicatorsHtml;
    }

    // Reinicializamos el carousel después de cambiar el contenido
    const carouselElement = document.getElementById('carruselActividad');
    if (carouselElement) {
        // Destruir instancia anterior si existe
        const carousel = bootstrap.Carousel.getInstance(carouselElement);
        if (carousel) {
            carousel.dispose();
        }
        // Crear nueva instancia
        new bootstrap.Carousel(carouselElement, {
            ride: false
        });
    }

    // Eventos para GIFs
    document.querySelectorAll('.gif-play-pause').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const containerDiv = this.closest('.gif-container');
            const img = containerDiv.querySelector('.gif-img');
            const gifSrc = img.getAttribute('data-gif-src');

            if (img.src === DEFAULT_IMG) {
                img.src = gifSrc;
                this.textContent = '⏸️ Pause';
            } else {
                img.src = DEFAULT_IMG;
                this.textContent = '▶️ Play';
            }
        });
    });
}

function actualizarBotonesInteres(interesValor) {
    document.querySelectorAll('.interes-boton').forEach(btn => {
        btn.classList.remove('activo');
        if (btn.getAttribute('data-valor') === interesValor) {
            btn.classList.add('activo');
        }
    });
}

function filterBadgesByTags(badgeContainerId, jsonItem) {
  const container = document.getElementById('warningBadgesContainerId');
  if (!container) return;

  const tags = jsonItem.tags || [];
  // Get all badges inside container (elements with class 'badge' or specific selector)
  const badges = container.querySelectorAll('.badge'); // adjust selector if needed

  let anyMatch = false;

  badges.forEach(badge => {
    const badgeId = badge.id;
    if (badgeId && tags.includes(badgeId)) {
      badge.style.display = 'block';      // show
      anyMatch = true;
    } else {
      badge.style.display = 'none';  // hide
    }
  });

  // If no badge matched any tag, hide the entire container
  if (!anyMatch) {
    container.style.display = 'none';
  } else {
    console.log("Tag detected:", anyMatch);
    container.style.display = 'block';     // ensure container is visible
  }
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
            "": i.emoji,
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
        "Dominación (0-10)": document.getElementById('energiaSlider').value,
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
    // Crear contenido HTML para impresión
    const contenido = generarHTMLImprimible();
    
    // Abrir nueva ventana para imprimir
    const ventana = window.open('', '_blank');
    if (!ventana) {
        alert('Por favor, permite ventanas emergentes para exportar el PDF.');
        return;
    }
    
    ventana.document.write(contenido);
    ventana.document.close();
    
    // Esperar a que carguen las imágenes y luego imprimir
    ventana.onload = () => {
        setTimeout(() => {
            ventana.print();
            // Opcional: cerrar la ventana después de imprimir (el usuario puede cancelar)
            // ventana.afterPrint = () => ventana.close();
        }, 500);
    };
}

function generarHTMLImprimible() {
    // Obtener datos del usuario
    const nombre = document.getElementById('nombreUsuario').value || "No especificado";
    const edad = document.getElementById('edadUsuario').value || "—";
    const pronombres = document.getElementById('pronombresUsuario').value || "—";
    const apodo = document.getElementById('apodoUsuario').value || "—";
    const palabraClave = document.getElementById('palabraClaveUsuario').value || "—";
    const cuidadoPosterior = document.getElementById('cuidadoPosterior').value || "—";
    const energia = document.getElementById('energiaSlider') ? document.getElementById('energiaSlider').value : "5";
    const dolor = document.getElementById('dolorSlider') ? document.getElementById('dolorSlider').value : "5";
    const enf = document.getElementById('enfermedadesUsuario').value || "—";
    const disclaimer1 = document.getElementById('checkDisclaimer1').checked ? 'Aceptado' : 'No';
    const disclaimer2 = document.getElementById('checkDisclaimer2').checked ? 'Aceptado' : 'No';
    
    // Construir tablas por categoría
    let tablasHTML = '';
    for (const cat of categorias) {
        const itemsFiltrados = items.filter(i => i.categoria === cat.id);
        if (itemsFiltrados.length === 0) continue;
        
        let filas = '';
        for (const i of itemsFiltrados) {
            const claseFila = getClaseInteres(i.interes);
            const iconoInteres = getIconoInteresUnicode(i.interes);
            const celdaInteres = iconoInteres ? `<span class="interes-icono">${iconoInteres}</span> ${i.interes || ''}` : (i.interes || '');
            
            filas += `
                <tr class="${claseFila}">
                    <td class="emoji">${i.emoji || ''}</td>
                    <td class="actividad">${escapeHtml(i.actividad)}</td>
                    <td class="experiencia">${escapeHtml(i.experiencia || '')}</td>
                    <td class="interes">${celdaInteres}</td>
                    <td class="rol">${escapeHtml(i.rol || '')}</td>
                    <td class="notas">${escapeHtml(i.notas || '')}</td>
                </tr>
            `;
        }
        
        tablasHTML += `
            <div class="categoria">
                <h3>${cat.display_name}</h3>
                <table class="tabla-actividades">
                    <thead>
                        <tr><th></th><th>Actividad</th><th>Experiencia</th><th>Interés</th><th>Rol</th><th>Notas</th></tr>
                    </thead>
                    <tbody>
                        ${filas}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    // HTML completo con estilos para impresión
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Lista de Actividades</title>
        <style>
            /* Forzar impresión de colores de fondo */
            @media print {
                * {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                body {
                    padding: 0;
                    margin: 1cm;
                }
                h3 {
                    page-break-after: avoid;
                }
                .tabla-actividades tr {
                    page-break-inside: avoid;
                }
                .categoria {
                    page-break-inside: avoid;
                }
            }
            /* Estilos generales */
            body {
                font-family: Arial, Helvetica, sans-serif;
                margin: 0;
                padding: 20px;
                background: white;
                color: black;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
            }
            h2 {
                font-size: 24px;
                margin-bottom: 20px;
            }
            h3 {
                font-size: 18px;
                margin: 25px 0 10px 0;
                page-break-after: avoid;
            }
            .info-usuario {
                margin-bottom: 30px;
                font-size: 12px;
                line-height: 1.4;
                border-bottom: 1px solid #ccc;
                padding-bottom: 10px;
            }
            /* Tablas más compactas y con letra más pequeña */
            .tabla-actividades {
                width: 100%;
                border-collapse: collapse;
                font-size: 11px;
                margin-bottom: 30px;
                page-break-inside: avoid;
            }
            .tabla-actividades th,
            .tabla-actividades td {
                border: 1px solid #aaa;
                padding: 6px 4px;
                vertical-align: top;
                text-align: left;
            }
            .tabla-actividades th {
                background-color: #f0f0f0;
                font-weight: bold;
                font-size: 11px;
            }
            /* Evitar que se corten las filas entre páginas */
            .tabla-actividades tr {
                page-break-inside: avoid;
                page-break-after: auto;
            }
            /* Repetir cabecera en cada página */
            .tabla-actividades thead {
                display: table-header-group;
            }
            /* Evitar que una categoría se separe del título */
            .categoria {
                page-break-inside: avoid;
                margin-bottom: 30px;
            }
            /* Colores de interés (más suaves para impresión) */
            .interes-Odio { background-color: #eba4a4; }
            .interes-No-me-gusta { background-color: #f3a25f; }
            .interes-Curiosidad { background-color: #fae586; }
            .interes-Me-gusta { background-color: #7ff7b3; }
            .interes-Amo { background-color: #f37eba; }
            /* Iconos dentro de la tabla */
            .interes-icono {
                display: inline-block;
                width: 1.2em;
                text-align: center;
                margin-right: 4px;
            }
            /* Ajustes de ancho de columnas */
            .tabla-actividades th:nth-child(1), .tabla-actividades td:nth-child(1) { width: 45px; text-align: center; }
            .tabla-actividades th:nth-child(2), .tabla-actividades td:nth-child(2) { width: 25%; }
            .tabla-actividades th:nth-child(3), .tabla-actividades td:nth-child(3) { width: 12%; }
            .tabla-actividades th:nth-child(4), .tabla-actividades td:nth-child(4) { width: 12%; }
            .tabla-actividades th:nth-child(5), .tabla-actividades td:nth-child(5) { width: 12%; }
            .tabla-actividades th:nth-child(6), .tabla-actividades td:nth-child(6) { width: auto; }
            /* Forzar saltos de página suaves */
            @media print {
                body {
                    padding: 0;
                    margin: 1cm;
                }
                h3 {
                    page-break-after: avoid;
                }
                .tabla-actividades tr {
                    page-break-inside: avoid;
                }
                .categoria {
                    page-break-inside: avoid;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>📋 Lista de Actividades</h2>
            <div class="info-usuario">
                <strong>${escapeHtml(nombre)}</strong> | Edad: ${escapeHtml(edad)} | Pronombres: ${escapeHtml(pronombres)} | Apodo: ${escapeHtml(apodo)}<br>
                😈 Dominación: ${escapeHtml(energia)} / 10 | 🔑 Palabra de Seguridad: ${escapeHtml(palabraClave)}<br>
                💥 Sensibilidad al dolor: ${escapeHtml(dolor)} / 10<br>
                💝 Cuidado posterior: ${escapeHtml(cuidadoPosterior)}<br>
                🚑 Enfermedades/condiciones: ${escapeHtml(enf)}<br>
                ✅ Disclaimers: ${disclaimer1} / ${disclaimer2}
            </div>
            ${tablasHTML}
            <p style="font-size: 9px; text-align: center; margin-top: 40px;">Documento generado el ${new Date().toLocaleString()}</p>
        </div>
    </body>
    </html>`;
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