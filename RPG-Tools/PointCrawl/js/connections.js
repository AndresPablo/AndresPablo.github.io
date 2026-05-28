function addConnectionRaw(fromId, toId, color, strokePattern, lineWidthLevel, text, iconSrc = null, iconShape = "circle", iconFillColor = "#ffffff", pattern = "none", patternCount = 0, patternSize = 1.0) {
    const connLabelFont = getThemeFont('connectionLabel');
    
    const conn = { 
        id: nextConnId++, 
        fromId, toId, color, strokePattern, lineWidthLevel, text, 
        iconSrc, iconImage: null, iconShape, iconFillColor, 
        pattern, patternCount, patternSize,
        // Font properties for connection label
        labelFont: { ...connLabelFont }
    };
    if (iconSrc) loadImageForConnection(conn, iconSrc);
    connections.push(conn);
    return conn;
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
        // Get font settings from connection or use defaults
        const fontSettings = conn.labelFont || getThemeFont('connectionLabel');
        ctx.font = `${fontSettings.weight} ${fontSettings.size}px ${fontSettings.family}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const tW = ctx.measureText(conn.text).width;
        const padding = 5;
        // Fondo centrado exactamente
        ctx.fillStyle = "#000000aa";
        ctx.fillRect(midX - tW / 2 - padding, midY - 10, tW + padding * 2, 20);
        ctx.fillStyle = fontSettings.color || "#fef5e3";
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