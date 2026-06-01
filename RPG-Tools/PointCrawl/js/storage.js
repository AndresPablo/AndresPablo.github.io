
function saveToLocalStorage() {
    const data = {
        nodes: nodes.map(n => ({ ...n, iconImage: null, iconSrc: n.iconSrc })),
        connections: connections.map(c => ({ ...c, iconImage: null, iconSrc: c.iconSrc })),
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
        theme: exportThemeData()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadFromLocalStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    try {
        const data = JSON.parse(raw);

        // Cargar nodos (sin imágenes, sin variable newNode)
        nodes = data.nodes.map(n => {
            const innerLabelFont = n.innerLabelFont || getThemeFont('innerLabel');
            const externalLabelFont = n.externalLabelFont || getThemeFont('externalLabel');
            return {
                ...n,
                iconImage: null,
                iconSrc: n.iconSrc,
                iconColor: n.iconColor || '#ffffff',
                iconFlipX: n.iconFlipX || false,
                iconFlipY: n.iconFlipY || false,
                iconRotation: n.iconRotation !== undefined ? n.iconRotation : 0,
                innerLabelRotation: n.innerLabelRotation !== undefined ? n.innerLabelRotation : 0,
                externalLabelRotation: n.externalLabelRotation !== undefined ? n.externalLabelRotation : 0,
                borderColor: n.borderColor || '#000000',
                borderWidth: n.borderWidth !== undefined ? n.borderWidth : 0,
                innerLabelFont,
                externalLabelFont,
                glowEnabled: n.glowEnabled || false,
                glowColor: n.glowColor || '#ffff00',
                glowSize: n.glowSize || 10
            };
        });

        // Convertir nodos antiguos que usaban 'size' a 'radius' y 'scale'
        for (let node of nodes) {
            if (!node.radius) {
                if (node.size) {
                    const sizeMap = { small: 18, medium: 26, large: 34, giant: 68 };
                    node.radius = sizeMap[node.size] || 26;
                    delete node.size;
                } else {
                    node.radius = 26;
                }
            }
            if (!node.scale) {
                node.scale = 1.0;
            }
        }

        // Cargar conexiones
        connections = data.connections.map(c => {
            const labelFont = c.labelFont || getThemeFont('connectionLabel');
            return {
                ...c,
                iconImage: null,
                iconSrc: c.iconSrc,
                patternSize: c.patternSize || 1.0,
                opacity: c.opacity !== undefined ? c.opacity : 1.0,
                startCap: c.startCap || 'none',
                endCap: c.endCap || 'none',
                labelFont
            };
        });

        // Resto de variables
        nextNodeId = data.nextNodeId || 1;
        nextConnId = data.nextConnId || 1;
        canvasOrientation = data.canvasOrientation || "landscape";
        showGrid = data.showGrid !== undefined ? data.showGrid : true;
        gridType = data.gridType || "hex";
        cellSize = data.cellSize || 32;
        gridUnitsX = data.gridUnitsX || 12;
        gridUnitsY = data.gridUnitsY || 12;
        gridColor = data.gridColor || "#8a8a8a";
        gridAlpha = data.gridAlpha !== undefined ? data.gridAlpha : 0.25;
        snappingEnabled = data.snappingEnabled !== undefined ? data.snappingEnabled : false;
        canvasBgColor = data.canvasBgColor || "#ffffff";
        lastConnectionStyle = data.lastConnectionStyle || {
            color: "#000000",
            strokePattern: "normal",
            lineWidthLevel: 3,
            iconShape: "circle",
            iconFillColor: "#ffffff",
            text: "1 jornada",
            pattern: "none",
            patternCount: 0,
            patternSize: 1.0,
            opacity: 1.0,
            startCap: 'none',
            endCap: 'none',
            labelParallel: false,
            labelSide: "above",
            labelOffsetDistance: 15,
            labelBgColor: "#000000aa"
        };
        lastConnectionStyle.opacity = lastConnectionStyle.opacity !== undefined ? lastConnectionStyle.opacity : 1.0;

        // Load theme
        if (data.theme) {
            importThemeData(data.theme);
        }

        // Ajustar tamaño del canvas según orientación
        setCanvasSizeByOrientation(false);

        // Recargar imágenes
        for (let node of nodes) if (node.iconSrc) loadImageForNode(node, node.iconSrc);
        for (let conn of connections) if (conn.iconSrc) loadImageForConnection(conn, conn.iconSrc);

        // Renderizar y actualizar UI
        renderCanvas();
        updatePropertiesPanel();
        updateStatusMessage("Mapa cargado", false);
        return true;

    } catch (e) {
        console.warn("Error cargando localStorage:", e);
        return false;
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
        if (mapData.showGrid !== undefined) showGrid = mapData.showGrid;
        if (mapData.gridType) gridType = mapData.gridType;
        if (mapData.gridColor) gridColor = mapData.gridColor;
        if (mapData.gridAlpha !== undefined) gridAlpha = mapData.gridAlpha;
        if (mapData.snappingEnabled) snappingEnabled = mapData.snappingEnabled;
        if (mapData.lastConnectionStyle) lastConnectionStyle = mapData.lastConnectionStyle;
        
        // Load theme
        if (mapData.theme) {
            importThemeData(mapData.theme);
        }
        
        // Load nodes
        if (mapData.nodes && Array.isArray(mapData.nodes)) {
            mapData.nodes.forEach(nodeData => {
                const node = { ...nodeData };
                node.iconImage = null;
                node.innerLabelFont = node.innerLabelFont || getThemeFont('innerLabel');
                node.externalLabelFont = node.externalLabelFont || getThemeFont('externalLabel');
                node.glowEnabled = node.glowEnabled || false;
                node.glowColor = node.glowColor || '#ffff00';
                node.glowSize = node.glowSize || 10;
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
                conn.iconImage = null;
                conn.labelFont = conn.labelFont || getThemeFont('connectionLabel');
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

// export PNG
function captureCanvasWithOptions(useSolidBg, includeGrid) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    renderCanvasTo(tempCtx, tempCanvas, includeGrid, useSolidBg);
    return tempCanvas.toDataURL('image/png');
}
