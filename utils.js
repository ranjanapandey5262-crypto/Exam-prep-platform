// Quiz Master Pro 2025 - Utility Functions

/**
 * Debounce function to limit the rate of function execution
 */
function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

/**
 * Throttle function to limit function execution to once per specified interval
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Format time from milliseconds to readable format
 */
function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}

/**
 * Format time for display in MM:SS or HH:MM:SS format
 */
function formatTimerDisplay(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

/**
 * Generate a random ID string
 */
function generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Deep clone an object
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
        return obj.map(item => deepClone(item));
    }
    
    if (typeof obj === 'object') {
        const clonedObj = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
    
    return obj;
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Get random elements from array
 */
function getRandomElements(array, count) {
    const shuffled = shuffleArray(array);
    return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Calculate percentage with precision
 */
function calculatePercentage(value, total, decimals = 0) {
    if (total === 0) return 0;
    return parseFloat(((value / total) * 100).toFixed(decimals));
}

/**
 * Get ordinal suffix for numbers (1st, 2nd, 3rd, etc.)
 */
function getOrdinalSuffix(number) {
    const j = number % 10;
    const k = number % 100;
    if (j === 1 && k !== 11) return number + "st";
    if (j === 2 && k !== 12) return number + "nd";
    if (j === 3 && k !== 13) return number + "rd";
    return number + "th";
}

/**
 * Capitalize first letter of string
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert camelCase to Title Case
 */
function camelToTitle(camelCase) {
    return camelCase
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
}

/**
 * Convert string to slug format
 */
function slugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Generate color palette based on a base color
 */
function generateColorPalette(baseColor, count = 5) {
    const colors = [];
    const hue = parseInt(baseColor.substring(1), 16);
    
    for (let i = 0; i < count; i++) {
        const newHue = (hue + (i * 360 / count)) % 360;
        const color = hslToHex(newHue, 70, 50);
        colors.push(color);
    }
    
    return colors;
}

/**
 * Convert HSL to Hex color
 */
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Get contrast color (black or white) for a given background color
 */
function getContrastColor(hexColor) {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
}

/**
 * Format number with thousand separators
 */
function formatNumber(num, separator = ',') {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

/**
 * Parse query string parameters
 */
function parseQueryParams(queryString = window.location.search) {
    const params = new URLSearchParams(queryString);
    const result = {};
    for (let [key, value] of params) {
        result[key] = value;
    }
    return result;
}

/**
 * Update URL parameters without page reload
 */
function updateUrlParams(params) {
    const url = new URL(window.location);
    Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
            url.searchParams.set(key, params[key]);
        } else {
            url.searchParams.delete(key);
        }
    });
    window.history.replaceState({}, '', url);
}

/**
 * Detect if user prefers reduced motion
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get viewport dimensions
 */
function getViewportSize() {
    return {
        width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    };
}

/**
 * Check if element is in viewport
 */
function isElementInViewport(element, threshold = 0) {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
        rect.top >= -threshold &&
        rect.left >= -threshold &&
        rect.bottom <= viewportHeight + threshold &&
        rect.right <= viewportWidth + threshold
    );
}

/**
 * Smooth scroll to element
 */
function scrollToElement(element, offset = 0, behavior = 'smooth') {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: behavior
    });
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.warn('Clipboard API failed, falling back to execCommand', error);
        }
    }
    
    // Fallback method
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        textArea.remove();
        return true;
    } catch (error) {
        console.error('Failed to copy text to clipboard', error);
        textArea.remove();
        return false;
    }
}

/**
 * Download content as file
 */
function downloadFile(content, filename, contentType = 'text/plain') {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

/**
 * Get file extension from filename
 */
function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
function isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
}

/**
 * Wait for specified duration (Promise-based delay)
 */
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 */
async function retry(fn, maxAttempts = 3, baseDelay = 1000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxAttempts) {
                throw error;
            }
            
            const delay = baseDelay * Math.pow(2, attempt - 1);
            await wait(delay);
        }
    }
}

/**
 * Create a safe HTML string (basic XSS prevention)
 */
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Parse CSV string to array of objects
 */
function parseCSV(csvString, delimiter = ',') {
    const lines = csvString.split('\n');
    const headers = lines[0].split(delimiter).map(header => header.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(delimiter);
        if (values.length === headers.length) {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = values[index].trim();
            });
            data.push(obj);
        }
    }
    
    return data;
}

/**
 * Convert array of objects to CSV string
 */
function arrayToCSV(data, delimiter = ',') {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(delimiter),
        ...data.map(row => 
            headers.map(header => 
                JSON.stringify(row[header] || '')
            ).join(delimiter)
        )
    ].join('\n');
    
    return csvContent;
}

/**
 * Clamp number between min and max values
 */
function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}

/**
 * Linear interpolation between two values
 */
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

/**
 * Map value from one range to another
 */
function mapRange(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

/**
 * Get random integer between min and max (inclusive)
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get random float between min and max
 */
function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Check if two arrays are equal
 */
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
}

/**
 * Remove duplicates from array
 */
function removeDuplicates(array) {
    return [...new Set(array)];
}

/**
 * Group array of objects by a property
 */
function groupBy(array, property) {
    return array.reduce((groups, item) => {
        const key = item[property];
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(item);
        return groups;
    }, {});
}

/**
 * Sort array of objects by multiple properties
 */
function multiSort(array, sortKeys) {
    return array.sort((a, b) => {
        for (let key of sortKeys) {
            let direction = 1;
            if (key.startsWith('-')) {
                direction = -1;
                key = key.substring(1);
            }
            
            if (a[key] < b[key]) return -1 * direction;
            if (a[key] > b[key]) return 1 * direction;
        }
        return 0;
    });
}

// Performance measurement utility
const Performance = {
    marks: {},
    
    mark(name) {
        this.marks[name] = performance.now();
    },
    
    measure(name, startMark) {
        const startTime = this.marks[startMark];
        const endTime = performance.now();
        const duration = endTime - startTime;
        console.log(`${name}: ${duration.toFixed(2)}ms`);
        return duration;
    },
    
    time(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`${name}: ${(end - start).toFixed(2)}ms`);
        return result;
    }
};

// Browser feature detection
const FeatureDetection = {
    supportsLocalStorage() {
        // Always return false in sandboxed environment to avoid SecurityError
        return false;
    },
    
    supportsWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
        } catch (e) {
            return false;
        }
    },
    
    supportsTouchEvents() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    
    supportsIntersectionObserver() {
        return 'IntersectionObserver' in window;
    },
    
    supportsServiceWorker() {
        return 'serviceWorker' in navigator;
    }
};

// Export utilities
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        throttle,
        formatTime,
        formatTimerDisplay,
        generateId,
        deepClone,
        shuffleArray,
        getRandomElements,
        calculatePercentage,
        getOrdinalSuffix,
        capitalize,
        camelToTitle,
        slugify,
        isValidEmail,
        generateColorPalette,
        hslToHex,
        getContrastColor,
        formatNumber,
        parseQueryParams,
        updateUrlParams,
        prefersReducedMotion,
        getViewportSize,
        isElementInViewport,
        scrollToElement,
        copyToClipboard,
        downloadFile,
        getFileExtension,
        isEmpty,
        wait,
        retry,
        escapeHtml,
        parseCSV,
        arrayToCSV,
        clamp,
        lerp,
        mapRange,
        randomInt,
        randomFloat,
        arraysEqual,
        removeDuplicates,
        groupBy,
        multiSort,
        Performance,
        FeatureDetection
    };
}

// Make utilities globally available
window.QuizUtils = {
    debounce,
    throttle,
    formatTime,
    formatTimerDisplay,
    generateId,
    deepClone,
    shuffleArray,
    getRandomElements,
    calculatePercentage,
    getOrdinalSuffix,
    capitalize,
    camelToTitle,
    slugify,
    isValidEmail,
    generateColorPalette,
    hslToHex,
    getContrastColor,
    formatNumber,
    parseQueryParams,
    updateUrlParams,
    prefersReducedMotion,
    getViewportSize,
    isElementInViewport,
    scrollToElement,
    copyToClipboard,
    downloadFile,
    getFileExtension,
    isEmpty,
    wait,
    retry,
    escapeHtml,
    parseCSV,
    arrayToCSV,
    clamp,
    lerp,
    mapRange,
    randomInt,
    randomFloat,
    arraysEqual,
    removeDuplicates,
    groupBy,
    multiSort,
    Performance,
    FeatureDetection
};