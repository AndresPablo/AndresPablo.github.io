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
    patternSize: 1.0
};

let exportSolidBackground = false;
let canvasOrientation = "landscape";
let gridSize = 26;
let showGrid = true;
let gridType = "hex";
let hexOrientation = "flat";
let gridColor = "#616161";
let gridAlpha = 0.18;
let canvasBgColor = "#ffffff";
const PORTRAIT_W = 800, PORTRAIT_H = 1131;
const LANDSCAPE_W = 1131, LANDSCAPE_H = 800;
const STORAGE_KEY = "pointcrawl_advanced_v6";
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

// Tamaños de nodos
const SIZE_MAP = { small: 18, medium: 26, large: 34, giant: 68 };

// Elementos DOM
const canvas = document.getElementById('pointcanvas');
const canvasContainer = document.getElementById('canvasContainer');
let ctx = canvas.getContext('2d');

// ------------------------- FUNCIONES BASE -------------------------
function getNodeRadius(node) { return SIZE_MAP[node.size] || SIZE_MAP.medium; }

function snapToGrid(x, y) {
    if (gridType === "hex") return snapToHexGrid(x, y, gridSize, hexOrientation);
    return {
        x: Math.round(x / gridSize) * gridSize,
        y: Math.round(y / gridSize) * gridSize
    };
}

function snapToHexGrid(x, y, size, orientation) {
    const sqrt3 = Math.sqrt(3);
    let q, r;
    if (orientation === "pointy") {
        q = (sqrt3 / 3 * x - 1 / 3 * y) / size;
        r = (2 / 3 * y) / size;
    } else { // flat
        q = (2 / 3 * x) / size;
        r = (-1 / 3 * x + sqrt3 / 3 * y) / size;
    }
    const cube = cubeRound({ x: q, y: -q - r, z: r });
    const axial = { q: cube.x, r: cube.z };
    return axialToPixel(axial.q, axial.r, size, orientation);
}

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

function hexToRgba(hex, alpha = 1) {
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

function updateStatusMessage(msg, isError = false) {
    const div = document.getElementById('statusMsg');
    div.innerHTML = `<i class="bi ${isError ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'}"></i> ${msg}`;
    div.style.background = isError ? "#992222" : "#2b2b2b";
    setTimeout(() => { if(!isError) div.style.background = "#2b2b2b"; }, 2200);
}

function saveToLocalStorage() {
    const data = {
        nodes: nodes.map(n => ({ ...n, iconImage: null, iconSrc: n.iconSrc })),
        connections: connections.map(c => ({ ...c, iconImage: null, iconSrc: c.iconSrc })),
        nextNodeId,
        nextConnId,
        canvasOrientation,
        lastConnectionStyle,
        gridSize,
        showGrid,
        gridType,
        hexOrientation,
        gridColor,
        gridAlpha,
        canvasBgColor
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadFromLocalStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    try {
        const data = JSON.parse(raw);
        nodes = data.nodes.map(n => ({ ...n, iconImage: null, iconSrc: n.iconSrc, iconColor: n.iconColor || '#ffffff' }));
        connections = data.connections.map(c => ({ ...c, iconImage: null, iconSrc: c.iconSrc, patternSize: c.patternSize || 1.0 }));
        nextNodeId = data.nextNodeId;
        nextConnId = data.nextConnId;
        canvasOrientation = data.canvasOrientation || "landscape";
        gridSize = data.gridSize || 26;
        showGrid = data.showGrid !== undefined ? data.showGrid : true;
        gridType = data.gridType || "hex";
        hexOrientation = data.hexOrientation || "flat";
        gridColor = data.gridColor || "#808080";
        gridAlpha = data.gridAlpha !== undefined ? data.gridAlpha : 0.18;
        canvasBgColor = data.canvasBgColor || "#ffffff";
        lastConnectionStyle = data.lastConnectionStyle || { color: "#000000", strokePattern: "normal", lineWidthLevel: 3, iconShape: "circle", iconFillColor: "#ffffff", text: "1 jornada", pattern: "none", patternCount: 0, patternSize: 1.0 };
        setCanvasSizeByOrientation(false);
        for (let node of nodes) if (node.iconSrc) loadImageForNode(node, node.iconSrc);
        for (let conn of connections) if (conn.iconSrc) loadImageForConnection(conn, conn.iconSrc);
        renderCanvas();
        updatePropertiesPanel();
        updateStatusMessage("Mapa cargado", false);
        return true;
    } catch(e) { console.warn(e); return false; }
}

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

// ------------------------- NODOS Y CONEXIONES -------------------------
function addNodeRaw(x, y, bgColor = "#000000", shape = "circle", size = "medium", labelText = "", labelPosition = "bottom", labelBgColor = "#ffffffaa", innerText = "") {
    const node = { id: nextNodeId++, x, y, bgColor, shape, size, labelText, labelPosition, labelBgColor, innerText, iconImage: null, iconSrc: null, iconColor: "#ffffff" };
    nodes.push(node);
    return node;
}

function addConnectionRaw(fromId, toId, color, strokePattern, lineWidthLevel, text, iconSrc = null, iconShape = "circle", iconFillColor = "#ffffff", pattern = "none", patternCount = 0, patternSize = 1.0) {
    const conn = { id: nextConnId++, fromId, toId, color, strokePattern, lineWidthLevel, text, iconSrc, iconImage: null, iconShape, iconFillColor, pattern, patternCount, patternSize };
    if (iconSrc) loadImageForConnection(conn, iconSrc);
    connections.push(conn);
    return conn;
}

function deleteNodeById(nodeId) {
    connections = connections.filter(c => c.fromId !== nodeId && c.toId !== nodeId);
    nodes = nodes.filter(n => n.id !== nodeId);
    if (selectedNodeId === nodeId) selectedNodeId = null;
    if (selectedConnectionId && !connections.some(c => c.id === selectedConnectionId)) selectedConnectionId = null;
    renderCanvas(); updatePropertiesPanel(); saveToLocalStorage();
}

function deleteConnectionById(connId) {
    connections = connections.filter(c => c.id !== connId);
    if (selectedConnectionId === connId) selectedConnectionId = null;
    renderCanvas(); updatePropertiesPanel(); saveToLocalStorage();
}

function addConnectionInteractive(fromId, toId) {
    if (fromId === toId) { updateStatusMessage("No autoconexión", true); return false; }
    const exists = connections.some(c => (c.fromId === fromId && c.toId === toId) || (c.fromId === toId && c.toId === fromId));
    if (exists) { updateStatusMessage("Ya existe conexión", true); return false; }
    addConnectionRaw(
        fromId, toId,
        lastConnectionStyle.color,
        lastConnectionStyle.strokePattern,
        lastConnectionStyle.lineWidthLevel,
        lastConnectionStyle.text,
        null,
        lastConnectionStyle.iconShape,
        lastConnectionStyle.iconFillColor,
        lastConnectionStyle.pattern,
        lastConnectionStyle.patternCount,
        lastConnectionStyle.patternSize
    );
    renderCanvas();
    updatePropertiesPanel();
    saveToLocalStorage();
    updateStatusMessage("Conexión creada con estilo reciente", false);
    return true;
}

function duplicateSelectedNode() {
    if (!selectedNodeId) {
        updateStatusMessage("No hay nodo seleccionado para duplicar", true);
        return;
    }
    const original = nodes.find(n => n.id === selectedNodeId);
    if (!original) return;
    const newX = Math.min(canvas.width - getNodeRadius(original) - 5, original.x + 40);
    const newY = Math.min(canvas.height - getNodeRadius(original) - 5, original.y + 40);
    const newNode = addNodeRaw(newX, newY, original.bgColor, original.shape, original.size, original.labelText, original.labelPosition, original.labelBgColor, original.innerText);
    newNode.iconColor = original.iconColor || '#ffffff';
    if (original.iconSrc) loadImageForNode(newNode, original.iconSrc);
    renderCanvas();
    selectedNodeId = newNode.id;
    selectedConnectionId = null;
    updatePropertiesPanel();
    saveToLocalStorage();
    updateStatusMessage(`Nodo duplicado (${newNode.id})`, false);
}

// ------------------------- DIBUJO -------------------------
function drawShape(ctx, x, y, radius, shape, bgColor, isSelected) {
    ctx.save();
    ctx.beginPath();
    if (shape === "circle") ctx.arc(x, y, radius, 0, Math.PI * 2);
    else if (shape === "square") ctx.rect(x - radius, y - radius, radius * 2, radius * 2);
    else if (shape === "hexagon") {
        const angles = [30, 90, 150, 210, 270, 330].map(d => d * Math.PI / 180);
        ctx.moveTo(x + radius * Math.cos(angles[0]), y + radius * Math.sin(angles[0]));
        for (let i = 1; i < angles.length; i++) ctx.lineTo(x + radius * Math.cos(angles[i]), y + radius * Math.sin(angles[i]));
        ctx.closePath();
    } else if (shape === "hexagon-flat") {
        const angles = [0, 60, 120, 180, 240, 300].map(d => d * Math.PI / 180);
        ctx.moveTo(x + radius * Math.cos(angles[0]), y + radius * Math.sin(angles[0]));
        for (let i = 1; i < angles.length; i++) ctx.lineTo(x + radius * Math.cos(angles[i]), y + radius * Math.sin(angles[i]));
        ctx.closePath();
    } else if (shape === "isometric") {
        const hw = radius * 0.9, hh = radius * 0.7;
        ctx.moveTo(x, y - hh);
        ctx.lineTo(x + hw, y);
        ctx.lineTo(x, y + hh);
        ctx.lineTo(x - hw, y);
        ctx.closePath();
    } else if (shape === "isometric-circle") {
        // Oval/ellipse for isometric circle - wider than tall
        ctx.ellipse(x, y, radius * 1.2, radius * 0.8, 0, 0, Math.PI * 2);
    } else if (shape === "diamond") {
        // Diamond shape (rotated square)
        const size = radius * 0.9;
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x - size, y);
        ctx.closePath();
    }
    ctx.fillStyle = bgColor;
    ctx.fill();
    if (isSelected) {
        ctx.strokeStyle = "#ffcc55";
        ctx.lineWidth = 2.5;
        ctx.stroke();
    }
    ctx.restore();
}

function drawInnerText(ctx, node, radius) {
    if (!node.innerText) return;
    ctx.save();
    ctx.font = "bold 14px 'Segoe UI'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const text = node.innerText;
    const metrics = ctx.measureText(text);
    const padding = 6;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(text, node.x, node.y);
    ctx.restore();
}

function drawLabel(ctx, node, radius) {
    if (!node.labelText || node.labelText.trim() === "") return;
    ctx.save();
    ctx.font = "bold 11px 'Segoe UI'";
    const text = node.labelText;
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const padding = 7;
    const offset = radius + 6;
    
    let x, y, textAlign, rectX, rectY;
    switch (node.labelPosition) {
        case "top":
            x = node.x;
            y = node.y - offset - 4;
            textAlign = "center";
            rectX = node.x - textWidth/2 - padding;
            rectY = y - 9;
            break;
        case "bottom":
            x = node.x;
            y = node.y + offset + 6;
            textAlign = "center";
            rectX = node.x - textWidth/2 - padding;
            rectY = y - 9;
            break;
        case "left":
            x = node.x - offset - 4;
            y = node.y;
            textAlign = "end";
            rectX = node.x - offset - textWidth - padding * 1.5;
            rectY = node.y - 9;
            break;
        case "right":
            x = node.x + offset + 4;
            y = node.y;
            textAlign = "start";
            rectX = node.x + offset + 2;
            rectY = node.y - 9;
            break;
        default:
            x = node.x;
            y = node.y + radius + 12;
            textAlign = "center";
            rectX = node.x - textWidth/2 - padding;
            rectY = y - 9;
    }
    
    ctx.fillStyle = node.labelBgColor || "#ffffffaa";
    ctx.fillRect(rectX, rectY, textWidth + padding * 2, 17);
    ctx.fillStyle = "#1e1a15";
    ctx.textAlign = textAlign;
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
    ctx.restore();
}

function drawIcon(ctx, node, radius) {
    if (node.iconImage && node.iconImage.complete && node.iconImage.naturalWidth > 0) {
        // Reduce icon size for isometric shapes to avoid clipping at edges
        let iconSize = radius * 1.2;
        if (node.shape === "isometric" || node.shape === "diamond") {
            iconSize = radius * 0.75;
        }
        ctx.save();
        ctx.beginPath();
        if (node.shape === "circle") ctx.arc(node.x, node.y, radius - 2, 0, Math.PI * 2);
        else if (node.shape === "square") ctx.rect(node.x - radius + 2, node.y - radius + 2, (radius - 2) * 2, (radius - 2) * 2);
        else if (node.shape === "hexagon") {
            const angles = [30, 90, 150, 210, 270, 330].map(d => d * Math.PI / 180);
            ctx.moveTo(node.x + (radius - 3) * Math.cos(angles[0]), node.y + (radius - 3) * Math.sin(angles[0]));
            for (let i = 1; i < angles.length; i++) ctx.lineTo(node.x + (radius - 3) * Math.cos(angles[i]), node.y + (radius - 3) * Math.sin(angles[i]));
            ctx.closePath();
        } else if (node.shape === "hexagon-flat") {
            const angles = [0, 60, 120, 180, 240, 300].map(d => d * Math.PI / 180);
            ctx.moveTo(node.x + (radius - 3) * Math.cos(angles[0]), node.y + (radius - 3) * Math.sin(angles[0]));
            for (let i = 1; i < angles.length; i++) ctx.lineTo(node.x + (radius - 3) * Math.cos(angles[i]), node.y + (radius - 3) * Math.sin(angles[i]));
            ctx.closePath();
        } else if (node.shape === "isometric") {
            const hw = radius * 0.9 - 2, hh = radius * 0.7 - 2;
            ctx.moveTo(node.x, node.y - hh);
            ctx.lineTo(node.x + hw, node.y);
            ctx.lineTo(node.x, node.y + hh);
            ctx.lineTo(node.x - hw, node.y);
            ctx.closePath();
        } else if (node.shape === "isometric-circle") {
            ctx.ellipse(node.x, node.y, (radius - 2) * 1.2, (radius - 2) * 0.8, 0, 0, Math.PI * 2);
        } else if (node.shape === "diamond") {
            const size = radius * 0.9 - 2;
            ctx.moveTo(node.x, node.y - size);
            ctx.lineTo(node.x + size, node.y);
            ctx.lineTo(node.x, node.y + size);
            ctx.lineTo(node.x - size, node.y);
            ctx.closePath();
        }
        ctx.clip();
        
        // Apply color tint if not white
        if (node.iconColor && node.iconColor !== '#ffffff') {
            // Create a colored version of the icon
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = node.iconImage.width;
            tempCanvas.height = node.iconImage.height;
            
            // Draw the original icon
            tempCtx.drawImage(node.iconImage, 0, 0);
            
            // Get image data
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const data = imageData.data;
            
            // Parse the target color
            const targetR = parseInt(node.iconColor.slice(1, 3), 16) / 255;
            const targetG = parseInt(node.iconColor.slice(3, 5), 16) / 255;
            const targetB = parseInt(node.iconColor.slice(5, 7), 16) / 255;
            
            // Apply color tint by multiplying with target color while preserving alpha
            for (let i = 0; i < data.length; i += 4) {
                const alpha = data[i + 3];
                if (alpha > 0) {
                    // Get original RGB values (normalized to 0-1)
                    const origR = data[i] / 255;
                    const origG = data[i + 1] / 255;
                    const origB = data[i + 2] / 255;
                    
                    // Calculate luminance (brightness) of original pixel
                    const luminance = 0.299 * origR + 0.587 * origG + 0.114 * origB;
                    
                    // Apply target color modulated by luminance
                    data[i] = Math.round(targetR * luminance * 255);     // Red
                    data[i + 1] = Math.round(targetG * luminance * 255); // Green
                    data[i + 2] = Math.round(targetB * luminance * 255); // Blue
                    // Keep original alpha
                }
            }
            
            tempCtx.putImageData(imageData, 0, 0);
            ctx.drawImage(tempCanvas, node.x - iconSize / 2, node.y - iconSize / 2, iconSize, iconSize);
        } else {
            // Draw normally for white/default color
            ctx.drawImage(node.iconImage, node.x - iconSize / 2, node.y - iconSize / 2, iconSize, iconSize);
        }
        
        ctx.restore();
    }
}

function mapWidthLevel(level) {
    const levels = { 1: 1.5, 2: 2.5, 3: 4, 4: 6, 5: 8.5 };
    return levels[level] || 2.5;
}

function drawWavyLine(ctx, fromX, fromY, toX, toY, amplitude, frequency) {
    const dist = Math.hypot(toX - fromX, toY - fromY);
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const segments = Math.max(30, Math.floor(dist / 5));
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = fromX + (toX - fromX) * t;
        let y = fromY + (toY - fromY) * t;
        const offset = Math.sin(t * Math.PI * frequency) * amplitude;
        const perpX = -Math.sin(angle) * offset;
        const perpY = Math.cos(angle) * offset;
        const nx = x + perpX, ny = y + perpY;
        if (i === 0) ctx.moveTo(nx, ny);
        else ctx.lineTo(nx, ny);
    }
    ctx.stroke();
}

function drawZigzagLine(ctx, fromX, fromY, toX, toY, zigSize = 8) {
    const dist = Math.hypot(toX - fromX, toY - fromY);
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const segments = Math.max(8, Math.floor(dist / zigSize));
    let zig = true;
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = fromX + (toX - fromX) * t;
        let y = fromY + (toY - fromY) * t;
        const offset = (zig ? zigSize / 1.5 : -zigSize / 1.5);
        const perpX = -Math.sin(angle) * offset;
        const perpY = Math.cos(angle) * offset;
        const nx = x + perpX, ny = y + perpY;
        if (i === 0) ctx.moveTo(nx, ny);
        else ctx.lineTo(nx, ny);
        zig = !zig;
    }
    ctx.stroke();
}

function drawPatternAlongLine(ctx, fromX, fromY, toX, toY, pattern, count, lineColor, lineWidth, patternSize = 1.0) {
    if (pattern === "none" || count === 0) return;
    
    const dx = toX - fromX;
    const dy = toY - fromY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    
    // Scale pattern size based on line width and user-defined size
    const sizeScale = Math.max(0.6, lineWidth / 2) * patternSize;
    
    ctx.save();
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = lineColor;
    
    for (let i = 1; i <= count; i++) {
        const t = i / (count + 1);
        const x = fromX + dx * t;
        const y = fromY + dy * t;
        
        drawPatternElement(ctx, pattern, x, y, angle, sizeScale, lineWidth);
    }
    ctx.restore();
}

function drawPatternAlongCurve(ctx, fromX, fromY, toX, toY, pattern, count, lineColor, lineWidth, patternSize, strokePattern) {
    if (pattern === "none" || count === 0) return;
    
    // Scale pattern size based on line width and user-defined size
    const sizeScale = Math.max(0.6, lineWidth / 2) * patternSize;
    
    ctx.save();
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = lineColor;
    
    // Sample points along the curve
    const dist = Math.hypot(toX - fromX, toY - fromY);
    const baseAngle = Math.atan2(toY - fromY, toX - fromX);
    
    for (let i = 1; i <= count; i++) {
        const t = i / (count + 1);
        
        let x, y, angle;
        
        if (strokePattern === "wavy_wide") {
            const amplitude = 7, frequency = 2.5;
            x = fromX + (toX - fromX) * t;
            let baseY = fromY + (toY - fromY) * t;
            const offset = Math.sin(t * Math.PI * frequency) * amplitude;
            const perpX = -Math.sin(baseAngle) * offset;
            const perpY = Math.cos(baseAngle) * offset;
            x = x + perpX;
            y = baseY + perpY;
            
            // Calculate local tangent for orientation
            const nextT = Math.min(t + 0.01, 1);
            const nextX = fromX + (toX - fromX) * nextT + (-Math.sin(baseAngle) * Math.sin(nextT * Math.PI * frequency) * amplitude);
            const nextY = fromY + (toY - fromY) * nextT + (Math.cos(baseAngle) * Math.sin(nextT * Math.PI * frequency) * amplitude);
            angle = Math.atan2(nextY - y, nextX - x);
            
        } else if (strokePattern === "wavy_short") {
            const amplitude = 5, frequency = 6;
            x = fromX + (toX - fromX) * t;
            let baseY = fromY + (toY - fromY) * t;
            const offset = Math.sin(t * Math.PI * frequency) * amplitude;
            const perpX = -Math.sin(baseAngle) * offset;
            const perpY = Math.cos(baseAngle) * offset;
            x = x + perpX;
            y = baseY + perpY;
            
            // Calculate local tangent for orientation
            const nextT = Math.min(t + 0.01, 1);
            const nextX = fromX + (toX - fromX) * nextT + (-Math.sin(baseAngle) * Math.sin(nextT * Math.PI * frequency) * amplitude);
            const nextY = fromY + (toY - fromY) * nextT + (Math.cos(baseAngle) * Math.sin(nextT * Math.PI * frequency) * amplitude);
            angle = Math.atan2(nextY - y, nextX - x);
            
        } else if (strokePattern === "zigzag") {
            const zigSize = 10;
            const segments = Math.max(8, Math.floor(dist / zigSize));
            const segmentT = t * segments;
            const segmentIndex = Math.floor(segmentT);
            const localT = segmentT - segmentIndex;
            
            const zig = segmentIndex % 2 === 0;
            const offset = zig ? zigSize / 1.5 : -zigSize / 1.5;
            
            x = fromX + (toX - fromX) * t;
            let baseY = fromY + (toY - fromY) * t;
            const perpX = -Math.sin(baseAngle) * offset;
            const perpY = Math.cos(baseAngle) * offset;
            x = x + perpX;
            y = baseY + perpY;
            
            // For zigzag, use the base line angle since zigzags are perpendicular
            angle = baseAngle;
        } else {
            // Fallback to straight line
            x = fromX + (toX - fromX) * t;
            y = fromY + (toY - fromY) * t;
            angle = baseAngle;
        }
        
        drawPatternElement(ctx, pattern, x, y, angle, sizeScale, lineWidth);
    }
    ctx.restore();
}

function drawPatternElement(ctx, pattern, x, y, angle, sizeScale, lineWidth) {
    if (pattern === "arrows") {
        const arrowSize = 8 * sizeScale;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(arrowSize, 0);
        ctx.lineTo(0, -arrowSize / 2);
        ctx.lineTo(0, arrowSize / 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    } else if (pattern === "dots") {
        const dotRadius = 3 * sizeScale;
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
    } else if (pattern === "squares") {
        const squareSize = 6 * sizeScale;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillRect(-squareSize / 2, -squareSize / 2, squareSize, squareSize);
        ctx.restore();
    } else if (pattern === "lines") {
        const lineLength = 8 * sizeScale;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.lineWidth = Math.max(1, lineWidth * 0.4);
        // Draw perpendicular lines (cross pattern)
        ctx.beginPath();
        ctx.moveTo(-lineLength / 2, 0);
        ctx.lineTo(lineLength / 2, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -lineLength / 2);
        ctx.lineTo(0, lineLength / 2);
        ctx.stroke();
        ctx.restore();
    }
}

function drawConnectionLine(ctx, fromNode, toNode, conn, isSelected) {
    const fromX = fromNode.x, fromY = fromNode.y;
    const toX = toNode.x, toY = toNode.y;
    ctx.save();
    const baseWidth = mapWidthLevel(conn.lineWidthLevel);
    ctx.lineWidth = isSelected ? baseWidth + 4 : baseWidth;
    ctx.strokeStyle = isSelected ? "#ffbc5e" : conn.color;
    ctx.shadowBlur = isSelected ? 4 : 0;
    if (conn.strokePattern === "dotted") ctx.setLineDash([4, 8]);
    else if (conn.strokePattern === "rayada") ctx.setLineDash([14, 10]);
    else ctx.setLineDash([]);

    if (conn.strokePattern === "wavy_wide") drawWavyLine(ctx, fromX, fromY, toX, toY, 7, 2.5);
    else if (conn.strokePattern === "wavy_short") drawWavyLine(ctx, fromX, fromY, toX, toY, 5, 6);
    else if (conn.strokePattern === "zigzag") drawZigzagLine(ctx, fromX, fromY, toX, toY, 10);
    else {
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
    }
    
    // Draw pattern along the line
    if (conn.strokePattern === "wavy_wide" || conn.strokePattern === "wavy_short" || conn.strokePattern === "zigzag") {
        drawPatternAlongCurve(ctx, fromX, fromY, toX, toY, conn.pattern, conn.patternCount, isSelected ? "#ffbc5e" : conn.color, baseWidth, conn.patternSize, conn.strokePattern);
    } else {
        drawPatternAlongLine(ctx, fromX, fromY, toX, toY, conn.pattern, conn.patternCount, isSelected ? "#ffbc5e" : conn.color, baseWidth, conn.patternSize);
    }

    const midX = (fromX + toX) / 2, midY = (fromY + toY) / 2;
    const iconSize = 18;
    
    // Ícono en el medio
    if (conn.iconImage && conn.iconImage.complete && conn.iconImage.naturalWidth > 0) {
        drawConnectionIconShape(ctx, midX, midY, conn.iconShape, iconSize, conn.color, conn.iconFillColor);
        ctx.save();
        ctx.beginPath();
        if (conn.iconShape === "circle") ctx.arc(midX, midY, iconSize / 2 - 1, 0, Math.PI * 2);
        else if (conn.iconShape === "square") ctx.rect(midX - iconSize / 2 + 1, midY - iconSize / 2 + 1, iconSize - 2, iconSize - 2);
        else if (conn.iconShape === "diamond") {
            ctx.moveTo(midX, midY - iconSize / 2 + 1);
            ctx.lineTo(midX + iconSize / 2 - 1, midY);
            ctx.lineTo(midX, midY + iconSize / 2 - 1);
            ctx.lineTo(midX - iconSize / 2 + 1, midY);
            ctx.closePath();
        }
        ctx.clip();
        ctx.drawImage(conn.iconImage, midX - iconSize / 2, midY - iconSize / 2, iconSize, iconSize);
        ctx.restore();
    } else if (conn.iconSrc && !conn.iconImage) {
        drawConnectionIconShape(ctx, midX, midY, conn.iconShape, iconSize, conn.color, conn.iconFillColor);
        ctx.fillStyle = "#888";
        ctx.font = "8px monospace";
        ctx.fillText("🖼️", midX - 4, midY + 3);
    }
    
    // Texto en el medio: corregido el centrado vertical
    if (conn.text && conn.text.trim() !== "") {
        ctx.font = "bold 11px 'Segoe UI'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const tW = ctx.measureText(conn.text).width;
        const padding = 5;
        // Fondo centrado exactamente
        ctx.fillStyle = "#000000aa";
        ctx.fillRect(midX - tW / 2 - padding, midY - 10, tW + padding * 2, 20);
        ctx.fillStyle = "#fef5e3";
        ctx.fillText(conn.text, midX, midY);
    }
    ctx.restore();
}

function drawConnectionIconShape(ctx, cx, cy, shape, size, borderColor, fillColor) {
    ctx.save();
    ctx.beginPath();
    const half = size / 2;
    if (shape === "circle") ctx.arc(cx, cy, half, 0, Math.PI * 2);
    else if (shape === "square") ctx.rect(cx - half, cy - half, size, size);
    else if (shape === "diamond") {
        ctx.moveTo(cx, cy - half);
        ctx.lineTo(cx + half, cy);
        ctx.lineTo(cx, cy + half);
        ctx.lineTo(cx - half, cy);
        ctx.closePath();
    }
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
}

// Returns an array of points along the wavy/zigzag line
function getPathPoints(fromX, fromY, toX, toY, style, amplitudeOrZigSize, frequencyOrSegments) {
    const points = [];
    const dist = Math.hypot(toX - fromX, toY - fromY);
    const angle = Math.atan2(toY - fromY, toX - fromX);
    
    if (style === 'wavy_wide' || style === 'wavy_short') {
        const amplitude = (style === 'wavy_wide') ? 7 : 5;
        const frequency = (style === 'wavy_wide') ? 2.5 : 6;
        const segments = Math.max(30, Math.floor(dist / 5));
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = fromX + (toX - fromX) * t;
            let y = fromY + (toY - fromY) * t;
            const offset = Math.sin(t * Math.PI * frequency) * amplitude;
            const perpX = -Math.sin(angle) * offset;
            const perpY = Math.cos(angle) * offset;
            points.push({ x: x + perpX, y: y + perpY });
        }
    } else if (style === 'zigzag') {
        const zigSize = 10;
        const segments = Math.max(8, Math.floor(dist / zigSize));
        let zig = true;
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = fromX + (toX - fromX) * t;
            let y = fromY + (toY - fromY) * t;
            const offset = (zig ? zigSize / 1.5 : -zigSize / 1.5);
            const perpX = -Math.sin(angle) * offset;
            const perpY = Math.cos(angle) * offset;
            points.push({ x: x + perpX, y: y + perpY });
            zig = !zig;
        }
    } else { // normal, dotted, rayada – straight line
        const segments = 2;
        points.push({ x: fromX, y: fromY });
        points.push({ x: toX, y: toY });
    }
    return points;
}

function drawPatternAlongPath(ctx, points, pattern, count, lineColor, lineWidth, patternSize) {
    if (pattern === 'none' || count === 0 || points.length < 2) return;
    
    // Compute cumulative distances along the path
    const distances = [0];
    for (let i = 1; i < points.length; i++) {
        const dx = points[i].x - points[i-1].x;
        const dy = points[i].y - points[i-1].y;
        distances.push(distances[i-1] + Math.hypot(dx, dy));
    }
    const totalLen = distances[distances.length-1];
    if (totalLen === 0) return;
    
    const step = totalLen / (count + 1);
    ctx.save();
    ctx.fillStyle = lineColor;
    ctx.strokeStyle = lineColor;
    
    for (let i = 1; i <= count; i++) {
        const targetDist = i * step;
        // Find segment containing targetDist
        let idx = 1;
        while (idx < distances.length && distances[idx] < targetDist) idx++;
        idx = Math.min(idx, distances.length-1);
        const t = (targetDist - distances[idx-1]) / (distances[idx] - distances[idx-1]);
        const x = points[idx-1].x + (points[idx].x - points[idx-1].x) * t;
        const y = points[idx-1].y + (points[idx].y - points[idx-1].y) * t;
        
        // Compute angle for orientation (for arrows)
        let angle = 0;
        if (pattern === 'arrows') {
            const dx = points[idx].x - points[idx-1].x;
            const dy = points[idx].y - points[idx-1].y;
            angle = Math.atan2(dy, dx);
        }
        
        const sizeScale = Math.max(0.6, lineWidth / 2) * patternSize;
        if (pattern === 'arrows') {
            const arrowSize = 8 * sizeScale;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(arrowSize, 0);
            ctx.lineTo(0, -arrowSize / 2);
            ctx.lineTo(0, arrowSize / 2);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        } else if (pattern === 'dots') {
            const dotRadius = 3 * sizeScale;
            ctx.beginPath();
            ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
            ctx.fill();
        } else if (pattern === 'squares') {
            const squareSize = 6 * sizeScale;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.fillRect(-squareSize/2, -squareSize/2, squareSize, squareSize);
            ctx.restore();
        } else if (pattern === 'lines') {
            const lineLength = 8 * sizeScale;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.lineWidth = Math.max(1, lineWidth * 0.4);
            ctx.beginPath();
            ctx.moveTo(-lineLength/2, 0);
            ctx.lineTo(lineLength/2, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, -lineLength/2);
            ctx.lineTo(0, lineLength/2);
            ctx.stroke();
            ctx.restore();
        }
    }
    ctx.restore();
}




//  *** GRILLA ***  //
function drawGrid(targetCtx = ctx, targetCanvas = canvas) {
    if (!showGrid) return;
    targetCtx.save();
    targetCtx.strokeStyle = hexToRgba(gridColor, gridAlpha);
    targetCtx.lineWidth = 1;
    if (gridType === "squares") {
        for (let x = 0; x <= targetCanvas.width; x += gridSize) {
            targetCtx.beginPath();
            targetCtx.moveTo(x + 0.5, 0);
            targetCtx.lineTo(x + 0.5, targetCanvas.height);
            targetCtx.stroke();
        }
        for (let y = 0; y <= targetCanvas.height; y += gridSize) {
            targetCtx.beginPath();
            targetCtx.moveTo(0, y + 0.5);
            targetCtx.lineTo(targetCanvas.width, y + 0.5);
            targetCtx.stroke();
        }
    } else if (gridType === "hex") {
        const r = gridSize;
        const angleOffset = hexOrientation === "pointy" ? -30 : 0;
        
        // Calculate bounds based on orientation
        let maxQ, maxR;
        if (hexOrientation === "pointy") {
            maxQ = Math.ceil(targetCanvas.width / (r * Math.sqrt(3))) + 1;
            maxR = Math.ceil(targetCanvas.height / (r * 1.5)) + 1;
        } else { // flat
            maxQ = Math.ceil(targetCanvas.width / (r * 1.5)) + 1;
            maxR = Math.ceil(targetCanvas.height / (r * Math.sqrt(3))) + 1;
        }
        
        for (let q = -maxQ; q <= maxQ; q++) {
            for (let rr = -maxR; rr <= maxR; rr++) {
                const center = axialToPixel(q, rr, r, hexOrientation);
                if (center.x < -r || center.x > targetCanvas.width + r || center.y < -r || center.y > targetCanvas.height + r) continue;
                
                targetCtx.beginPath();
                for (let side = 0; side < 6; side++) {
                    const angle = Math.PI / 180 * (60 * side + angleOffset);
                    const px = center.x + r * Math.cos(angle);
                    const py = center.y + r * Math.sin(angle);
                    if (side === 0) targetCtx.moveTo(px, py);
                    else targetCtx.lineTo(px, py);
                }
                targetCtx.closePath();
                targetCtx.stroke();
            }
        }
    }
    targetCtx.restore();
}

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
        drawShape(targetCtx, node.x, node.y, radius, node.shape, node.bgColor, selectedNodeId === node.id);
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
            // Snap to grid from center
            const snapped = snapToGrid(newX, newY);
            newX = snapped.x;
            newY = snapped.y;
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

// ------------------------- PANEL DE PROPIEDADES -------------------------
function updatePropertiesPanel() {
    const nodePanel = document.getElementById('nodePropertiesPanel');
    const connPanel = document.getElementById('connectionPropertiesPanel');

    if (selectedNodeId !== null) {
        const node = nodes.find(n => n.id === selectedNodeId);
        if (node) {
            // Show node panel, hide connection panel
            nodePanel.style.display = 'block';
            connPanel.style.display = 'none';

            // Update node field values
            document.getElementById('nodeBgColor').value = node.bgColor;
            document.getElementById('nodeShape').value = node.shape;
            document.getElementById('nodeSize').value = node.size;
            document.getElementById('innerText').value = node.innerText || '';
            document.getElementById('labelText').value = node.labelText || '';
            document.getElementById('labelPos').value = node.labelPosition;
            document.getElementById('labelBgColor').value = node.labelBgColor;
            document.getElementById('iconColor').value = node.iconColor || '#ffffff';

            // Update icon preview
            const iconPreview = document.getElementById('iconPreview');
            if (node.iconImage) {
                iconPreview.innerHTML = `<img src="${node.iconSrc}" style="filter: ${getIconFilter(node.iconColor || '#ffffff')}">`;
            } else {
                iconPreview.innerHTML = "Sin icono";
            }

            attachNodeEvents(node);
        }
    } else if (selectedConnectionId !== null) {
        const conn = connections.find(c => c.id === selectedConnectionId);
        if (conn) {
            // Show connection panel, hide node panel
            connPanel.style.display = 'block';
            nodePanel.style.display = 'none';

            // Update connection field values
            document.getElementById('lineColor').value = conn.color;
            document.getElementById('strokePattern').value = conn.strokePattern;
            document.getElementById('lineWidthSlider').value = conn.lineWidthLevel;
            document.getElementById('connText').value = conn.text || '';
            document.getElementById('connIconShape').value = conn.iconShape;
            document.getElementById('connIconFill').value = conn.iconFillColor;
            document.getElementById('connPattern').value = conn.pattern;
            document.getElementById('patternCount').value = conn.patternCount;
            document.getElementById('patternSize').value = conn.patternSize || 1.0;

            // Update slider values
            updateWidthValue(conn.lineWidthLevel);
            updatePatternCountValue(conn.patternCount);
            updatePatternSizeValue(conn.patternSize || 1.0);

            // Update connection icon preview
            const connIconPreview = document.getElementById('connIconPreview');
            if (conn.iconImage) {
                connIconPreview.innerHTML = `<img src="${conn.iconSrc}">`;
            } else {
                connIconPreview.innerHTML = "Sin ícono";
            }

            attachConnectionEvents(conn);
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

function attachNodeEvents(node) {
    // Remove existing event listeners to prevent duplicates
    const elements = [
        'nodeBgColor', 'nodeShape', 'nodeSize', 'innerText', 'labelText', 'labelPos', 'labelBgColor', 'iconColor',
        'iconFile', 'loadUrlIcon', 'selectIconBtn', 'removeIconBtn', 'deleteNodeBtn'
    ];

    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            const clone = element.cloneNode(true);
            element.parentNode.replaceChild(clone, element);
        }
    });

    // Re-attach event listeners
    document.getElementById('nodeBgColor')?.addEventListener('change', e => { node.bgColor = e.target.value; renderCanvas(); saveToLocalStorage(); });
    document.getElementById('nodeShape')?.addEventListener('change', e => { node.shape = e.target.value; renderCanvas(); saveToLocalStorage(); });
    document.getElementById('nodeSize')?.addEventListener('change', e => { node.size = e.target.value; renderCanvas(); saveToLocalStorage(); });
    document.getElementById('innerText')?.addEventListener('change', e => { node.innerText = e.target.value; renderCanvas(); saveToLocalStorage(); });
    document.getElementById('labelText')?.addEventListener('change', e => { node.labelText = e.target.value; renderCanvas(); saveToLocalStorage(); });
    document.getElementById('labelPos')?.addEventListener('change', e => { node.labelPosition = e.target.value; renderCanvas(); saveToLocalStorage(); });
    document.getElementById('labelBgColor')?.addEventListener('change', e => { node.labelBgColor = e.target.value; renderCanvas(); saveToLocalStorage(); });
    document.getElementById('iconColor')?.addEventListener('change', e => { node.iconColor = e.target.value; renderCanvas(); saveToLocalStorage(); });
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
}

function attachConnectionEvents(conn) {
    // Remove existing event listeners to prevent duplicates
    const elements = [
        'lineColor', 'strokePattern', 'lineWidthSlider', 'connText', 'connIconShape', 'connIconFill',
        'connIconFile', 'loadConnIconUrl', 'removeConnIconBtn', 'connPattern', 'patternCount', 'patternSize', 'deleteConnBtn'
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
    document.getElementById('deleteConnBtn')?.addEventListener('click', () => deleteConnectionById(conn.id));
}

function escapeHtml(str) { if (!str) return ""; return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m])); }

// ------------------------- EXPORTACIÓN (modal) -------------------------
function captureCanvasWithOptions(useSolidBg, includeGrid) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    renderCanvasTo(tempCtx, tempCanvas, includeGrid, useSolidBg);
    return tempCanvas.toDataURL('image/png');
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
        nodes: nodes.map(n => ({ ...n, iconImage: null, iconSrc: n.iconSrc })),
        connections: connections.map(c => ({ ...c, iconImage: null, iconSrc: c.iconSrc })),
        nextNodeId,
        nextConnId,
        canvasOrientation,
        lastConnectionStyle,
        gridSize,
        showGrid,
        gridType,
        hexOrientation
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
            nodes = data.nodes.map(n => ({ ...n, iconImage: null, iconSrc: n.iconSrc, iconColor: n.iconColor || '#ffffff' }));
            connections = data.connections.map(c => ({ ...c, iconImage: null, iconSrc: c.iconSrc, patternSize: c.patternSize || 1.0 }));
            nextNodeId = data.nextNodeId || 1;
            nextConnId = data.nextConnId || 1;
            canvasOrientation = data.canvasOrientation || "landscape";
            gridSize = data.gridSize || 26;
            showGrid = data.showGrid !== undefined ? data.showGrid : true;
            gridType = data.gridType || "hex";
            hexOrientation = data.hexOrientation || "flat";
            lastConnectionStyle = data.lastConnectionStyle || { color: "#000000", strokePattern: "normal", lineWidthLevel: 3, iconShape: "circle", iconFillColor: "#ffffff", text: "1 jornada", pattern: "none", patternCount: 0, patternSize: 1.0 };
            
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
    const newGridSize = parseInt(document.getElementById('gridSizeInput').value, 10) || gridSize;
    const newGridType = document.getElementById('gridTypeSelect').value;
    const newShowGrid = document.getElementById('gridVisibleToggle').checked;
    const newHexOrientation = document.getElementById('hexOrientationSelect').value;
    const newGridColor = document.getElementById('gridColorInput').value;
    const newGridAlpha = parseFloat(document.getElementById('gridAlphaInput').value);
    const newCanvasBgColor = document.getElementById('canvasBgColorInput').value;
    let changed = false;

    if (selectedOrientation && selectedOrientation !== canvasOrientation) {
        canvasOrientation = selectedOrientation;
        setCanvasSizeByOrientation(false);
        changed = true;
    }
    if (newGridSize !== gridSize) {
        gridSize = newGridSize;
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
    if (newHexOrientation !== hexOrientation) {
        hexOrientation = newHexOrientation;
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

    document.getElementById('hexOrientationDiv').style.display = gridType === 'hex' ? 'block' : 'none';

    if (changed) {
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
    document.getElementById('gridSizeInput').value = gridSize;
    document.getElementById('gridTypeSelect').value = gridType;
    document.getElementById('gridVisibleToggle').checked = showGrid;
    document.getElementById('hexOrientationSelect').value = hexOrientation;
    document.getElementById('gridColorInput').value = gridColor;
    document.getElementById('gridAlphaInput').value = gridAlpha;
    document.getElementById('canvasBgColorInput').value = canvasBgColor;
    document.getElementById('gridAlphaValue').innerText = `${Math.round(gridAlpha * 100)}%`;
    const hexDiv = document.getElementById('hexOrientationDiv');
    hexDiv.style.display = gridType === 'hex' ? 'block' : 'none';
});

// Manejador para cambiar el tamaño de la grilla
const gridSizeInput = document.getElementById('gridSizeInput');
gridSizeInput.addEventListener('change', (e) => {
    const newSize = parseInt(e.target.value, 10);
    if (!Number.isNaN(newSize) && newSize >= 8 && newSize <= 256) {
        gridSize = newSize;
        saveToLocalStorage();
        renderCanvas();
        updateStatusMessage(`Tamaño de grilla cambiado a ${gridSize}px`, false);
    }
});
const gridColorInput = document.getElementById('gridColorInput');
gridColorInput.addEventListener('change', (e) => {
    gridColor = e.target.value;
    saveToLocalStorage();
    renderCanvas();
    updateStatusMessage('Color de grilla actualizado', false);
});
const gridAlphaInput = document.getElementById('gridAlphaInput');
gridAlphaInput.addEventListener('input', (e) => {
    gridAlpha = parseFloat(e.target.value);
    document.getElementById('gridAlphaValue').innerText = `${Math.round(gridAlpha * 100)}%`;
    saveToLocalStorage();
    renderCanvas();
});
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
    const hexDiv = document.getElementById('hexOrientationDiv');
    hexDiv.style.display = gridType === 'hex' ? 'block' : 'none';
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

// Manejador para cambiar la orientación de hexágonos
document.getElementById('hexOrientationSelect').addEventListener('change', (e) => {
    hexOrientation = e.target.value;
    saveToLocalStorage();
    updateStatusMessage(`Orientación de hexágonos cambiada a ${hexOrientation}`, false);
});

// ------------------------- RESET Y DEMO -------------------------
function resetFullMap() {
    if (confirm("⚠️ ¿Reiniciar completamente el mapa? Se perderán todos los datos actuales.")) {
        nodes = [];
        connections = [];
        nextNodeId = 1;
        nextConnId = 1;
        selectedNodeId = null;
        selectedConnectionId = null;
        const n1 = addNodeRaw(300, 250, "#000000", "circle", "medium", "Cripta", "bottom", "#ffffffaa", "💀");
        const n2 = addNodeRaw(750, 380, "#000000", "square", "medium", "Bosque", "bottom", "#ffffffaa", "🌲");
        const n3 = addNodeRaw(550, 600, "#000000", "isometric", "giant", "Montaña", "bottom", "#ffffffaa", "⛰️");
        addConnectionRaw(n1.id, n2.id, "#000000", "normal", 3, "2 días", null, "circle", "#ffffff");
        addConnectionRaw(n2.id, n3.id, "#000000", "rayada", 4, "1 día", null, "diamond", "#ffffff");
        addConnectionRaw(n1.id, n3.id, "#000000", "dotted", 2, "ruta oculta", null, "square", "#ffffff");
        lastConnectionStyle = { color: "#000000", strokePattern: "normal", lineWidthLevel: 3, iconShape: "circle", iconFillColor: "#ffffff", text: "1 jornada", pattern: "none", patternCount: 0, patternSize: 1.0 };
        renderCanvas();
        updatePropertiesPanel();
        saveToLocalStorage();
        updateStatusMessage("Mapa reiniciado a demo oscuro", false);
    }
}

// ------------------------- INICIALIZACIÓN DE BOTONES DE NAVBAR -------------------------
document.getElementById('newNodeNavBtn').addEventListener('click', () => {
    let x = 100 + Math.random() * (canvas.width - 200);
    let y = 100 + Math.random() * (canvas.height - 200);
    const newNode = addNodeRaw(x, y, "#000000", "circle", "medium", "", "bottom", "#ffffffaa", "");
    renderCanvas();
    selectedNodeId = newNode.id;
    selectedConnectionId = null;
    updatePropertiesPanel();
    saveToLocalStorage();
    updateStatusMessage("Nodo añadido", false);
});
document.getElementById('duplicateNodeNavBtn').addEventListener('click', () => duplicateSelectedNode());
document.getElementById('resetNavBtn').addEventListener('click', () => resetFullMap());

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

function loadMapFromData(mapData) {
    try {
        // Clear current data
        nodes = [];
        connections = [];
        nextNodeId = mapData.nextNodeId || 1;
        nextConnId = mapData.nextConnId || 1;
        
        // Load canvas settings
        if (mapData.canvasOrientation) {
            canvasOrientation = mapData.canvasOrientation;
            setCanvasSizeByOrientation(false);
        }
        if (mapData.gridSize !== undefined) gridSize = mapData.gridSize;
        if (mapData.showGrid !== undefined) showGrid = mapData.showGrid;
        if (mapData.gridType) gridType = mapData.gridType;
        if (mapData.hexOrientation) hexOrientation = mapData.hexOrientation;
        if (mapData.gridColor) gridColor = mapData.gridColor;
        if (mapData.gridAlpha !== undefined) gridAlpha = mapData.gridAlpha;
        if (mapData.lastConnectionStyle) lastConnectionStyle = mapData.lastConnectionStyle;
        
        // Load nodes
        if (mapData.nodes && Array.isArray(mapData.nodes)) {
            mapData.nodes.forEach(nodeData => {
                const node = { ...nodeData };
                if (node.iconSrc) {
                    loadImageForNode(node, node.iconSrc);
                }
                nodes.push(node);
            });
        }
        
        // Load connections
        if (mapData.connections && Array.isArray(mapData.connections)) {
            mapData.connections.forEach(connData => {
                const conn = { ...connData };
                if (conn.iconSrc) {
                    loadImageForConnection(conn, conn.iconSrc);
                }
                connections.push(conn);
            });
        }
        
        renderCanvas();
        updatePropertiesPanel();
        saveToLocalStorage();
        updateStatusMessage(`Mapa "${mapData.name || 'predefinido'}" cargado`, false);
        return true;
    } catch (error) {
        console.error('Error loading map:', error);
        updateStatusMessage('Error al cargar el mapa', true);
        return false;
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

// ------------------------- EVENT HANDLERS -------------------------
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

// ------------------------- INITIALIZATION -------------------------
renderCanvas();
document.getElementById('canvasBgColorInput').value = canvasBgColor;
populateIconPicker();

// Show startup modal instead of auto-loading
showStartupModal();