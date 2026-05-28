// ======================== THEME SYSTEM ========================
// Themes contain 12 preset colors that can be used in color pickers
// Users can still create custom colors outside of the palette

const THEMES = {
    fantasy: {
        name: "Fantasy",
        colors: [
            "#8B4513", // Saddle Brown
            "#D4AF37", // Gold
            "#4A4E69", // Dark Blue-Grey
            "#F1FAEE", // Cream
            "#A8DADC", // Pale Blue
            "#457B9D", // Slate Blue
            "#1D3557", // Deep Navy
            "#E63946", // Crimson
            "#F77F00", // Dark Orange
            "#06A77D", // Teal
            "#5E548E", // Purple
            "#1A1423"  // Dark Purple
        ],
        fonts: {
            innerLabel: { family: "Georgia, serif", size: 14, color: "#000000", weight: "bold" },
            externalLabel: { family: "Georgia, serif", size: 12, color: "#1D3557", weight: "normal" },
            connectionLabel: { family: "Georgia, serif", size: 11, color: "#1D3557", weight: "normal" }
        }
    },
    modern: {
        name: "Modern",
        colors: [
            "#264653", // Dark Slate
            "#2A9D8F", // Teal
            "#E9C46A", // Yellow
            "#F4A261", // Orange
            "#E76F51", // Burnt Orange
            "#D62828", // Red
            "#F77F00", // Orange
            "#FCBF49", // Gold
            "#EAE2B7", // Beige
            "#003049", // Navy
            "#669BBC", // Steel Blue
            "#CCCCCC"  // Light Grey
        ],
        fonts: {
            innerLabel: { family: "Arial, sans-serif", size: 14, color: "#003049", weight: "bold" },
            externalLabel: { family: "Arial, sans-serif", size: 12, color: "#264653", weight: "normal" },
            connectionLabel: { family: "Arial, sans-serif", size: 11, color: "#264653", weight: "normal" }
        }
    },
    scifi: {
        name: "Sci-Fi",
        colors: [
            "#0A0E27", // Deep Space Black
            "#00D9FF", // Cyan
            "#FF006E", // Hot Pink
            "#8338EC", // Purple
            "#3A86FF", // Bright Blue
            "#06FFA5", // Neon Green
            "#FFB700", // Neon Orange
            "#FB5607", // Orange-Red
            "#FFBE0B", // Yellow
            "#00B4D8", // Light Blue
            "#00F5FF", // Electric Cyan
            "#1E1E2E"  // Almost Black
        ],
        fonts: {
            innerLabel: { family: "Courier New, monospace", size: 14, color: "#00F5FF", weight: "bold" },
            externalLabel: { family: "Courier New, monospace", size: 12, color: "#00D9FF", weight: "normal" },
            connectionLabel: { family: "Courier New, monospace", size: 11, color: "#06FFA5", weight: "normal" }
        }
    }
};

// Current active theme
let currentThemeName = "fantasy";
let currentTheme = THEMES.fantasy;

/**
 * Get the current theme
 */
function getCurrentTheme() {
    return currentTheme;
}

/**
 * Get current theme name
 */
function getCurrentThemeName() {
    return currentThemeName;
}

/**
 * Switch to a different theme
 */
function setTheme(themeName) {
    if (THEMES[themeName]) {
        currentThemeName = themeName;
        currentTheme = THEMES[themeName];
        return true;
    }
    console.warn(`Theme '${themeName}' not found`);
    return false;
}

/**
 * Get a theme by name
 */
function getThemeByName(themeName) {
    return THEMES[themeName] || null;
}

/**
 * Get all available themes
 */
function getAllThemes() {
    return THEMES;
}

/**
 * Get color palette for a theme
 */
function getThemePalette(themeName = currentThemeName) {
    const theme = THEMES[themeName];
    return theme ? theme.colors : [];
}

/**
 * Get default font settings for a label type from current theme
 */
function getThemeFont(labelType = 'externalLabel') {
    const fonts = currentTheme.fonts;
    return fonts[labelType] || fonts.externalLabel;
}

/**
 * Get default font settings for a specific label type and theme
 */
function getThemeFontByName(themeName, labelType = 'externalLabel') {
    const theme = THEMES[themeName];
    if (!theme) return getThemeFont(labelType);
    const fonts = theme.fonts;
    return fonts[labelType] || fonts.externalLabel;
}

/**
 * Export theme data
 */
function exportThemeData() {
    return {
        themeName: currentThemeName
    };
}

/**
 * Import theme data from saved map
 */
function importThemeData(themeData) {
    if (themeData && themeData.themeName) {
        setTheme(themeData.themeName);
    } else {
        setTheme("fantasy");
    }
}
