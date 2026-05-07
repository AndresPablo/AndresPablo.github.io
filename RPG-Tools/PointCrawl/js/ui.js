// ------------------------- PANEL DE PROPIEDADES -------------------------
function updatePropertiesPanel() {
    const nodePanel = document.getElementById('nodePropertiesPanel');
    const connPanel = document.getElementById('connectionPropertiesPanel');
    const radiusInput = document.getElementById('nodeRadiusInput');
    const scaleInput = document.getElementById('nodeScaleInput');

    if (selectedNodeId !== null) {
        const node = nodes.find(n => n.id === selectedNodeId);
        if (node) {
            // Show node panel, hide connection panel
            nodePanel.style.display = 'block';
            connPanel.style.display = 'none';

            // Update node field values
            document.getElementById('nodeBgColor').value = node.bgColor;
            document.getElementById('nodeShape').value = node.shape;
            document.getElementById('innerText').value = node.innerText || '';
            document.getElementById('labelText').value = node.labelText || '';
            document.getElementById('labelPos').value = node.labelPosition;
            document.getElementById('labelBgColor').value = node.labelBgColor;
            document.getElementById('iconColor').value = node.iconColor || '#ffffff';
            if (scaleInput) scaleInput.value = node.scale.toFixed(2);
            

            // Update icon preview
            const iconPreview = document.getElementById('iconPreview');
            if (node.iconImage) {
                iconPreview.innerHTML = `<img src="${node.iconSrc}" style="filter: ${getIconFilter(node.iconColor || '#ffffff')}">`;
            } else {
                iconPreview.innerHTML = "Sin icono";
            }

            //attachNodeEvents(node); // TODO: DELETE
        }
    } else if (selectedConnectionId !== null) {
        const conn = connections.find(c => c.id === selectedConnectionId);
        console.log(selectedConnectionId)
        if (conn) {
            connPanel.style.display = 'block';
            nodePanel.style.display = 'none';

            // Actualizar campos
            document.getElementById('lineColor').value = conn.color;
            document.getElementById('strokePattern').value = conn.strokePattern;
            document.getElementById('lineWidthSlider').value = conn.lineWidthLevel;
            document.getElementById('connText').value = conn.text || '';
            document.getElementById('connIconShape').value = conn.iconShape;
            document.getElementById('connIconFill').value = conn.iconFillColor;
            document.getElementById('connPattern').value = conn.pattern;
            document.getElementById('patternCount').value = conn.patternCount;
            document.getElementById('patternSize').value = conn.patternSize || 1.0;

            updateWidthValue(conn.lineWidthLevel);
            updatePatternCountValue(conn.patternCount);
            updatePatternSizeValue(conn.patternSize || 1.0);

            const connIconPreview = document.getElementById('connIconPreview');
            if (conn.iconImage) {
                connIconPreview.innerHTML = `<img src="${conn.iconSrc}">`;
            } else {
                connIconPreview.innerHTML = "Sin ícono";
            }

            attachConnectionEvents(conn);
            
            document.getElementById('strokePattern').value = conn.strokePattern;
            document.getElementById('connIconShape').value = conn.iconShape;
            document.getElementById('connPattern').value = conn.pattern;
        }
    } else {
        // Hide both panels
        nodePanel.style.display = 'none';
        connPanel.style.display = 'none';
    }
}

function updateWidthValue(value) {
    const span = document.getElementById('widthValue');
    const labels = ['Muy fina', 'Fina', 'Media', 'Gruesa', 'Muy gruesa'];
    span.innerText = labels[value - 1];
}

function updatePatternCountValue(value) {
    const span = document.getElementById('patternCountValue');
    span.innerText = value;
}

function updatePatternSizeValue(value) {
    const span = document.getElementById('patternSizeValue');
    span.innerText = value.toFixed(2);
}

// Status Message

function updateStatusMessage(msg, isError = false) {
    const div = document.getElementById('statusMsg');
    div.innerHTML = `<i class="bi ${isError ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'}"></i> ${msg}`;
    div.style.background = isError ? "#992222" : "#2b2b2b";
    setTimeout(() => { if(!isError) div.style.background = "#2b2b2b"; }, 2200);
}

// ------------------------- MAP LOADING -------------------------
const mapsPath = "maps/";
let availableMaps = [];

async function discoverMaps() {
    availableMaps = [];
    let fileIndex = 1;
    let consecutiveErrors = 0;
    
    while (consecutiveErrors < 5) {
        const mapPath = `${mapsPath}${fileIndex}.json`;
        try {
            const response = await fetch(mapPath);
            if (response.ok) {
                const mapData = await response.json();
                const mapName = mapData.name || `Mapa ${fileIndex}`;
                availableMaps.push({
                    id: fileIndex,
                    name: mapName,
                    path: mapPath,
                    data: mapData
                });
                consecutiveErrors = 0;
                fileIndex++;
            } else {
                consecutiveErrors++;
                fileIndex++;
            }
        } catch (error) {
            consecutiveErrors++;
            fileIndex++;
        }
    }
}


function populateMapSelection() {
    const container = document.getElementById('mapList');
    container.innerHTML = '';
    
    if (availableMaps.length === 0) {
        container.innerHTML = '<div class="col-12 text-center text-light py-4"><i class="bi bi-info-circle"></i> No se encontraron mapas predefinidos en la carpeta "maps"</div>';
        return;
    }
    
    availableMaps.forEach(map => {
        const mapCard = document.createElement('div');
        mapCard.className = 'col-md-6 col-lg-4';
        mapCard.innerHTML = `
            <div class="card bg-secondary text-light h-100 map-card" data-map-id="${map.id}">
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title">${map.name}</h6>
                    <div class="card-text flex-grow-1">
                        <small class="text-muted">
                            ${map.data.author ? `Por ${map.data.author}` : 'Author'}<br>
                            ${map.data.nodes ? map.data.nodes.length : 0} nodos
                        </small>
                    </div>
                    <button class="btn btn-primary btn-sm mt-2 load-map-btn" data-map-id="${map.id}">
                        <i class="bi bi-play-circle"></i> Cargar
                    </button>
                </div>
            </div>
        `;
        container.appendChild(mapCard);
    });
    
    // Add event listeners
    document.querySelectorAll('.load-map-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mapId = parseInt(e.target.dataset.mapId);
            const selectedMap = availableMaps.find(m => m.id === mapId);
            if (selectedMap) {
                loadMapFromData(selectedMap.data);
                const modal = bootstrap.Modal.getInstance(document.getElementById('mapSelectionModal'));
                modal.hide();
                const startupModal = bootstrap.Modal.getInstance(document.getElementById('startupModal'));
                startupModal.hide();
            }
        });
    });
}

async function showStartupModal() {
    await discoverMaps();
    
    const startupModal = new bootstrap.Modal(document.getElementById('startupModal'), {
        backdrop: 'static',
        keyboard: false
    });
    startupModal.show();
}

