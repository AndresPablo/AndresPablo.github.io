// #region GRID / Grilla

//  *** GRILLA ***  //
function drawGrid(targetCtx = ctx, targetCanvas = canvas) {
    if (!showGrid) return;
    targetCtx.save();
    targetCtx.strokeStyle = hexToRgba(gridColor, gridAlpha);
    targetCtx.lineWidth = 1;
    if (gridUnitsX <= 0) gridUnitsX = 24;
    if (gridUnitsY <= 0) gridUnitsY = 12;
    const cellW = targetCanvas.width / gridUnitsX;
    const cellH = targetCanvas.height / gridUnitsY;
    
    if (gridType === "square") {
        for (let i = 0; i <= gridUnitsX; i++) {
            const x = i * cellW;
            targetCtx.beginPath();
            targetCtx.moveTo(x, 0);
            targetCtx.lineTo(x, targetCanvas.height);
            targetCtx.stroke();
        }
        for (let i = 0; i <= gridUnitsY; i++) {
            const y = i * cellH;
            targetCtx.beginPath();
            targetCtx.moveTo(0, y);
            targetCtx.lineTo(targetCanvas.width, y);
            targetCtx.stroke();
        }
    } 
    else if (gridType === "hex-pointy" || gridType === "hex-flat") {
        const size = hexRadius;
        const sqrt3 = Math.sqrt(3);
        const degToRad = Math.PI / 180;
        const isPointy = gridType === "hex-pointy";
        const angleOffset = isPointy ? -30 : 0;

        let qMin, qMax, rMin, rMax;

        if (isPointy) {
            const hexWidth = sqrt3 * size;
            const hexHeight = 2 * size;

            qMin = Math.floor(-targetCanvas.width / hexWidth) - 2;
            qMax = Math.floor(targetCanvas.width / hexWidth) + 2;

            rMin = Math.floor(-targetCanvas.height / hexHeight) - 2;
            rMax = Math.floor(targetCanvas.height / hexHeight) + 2;

        } else {
            const hexWidth = 2 * size;
            const hexHeight = sqrt3 * size;

            qMin = Math.floor(-targetCanvas.width / hexWidth) - 2;
            qMax = Math.floor(targetCanvas.width / hexWidth) + 2;

            rMin = Math.floor(-targetCanvas.height / hexHeight) - 2;
            rMax = Math.floor(targetCanvas.height / hexHeight) + 2;
        }

        for (let q = qMin; q <= qMax; q++) {
            for (let r = rMin; r <= rMax; r++) {

                let center;

                if (isPointy) {
                    const offsetX = targetCanvas.width / 2;
                    const offsetY = targetCanvas.height / 2;

                    center = {
                        x: size * sqrt3 * (q + r / 2) + offsetX,
                        y: size * 3/2 * r + offsetY
                    };
                } else {
                    const offsetX = targetCanvas.width / 2;
                    const offsetY = targetCanvas.height / 2;

                    center = {
                        x: size * 3/2 * q + offsetX,
                        y: size * sqrt3 * (r + q / 2) + offsetY
                    };
                }

                // Culling (mejorado)
                if (
                    center.x < -size * 2 ||
                    center.x > targetCanvas.width + size * 2 ||
                    center.y < -size * 2 ||
                    center.y > targetCanvas.height + size * 2
                ) continue;

                // Dibujar hexágono
                targetCtx.beginPath();

                for (let i = 0; i < 6; i++) {
                    const angle = degToRad * (60 * i + angleOffset);
                    const x = center.x + size * Math.cos(angle);
                    const y = center.y + size * Math.sin(angle);

                    i === 0
                        ? targetCtx.moveTo(x, y)
                        : targetCtx.lineTo(x, y);
                }

                targetCtx.closePath();
                targetCtx.stroke();
            }
        }
    }
    else if (gridType === "circles") {
        const radius = Math.min(cellW, cellH) * 0.3;
        for (let i = 0; i < gridUnitsX; i++) {
            for (let j = 0; j < gridUnitsY; j++) {
                const cx = (i + 0.5) * cellW;
                const cy = (j + 0.5) * cellH;
                targetCtx.beginPath();
                targetCtx.arc(cx, cy, radius, 0, Math.PI * 2);
                targetCtx.stroke();
            }
        }
    }
    else if (gridType === "isometric") {
        // Calcula el tamaño de celda a partir de las unidades actuales
        const cellW = targetCanvas.width / gridUnitsX;
        const cellH = targetCanvas.height / gridUnitsY;
        // Para una grilla isométrica, usamos el promedio o el horizontal (ambos funcionan)
        const step = Math.min(cellW, cellH); // o usa cellW directamente
        drawIsometricGrid(targetCtx, targetCanvas.width, targetCanvas.height, step, step/2, gridColor, gridAlpha);
    }
    debugDrawCenters(targetCtx);
    targetCtx.restore();
}

function drawHex(ctx, center, size, angleOffset) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 180) * (60 * i + angleOffset);
        const x = center.x + size * Math.cos(angle);
        const y = center.y + size * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
}

function drawIsometricGrid(ctx, width, height, stepX, stepY, color, alpha) {
    if (!stepX || stepX <= 0 || !stepY || stepY <= 0) return;
    
    ctx.save();
    ctx.strokeStyle = hexToRgba(color, alpha);
    ctx.lineWidth = 1;
    
    const slope = stepY / stepX;  // típicamente 0.5
    
    // Extender los límites considerablemente para cubrir todas las esquinas
    const extend = Math.max(width, height) * 1.5;
    const bMin = -extend;
    const bMax = height + extend;
    const stepB = stepY;  // espaciado entre líneas paralelas
    
    // 1. Líneas con pendiente positiva ( / ) : y = slope * x + b
    for (let b = bMin; b <= bMax; b += stepB) {
        const x1 = 0;
        const y1 = b;
        const x2 = width;
        const y2 = slope * width + b;
        
        // No es necesario recortar, solo dibujar (el canvas lo recorta automáticamente)
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    
    // 2. Líneas con pendiente negativa ( \ ) : y = -slope * x + b
    for (let b = bMin; b <= bMax; b += stepB) {
        const x1 = 0;
        const y1 = b;
        const x2 = width;
        const y2 = -slope * width + b;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    
    ctx.restore();
}

function updateCellSize() {
    if (!canvas) return;
    const cellW = canvas.width / gridUnitsX;
    const cellH = canvas.height / gridUnitsY;
    // Para grilla cuadrada usamos el ancho; para hex/isométrico usamos el mínimo
    currentCellSize = Math.min(cellW, cellH);
    if (currentCellSize <= 0) currentCellSize = 32;
}

function getCellCenters() {
    if (!canvas) return [];
    
    const cellW = canvas.width / gridUnitsX;
    const cellH = canvas.height / gridUnitsY;
    const centers = [];
    
    switch (gridType) {
        case "square":
        case "circles":
            for (let row = 0; row < gridUnitsY; row++) {
                for (let col = 0; col < gridUnitsX; col++) {
                    centers.push({
                        x: col * cellW + cellW/2,
                        y: row * cellH + cellH/2
                    });
                }
            }
            break;
            
        case "hex-pointy":
            for (let q = -gridUnitsX; q <= gridUnitsX; q++) {
                for (let r = -gridUnitsY; r <= gridUnitsY; r++) {
                    const center = axialToPixel(q, r, hexRadius, "pointy");
                    if (center.x >= 0 && center.x <= canvas.width && center.y >= 0 && center.y <= canvas.height) {
                        centers.push(center);
                    }
                }
            }
            break;
            
        case "hex-flat":
            for (let q = -gridUnitsX; q <= gridUnitsX; q++) {
                for (let r = -gridUnitsY; r <= gridUnitsY; r++) {
                    const center = axialToPixel(q, r, hexRadius, "flat");
                    if (center.x >= 0 && center.x <= canvas.width && center.y >= 0 && center.y <= canvas.height) {
                        centers.push(center);
                    }
                }
            }
            break;
            
        case "isometric":
            for (let i = -gridUnitsX; i <= gridUnitsX; i++) {
                for (let j = -gridUnitsY; j <= gridUnitsY; j++) {
                    const centerX = (i - j) * cellW / 2;
                    const centerY = (i + j) * cellH / 2;
                    if (centerX >= 0 && centerX <= canvas.width && centerY >= 0 && centerY <= canvas.height) {
                        centers.push({ x: centerX, y: centerY });
                    }
                }
            }
            break;
    }
    
    return centers;
}

function debugDrawCenters(ctx) {
    const centers = getCellCenters();
    ctx.save();
    ctx.fillStyle = "#ff0000";
    
    for (const center of centers) {
        ctx.beginPath();
        ctx.arc(center.x, center.y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

function debugSnapPoint(mouseX, mouseY, ctx) {
    const snapped = snapToGrid(mouseX, mouseY);
    ctx.save();
    ctx.fillStyle = "#ffff00";
    ctx.strokeStyle = "#ffaa00";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(snapped.x, snapped.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(snapped.x, snapped.y, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    
    console.log(`Mouse: (${mouseX}, ${mouseY}) → Snap: (${snapped.x}, ${snapped.y})`);
}


function updateUnitsFromCellSize() {
    if (!canvas) return;
    gridUnitsX = Math.max(1, Math.floor(canvas.width / cellSize));
    gridUnitsY = Math.max(1, Math.floor(canvas.height / cellSize));
}


function snapToGrid(x, y) {
    const cellW = canvas.width / gridUnitsX;
    const cellH = canvas.height / gridUnitsY;

    switch (gridType) {
        case "square":
        case "circles":
            // Centro de la celda cuadrada
            const col = Math.round(x / cellW);
            const row = Math.round(y / cellH);
            return {
                x: col * cellW + cellW/2,
                y: row * cellH + cellH/2
            };
        case "hex-pointy":
            return snapToHexCenter(x, y, hexRadius, "pointy");
        case "hex-flat":
            return snapToHexCenter(x, y, hexRadius, "flat");
        case "isometric":
            const cellW = canvas.width / gridUnitsX;
            const cellH = canvas.height / gridUnitsY;
            return snapToIsometricCenter(x, y, cellW, cellH);
        default:
            return { x, y };
    }
}

function snapToHexCenter(x, y, size, orientation) {
    const sqrt3 = Math.sqrt(3);

    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 2;

    // 1. Llevar a espacio de grilla
    const localX = x - offsetX;
    const localY = y - offsetY;

    let q, r;
    if (orientation === "pointy") {
        q = (sqrt3/3 * localX - 1/3 * localY) / size;
        r = (2/3 * localY) / size;
    } else {
        q = (2/3 * localX) / size;
        r = (-1/3 * localX + sqrt3/3 * localY) / size;
    }
    const cube = cubeRound({ x: q, y: -q - r, z: r });
    const axial = { q: cube.x, r: cube.z };
    const center = axialToPixel(axial.q, axial.r, size, orientation);
    return {
        x: center.x + offsetX,
        y: center.y + offsetY
    };
}

function snapToIsometricCenter(x, y, cellW, cellH) {

    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 2;

    const localX = x - offsetX;
    const localY = y - offsetY;

    const i = (localX / (cellW / 2) + localY / (cellH / 2)) / 2;
    const j = (localY / (cellH / 2) - localX / (cellW / 2)) / 2;

    const iRound = Math.round(i);
    const jRound = Math.round(j);

    return {
        x: (iRound - jRound) * cellW / 2 + offsetX,
        y: (iRound + jRound) * cellH / 2 + offsetY
    };
}

//#endregion GRID / Grilla
