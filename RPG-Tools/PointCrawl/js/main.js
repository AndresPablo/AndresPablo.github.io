

// ------------------------- EVENTOS -------------------------
//#region EVENTOS
document.getElementById('loadPremadeMapBtn').addEventListener('click', async () => {
    await discoverMaps();
    populateMapSelection();
    const startupModal = bootstrap.Modal.getInstance(document.getElementById('startupModal'));
    startupModal.hide();
    const mapModal = new bootstrap.Modal(document.getElementById('mapSelectionModal'));
    mapModal.show();
});

document.getElementById('startBlankMapBtn').addEventListener('click', () => {
    resetFullMap();
    const modal = bootstrap.Modal.getInstance(document.getElementById('startupModal'));
    modal.hide();
});

document.getElementById('loadLastSessionBtn').addEventListener('click', () => {
    if (!loadFromLocalStorage()) {
        resetFullMap();
    }
    const modal = bootstrap.Modal.getInstance(document.getElementById('startupModal'));
    modal.hide();
});

const radiusInputElement = document.getElementById('nodeRadiusInput');
if (radiusInputElement) {
    radiusInputElement.addEventListener('input', function(e) {
        if (selectedNodeId === null) return;
        const node = nodes.find(n => n.id === selectedNodeId);
        if (!node) return;
        
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = 26;
        val = Math.min(80, Math.max(12, val));
        node.radius = val;
        e.target.value = val; // asegura que el valor mostrado sea el válido
        renderCanvas();
        saveToLocalStorage();
    });
}

function setupEventListeners() {
    // --- Nodo ---
    document.getElementById('nodeBgColor')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) node.bgColor = e.target.value;
            renderCanvas(); saveToLocalStorage();
        }
    });
    document.getElementById('nodeShape')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) {
                node.shape = e.target.value;
                node.radius = getRadiusFromScale(node.shape, node.scale, currentCellSize);
            }
            renderCanvas(); saveToLocalStorage();
        }
    });
    document.getElementById('innerText')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) node.innerText = e.target.value;
            renderCanvas(); saveToLocalStorage();
        }
    });
    document.getElementById('labelText')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) node.labelText = e.target.value;
            renderCanvas(); saveToLocalStorage();
        }
    });
    document.getElementById('labelPos')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) node.labelPosition = e.target.value;
            renderCanvas(); saveToLocalStorage();
        }
    });
    document.getElementById('labelBgColor')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) node.labelBgColor = e.target.value;
            renderCanvas(); saveToLocalStorage();
        }
    });
    document.getElementById('iconColor')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) node.iconColor = e.target.value;
            renderCanvas(); saveToLocalStorage();
        }
    });
    document.getElementById('nodeIconFlipX')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) node.iconFlipX = e.target.checked;
            renderCanvas(); saveToLocalStorage();
        }
    });
    document.getElementById('nodeIconFlipY')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) node.iconFlipY = e.target.checked;
            renderCanvas(); saveToLocalStorage();
        }
    });
    document.getElementById('nodeIconRotation')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) {
                const rotation = parseFloat(e.target.value);
                node.iconRotation = isNaN(rotation) ? 0 : ((rotation % 360) + 360) % 360;
                e.target.value = node.iconRotation;
                renderCanvas(); saveToLocalStorage();
            }
        }
    });
    document.getElementById('externalLabelRotation')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) {
                const rotation = parseFloat(e.target.value);
                node.externalLabelRotation = isNaN(rotation) ? 0 : ((rotation % 360) + 360) % 360;
                e.target.value = node.externalLabelRotation;
                renderCanvas(); saveToLocalStorage();
            }
        }
    });
    document.getElementById('innerLabelRotation')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) {
                const rotation = parseFloat(e.target.value);
                node.innerLabelRotation = isNaN(rotation) ? 0 : ((rotation % 360) + 360) % 360;
                e.target.value = node.innerLabelRotation;
                renderCanvas(); saveToLocalStorage();
            }
        }
    });

    // ======================== FONT SETTINGS FOR NODES ========================
    
    // Internal label font
    document.getElementById('innerLabelFontFamily')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) {
                if (!node.innerLabelFont) node.innerLabelFont = getThemeFont('innerLabel');
                node.innerLabelFont.family = e.target.value;
                renderCanvas(); saveToLocalStorage();
            }
        }
    });
    document.getElementById('innerLabelFontSize')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) {
                if (!node.innerLabelFont) node.innerLabelFont = getThemeFont('innerLabel');
                node.innerLabelFont.size = parseInt(e.target.value) || 14;
                renderCanvas(); saveToLocalStorage();
            }
        }
    });
    document.getElementById('innerLabelFontColor')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) {
                if (!node.innerLabelFont) node.innerLabelFont = getThemeFont('innerLabel');
                node.innerLabelFont.color = e.target.value;
                renderCanvas(); saveToLocalStorage();
            }
        }
    });
    document.getElementById('innerLabelFontWeight')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) {
                if (!node.innerLabelFont) node.innerLabelFont = getThemeFont('innerLabel');
                node.innerLabelFont.weight = e.target.value;
                renderCanvas(); saveToLocalStorage();
            }
        }
    });

    // External label font
    document.getElementById('externalLabelFontFamily')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) {
                if (!node.externalLabelFont) node.externalLabelFont = getThemeFont('externalLabel');
                node.externalLabelFont.family = e.target.value;
                renderCanvas(); saveToLocalStorage();
            }
        }
    });
    document.getElementById('externalLabelFontSize')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) {
                if (!node.externalLabelFont) node.externalLabelFont = getThemeFont('externalLabel');
                node.externalLabelFont.size = parseInt(e.target.value) || 12;
                renderCanvas(); saveToLocalStorage();
            }
        }
    });
    document.getElementById('externalLabelFontColor')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) {
                if (!node.externalLabelFont) node.externalLabelFont = getThemeFont('externalLabel');
                node.externalLabelFont.color = e.target.value;
                renderCanvas(); saveToLocalStorage();
            }
        }
    });
    document.getElementById('externalLabelFontWeight')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) {
                if (!node.externalLabelFont) node.externalLabelFont = getThemeFont('externalLabel');
                node.externalLabelFont.weight = e.target.value;
                renderCanvas(); saveToLocalStorage();
            }
        }
    });

    // ======================== FONT SETTINGS FOR CONNECTIONS ========================
    
    document.getElementById('connLabelFontFamily')?.addEventListener('change', (e) => {
        if (selectedConnectionId !== null) {
            const conn = connections.find(c => c.id === selectedConnectionId);
            if (conn) {
                if (!conn.labelFont) conn.labelFont = getThemeFont('connectionLabel');
                conn.labelFont.family = e.target.value;
                renderCanvas(); saveToLocalStorage();
            }
        }
    });
    document.getElementById('connLabelFontSize')?.addEventListener('change', (e) => {
        if (selectedConnectionId !== null) {
            const conn = connections.find(c => c.id === selectedConnectionId);
            if (conn) {
                if (!conn.labelFont) conn.labelFont = getThemeFont('connectionLabel');
                conn.labelFont.size = parseInt(e.target.value) || 11;
                renderCanvas(); saveToLocalStorage();
            }
        }
    });
    document.getElementById('connLabelFontColor')?.addEventListener('change', (e) => {
        if (selectedConnectionId !== null) {
            const conn = connections.find(c => c.id === selectedConnectionId);
            if (conn) {
                if (!conn.labelFont) conn.labelFont = getThemeFont('connectionLabel');
                conn.labelFont.color = e.target.value;
                renderCanvas(); saveToLocalStorage();
            }
        }
    });
    document.getElementById('connLabelFontWeight')?.addEventListener('change', (e) => {
        if (selectedConnectionId !== null) {
            const conn = connections.find(c => c.id === selectedConnectionId);
            if (conn) {
                if (!conn.labelFont) conn.labelFont = getThemeFont('connectionLabel');
                conn.labelFont.weight = e.target.value;
                renderCanvas(); saveToLocalStorage();
            }
        }
    });

    // ======================== GLOW SETTINGS FOR NODES ========================
    document.getElementById('nodeGlowEnabled')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) {
                node.glowEnabled = e.target.checked;
                renderCanvas(); saveToLocalStorage();
            }
        }
    });
    document.getElementById('nodeGlowColor')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) {
                node.glowColor = e.target.value;
                renderCanvas(); saveToLocalStorage();
            }
        }
    });
    document.getElementById('nodeGlowSize')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) {
                node.glowSize = parseInt(e.target.value) || 10;
                renderCanvas(); saveToLocalStorage();
            }
        }
    });
    document.getElementById('nodeBorderColor')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) {
                node.borderColor = e.target.value;
                renderCanvas(); saveToLocalStorage();
            }
        }
    });
    document.getElementById('nodeBorderWidth')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) {
                const width = parseInt(e.target.value, 10);
                node.borderWidth = isNaN(width) ? 0 : width;
                e.target.value = node.borderWidth;
                renderCanvas(); saveToLocalStorage();
            }
        }
    });

    // Escala del nodo (input numérico)
    document.getElementById('nodeScaleInput')?.addEventListener('change', (e) => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) {
                let scale = parseFloat(e.target.value);
                if (isNaN(scale)) scale = 1;
                scale = Math.min(3, Math.max(0.2, scale));
                node.scale = scale;
                node.radius = getRadiusFromScale(node.shape, scale, currentCellSize);
                e.target.value = scale.toFixed(2);
                renderCanvas(); saveToLocalStorage();
            }
        }
    });
    // Botón reset escala
    document.getElementById('resetScaleBtn')?.addEventListener('click', () => {
        if (selectedNodeId !== null) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) {
                node.scale = 1.0;
                node.radius = getRadiusFromScale(node.shape, 1.0, currentCellSize);
                document.getElementById('nodeScaleInput').value = "1.00";
                renderCanvas(); saveToLocalStorage();
            }
        }
    });
    // Icono: cargar archivo, URL, selector, quitar, eliminar nodo
    document.getElementById('iconFile')?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (selectedNodeId && file) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) {
                const reader = new FileReader();
                reader.onload = ev => loadImageForNode(node, ev.target.result);
                reader.readAsDataURL(file);
            }
        }
    });
    document.getElementById('loadUrlIcon')?.addEventListener('click', () => {
        const url = document.getElementById('iconUrl')?.value;
        if (selectedNodeId && url) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) loadImageForNode(node, url);
        }
    });
    document.getElementById('selectIconBtn')?.addEventListener('click', async () => {
        if (selectedNodeId) {
            iconPickerTargetNodeId = selectedNodeId;
            selectedIconTags.clear();
            await populateIconPicker();
            const modalEl = document.getElementById('iconPickerModal');
            const iconModal = new bootstrap.Modal(modalEl);
            iconModal.show();
        }
    });
    document.getElementById('removeIconBtn')?.addEventListener('click', () => {
        if (selectedNodeId) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) {
                node.iconImage = null;
                node.iconSrc = null;
                renderCanvas(); updatePropertiesPanel(); saveToLocalStorage();
            }
        }
    });
    document.getElementById('deleteNodeBtn')?.addEventListener('click', () => {
        if (selectedNodeId) deleteNodeById(selectedNodeId);
    });

    document.getElementById('snappingToggle').addEventListener('change', (e) => {
        snappingEnabled = e.target.checked;
        updateStatusMessage(`Snapping ${snappingEnabled ? 'activado' : 'desactivado'}`, false);
    });

    // --- Conexión (similar, pero con sus propios IDs) ---
    // ... (puedes agregar aquí los eventos para conexión si los tienes,
    // pero asegúrate de que no se dupliquen con attachConnectionEvents)

    // Exportar, importar, configuraciones, etc. ya los tienes definidos fuera.
}

document.getElementById('resetScaleBtn')?.addEventListener('click', () => {
    if (selectedNodeId) {
        const node = nodes.find(n => n.id === selectedNodeId);
        if (node) {
            node.scale = 1.0;
            node.radius = getRadiusFromScale(node.shape, 1.0, currentCellSize);
            document.getElementById('nodeScaleInput').value = "1.00";
            renderCanvas();
            saveToLocalStorage();
        }
    }
});

function attachNodeEvents(node) {
    // Remove existing event listeners to prevent duplicates
    const elements = [
        'nodeBgColor', 'nodeBorderColor', 'nodeBorderWidth', 'nodeShape', 'nodeRadius', 'innerText', 'labelText', 'labelPos', 'labelBgColor', 'iconColor',
        'nodeIconFlipX', 'nodeIconFlipY', 'nodeIconRotation', 'externalLabelRotation', 'innerLabelRotation',
        'iconFile', 'loadUrlIcon', 'selectIconBtn', 'removeIconBtn', 'deleteNodeBtn'
    ];

    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            const clone = element.cloneNode(true);
            element.parentNode.replaceChild(clone, element);
        }
    });

    // Re-bind the color palette handlers for any replaced color inputs
    try { initializeColorPalettes(document.getElementById('nodePropertiesPanel') || document); } catch (err) { initializeColorPalettes(); }

    // Re-attach event listeners
    document.getElementById('nodeBgColor')?.addEventListener('change', e => { node.bgColor = e.target.value; renderCanvas(); saveToLocalStorage(); });
    document.getElementById('nodeShape')?.addEventListener('change', e => { node.shape = e.target.value; renderCanvas(); saveToLocalStorage(); });
    document.getElementById('innerText')?.addEventListener('change', e => { node.innerText = e.target.value; renderCanvas(); saveToLocalStorage(); });
    document.getElementById('labelText')?.addEventListener('change', e => { node.labelText = e.target.value; renderCanvas(); saveToLocalStorage(); });
    document.getElementById('labelPos')?.addEventListener('change', e => { node.labelPosition = e.target.value; renderCanvas(); saveToLocalStorage(); });
    document.getElementById('labelBgColor')?.addEventListener('change', e => { node.labelBgColor = e.target.value; renderCanvas(); saveToLocalStorage(); });
    document.getElementById('nodeBorderColor')?.addEventListener('change', e => { node.borderColor = e.target.value; renderCanvas(); saveToLocalStorage(); });
    document.getElementById('nodeBorderWidth')?.addEventListener('change', e => { const val = parseInt(e.target.value, 10); node.borderWidth = isNaN(val) ? 0 : val; renderCanvas(); saveToLocalStorage(); });
    document.getElementById('iconColor')?.addEventListener('change', e => { node.iconColor = e.target.value; renderCanvas(); saveToLocalStorage(); });
    document.getElementById('nodeIconFlipX')?.addEventListener('change', e => { node.iconFlipX = e.target.checked; renderCanvas(); saveToLocalStorage(); });
    document.getElementById('nodeIconFlipY')?.addEventListener('change', e => { node.iconFlipY = e.target.checked; renderCanvas(); saveToLocalStorage(); });
    document.getElementById('nodeIconRotation')?.addEventListener('change', e => {
        const rotation = parseFloat(e.target.value);
        node.iconRotation = isNaN(rotation) ? 0 : ((rotation % 360) + 360) % 360;
        e.target.value = node.iconRotation;
        renderCanvas(); saveToLocalStorage();
    });
    document.getElementById('externalLabelRotation')?.addEventListener('change', e => {
        const rotation = parseFloat(e.target.value);
        node.externalLabelRotation = isNaN(rotation) ? 0 : ((rotation % 360) + 360) % 360;
        e.target.value = node.externalLabelRotation;
        renderCanvas(); saveToLocalStorage();
    });
    document.getElementById('innerLabelRotation')?.addEventListener('change', e => {
        const rotation = parseFloat(e.target.value);
        node.innerLabelRotation = isNaN(rotation) ? 0 : ((rotation % 360) + 360) % 360;
        e.target.value = node.innerLabelRotation;
        renderCanvas(); saveToLocalStorage();
    });
    document.getElementById('iconFile')?.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = ev => { loadImageForNode(node, ev.target.result); };
            reader.readAsDataURL(file);
        }
    });
    document.getElementById('loadUrlIcon')?.addEventListener('click', () => {
        const url = document.getElementById('iconUrl')?.value;
        if (url) {
            node.iconSrc = url;
            loadImageForNode(node, url);
            saveToLocalStorage();
        }
    });
    document.getElementById('selectIconBtn')?.addEventListener('click', async () => {
        iconPickerTargetNodeId = node.id;
        selectedIconTags.clear(); // Reset filters when opening
        await populateIconPicker();
        const modalEl = document.getElementById('iconPickerModal');
        const iconModal = new bootstrap.Modal(modalEl);
        iconModal.show();
    });
    document.getElementById('removeIconBtn')?.addEventListener('click', () => {
        node.iconImage = null; node.iconSrc = null;
        renderCanvas(); updatePropertiesPanel(); saveToLocalStorage();
    });
    document.getElementById('deleteNodeBtn')?.addEventListener('click', () => deleteNodeById(node.id));

    document.getElementById('nodeScaleInput')?.addEventListener('change', e => {
        let scale = parseFloat(e.target.value);
        if (isNaN(scale)) scale = 1;
        scale = Math.min(3, Math.max(0.2, scale));
        node.radius = scale * currentCellSize;
        e.target.value = scale.toFixed(2);
        renderCanvas();
        saveToLocalStorage();
    });

    document.getElementById('resetScaleBtn')?.addEventListener('click', () => {
        const scaleInput = document.getElementById('nodeScaleInput');
        if (scaleInput && selectedNodeId) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node) {
                node.radius = currentCellSize;
                scaleInput.value = "1.00";
                renderCanvas();
                saveToLocalStorage();
            }
        }
    });
}

function attachConnectionEvents(conn) {
    // Remove existing event listeners to prevent duplicates
    const elements = [
        'lineColor', 'connOpacitySlider', 'strokePattern', 'lineWidthSlider', 'connText', 'connIconShape', 'connIconFill',
        'connIconFile', 'loadConnIconUrl', 'removeConnIconBtn', 'connPattern', 'patternCount', 'patternSize', 'deleteConnBtn',
        'connStartCap', 'connEndCap',
        'connLabelParallel', 'connLabelSide', 'connLabelOffset', 'connLabelBgColor'
    ];

    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            const clone = element.cloneNode(true);
            element.parentNode.replaceChild(clone, element);
        }
    });

    // Re-attach event listeners
    document.getElementById('lineColor')?.addEventListener('change', e => {
        conn.color = e.target.value;
        lastConnectionStyle.color = conn.color;
        renderCanvas(); saveToLocalStorage();
    });
    document.getElementById('connOpacitySlider')?.addEventListener('input', e => {
        const opacityValue = parseInt(e.target.value, 10) / 100;
        conn.opacity = opacityValue;
        lastConnectionStyle.opacity = conn.opacity;
        updateOpacityValue(conn.opacity);
        renderCanvas(); saveToLocalStorage();
    });
    document.getElementById('strokePattern')?.addEventListener('change', e => {
        conn.strokePattern = e.target.value;
        lastConnectionStyle.strokePattern = conn.strokePattern;
        renderCanvas(); saveToLocalStorage();
    });
    document.getElementById('lineWidthSlider')?.addEventListener('input', e => {
        const val = parseInt(e.target.value);
        conn.lineWidthLevel = val;
        lastConnectionStyle.lineWidthLevel = val;
        updateWidthValue(val);
        renderCanvas(); saveToLocalStorage();
    });
    document.getElementById('connText')?.addEventListener('change', e => {
        conn.text = e.target.value;
        lastConnectionStyle.text = conn.text;
        renderCanvas(); saveToLocalStorage();
    });
    document.getElementById('connIconShape')?.addEventListener('change', e => {
        conn.iconShape = e.target.value;
        lastConnectionStyle.iconShape = conn.iconShape;
        renderCanvas(); saveToLocalStorage();
    });
    document.getElementById('connIconFill')?.addEventListener('change', e => {
        conn.iconFillColor = e.target.value;
        lastConnectionStyle.iconFillColor = conn.iconFillColor;
        renderCanvas(); saveToLocalStorage();
    });
    document.getElementById('connIconFile')?.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = ev => loadImageForConnection(conn, ev.target.result);
            reader.readAsDataURL(file);
        }
    });
    document.getElementById('loadConnIconUrl')?.addEventListener('click', () => {
        const url = document.getElementById('connIconUrl')?.value;
        if (url) loadImageForConnection(conn, url);
    });
    document.getElementById('removeConnIconBtn')?.addEventListener('click', () => {
        conn.iconImage = null; conn.iconSrc = null;
        renderCanvas(); updatePropertiesPanel(); saveToLocalStorage();
    });
    document.getElementById('connPattern')?.addEventListener('change', e => {
        conn.pattern = e.target.value;
        lastConnectionStyle.pattern = conn.pattern;
        renderCanvas(); saveToLocalStorage();
    });
    document.getElementById('connStartCap')?.addEventListener('change', e => {
        conn.startCap = e.target.value;
        lastConnectionStyle.startCap = conn.startCap;
        renderCanvas(); saveToLocalStorage();
    });
    document.getElementById('connEndCap')?.addEventListener('change', e => {
        conn.endCap = e.target.value;
        lastConnectionStyle.endCap = conn.endCap;
        renderCanvas(); saveToLocalStorage();
    });
    document.getElementById('patternCount')?.addEventListener('input', e => {
        conn.patternCount = parseInt(e.target.value, 10);
        lastConnectionStyle.patternCount = conn.patternCount;
        updatePatternCountValue(conn.patternCount);
        renderCanvas(); saveToLocalStorage();
    });
    document.getElementById('patternSize')?.addEventListener('input', e => {
        conn.patternSize = parseFloat(e.target.value);
        lastConnectionStyle.patternSize = conn.patternSize;
        updatePatternSizeValue(conn.patternSize);
        renderCanvas(); saveToLocalStorage();
    });
    document.getElementById('connLabelParallel')?.addEventListener('change', e => {
        conn.labelParallel = e.target.checked;
        const controlsDiv = document.getElementById('labelSideOffsetControls');
        if (controlsDiv) controlsDiv.style.display = e.target.checked ? 'flex' : 'none';
        renderCanvas(); saveToLocalStorage();
    });
    document.getElementById('connLabelSide')?.addEventListener('change', e => {
        conn.labelSide = e.target.value;
        renderCanvas(); saveToLocalStorage();
    });
    document.getElementById('connLabelOffset')?.addEventListener('change', e => {
        conn.labelOffsetDistance = parseInt(e.target.value);
        renderCanvas(); saveToLocalStorage();
    });
    document.getElementById('connLabelBgColor')?.addEventListener('change', e => {
        conn.labelBgColor = e.target.value;
        lastConnectionStyle.labelBgColor = conn.labelBgColor;
        renderCanvas(); saveToLocalStorage();
    });
    document.getElementById('deleteConnBtn')?.addEventListener('click', () => deleteConnectionById(conn.id));
}




// Configurar eventos de modales
let modalSolidBg = true;
let modalIncludeGrid = true;
document.getElementById('modalSolidBgToggle').addEventListener('change', (e) => modalSolidBg = e.target.checked);
document.getElementById('modalIncludeGridToggle').addEventListener('change', (e) => modalIncludeGrid = e.target.checked);

document.getElementById('modalExportPngBtn').addEventListener('click', () => {
    const dataUrl = captureCanvasWithOptions(modalSolidBg, modalIncludeGrid);
    const link = document.createElement('a');
    link.download = 'pointcrawl_map.png';
    link.href = dataUrl;
    link.click();
    updateStatusMessage("PNG exportado", false);
});

document.getElementById('modalExportPdfBtn').addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;
    const imgData = captureCanvasWithOptions(modalSolidBg, modalIncludeGrid);
    const pdf = new jsPDF({ orientation: canvasOrientation === 'portrait' ? 'portrait' : 'landscape', unit: 'mm', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height / canvas.width) * pdfWidth;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    pdf.save('pointcrawl_map.pdf');
    updateStatusMessage("PDF generado", false);
});

document.getElementById('modalExportJsonBtn').addEventListener('click', () => {
    const data = {
        name,
        author,
        currentThemeName,
        nextNodeId,
        nextConnId,
        canvasOrientation,
        lastConnectionStyle,
        cellSize,
        showGrid,
        gridType,
        gridUnitsX,
        gridUnitsY,
        gridColor,
        gridAlpha,
        snappingEnabled,
        canvasBgColor,
        nodes: nodes.map(n => ({ ...n, iconImage: null, iconSrc: n.iconSrc })),
        connections: connections.map(c => ({ ...c, iconImage: null, iconSrc: c.iconSrc }))        
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `pointcrawl_map_${new Date().toISOString().slice(0, 10)}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
    updateStatusMessage("JSON exportado", false);
});

document.getElementById('importJsonBtn').addEventListener('click', () => {
    document.getElementById('jsonFileInput').click();
});

document.getElementById('jsonFileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            
            // Validar estructura básica
            if (!data.nodes || !Array.isArray(data.nodes) || !data.connections || !Array.isArray(data.connections)) {
                throw new Error("Estructura de JSON inválida");
            }
            
            // Cargar los datos
            author = data.author || "author error";
            source = data.source || "source error";
            nodes = data.nodes.map(n => ({ ...n, iconImage: null, iconSrc: n.iconSrc, iconColor: n.iconColor || '#ffffff', iconFlipX: n.iconFlipX || false, iconFlipY: n.iconFlipY || false, iconRotation: n.iconRotation !== undefined ? n.iconRotation : 0, innerLabelRotation: n.innerLabelRotation !== undefined ? n.innerLabelRotation : 0, externalLabelRotation: n.externalLabelRotation !== undefined ? n.externalLabelRotation : 0, borderColor: n.borderColor || '#000000', borderWidth: n.borderWidth !== undefined ? n.borderWidth : 0 }));
            connections = data.connections.map(c => ({ ...c, iconImage: null, iconSrc: c.iconSrc, patternSize: c.patternSize || 1.0, opacity: c.opacity !== undefined ? c.opacity : 1.0, startCap: c.startCap || 'none', endCap: c.endCap || 'none' }));
            nextNodeId = data.nextNodeId || 1;
            nextConnId = data.nextConnId || 1;
            canvasOrientation = data.canvasOrientation || "landscape";
            showGrid = data.showGrid !== undefined ? data.showGrid : true;
            gridType = data.gridType || "hex";
            snappingEnabled = data.snappingEnabled || false;
            currentThemeName = data.currentThemeName || "fantasy";
            setTheme(currentThemeName);
            lastConnectionStyle = data.lastConnectionStyle || { color: "#000000", strokePattern: "normal", lineWidthLevel: 3, iconShape: "circle", iconFillColor: "#ffffff", text: "1 jornada", pattern: "none", patternCount: 0, patternSize: 1.0, opacity: 1.0, startCap: 'none', endCap: 'none', labelParallel: false, labelSide: "above", labelOffsetDistance: 15, labelBgColor: "#000000aa" };
            lastConnectionStyle.opacity = lastConnectionStyle.opacity !== undefined ? lastConnectionStyle.opacity : 1.0;
            
            setCanvasSizeByOrientation(false);
            
            // Cargar imágenes si existen
            for (let node of nodes) if (node.iconSrc) loadImageForNode(node, node.iconSrc);
            for (let conn of connections) if (conn.iconSrc) loadImageForConnection(conn, conn.iconSrc);
            
            selectedNodeId = null;
            selectedConnectionId = null;
            
            renderCanvas();
            updatePropertiesPanel();
            saveToLocalStorage();
            updateStatusMessage("Mapa importado correctamente", false);
        } catch(error) {
            console.error("Error importando JSON:", error);
            updateStatusMessage(`Error al importar: ${error.message}`, true);
        }
    };
    reader.readAsText(file);
    
    // Limpiar el input para permitir cargar el mismo archivo otra vez
    e.target.value = '';
});

// Opciones de documento: orientación + configuraciones de grilla
document.getElementById('applyOrientationBtn').addEventListener('click', () => {
    const selectedOrientation = document.querySelector('input[name="orientationRadio"]:checked')?.value;
    const newGridType = document.getElementById('gridTypeSelect').value;
    const newCellSize = document.getElementById('cellSizeInput').value;
    const newShowGrid = document.getElementById('gridVisibleToggle').checked;
    const newGridColor = document.getElementById('gridColorInput').value;
    const newGridAlpha = parseFloat(document.getElementById('gridAlphaInput').value);
    const newCanvasBgColor = document.getElementById('canvasBgColorInput').value;
    let changed = false;

    if (selectedOrientation && selectedOrientation !== canvasOrientation) {
        canvasOrientation = selectedOrientation;
        setCanvasSizeByOrientation(false);
        changed = true;
    }
        if (!isNaN(newCellSize) && newCellSize !== cellSize) {
        cellSize = newCellSize;
        updateUnitsFromCellSize();
        changed = true;
    }
    if (newGridType !== gridType) {
        gridType = newGridType;
        changed = true;
    }
    if (newShowGrid !== showGrid) {
        showGrid = newShowGrid;
        changed = true;
    }
    if (newGridColor !== gridColor) {
        gridColor = newGridColor;
        changed = true;
    }
    if (!Number.isNaN(newGridAlpha) && newGridAlpha !== gridAlpha) {
        gridAlpha = newGridAlpha;
        changed = true;
    }
    if (newCanvasBgColor !== canvasBgColor) {
        canvasBgColor = newCanvasBgColor;
        changed = true;
    }


    if (changed) {
        updateCellSize();
        updateHexRadius();
        updateAllNodeRadii();
        saveToLocalStorage();
        renderCanvas();
        updateStatusMessage('Configuración aplicada', false);
    } else {
        updateStatusMessage('No hubo cambios en la configuración', false);
    }
});

// Sincronizar radio buttons con la orientación actual al abrir el modal
const settingsModalEl = document.getElementById('settingsModal');
settingsModalEl.addEventListener('show.bs.modal', () => {
    document.getElementById(canvasOrientation === 'portrait' ? 'orientVertical' : 'orientHorizontal').checked = true;
    document.getElementById('gridTypeSelect').value = gridType;
    document.getElementById('gridVisibleToggle').checked = showGrid;
    document.getElementById('cellSizeInput').value = cellSize;
    document.getElementById('gridColorInput').value = gridColor;
    document.getElementById('gridAlphaInput').value = gridAlpha;
    document.getElementById('canvasBgColorInput').value = canvasBgColor;
    document.getElementById('gridAlphaValue').innerText = `${Math.round(gridAlpha * 100)}%`;
});




// Manejador para cambiar el color de la grilla
const gridColorInput = document.getElementById('gridColorInput');
gridColorInput.addEventListener('change', (e) => {
    gridColor = e.target.value;
    saveToLocalStorage();
    renderCanvas();
    updateStatusMessage('Color de grilla actualizado', false);
});
// Manejador para cambiar el Alfa  de la grilla
const gridAlphaInput = document.getElementById('gridAlphaInput');
gridAlphaInput.addEventListener('input', (e) => {
    gridAlpha = parseFloat(e.target.value);
    document.getElementById('gridAlphaValue').innerText = `${Math.round(gridAlpha * 100)}%`;
    saveToLocalStorage();
    renderCanvas();
});

// Manejador para cambiar el color del canvas
const canvasBgColorInput = document.getElementById('canvasBgColorInput');
canvasBgColorInput.addEventListener('change', (e) => {
    canvasBgColor = e.target.value;
    saveToLocalStorage();
    renderCanvas();
    updateStatusMessage('Color de fondo del canvas actualizado', false);
});

// Manejador para cambiar el tipo de grilla
document.getElementById('gridTypeSelect').addEventListener('change', (e) => {
    gridType = e.target.value;
    saveToLocalStorage();
    renderCanvas();
    updateStatusMessage(`Tipo de grilla cambiado a ${gridType}`, false);
});

// Manejador para cambiar la visibilidad de la grilla
document.getElementById('gridVisibleToggle').addEventListener('change', (e) => {
    showGrid = e.target.checked;
    saveToLocalStorage();
    renderCanvas();
    updateStatusMessage(`Grilla ${showGrid ? 'visible' : 'oculta'}`, false);
});
// ======================== THEME SYSTEM EVENTS ========================

// Manejador para cambiar el tema
document.getElementById('themeSelect')?.addEventListener('change', (e) => {
    const themeName = e.target.value;
    setTheme(themeName);
    updateThemePaletteDisplay();
    saveToLocalStorage();
    updateStatusMessage(`Tema cambiado a ${getCurrentTheme().name}`, false);
});

// Initialize color palettes for all color inputs
function initializeUIColorPalettes() {
    // Initialize existing color inputs
    initializeColorPalettes();
    
    // Re-initialize whenever the DOM changes or modals are shown
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
        settingsModal.addEventListener('shown.bs.modal', () => {
            updateThemePaletteDisplay();
            initializeColorPalettes(settingsModal);
        });
    }
    
    // Also reinitialize when node properties panel updates
    const observer = new MutationObserver(() => {
        initializeColorPalettes();
    });
    
    const nodePanel = document.getElementById('nodePropertiesPanel');
    if (nodePanel) {
        observer.observe(nodePanel, { childList: true, subtree: true });
    }
    const connPanel = document.getElementById('connectionPropertiesPanel');
    if (connPanel) {
        observer.observe(connPanel, { childList: true, subtree: true });
    }
}


// Call after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeUIColorPalettes, 100);
});
//#endregion EVENTOS


// ------------------------- INICIALIZACIÓN DE BOTONES DE NAVBAR -------------------------
document.getElementById('newNodeNavBtn').addEventListener('click', () => {
    let x = 100 + Math.random() * (canvas.width - 200);
    let y = 100 + Math.random() * (canvas.height - 200);
    const newNode = addNodeRaw(x, y, "#000000", "circle", 1.0, "", "bottom", "#ffffffaa", "");
    renderCanvas();
    selectedNodeId = newNode.id;
    selectedConnectionId = null;
    updatePropertiesPanel();
    saveToLocalStorage();
    updateStatusMessage("Nodo añadido", false);
});
document.getElementById('duplicateNodeNavBtn').addEventListener('click', () => duplicateSelectedNode());
document.getElementById('resetNavBtn').addEventListener('click', () => resetFullMap());


// ------------------------- INITIALIZATION -------------------------
//#region INITIALIZATION
setupEventListeners();
renderCanvas();
document.getElementById('canvasBgColorInput').value = canvasBgColor;

// Initialize theme selector with current theme
document.getElementById('themeSelect').value = getCurrentThemeName();
updateThemePaletteDisplay();

// Initialize color palettes for all color inputs
initializeUIColorPalettes();

populateIconPicker();

// Show startup modal instead of auto-loading
showStartupModal();
//#endregion INITIALIZATION
