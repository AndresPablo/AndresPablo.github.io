// ------------------------- MODELO DE DATOS -------------------------
let nodes = [];
let connections = [];
let nextNodeId = 1;
let nextConnId = 1;

let selectedNodeId = null;
let selectedConnectionId = null;

// Arrastre de nodos
let draggingNodeId = null;
let dragOffsetX = 0, dragOffsetY = 0;

// Pan del canvas (arrastrar el fondo)
let isPanning = false;
let panStartX = 0, panStartY = 0;
let scrollLeft = 0, scrollTop = 0;

// Creación conexión con Ctrl
let ctrlPressed = false;
let previewLine = { active: false, fromNodeId: null, mouseX: 0, mouseY: 0 };

// Último estilo usado para nuevas conexiones
let lastConnectionStyle = {
    color: "#000000",
    strokePattern: "normal",
    lineWidthLevel: 3,
    iconShape: "circle",
    iconFillColor: "#ffffff",
    text: "1 jornada",
    pattern: "none",
    patternCount: 0,
    patternSize: 1.0,
    labelParallel: false,
    labelSide: "above",
    labelOffsetDistance: 15,
    labelBgColor: "#000000aa"
};

let exportSolidBackground = false;
let canvasOrientation = "landscape";
let showGrid = true;
let gridType = "square";
let gridColor = "#616161";
let gridAlpha = 0.25;
let cellW = 32;
let cellH = 32;
let snappingEnabled = true;
let canvasBgColor = "#ffffff";
const PORTRAIT_W = 800, PORTRAIT_H = 1131;
const LANDSCAPE_W = 1131, LANDSCAPE_H = 800;
const STORAGE_KEY = "pointcrawl_cartographer";
const iconLibraryPath = "node-icons/";
const ICON_FOLDERS = ["abstract", "default", "dungeon", "isometric", "modern", "other", "overland", "symbols"];
const ICON_FILE_MAP = {
    abstract: ["abstract-1.svg"],
    default: [
        "default-103.svg",
        "default-111.svg",
        "default-113.svg",
        "default-114.svg",
        "default-115.svg",
        "default-116.svg",
        "default-119.svg",
        "default-123.svg",
        "default-124.svg",
        "default-125.svg",
        "default-126.svg",
        "default-127.svg",
        "default-13.svg",
        "default-18.svg",
        "default-20.svg",
        "default-21.svg",
        "default-22.svg",
        "default-27.svg",
        "default-32.svg",
        "default-34.svg",
        "default-35.svg",
        "default-36.svg",
        "default-38.svg",
        "default-40.svg",
        "default-46.svg",
        "default-48.svg",
        "default-5.svg",
        "default-50.svg",
        "default-52.svg",
        "default-56.svg",
        "default-58.svg",
        "default-6.svg",
        "default-61.svg",
        "default-62.svg",
        "default-64.svg",
        "default-69.svg",
        "default-7.svg",
        "default-70.svg",
        "default-73.svg",
        "default-76.svg",
        "default-81.svg",
        "default-82.svg",
        "default-83.svg",
        "default-86.svg",
        "default-arrow-cluster.svg",
        "default-dig-dug.svg",
        "default-scales.svg"
    ],
    dungeon: [
        "dungeon-1.svg",
        "dungeon-102.svg",
        "dungeon-103.svg",
        "dungeon-107.svg",
        "dungeon-109.svg",
        "dungeon-110.svg",
        "dungeon-12.svg",
        "dungeon-120.svg",
        "dungeon-19.svg",
        "dungeon-27.svg",
        "dungeon-40.svg",
        "dungeon-56.svg",
        "dungeon-68.svg",
        "dungeon-71.svg",
        "dungeon-72.svg",
        "dungeon-88.svg",
        "dungeon-91.svg",
        "dungeon-98.svg",
        "dungeon-99.svg",
        "dungeon-spears.svg"
    ],
    isometric: [
        "isometric-1.svg",
        "isometric-105.svg",
        "isometric-30.svg",
        "isometric-33.svg",
        "isometric-53.svg",
        "isometric-68.svg",
        "isometric-71.svg",
        "isometric-89.svg",
        "isometric-tyre.svg"
    ],
    modern: [
        "modern-10.svg",
        "modern-105.svg",
        "modern-121.svg",
        "modern-16.svg",
        "modern-2.svg",
        "modern-29.svg",
        "modern-33.svg",
        "modern-4.svg",
        "modern-51.svg",
        "modern-54.svg",
        "modern-60.svg",
        "modern-74.svg",
        "modern-92.svg",
        "modern-93.svg",
        "modern-94.svg",
        "modern-airtight-hatch.svg",
        "modern-alien-skull.svg",
        "modern-alien-stare.svg",
        "modern-android-mask.svg",
        "modern-at-sea.svg",
        "modern-defense-satellite.svg",
        "modern-digital-trace.svg",
        "modern-double-ringed-orb.svg",
        "modern-duration.svg",
        "modern-falling-blob.svg",
        "modern-greenhouse.svg",
        "modern-habitat-dome.svg",
        "modern-holosphere.svg",
        "modern-laptop.svg",
        "modern-missile-pod.svg",
        "modern-moon.svg",
        "modern-nested-eclipses.svg",
        "modern-orbit.svg",
        "modern-orrery.svg",
        "modern-park-bench.svg",
        "modern-planet-conquest.svg",
        "modern-planet-core.svg",
        "modern-processor.svg",
        "modern-radar-dish.svg",
        "modern-ringed-planet.svg",
        "modern-robot-golem-1.svg",
        "modern-satellite.svg",
        "modern-sentry-gun.svg",
        "modern-spoutnik.svg",
        "modern-tyre.svg",
        "modern-wireframe-globe.svg"
    ],
    other: [
        "other-100.svg",
        "other-101.svg",
        "other-104.svg",
        "other-106.svg",
        "other-11.svg",
        "other-112.svg",
        "other-117.svg",
        "other-118.svg",
        "other-122.svg",
        "other-128.svg",
        "other-129.svg",
        "other-14.svg",
        "other-15.svg",
        "other-17.svg",
        "other-23.svg",
        "other-24.svg",
        "other-25.svg",
        "other-26.svg",
        "other-28.svg",
        "other-3.svg",
        "other-37.svg",
        "other-39.svg",
        "other-41.svg",
        "other-44.svg",
        "other-45.svg",
        "other-49.svg",
        "other-53.svg",
        "other-55.svg",
        "other-57.svg",
        "other-63.svg",
        "other-65.svg",
        "other-66.svg",
        "other-67.svg",
        "other-75.svg",
        "other-77.svg",
        "other-78.svg",
        "other-80.svg",
        "other-84.svg",
        "other-90.svg",
        "other-95.svg",
        "other-96.svg",
        "other-bullseye.svg",
        "other-crossbow.svg",
        "other-direction-sign.svg",
        "other-evil-eyes.svg",
        "other-high-shot.svg",
        "other-knight-banner.svg",
        "other-lightning-tear.svg",
        "other-stone-sphere.svg",
        "other-target-arrows.svg"
    ],
    overland: [],
    symbols: [
        "symbols-30.svg",
        "symbols-42.svg",
        "symbols-43.svg",
        "symbols-47.svg",
        "symbols-79.svg",
        "symbols-8.svg",
        "symbols-85.svg",
        "symbols-89.svg",
        "symbols-arrow-dunk.svg",
        "symbols-infinity.svg",
        "symbols-plain-arrow.svg",
        "symbols-thrust.svg",
        "symbols-vertical-flip.svg"
    ]
};
let availableNodeIcons = {};
let iconPickerTargetNodeId = null;
let selectedIconTags = new Set();

async function loadIconsFromFolders() {
    if (Object.keys(availableNodeIcons).length > 0) return;

    for (const folder of ICON_FOLDERS) {
        const filenames = ICON_FILE_MAP[folder] || [];
        availableNodeIcons[folder] = filenames.map(filename => `${folder}/${filename}`);
    }
}


//#region DOM

const canvas = document.getElementById('pointcanvas');
const canvasContainer = document.getElementById('canvasContainer');
let ctx = canvas.getContext('2d');
const MARGIN_CM = 2;

// Tamaños de nodos
let cellSize = 32;  // tamaño de celda en píxeles
gridUnitsX = 16;
gridUnitsY = 9;
let currentCellSize = canvas.width / gridUnitsX; // se actualiza al cambiar grilla o canvas
let hexRadius = 20; 

//#endregion DOM



function axialToPixel(q, r, size, orientation) {
    const sqrt3 = Math.sqrt(3);
    if (orientation === "pointy") {
        return {
            x: size * sqrt3 * (q + r / 2),
            y: size * 3 / 2 * r
        };
    } else { // flat
        return {
            x: size * 3 / 2 * q,
            y: size * sqrt3 * (r + q / 2)
        };
    }
}

function getMarginPx() {
    const widthCm = canvasOrientation === "landscape" ? 29.7 : 21.0;
    const pxPerCmX = canvas.width / widthCm;
    const pxPerCmY = canvas.height / (canvasOrientation === "landscape" ? 21.0 : 29.7);
    return Math.floor(MARGIN_CM * Math.min(pxPerCmX, pxPerCmY));
}

// Función auxiliar para convertir hex a rgba
function hexToRgba(hex, alpha = 1) {
    if (!hex || typeof hex !== 'string') hex = "#808080";
    const normalized = hex.startsWith('#') ? hex.slice(1) : hex;
    if (normalized.length !== 6) return `rgba(128,128,128,${alpha})`;
    const intVal = parseInt(normalized, 16);
    const r = (intVal >> 16) & 255;
    const g = (intVal >> 8) & 255;
    const b = intVal & 255;
    return `rgba(${r},${g},${b},${alpha})`;
}

function cubeRound(cube) {
    let rx = Math.round(cube.x);
    let ry = Math.round(cube.y);
    let rz = Math.round(cube.z);

    const xDiff = Math.abs(rx - cube.x);
    const yDiff = Math.abs(ry - cube.y);
    const zDiff = Math.abs(rz - cube.z);

    if (xDiff > yDiff && xDiff > zDiff) {
        rx = -ry - rz;
    } else if (yDiff > zDiff) {
        ry = -rx - rz;
    } else {
        rz = -rx - ry;
    }

    return { x: rx, y: ry, z: rz };
}

function getRadiusFromScale(shape, scale, cellW, cellH) {
    if (shape === "square") {
        return (cellW * scale) / 2;  // el cuadrado ocupa todo el ancho
    } else if (shape === "isometric" || shape === "isometric-circle") {
        // Para isométrico, el radio base = cellW/3 cuando scale=1
        return (cellW / 3) * scale;
    } else if (shape === "hexagon" || shape === "hexagon-flat") {
        // Para hexágonos, usa hexRadius definido aparte
        return hexRadius * scale;
    } else {
        // círculo, diamante, etc.
        return (cellW / 2) * scale;  // o cellH/2, pero usamos cellW para simetría
    }
}

// #region CANVAS 
function renderCanvasTo(targetCtx, targetCanvas, includeGrid = true, includeBackground = true) {
    if (includeBackground) {
        targetCtx.fillStyle = canvasBgColor;
        targetCtx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
    }
    if (includeGrid) drawGrid(targetCtx, targetCanvas);
    for (let conn of connections) {
        const fromN = nodes.find(n => n.id === conn.fromId);
        const toN = nodes.find(n => n.id === conn.toId);
        if (fromN && toN) drawConnectionLine(targetCtx, fromN, toN, conn, selectedConnectionId === conn.id);
    }
    if (previewLine.active && ctrlPressed && previewLine.fromNodeId) {
        const fromNode = nodes.find(n => n.id === previewLine.fromNodeId);
        if (fromNode) {
            targetCtx.save();
            targetCtx.setLineDash([6, 8]);
            targetCtx.lineWidth = 3;
            targetCtx.strokeStyle = "#ffac3c";
            targetCtx.beginPath();
            targetCtx.moveTo(fromNode.x, fromNode.y);
            targetCtx.lineTo(previewLine.mouseX, previewLine.mouseY);
            targetCtx.stroke();
            targetCtx.restore();
        }
    }
    for (let node of nodes) {
        const radius = getNodeRadius(node);
        drawShape(targetCtx, node.x, node.y, radius, node.shape, node.bgColor, selectedNodeId === node.id, node.glowEnabled, node.glowColor, node.glowSize);
        drawIcon(targetCtx, node, radius);
        drawInnerText(targetCtx, node, radius);
        drawLabel(targetCtx, node, radius);
    }
}

function renderCanvas() {
    renderCanvasTo(ctx, canvas, true);
}

// ------------------------- HIT DETECTION -------------------------
function getIconFilter(color) {
    // For SVG icons, we can use filters to apply color
    // For PNG icons, this won't work well, but we'll handle that in rendering
    if (color === '#ffffff' || !color) return 'none';
    
    // Convert hex to RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    // Create a filter that applies the color to black/white SVGs
    return `brightness(0) saturate(100%) invert(${r/255*100}%) sepia(${g/255*100}%) saturate(${b/255*100}%) hue-rotate(${Math.atan2(Math.sqrt(3)*(g-b), 2*r-g-b)*180/Math.PI}deg)`;
}

function hitTestNode(mx, my) {
    for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        const rad = getNodeRadius(n);
        let inside = false;
        
        if (n.shape === "square") {
            // Square hitbox for square nodes
            inside = (mx >= n.x - rad && mx <= n.x + rad && my >= n.y - rad && my <= n.y + rad);
        } else {
            // Circular hitbox for all other shapes
            inside = Math.hypot(mx - n.x, my - n.y) <= rad;
        }
        
        if (inside) return n.id;
    }
    return null;
}

function hitTestConnection(mx, my) {
    for (let conn of connections) {
        const f = nodes.find(n => n.id === conn.fromId);
        const t = nodes.find(n => n.id === conn.toId);
        if (f && t) {
            const dist = pointSegmentDistance(mx, my, f.x, f.y, t.x, t.y);
            if (dist < 12) return conn.id;
        }
    }
    return null;
}

function pointSegmentDistance(px, py, x1, y1, x2, y2) {
    const ax = px - x1, ay = py - y1;
    const bx = x2 - x1, by = y2 - y1;
    const len2 = bx * bx + by * by;
    if (len2 === 0) return Math.hypot(px - x1, py - y1);
    let t = (ax * bx + ay * by) / len2;
    t = Math.max(0, Math.min(1, t));
    const projx = x1 + t * bx, projy = y1 + t * by;
    return Math.hypot(px - projx, py - projy);
}

// ------------------------- EVENTOS DEL CANVAS (incluyendo pan) -------------------------
function escapeHtml(str) { if (!str) return ""; return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m])); }

function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let cx, cy;
    if (e.touches) { cx = e.touches[0].clientX; cy = e.touches[0].clientY; }
    else { cx = e.clientX; cy = e.clientY; }
    let canvasX = (cx - rect.left) * scaleX;
    let canvasY = (cy - rect.top) * scaleY;
    canvasX = Math.min(Math.max(0, canvasX), canvas.width);
    canvasY = Math.min(Math.max(0, canvasY), canvas.height);
    return { mx: canvasX, my: canvasY };
}

function onMouseDown(e) {
    if (e.cancelable) e.preventDefault();
    const { mx, my } = getCanvasCoords(e);
    const nodeHit = hitTestNode(mx, my);
    
    // Modo creación de conexión con Ctrl
    if (ctrlPressed && selectedNodeId !== null) {
        if (nodeHit === selectedNodeId) return;
        previewLine.active = true;
        previewLine.fromNodeId = selectedNodeId;
        previewLine.mouseX = mx;
        previewLine.mouseY = my;
        renderCanvas();
        return;
    }
    
    // Arrastre de nodo
    if (nodeHit !== null) {
        selectedNodeId = nodeHit;
        selectedConnectionId = null;
        draggingNodeId = nodeHit;
        const node = nodes.find(n => n.id === nodeHit);
        if (node) { dragOffsetX = node.x - mx; dragOffsetY = node.y - my; }
        renderCanvas();
        updatePropertiesPanel();
        return;
    }
    
    // Selección de conexión
    const connHit = hitTestConnection(mx, my);
    if (connHit !== null) {
        selectedConnectionId = connHit;
        selectedNodeId = null;
        draggingNodeId = null;
        renderCanvas();
        updatePropertiesPanel();
        return;
    }
    
    // Si no se selecciona nada, iniciar pan (arrastrar el canvas)
    selectedNodeId = null;
    selectedConnectionId = null;
    isPanning = true;
    panStartX = e.clientX;
    panStartY = e.clientY;
    scrollLeft = canvasContainer.scrollLeft;
    scrollTop = canvasContainer.scrollTop;
    canvasContainer.style.cursor = 'grabbing';
    e.preventDefault();
}

function onMouseMove(e) {
    if (draggingNodeId !== null || (previewLine.active && ctrlPressed && selectedNodeId !== null) || isPanning) {
        if (e.cancelable) e.preventDefault();
    }
    // Si estamos arrastrando un nodo
    if (draggingNodeId !== null) {
        const { mx, my } = getCanvasCoords(e);
        const node = nodes.find(n => n.id === draggingNodeId);
        if (node) {
            let newX = mx + dragOffsetX;
            let newY = my + dragOffsetY;
            if (snappingEnabled) {
                const snapped = snapToGrid(newX, newY);
                newX = snapped.x;
                newY = snapped.y;
            }
            const rad = getNodeRadius(node);
            newX = Math.min(Math.max(rad, newX), canvas.width - rad);
            newY = Math.min(Math.max(rad, newY), canvas.height - rad);
            node.x = newX; node.y = newY;
            renderCanvas();
            saveToLocalStorage();
        }
        return;
    }
    
    // Modo preview de conexión
    if (previewLine.active && ctrlPressed && selectedNodeId !== null) {
        const { mx, my } = getCanvasCoords(e);
        previewLine.mouseX = mx;
        previewLine.mouseY = my;
        renderCanvas();
        return;
    }
    
    // Modo pan
    if (isPanning) {
        const dx = e.clientX - panStartX;
        const dy = e.clientY - panStartY;
        canvasContainer.scrollLeft = scrollLeft - dx;
        canvasContainer.scrollTop = scrollTop - dy;
    }
}

function onMouseUp(e) {
    if (e.cancelable) e.preventDefault();
    if (previewLine.active && ctrlPressed && selectedNodeId !== null) {
        const { mx, my } = getCanvasCoords(e);
        const targetNodeId = hitTestNode(mx, my);
        if (targetNodeId && targetNodeId !== selectedNodeId && selectedNodeId !== null) {
            addConnectionInteractive(selectedNodeId, targetNodeId);
        }
        previewLine.active = false;
        renderCanvas();
    }
    draggingNodeId = null;
    if (isPanning) {
        isPanning = false;
        canvasContainer.style.cursor = 'grab';
    }
}

// Teclado global
window.addEventListener('keydown', (e) => {
    if (e.key === 'Control' || e.metaKey) ctrlPressed = true;
    if (e.key === 'Delete' || e.key === 'Supr') {
        if (selectedNodeId !== null) deleteNodeById(selectedNodeId);
        else if (selectedConnectionId !== null) deleteConnectionById(selectedConnectionId);
        e.preventDefault();
    }
    if (e.key === 'Escape') {
        selectedNodeId = null;
        selectedConnectionId = null;
        updatePropertiesPanel();
        renderCanvas();
        updateStatusMessage("Selección cancelada", false);
    }
    // Prevenir el scroll con Ctrl + rueda
    if (e.key === 'Control') e.preventDefault();
});
window.addEventListener('keyup', (e) => { if (e.key === 'Control') ctrlPressed = false; });

canvas.addEventListener('mousedown', onMouseDown);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mouseup', onMouseUp);
canvas.addEventListener('touchstart', onMouseDown, { passive: false });
window.addEventListener('touchmove', onMouseMove, { passive: false });
window.addEventListener('touchend', onMouseUp);

// Evitar gestos táctiles del navegador en el canvas
canvas.style.touchAction = 'none';

// Configurar cursor del contenedor
canvasContainer.style.cursor = 'grab';


// ------------------------- RESET Y DEMO -------------------------
function resetFullMap() {
    if (confirm("⚠️ ¿Reiniciar completamente el mapa? Se perderán todos los datos actuales.")) {
        nodes = [];
        connections = [];
        nextNodeId = 1;
        nextConnId = 1;
        selectedNodeId = null;
        selectedConnectionId = null;
        gridType = "hex-flat";
        canvasBgColor = "#ffffff";
        const n1 = addNodeRaw(300, 250, "#2c2c2c", "circle", 1, "Cripta", "bottom", "#ffffff", "💀");
        const n2 = addNodeRaw(750, 380, "#3b965a", "square", 1, "Bosque", "bottom", "#ffffff", "🌲");
        const n3 = addNodeRaw(550, 600, "#473700", "isometric", 2, "Montaña", "bottom", "#ffffffaa", "⛰️");
        addConnectionRaw(n1.id, n2.id, "#000000", "normal", 3, "2 días", null, "circle", "#ffffff");
        addConnectionRaw(n2.id, n3.id, "#000000", "rayada", 4, "1 día", null, "diamond", "#ffffff");
        addConnectionRaw(n1.id, n3.id, "#000000", "dotted", 2, "ruta oculta", null, "square", "#ffffff");
        lastConnectionStyle = { color: "#000000", strokePattern: "normal", lineWidthLevel: 3, iconShape: "circle", iconFillColor: "#ffffff", text: "1 jornada", pattern: "none", patternCount: 0, patternSize: 1.0, labelParallel: false, labelSide: "above", labelOffsetDistance: 15, labelBgColor: "#000000aa" };
        renderCanvas();
        updatePropertiesPanel();
        saveToLocalStorage();
        updateStatusMessage("Mapa reiniciado a demo oscuro", false);
    }
}

// OTRAS FUNCIONES BASE
function setCanvasSizeByOrientation(save = true) {
    const newWidth = canvasOrientation === "portrait" ? PORTRAIT_W : LANDSCAPE_W;
    const newHeight = canvasOrientation === "portrait" ? PORTRAIT_H : LANDSCAPE_H;
    if (canvas.width === newWidth && canvas.height === newHeight) return;
    const scaleX = newWidth / canvas.width;
    const scaleY = newHeight / canvas.height;
    for (let node of nodes) {
        node.x = Math.min(Math.max(getNodeRadius(node), node.x * scaleX), newWidth - getNodeRadius(node));
        node.y = Math.min(Math.max(getNodeRadius(node), node.y * scaleY), newHeight - getNodeRadius(node));
    }
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx = canvas.getContext('2d');
    updateUnitsFromCellSize()
    renderCanvas();
    if (save) saveToLocalStorage();
}

function loadImageForNode(node, src) {
    node.iconSrc = src;
    const img = new Image();
    img.onload = () => { node.iconImage = img; renderCanvas(); updatePropertiesPanel(); };
    img.src = src;
}

function loadImageForConnection(conn, src) {
    conn.iconSrc = src;
    const img = new Image();
    img.onload = () => { conn.iconImage = img; renderCanvas(); updatePropertiesPanel(); };
    img.src = src;
}

async function populateIconPicker() {
    const container = document.getElementById('iconPickerGrid');
    const tagsContainer = document.getElementById('iconPickerTags');
    if (!container || !tagsContainer) return;
    await loadIconsFromFolders();
    container.innerHTML = '';
    tagsContainer.innerHTML = '';
    const currentIconSrc = nodes.find(n => n.id === iconPickerTargetNodeId)?.iconSrc;
    
    // Get selected node's background color
    const selectedNode = nodes.find(n => n.id === iconPickerTargetNodeId);
    const nodeBgColor = selectedNode ? selectedNode.bgColor : '#000000';

    // Create tag filter buttons (above the scrollable panel)
    const tagContainer = document.createElement('div');
    tagContainer.className = 'icon-tag-container mb-3 pb-3 border-bottom border-secondary';
    tagContainer.innerHTML = '<div class="tag-label text-light mb-2 fw-bold">Categorías:</div>';

    const allTags = ICON_FOLDERS;
    allTags.forEach(tag => {
        const tagButton = document.createElement('button');
        tagButton.type = 'button';
        tagButton.className = `btn btn-sm me-2 mb-2 ${selectedIconTags.has(tag) ? 'btn-primary' : 'btn-outline-secondary'}`;
        tagButton.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
        tagButton.addEventListener('click', () => toggleIconTag(tag));
        tagContainer.appendChild(tagButton);
    });

    tagsContainer.appendChild(tagContainer);

    // Filter icons based on selected tags
    const filteredIcons = [];
    const activeTags = selectedIconTags.size > 0 ? Array.from(selectedIconTags) : ICON_FOLDERS;

    activeTags.forEach(tag => {
        if (availableNodeIcons[tag]) {
            availableNodeIcons[tag].forEach(filepath => {
                filteredIcons.push({ filepath, tag });
            });
        }
    });

    if (filteredIcons.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'text-light text-center py-5';
        emptyMsg.textContent = 'No se encontraron iconos en las carpetas seleccionadas';
        container.appendChild(emptyMsg);
        return;
    }

    // Create icon grid (without file names)
    const iconGrid = document.createElement('div');
    iconGrid.className = 'icon-grid';
    
    filteredIcons.forEach(({ filepath, tag }) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'icon-picker-card btn';
        button.style.backgroundColor = nodeBgColor;
        const itemSrc = iconLibraryPath + filepath;
        if (currentIconSrc === itemSrc) button.classList.add('selected');
        button.innerHTML = `<img src="${itemSrc}" alt="icon" title="${tag}">`;
        button.addEventListener('click', () => selectNodeIcon(filepath));
        iconGrid.appendChild(button);
    });
    
    container.appendChild(iconGrid);
}

function toggleIconTag(tag) {
    if (selectedIconTags.has(tag)) {
        selectedIconTags.delete(tag);
    } else {
        selectedIconTags.add(tag);
    }
    populateIconPicker();
}

function selectNodeIcon(filepath) {
    const node = nodes.find(n => n.id === iconPickerTargetNodeId);
    if (!node) return;
    const iconSrc = iconLibraryPath + filepath;
    node.iconSrc = iconSrc;
    loadImageForNode(node, iconSrc);
    saveToLocalStorage();
    const modalEl = document.getElementById('iconPickerModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
}