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
            document.getElementById('nodeBgColor').value = node.bgColor || "#000000";
            document.getElementById('nodeBorderColor').value = node.borderColor || "#000000";
            document.getElementById('nodeBorderWidth').value = node.borderWidth !== undefined ? node.borderWidth : 0;
            document.getElementById('nodeShape').value = node.shape;
            document.getElementById('innerText').value = node.innerText || '';
            document.getElementById('labelText').value = node.labelText || '';
            document.getElementById('labelPos').value = node.labelPosition;
            document.getElementById('labelBgColor').value = node.labelBgColor || "#000000";
            document.getElementById('iconColor').value = node.iconColor || '#ffffff';
            document.getElementById('nodeIconFlipX').checked = node.iconFlipX || false;
            document.getElementById('nodeIconFlipY').checked = node.iconFlipY || false;
            document.getElementById('nodeIconRotation').value = node.iconRotation !== undefined ? node.iconRotation : 0;
            document.getElementById('externalLabelRotation').value = node.externalLabelRotation !== undefined ? node.externalLabelRotation : 0;
            document.getElementById('innerLabelRotation').value = node.innerLabelRotation !== undefined ? node.innerLabelRotation : 0;
            if (scaleInput) {
                const scaleValue = (node.scale !== undefined && node.scale !== null) ? node.scale : 1.0;
                scaleInput.value = scaleValue.toFixed(2);
            }
            const shapeRadio = document.querySelector(`input[name="shape"][value="${node.shape}"]`);
            if (shapeRadio) {
                shapeRadio.checked = true;
            }
            
            // Update internal label font
            if (!node.innerLabelFont) node.innerLabelFont = getThemeFont('innerLabel');
            document.getElementById('innerLabelFontFamily').value = node.innerLabelFont.family || 'Georgia, serif';
            document.getElementById('innerLabelFontSize').value = node.innerLabelFont.size || 14;
            document.getElementById('innerLabelFontColor').value = node.innerLabelFont.color || '#000000';
            document.getElementById('innerLabelFontWeight').value = node.innerLabelFont.weight || 'bold';
            
            // Update external label font
            if (!node.externalLabelFont) node.externalLabelFont = getThemeFont('externalLabel');
            document.getElementById('externalLabelFontFamily').value = node.externalLabelFont.family || 'Georgia, serif';
            document.getElementById('externalLabelFontSize').value = node.externalLabelFont.size || 12;
            document.getElementById('externalLabelFontColor').value = node.externalLabelFont.color || '#000000';
            document.getElementById('externalLabelFontWeight').value = node.externalLabelFont.weight || 'normal';

            // Update glow settings
            document.getElementById('nodeGlowEnabled').checked = node.glowEnabled || false;
            document.getElementById('nodeGlowColor').value = node.glowColor || '#ffff00';
            document.getElementById('nodeGlowSize').value = node.glowSize || 10;

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
            document.getElementById('connOpacitySlider').value = Math.round((conn.opacity !== undefined ? conn.opacity : 1.0) * 100);
            document.getElementById('lineWidthSlider').value = conn.lineWidthLevel;
            document.getElementById('connText').value = conn.text || '';
            document.getElementById('connIconShape').value = conn.iconShape;
            document.getElementById('connIconFill').value = conn.iconFillColor;
            document.getElementById('connPattern').value = conn.pattern;
            document.getElementById('patternCount').value = conn.patternCount;
            document.getElementById('patternSize').value = conn.patternSize || 1.0;

            // Update connection label font
            if (!conn.labelFont) conn.labelFont = getThemeFont('connectionLabel');
            document.getElementById('connLabelFontFamily').value = conn.labelFont.family || 'Georgia, serif';
            document.getElementById('connLabelFontSize').value = conn.labelFont.size || 11;
            document.getElementById('connLabelFontColor').value = conn.labelFont.color || '#000000';
            document.getElementById('connLabelFontWeight').value = conn.labelFont.weight || 'normal';

            updateWidthValue(conn.lineWidthLevel);
            updateOpacityValue(conn.opacity !== undefined ? conn.opacity : 1.0);
            updatePatternCountValue(conn.patternCount);
            updatePatternSizeValue(conn.patternSize || 1.0);

            // Update parallel label controls
            document.getElementById('connLabelParallel').checked = conn.labelParallel || false;
            document.getElementById('connLabelSide').value = conn.labelSide || 'above';
            document.getElementById('connLabelOffset').value = conn.labelOffsetDistance || 15;
            document.getElementById('connLabelBgColor').value = conn.labelBgColor || '#000000';
            const controlsDiv = document.getElementById('labelSideOffsetControls');
            if (controlsDiv) controlsDiv.style.display = (conn.labelParallel ? 'flex' : 'none');

            const connIconPreview = document.getElementById('connIconPreview');
            if (conn.iconImage) {
                connIconPreview.innerHTML = `<img src="${conn.iconSrc}">`;
            } else {
                connIconPreview.innerHTML = "Sin ícono";
            }

            // Caps
            const startCapEl = document.getElementById('connStartCap');
            const endCapEl = document.getElementById('connEndCap');
            if (startCapEl) startCapEl.value = conn.startCap || 'none';
            if (endCapEl) endCapEl.value = conn.endCap || 'none';

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

function updateOpacityValue(value) {
    const span = document.getElementById('opacityValue');
    span.innerText = `${Math.round(value * 100)}%`;
}

function updatePatternSizeValue(value) {
    const span = document.getElementById('patternSizeValue');
    span.innerText = value.toFixed(2);
}

// Status Message

function updateStatusMessage(msg, isError = false) {
    const div = document.getElementById('statusMsg');
    const icon = isError ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill';
    const alertClass = isError ? 'alert-danger' : 'alert-success';
    
    // Update content
    div.innerHTML = `<button type="button" class="btn-close" data-bs-dismiss="alert"></button><div><i class="bi ${icon}"></i> ${msg}</div>`;
    
    // Remove all alert color classes and add the appropriate one
    div.className = div.className.replace(/alert-\w+/g, '');
    div.classList.add('alert', 'alert-dismissible', alertClass);
    
    // Show the alert
    div.style.display = 'block';
    
    // Auto-hide after 2.2 seconds if not an error
    if (!isError) {
        setTimeout(() => { div.style.display = 'none'; }, 2200);
    }
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
                        </small>
                    </div>
                    <button class="btn btn-primary btn-sm mt-2 load-map-btn" data-map-id="${map.id}">
                        Cargar
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

