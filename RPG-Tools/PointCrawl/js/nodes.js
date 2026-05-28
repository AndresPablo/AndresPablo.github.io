function drawShape(ctx, x, y, radius, shape, bgColor, isSelected, glowEnabled = false, glowColor = "#ffff00", glowSize = 10) {
    ctx.save();
    
    // Draw glow if enabled
    if (glowEnabled && glowSize > 0) {
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = glowSize;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }
    
    ctx.beginPath();
    if (shape === "circle"){
        ctx.arc(x, y, radius, 0, Math.PI * 2);
    } 
    else if (shape === "square"){
            // El lado del cuadrado es 2 * radius, debe ser igual a cellSize cuando scale=1
    const side = radius * 2;
    ctx.rect(x - side/2, y - side/2, side, side);
    }
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
        // Proporción isométrica: ancho = 2 * alto
        const width = radius * 1.5;      // semi-ancho horizontal
        const height = radius * 0.75;    // semi-alto vertical
        ctx.moveTo(x, y - height);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x, y + height);
        ctx.lineTo(x - width, y);
        ctx.closePath();
    } else if (shape === "isometric-circle") {
        // Oval/ellipse for isometric circle - wider than tall
        const radX = radius * 1.5;
        const radY = radius * 0.75;
        ctx.ellipse(x, y, radX, radY, 0, 0, Math.PI * 2);
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

function updateHexRadius() {
    const cellW = canvas.width / gridUnitsX;
    const cellH = canvas.height / gridUnitsY;
    // Para hexágonos regulares, el radio se calcula según la orientación
    if (gridType === "hex-pointy") {
        // Distancia horizontal entre centros = sqrt(3) * radius
        hexRadius = cellW / Math.sqrt(3);
    } else if (gridType === "hex-flat") {
        // Distancia vertical entre centros = sqrt(3) * radius
        hexRadius = cellH / Math.sqrt(3);
    } else {
        hexRadius = Math.min(cellW, cellH) / 2;
    }
    hexRadius = Math.max(4, Math.min(100, hexRadius));
}

function drawInnerText(ctx, node, radius) {
    if (!node.innerText) return;
    ctx.save();
    
    // Get font settings from node or use defaults
    const fontSettings = node.innerLabelFont || getThemeFont('innerLabel');
    ctx.font = `${fontSettings.weight} ${fontSettings.size}px ${fontSettings.family}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = fontSettings.color || "#ffffff";
    
    const text = node.innerText;
    const metrics = ctx.measureText(text);
    const padding = 6;
    ctx.fillText(text, node.x, node.y);
    ctx.restore();
}

function drawLabel(ctx, node, radius) {
    if (!node.labelText || node.labelText.trim() === "") return;
    ctx.save();
    
    // Get font settings from node or use defaults
    const fontSettings = node.externalLabelFont || getThemeFont('externalLabel');
    // Don't quote font family - Canvas API handles it better without quotes when comma-separated
    const fontString = `${fontSettings.weight} ${fontSettings.size}px ${fontSettings.family}`;
    ctx.font = fontString;
    ctx.fillStyle = fontSettings.color || "#1D3557";
    
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
    // Reset fillStyle to font color for text rendering
    ctx.fillStyle = fontSettings.color || "#1D3557";
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

function calcRadiusFromScale(shape, scale, cellSize) {
    if (shape === "square") {
        // El cuadrado debe ocupar todo el ancho de la celda: lado = cellSize * scale
        // El radio de dibujo es la mitad del lado
        return (cellSize * scale) / 2;
    } else {
        // Círculo, hexágono, isométrico: el radio es la mitad del tamaño de celda por escala
        return (cellSize / 2) * scale;
    }
}

function updateAllNodeRadii() {
    const cellW = canvas.width / gridUnitsX;
    const cellH = canvas.height / gridUnitsY;

    for (let node of nodes) {
        node.radius = getRadiusFromScale(node.shape, node.scale, cellW, cellH);
    }

    renderCanvas();
    saveToLocalStorage();
}

function addNodeRaw(x, y, bgColor = "#000000", shape = "circle", scale = 1.0, labelText = "", labelPosition = "bottom", labelBgColor = "#dbdbdb", innerText = "") {
    const innerLabelFont = getThemeFont('innerLabel');
    const externalLabelFont = getThemeFont('externalLabel');
    
    const node = { 
        id: nextNodeId++, 
        x, y, bgColor, shape, 
        scale: scale, 
        labelText, labelPosition, labelBgColor, innerText, 
        iconImage: null, iconSrc: null, iconColor: "#ffffff",
        // Font properties for labels
        innerLabelFont: { ...innerLabelFont },
        externalLabelFont: { ...externalLabelFont },
        // Glow properties
        glowEnabled: false,
        glowColor: "#ffff00",
        glowSize: 10
    };
    // Calculamos radius dinámicamente según la forma y el tamaño de celda actual
    node.radius = getRadiusFromScale(shape, scale, currentCellSize);
    nodes.push(node);
    return node;
}

function deleteNodeById(nodeId) {
    connections = connections.filter(c => c.fromId !== nodeId && c.toId !== nodeId);
    nodes = nodes.filter(n => n.id !== nodeId);
    if (selectedNodeId === nodeId) selectedNodeId = null;
    if (selectedConnectionId && !connections.some(c => c.id === selectedConnectionId)) selectedConnectionId = null;
    renderCanvas(); updatePropertiesPanel(); saveToLocalStorage();
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
    const newNode = addNodeRaw(newX, newY, original.bgColor, original.shape, original.scale, original.labelText, original.labelPosition, original.labelBgColor, original.innerText);
    newNode.iconColor = original.iconColor || '#ffffff';
    
    // Copy font properties
    if (original.innerLabelFont) newNode.innerLabelFont = { ...original.innerLabelFont };
    if (original.externalLabelFont) newNode.externalLabelFont = { ...original.externalLabelFont };
    
    // Copy glow properties
    newNode.glowEnabled = original.glowEnabled || false;
    newNode.glowColor = original.glowColor || '#ffff00';
    newNode.glowSize = original.glowSize || 10;
    
    if (original.iconSrc) loadImageForNode(newNode, original.iconSrc);
    renderCanvas();
    selectedNodeId = newNode.id;
    selectedConnectionId = null;
    updatePropertiesPanel();
    saveToLocalStorage();
    updateStatusMessage(`Nodo duplicado (${newNode.id})`, false);
}

function getNodeRadius(node) { return node.radius || 26; }
