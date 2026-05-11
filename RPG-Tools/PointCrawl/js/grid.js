// #region GRID / Grilla


// ---------------------------------------------------------------------
// 1. Grilla cuadrada (square)
// ---------------------------------------------------------------------
function drawSquareGrid(ctx, width, height, cols, rows, cellSize) {
    const marginPx = getMarginPx();
    const areaWidth = width - 2 * marginPx;
    const areaHeight = height - 2 * marginPx;
    const totalW = cols * cellSize;
    const totalH = rows * cellSize;
    const startX = marginPx + (areaWidth - totalW) / 2;
    const startY = marginPx + (areaHeight - totalH) / 2;
    
    // Dibujar líneas verticales
    for (let i = 0; i <= cols; i++) {
        const x = startX + i * cellSize;
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, startY + totalH);
        ctx.stroke();
    }
    // Dibujar líneas horizontales
    for (let j = 0; j <= rows; j++) {
        const y = startY + j * cellSize;
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(startX + totalW, y);
        ctx.stroke();
    }
}

// ---------------------------------------------------------------------
// 2. Grilla de círculos (centrados en cada celda cuadrada del área)
// ---------------------------------------------------------------------
function drawCirclesGrid(ctx, width, height, cols, rows, cellSize) {
    const marginPx = getMarginPx();
    const areaWidth = width - 2 * marginPx;
    const areaHeight = height - 2 * marginPx;
    const totalW = cols * cellSize;
    const totalH = rows * cellSize;
    const startX = marginPx + (areaWidth - totalW) / 2;
    const startY = marginPx + (areaHeight - totalH) / 2;
    const radius = cellSize * 0.3;

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const cx = startX + i * cellSize + cellSize/2;
            const cy = startY + j * cellSize + cellSize/2;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

// ---------------------------------------------------------------------
// 3. Grilla hexagonal (pointy y flat) con márgenes y centrado
// ---------------------------------------------------------------------
function drawHexGrid(ctx, orientation, cols, rows) {
    const R = hexRadius;
    let cellW, cellH;
    if (orientation === "pointy") {
        cellW = Math.sqrt(3) * R;   // distancia horizontal entre centros
        cellH = 1.5 * R;            // distancia vertical entre centros
    } else { // flat
        cellW = 1.5 * R;            // distancia horizontal entre centros
        cellH = Math.sqrt(3) * R;   // distancia vertical entre centros
    }

    // Dimensiones totales de la grilla (incluyendo medio hexágono en los bordes)
    const totalW = (cols - 1) * cellW + 2 * R;
    const totalH = (rows - 1) * cellH + 2 * R;
    const marginPx = getMarginPx();
    const startX = marginPx + (canvas.width - 2 * marginPx - totalW) / 2 + R;
    const startY = marginPx + (canvas.height - 2 * marginPx - totalH) / 2 + R;

    // Vértices del hexágono (centro en 0,0)
    const vertices = [];
    const step = (Math.PI * 2) / 6;
    for (let i = 0; i < 6; i++) {
        let angle = (orientation === "pointy") ? step * i - Math.PI/2 : step * i;
        vertices.push({ x: R * Math.cos(angle), y: R * Math.sin(angle) });
    }

    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            let cx, cy;
            if (orientation === "pointy") {
                // Desplazamiento horizontal en filas impares
                const offsetX = (row % 2 !== 0) ? cellW / 2 : 0;
                cx = startX + col * cellW + offsetX;
                cy = startY + row * cellH;
            } else { // flat
                // Desplazamiento vertical en columnas impares
                const offsetY = (col % 2 !== 0) ? cellH / 2 : 0;
                cx = startX + col * cellW;
                cy = startY + row * cellH + offsetY;
            }
            ctx.beginPath();
            for (let v of vertices) ctx.lineTo(cx + v.x, cy + v.y);
            ctx.closePath();
            ctx.stroke();
        }
    }
}

// ---------------------------------------------------------------------
// 4. Grilla isométrica (líneas diagonales) dentro del área con márgenes
// ---------------------------------------------------------------------
function drawIsometricGrid(ctx, width, height, cols, rows) {
    const marginPx = getMarginPx();
    const areaWidth = width - 2 * marginPx;
    const areaHeight = height - 2 * marginPx;
    const startX = marginPx;
    const startY = marginPx;
    const cellW = areaWidth / cols;
    const cellH = areaHeight / rows;
    const stepX = cellW;
    const stepY = cellH / 2;
    const slope = stepY / stepX;

    // Extensión para cubrir toda el área
    const extend = Math.max(areaWidth, areaHeight) * 1.5;
    const bMin = -extend;
    const bMax = areaHeight + extend;
    const stepB = stepY;

    ctx.save();
    ctx.strokeStyle = hexToRgba(gridColor, gridAlpha);
    ctx.lineWidth = 1;
    // Líneas /
    for (let b = bMin; b <= bMax; b += stepB) {
        const x1 = startX;
        const y1 = startY + b;
        const x2 = startX + areaWidth;
        const y2 = startY + slope * areaWidth + b;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    // Líneas \
    for (let b = bMin; b <= bMax; b += stepB) {
        const x1 = startX;
        const y1 = startY + b;
        const x2 = startX + areaWidth;
        const y2 = startY - slope * areaWidth + b;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    ctx.restore();
}

// ---------------------------------------------------------------------
// 5. Función principal drawGrid
// ---------------------------------------------------------------------
function drawGrid(targetCtx = ctx, targetCanvas = canvas) {
    if (!showGrid) return;
    targetCtx.save();
    targetCtx.strokeStyle = hexToRgba(gridColor, gridAlpha);
    targetCtx.lineWidth = 1;

    const width = targetCanvas.width;
    const height = targetCanvas.height;
    const cols = gridUnitsX;
    const rows = gridUnitsY;

    if (cols <= 0 || rows <= 0) {
        targetCtx.restore();
        return;
    }

    // Para cuadrados y círculos necesitamos cellSize real (tamaño de celda en px)
    // Nota: cellSize debe estar definido (sería el tamaño de celda elegido por el usuario)
    // Pero como la grilla cuadrada ahora se dibuja con celdas de tamaño cellSize,
    // debemos pasar cellSize a drawSquareGrid y drawCirclesGrid.
    // Asegurar que cellSize esté definido.
    const cellSizePx = cellSize || 32;

    switch (gridType) {
        case "square":
            drawSquareGrid(targetCtx, width, height, cols, rows, cellSize);
            break;
        case "circles":
            drawCirclesGrid(targetCtx, width, height, cols, rows, cellSizePx);
            break;
        case "hex-pointy":
            drawHexGrid(targetCtx, "pointy", cols, rows);
            break;
        case "hex-flat":
            drawHexGrid(targetCtx, "flat", cols, rows);
            break;
        case "isometric":
            drawIsometricGrid(targetCtx, width, height, cols, rows);
            break;
        default:
            break;
    }
    targetCtx.restore();
}

// ---------------------------------------------------------------------
// 6. Snapping (centro de celdas) ajustado a márgenes
// ---------------------------------------------------------------------
function snapToGrid(x, y) {
    const width = canvas.width;
    const height = canvas.height;
    const cols = gridUnitsX;
    const rows = gridUnitsY;
    if (cols <= 0 || rows <= 0) return { x, y };

    switch (gridType) {
        case "square":
        case "circles": {
            const marginPx = getMarginPx();
            const areaWidth = width - 2 * marginPx;
            const areaHeight = height - 2 * marginPx;
            const totalW = cols * cellSize;
            const totalH = rows * cellSize;
            const startX = marginPx + (areaWidth - totalW) / 2;
            const startY = marginPx + (areaHeight - totalH) / 2;
            // Columna y fila más cercana
            const col = Math.round((x - startX - cellSize/2) / cellSize);
            const row = Math.round((y - startY - cellSize/2) / cellSize);
            const clampedCol = Math.min(Math.max(col, 0), cols - 1);
            const clampedRow = Math.min(Math.max(row, 0), rows - 1);
            return {
                x: startX + clampedCol * cellSize + cellSize/2,
                y: startY + clampedRow * cellSize + cellSize/2
            };
        }
        case "hex-pointy":
            return snapToHexCenter(x, y, "pointy", cols, rows);
        case "hex-flat":
            return snapToHexCenter(x, y, "flat", cols, rows);
        case "isometric":
            // Para isométrica, el snapping se basa en el área con márgenes
            const marginPx = getMarginPx();
            const localX = x - marginPx;
            const localY = y - marginPx;
            const areaWidth = width - 2 * marginPx;
            const areaHeight = height - 2 * marginPx;
            const cellW = areaWidth / cols;
            const cellH = areaHeight / rows;
            return snapToIsometricCenter(localX, localY, cellW, cellH, marginPx, marginPx);
        default:
            return { x, y };
    }
}

function snapToHexCenter(x, y, orientation, cols, rows) {
    const R = hexRadius;
    let cellW, cellH;
    if (orientation === "pointy") {
        cellW = Math.sqrt(3) * R;
        cellH = 1.5 * R;
    } else {
        cellW = 1.5 * R;
        cellH = Math.sqrt(3) * R;
    }

    const totalW = (cols - 1) * cellW + 2 * R;
    const totalH = (rows - 1) * cellH + 2 * R;
    const marginPx = getMarginPx();
    const startX = marginPx + (canvas.width - 2 * marginPx - totalW) / 2 + R;
    const startY = marginPx + (canvas.height - 2 * marginPx - totalH) / 2 + R;

    const getCenter = (col, row) => {
        if (orientation === "pointy") {
            const offsetX = (row % 2 !== 0) ? cellW / 2 : 0;
            return {
                x: startX + col * cellW + offsetX,
                y: startY + row * cellH
            };
        } else {
            const offsetY = (col % 2 !== 0) ? cellH / 2 : 0;
            return {
                x: startX + col * cellW,
                y: startY + row * cellH + offsetY
            };
        }
    };

    // Aproximar col y row
    let approxCol = Math.floor((x - startX) / cellW);
    let approxRow = Math.floor((y - startY) / cellH);
    approxCol = Math.min(Math.max(approxCol, 0), cols - 1);
    approxRow = Math.min(Math.max(approxRow, 0), rows - 1);

    let bestDist = Infinity;
    let bestCenter = { x, y };
    for (let col = Math.max(0, approxCol - 2); col <= Math.min(cols - 1, approxCol + 2); col++) {
        for (let row = Math.max(0, approxRow - 2); row <= Math.min(rows - 1, approxRow + 2); row++) {
            const center = getCenter(col, row);
            const dx = center.x - x, dy = center.y - y;
            const dist = dx*dx + dy*dy;
            if (dist < bestDist) {
                bestDist = dist;
                bestCenter = center;
            }
        }
    }
    return bestCenter;
}

function snapToIsometricCenter(x, y, cellW, cellH, offsetX, offsetY) {
    // x, y son coordenadas locales dentro del área (sin margen)
    const i = (x / (cellW / 2) + y / (cellH / 2)) / 2;
    const j = (y / (cellH / 2) - x / (cellW / 2)) / 2;
    const iRound = Math.round(i);
    const jRound = Math.round(j);
    return {
        x: (iRound - jRound) * cellW / 2 + offsetX,
        y: (iRound + jRound) * cellH / 2 + offsetY
    };
}

// ---------------------------------------------------------------------
// 7. Funciones auxiliares de actualización
// ---------------------------------------------------------------------
function updateHexRadius() {
    hexRadius = (cellSize && cellSize > 0) ? cellSize : 20;
}

function updateCellSize() {
    if (!canvas) return;
    const cellW = canvas.width / gridUnitsX;
    const cellH = canvas.height / gridUnitsY;
    currentCellSize = Math.min(cellW, cellH);
    if (currentCellSize <= 0) currentCellSize = 32;
}

function updateUnitsFromCellSize() {
    if (!canvas) return;
    gridUnitsX = Math.max(1, Math.floor(canvas.width / cellSize));
    gridUnitsY = Math.max(1, Math.floor(canvas.height / cellSize));
}

function updateGridUnitsFromCellSize() {
    if (!canvas) return;
    const marginPx = getMarginPx();
    const areaWidth = canvas.width - 2 * marginPx;
    const areaHeight = canvas.height - 2 * marginPx;
    gridUnitsX = Math.max(1, Math.floor(areaWidth / cellSize));
    gridUnitsY = Math.max(1, Math.floor(areaHeight / cellSize));
}

//#endregion GRID / Grilla