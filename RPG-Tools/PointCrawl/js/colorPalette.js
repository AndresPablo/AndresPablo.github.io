// ======================== COLOR PALETTE UI ========================
// Provides a color palette picker that shows theme colors plus custom option

let palettePickerOpen = false;
let paletteTargetInput = null;

/**
 * Show color palette popup for a specific color input
 */
function showColorPalette(event, inputElement) {
    event.preventDefault();
    event.stopPropagation();
    
    paletteTargetInput = inputElement;
    
    // Remove existing palette if open
    const existingPalette = document.getElementById('colorPalettePopup');
    if (existingPalette) {
        existingPalette.remove();
    }
    
    // Create palette container
    const palette = document.createElement('div');
    palette.id = 'colorPalettePopup';
    palette.className = 'color-palette-popup';
    
    // Get current theme colors
    const themeColors = getCurrentTheme().colors;
    
    // Create color swatches
    const swatchesContainer = document.createElement('div');
    swatchesContainer.className = 'palette-swatches';
    
    // Add theme colors
    themeColors.forEach(color => {
        const swatch = document.createElement('button');
        swatch.type = 'button';
        swatch.className = 'palette-swatch';
        swatch.style.backgroundColor = color;
        swatch.title = color;
        swatch.addEventListener('click', (e) => {
            e.preventDefault();
            inputElement.value = color;
            inputElement.dispatchEvent(new Event('change', { bubbles: true }));
            closePalette();
        });
        swatchesContainer.appendChild(swatch);
    });
    
    // Add custom color option
    const customDiv = document.createElement('div');
    customDiv.className = 'palette-custom';
    
    const label = document.createElement('label');
    label.className = 'palette-custom-label';
    label.textContent = 'Personalizado:';
    
    const customInput = document.createElement('input');
    customInput.type = 'color';
    customInput.className = 'palette-custom-input';
    customInput.value = inputElement.value || '#ffffff';
    customInput.addEventListener('input', (e) => {
        inputElement.value = e.target.value;
        inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    customDiv.appendChild(label);
    customDiv.appendChild(customInput);
    
    palette.appendChild(swatchesContainer);
    palette.appendChild(customDiv);
    
    // Position near the input
    document.body.appendChild(palette);
    positionPalette(palette, inputElement);
    
    palettePickerOpen = true;
}

/**
 * Position palette popup near the clicked input
 */
function positionPalette(paletteEl, inputEl) {
    const rect = inputEl.getBoundingClientRect();
    paletteEl.style.position = 'fixed';
    paletteEl.style.left = rect.left + 'px';
    paletteEl.style.top = (rect.bottom + 8) + 'px';
}


function closePalette() {
    const palette = document.getElementById('colorPalettePopup');
    if (palette) {
        palette.remove();
    }
    palettePickerOpen = false;
    paletteTargetInput = null;
}

/**
 * Update palette display in settings modal
 */
function updateThemePaletteDisplay() {
    const paletteContainer = document.getElementById('currentThemePalette');
    if (!paletteContainer) return;
    
    paletteContainer.innerHTML = '';
    const colors = getCurrentTheme().colors;
    
    colors.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'palette-preview-swatch';
        swatch.style.backgroundColor = color;
        swatch.title = color;
        paletteContainer.appendChild(swatch);
    });
}

/**
 * Initialize color palette for all color inputs in a container
 */
function initializeColorPalettes(container = document) {
    // Find all color inputs
    const colorInputs = container.querySelectorAll('input[type="color"]');
    
    colorInputs.forEach(input => {
        // Remove existing listeners (in case of re-initialization)
        input.removeEventListener('click', handleColorInputClick);
        input.addEventListener('click', handleColorInputClick);
    });
}

/**
 * Event handler for color input click
 */
function handleColorInputClick(event) {
    // Don't show palette if it's for a specific input that shouldn't use it
    // (optional: add data attribute to exclude inputs)
    if (this.dataset.noPalette) {
        return;
    }
    
    showColorPalette(event, this);
}


document.addEventListener('click', (event) => {
    if (palettePickerOpen) {
        const palette = document.getElementById('colorPalettePopup');
        if (palette && !palette.contains(event.target) && event.target.type !== 'color') {
            closePalette();
        }
    }
});


document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && palettePickerOpen) {
        closePalette();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && palettePickerOpen) {
        closePalette();
    }
});
