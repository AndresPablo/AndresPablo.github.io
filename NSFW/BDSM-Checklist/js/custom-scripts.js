let items = [];
let categorias = [];
let indiceItemActual = 0;
let inmersivoModalInstance;
let tooltipTriggerList = [];

const contenedor = document.getElementById("tablasContainer");
const DEFAULT_IMG = "assets/default.png";



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

function escapeHtml(str) { return String(str).replace(/[&<>]/g, function(m){if(m==='&') return '&amp;'; if(m==='<') return '&lt;'; if(m==='>') return '&gt;'; return m;}); }


function getContainerId(categoriaId) {
    return `categoria-${categoriaId}`;
}

function getCategoriaById(categoriaId) {
    return categorias.find(cat => cat.id === categoriaId);
}

function getNombreVisible(categoriaId) {
    const cat = getCategoriaById(categoriaId);
    return cat ? cat.display_name : categoriaId;
}



function reasignarIds() {
    if (!items || !Array.isArray(items)) {
        items = [];
        return;
    }
    items.forEach((item, idx) => { 
        item.id = idx + 1; 
    });
}

function renderizarTablas() {
    // Iterar sobre todas las categorías
    for (const cat of categorias) {
        const containerId = getContainerId(cat.id);
        
        const container = document.getElementById(containerId);
        
        if (!container) continue;
        const itemsFiltrados = items.filter(item => item.categoria === cat.id);
        
        

        if (itemsFiltrados.length === 0) {
            container.innerHTML = '<div><div class="alert alert-secondary">No hay actividades en esta categoría</div></div>';
            continue;
        }
        
        let html = `
            <div class="section-title">
                <h3><i class=""></i> ${cat.display_name}</h3>
            </div>
            <div class="table-responsive">
                <table class="table table-hover table-bordered align-middle">
                    <thead class="table-dark">
                        <tr><th>Icono</th><th>Actividad</th><th>Experiencia</th><th>Interés</th><th>Rol</th><th>Notas</th><th></th></tr>
                    </thead>
                    <tbody>
        `;
        
        itemsFiltrados.forEach((item) => {
            const globalIndex = items.findIndex(i => i.id === item.id);
            const claseFila = getClaseInteres(item.interes);
            const iconoInteres = getIconoInteres(item.interes);
            
            html += `
                <tr class="${claseFila}">
                    <td>${item.emoji || ''}</td>
                    <td><span class="actividad-tooltip" data-bs-toggle="tooltip" title="${escapeHtml(item.descripcion || '')}">${escapeHtml(item.actividad)}</span></td>
                    <td>${item.experiencia || ''}</td>
                    <td>${iconoInteres ? `<span class="interes-icono-tabla">${iconoInteres}</span>` : ''}${item.interes || ''}</td>
                    <td>${item.rol || ''}</td>
                    <td>${item.notas || ''}</td>
                    <td><button class="btn-editar-fila" data-index="${globalIndex}"><i class="fas fa-edit"></i></button></td>
                </tr>
            `;
        });
        
        html += `</tbody></tr></div>`;
        container.innerHTML = html;
    }
    
    // Tooltips y botones editar...
    if (window.bootstrap && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('.actividad-tooltip'));
        tooltipTriggerList.map(el => new bootstrap.Tooltip(el));
    }
    
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


async function cargarDatosIniciales() {
    const stored = localStorage.getItem('eventoActividades');
    if (stored) {
        try {
            const data = JSON.parse(stored);
            items = data.items || [];
            categorias = data.categorias || [];
        } catch(e) {
            items = [];
            categorias = [];
        }
    } else {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            
            // Asegurar que existan las propiedades
            items = data.items || [];
            categorias = data.categorias || [];
            
            // Guardar en localStorage
            guardarEnLocalStorage();
        } catch(e) {
            console.warn('No se pudo cargar data.json', e);
            items = [];
            categorias = [];
        }
    }
    
    reasignarIds();
    renderizarTablas();
}

// Función auxiliar para convertir el formato anidado al plano
function transformarDesdeFormatoAnidado(data) {
    categorias = [];
    items = [];
    
    for (const grupo of data.categorias) {
        // Crear objeto categoría
        const categoriaObj = {
            id: grupo.id,
            nombre_visible: grupo.nombre_visible
        };
        categorias.push(categoriaObj);
        
        // Agregar cada item del grupo, asignándole la categoría (usando el id string)
        if (grupo.items && Array.isArray(grupo.items)) {
            for (const item of grupo.items) {
                items.push({
                    ...item,
                    categoria: grupo.id,        // el identificador corto (ej: "soccer")
                    categoria_nombre: grupo.nombre_visible, // opcional para mostrar
                    id: null // se reasignará después
                });
            }
        }
    }
}

function guardarEnLocalStorage() {
    localStorage.setItem('eventoActividades', JSON.stringify(items));
}


function guardarEnLocalStorage() {
    const dataToStore = { 
        items: items || [], 
        categorias: categorias || [] 
    };
    localStorage.setItem('eventoActividades', JSON.stringify(dataToStore));
}

function reasignarIds() {
    items.forEach((item, idx) => { item.id = idx + 1; });
}

function getNombreCategoria(categoriaId) {
    const cat = categorias.find(c => c.id === categoriaId);
    return cat ? cat.nombre_visible : 'Sin categoría';
}

function getItemsPorCategoria(categoriaId) {
    return items.filter(item => item.categoria_id === categoriaId);
}


function reasignarIds() { items.forEach((item, idx) => { item.id = idx + 1; }); }

function normalizarItem(item) {
    return {
        id: item.id || 0,
        tematica: item.display_name,
        actividad: item.actividad,
        emoji: item.emoji || '',
        imagen: item.imagen || '',
        descripcion: item.descripcion || '',
        ejemplo_notas: item.ejemplo_notas || '',
        urls_ejemplo: Array.isArray(item.urls_ejemplo) ? item.urls_ejemplo : (item.url_ejemplo ? [item.url_ejemplo] : []),
        external_links: Array.isArray(item.external_links) ? item.external_links : (item.external_links ? [item.external_links] : []),
        // campos que se editan en el modal, siempre vacíos al inicio
        experiencia: '',
        interes: '',
        rol: '',
        notas: ''
    };
}

function actualizarBotonesInteres(interesValor) {
    document.querySelectorAll('.interes-boton').forEach(btn => {
        btn.classList.remove('activo');
        if (btn.getAttribute('data-valor') === interesValor) {
            btn.classList.add('activo');
        }
    });
}

function cargarItemEnModal(index) {
    const item = items[index];
    if (!item) return;
    
    const nombreCategoria = getNombreVisible(item.categoria);

    document.getElementById('modalTitulo').innerText = `${item.actividad}`;
    document.getElementById('modalSubtitulo').innerText =  `${nombreCategoria}`;
    document.getElementById('modalDescripcion').innerText = `${item.descripcion}`;
    const imgElement = document.getElementById('modalImagen');
    if (item.imagen && item.imagen.trim() !== '') {
        imgElement.src = item.imagen;
        imgElement.onerror = () => { imgElement.src = DEFAULT_IMG; };
    } else {
        imgElement.src = DEFAULT_IMG;
    }
    document.getElementById('editExperiencia').value = item.experiencia || '';
    document.getElementById('editInteres').value = item.interes || '';
    actualizarBotonesInteres(item.interes);
    document.getElementById('editRol').value = item.rol || '';
    document.getElementById('editNotas').value = item.notas || '';
    document.getElementById('ejemploNotasTexto').innerText = item.ejemplo_notas || '';
    const urlEjemplo = item.url_ejemplo || '#';
    const extLink = item.external_links || '#';
    document.getElementById('contadorModal').innerText = `${index+1}/${items.length}`;
    const urlsContainer = document.getElementById('urlsEjemploContainer');
    urlsContainer.innerHTML = '';
    if(item.external_links){
        item.external_links.forEach((url, idx) => {
            const link = document.createElement('a');
            link.href = url.url;
            link.target = '_blank';
            link.className = 'btn btn-sm btn-outline-primary me-1 mb-1';
            link.textContent = `${url.texto_visible}`;
            urlsContainer.appendChild(link);
        });
    /*}
    if (item.urls_ejemplo && item.urls_ejemplo.length) {
        item.urls_ejemplo.forEach((url, idx) => {
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.className = 'btn btn-sm btn-outline-primary me-1 mb-1';
            link.textContent = `Ejemplo ${idx+1}`;
            urlsContainer.appendChild(link);
        });*/
    } else {
        console.warn('No se pudo cargar los links externos');
        urlsContainer.innerHTML = '<span class="text-muted">Sin enlaces</span>';
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

// Eventos del modal
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

// Exportar a Excel
function exportarExcel() {
    const wb = XLSX.utils.book_new();
    for (let tem of tematicasOrden) {
        const itemsFiltrados = items.filter(i => i.tematica === tem);
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
        XLSX.utils.book_append_sheet(wb, ws, tem.slice(0,31));
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

// Exportar a PDF
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
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top;}
        th { background-color: #ff0000; }
        .tabla-pdf th:nth-child(1), .tabla-pdf td:nth-child(1) { width: 60px; }   /* Icono */
        .tabla-pdf th:nth-child(2), .tabla-pdf td:nth-child(2) { width: 25%; }    /* Actividad */
        .tabla-pdf th:nth-child(3), .tabla-pdf td:nth-child(3) { width: 100px; }  /* Experiencia */
        .tabla-pdf th:nth-child(4), .tabla-pdf td:nth-child(4) { width: 150px; }  /* Interés */
        .tabla-pdf th:nth-child(5), .tabla-pdf td:nth-child(5) { width: 80px; }   /* Rol */
        .tabla-pdf th:nth-child(6), .tabla-pdf td:nth-child(6) { width: auto; }   /* Notas */
        .interes-icono-tabla { margin-right: 6px; font-size: 0.9rem; display: inline-block; width: 1.2rem; text-align: center; }
    `;
    pdfContent.appendChild(style);

    // Obtener valores del formulario de usuario
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

    for (let tem of tematicasOrden) {
        const itemsFiltrados = items.filter(i => i.tematica === tem);
        if (!itemsFiltrados.length) continue;
        let tabla = `<h3>${tem}</h3>
        <table class="tabla-pdf">
            <thead>
                <tr><th></th><th>Actividad</th><th>Experiencia</th><th>Interés</th><th>Rol</th><th>Notas</th></tr>
            </thead>
            <tbody>`;
        itemsFiltrados.forEach(i => {
            const clase = getClaseInteres(i.interes);
            const iconoInteres = getIconoInteres(i.interes);
            // Mostrar icono + texto en la celda de Interés
            const celdaInteres = iconoInteres ? `<span class="interes-icono-tabla">${iconoInteres}</span> ${i.interes || ''}` : (i.interes || '');
            tabla += `<tr class="${clase}">
                        <td>${i.emoji || ''}</td>
                        <td>${escapeHtml(i.actividad)}</td>
                        <td>${i.experiencia || ''}</td>
                        <td>${celdaInteres}</td>
                        <td>${i.rol || ''}</td>
                        <td>${i.notas || ''}</td>
                       `;
        });
        tabla += `</tbody>
        </table>`;
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
    const dataStr = JSON.stringify({ items }, null, 2);
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

// Inicialización al cargar la página
window.addEventListener('load', async () => {
    await cargarDatosIniciales();
    inmersivoModalInstance = new bootstrap.Modal(document.getElementById('inmersivoModal'));
    const welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'), { backdrop: 'static' });
    welcomeModal.show();
    document.getElementById('btnSiModal').onclick = () => welcomeModal.hide();
    document.getElementById('btnNoModal').onclick = () => welcomeModal.hide();
    // Control de teclado para el modal inmersivo
    document.addEventListener('keydown', function(e) {
        const modalElement = document.getElementById('inmersivoModal');
        if (!modalElement.classList.contains('show')) return;

        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                document.getElementById('btnAnteriorItem').click();
                break;
            case 'ArrowRight':
                e.preventDefault();
                document.getElementById('btnSiguienteItem').click();
                break;
            case 'Enter':
                e.preventDefault();
                document.getElementById('btnGuardarItemModal').click();
                break;
            case 'Escape':
                inmersivoModalInstance.hide();
                break;
            default: break;
        }
     });
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
        });
    // Slider interactivo
    const slider = document.getElementById('energiaSlider');
    const valorSpan = document.getElementById('energiaValor');
    if (slider && valorSpan) {
        slider.addEventListener('input', function() {
            valorSpan.innerText = this.value;
        });
    }
    // Asegurar edad mínima 18 por defecto si está vacío
    const edadInput = document.getElementById('edadUsuario');
    if (edadInput && (edadInput.value === '' || edadInput.value === null)) {
        edadInput.value = '18';
    }
    });
});

