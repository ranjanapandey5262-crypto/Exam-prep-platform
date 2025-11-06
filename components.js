// Quiz Master Pro 2025 - Reusable Components

/**
 * Modal Component for displaying popups and dialogs
 */
class Modal {
    constructor(id, title, content, options = {}) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.options = {
            closable: true,
            backdrop: true,
            size: 'medium', // small, medium, large
            ...options
        };
        this.isOpen = false;
        this.element = null;
        
        this.create();
    }
    
    create() {
        const modalHTML = `
            <div class="modal-overlay" id="${this.id}-overlay">
                <div class="modal modal--${this.options.size}" id="${this.id}">
                    <div class="modal__header">
                        <h3 class="modal__title">${this.title}</h3>
                        ${this.options.closable ? '<button class="modal__close" aria-label="Close modal">&times;</button>' : ''}
                    </div>
                    <div class="modal__body">
                        ${this.content}
                    </div>
                    <div class="modal__footer" id="${this.id}-footer">
                        <!-- Footer content will be added dynamically -->
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.element = document.getElementById(this.id);
        this.overlay = document.getElementById(`${this.id}-overlay`);
        
        this.bindEvents();
    }
    
    bindEvents() {
        if (this.options.closable) {
            const closeBtn = this.element.querySelector('.modal__close');
            closeBtn?.addEventListener('click', () => this.close());
        }
        
        if (this.options.backdrop) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.close();
                }
            });
        }
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    open() {
        this.overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this.isOpen = true;
        
        // Animate in
        setTimeout(() => {
            this.overlay.classList.add('modal-overlay--open');
        }, 10);
    }
    
    close() {
        this.overlay.classList.remove('modal-overlay--open');
        
        setTimeout(() => {
            this.overlay.style.display = 'none';
            document.body.style.overflow = '';
            this.isOpen = false;
        }, 300);
    }
    
    setFooter(html) {
        const footer = document.getElementById(`${this.id}-footer`);
        footer.innerHTML = html;
    }
    
    destroy() {
        this.overlay?.remove();
    }
}

/**
 * Progress Ring Component for circular progress indicators
 */
class ProgressRing {
    constructor(selector, options = {}) {
        this.element = document.querySelector(selector);
        this.options = {
            size: 120,
            strokeWidth: 8,
            progress: 0,
            color: 'var(--color-primary)',
            backgroundColor: 'var(--color-secondary)',
            animated: true,
            duration: 1000,
            ...options
        };
        
        this.create();
    }
    
    create() {
        const { size, strokeWidth } = this.options;
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        
        this.element.innerHTML = `
            <svg class="progress-ring" width="${size}" height="${size}">
                <circle
                    class="progress-ring__background"
                    stroke="${this.options.backgroundColor}"
                    stroke-width="${strokeWidth}"
                    fill="transparent"
                    r="${radius}"
                    cx="${size / 2}"
                    cy="${size / 2}"
                />
                <circle
                    class="progress-ring__progress"
                    stroke="${this.options.color}"
                    stroke-width="${strokeWidth}"
                    stroke-linecap="round"
                    fill="transparent"
                    r="${radius}"
                    cx="${size / 2}"
                    cy="${size / 2}"
                    style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${circumference};"
                />
            </svg>
        `;
        
        this.circle = this.element.querySelector('.progress-ring__progress');
        this.circumference = circumference;
    }
    
    setProgress(progress) {
        const offset = this.circumference - (progress / 100) * this.circumference;
        
        if (this.options.animated) {
            this.circle.style.transition = `stroke-dashoffset ${this.options.duration}ms ease-in-out`;
        }
        
        this.circle.style.strokeDashoffset = offset;
    }
}

/**
 * Animated Counter Component
 */
class AnimatedCounter {
    constructor(selector, options = {}) {
        this.element = document.querySelector(selector);
        this.options = {
            startValue: 0,
            endValue: 100,
            duration: 2000,
            decimals: 0,
            suffix: '',
            prefix: '',
            separator: ',',
            ...options
        };
    }
    
    start() {
        const startTime = performance.now();
        const { startValue, endValue, duration, decimals, prefix, suffix, separator } = this.options;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = startValue + (endValue - startValue) * this.easeOutQuart(progress);
            const formatted = this.formatNumber(current, decimals, separator);
            
            this.element.textContent = `${prefix}${formatted}${suffix}`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
    
    formatNumber(num, decimals, separator) {
        const fixed = num.toFixed(decimals);
        return fixed.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    }
}

/**
 * Notification Toast Component
 */
class NotificationToast {
    constructor() {
        this.container = this.createContainer();
        this.toasts = [];
    }
    
    createContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }
    
    show(message, type = 'info', duration = 3000) {
        const toast = this.createToast(message, type, duration);
        this.container.appendChild(toast.element);
        this.toasts.push(toast);
        
        // Animate in
        setTimeout(() => {
            toast.element.classList.add('toast--show');
        }, 10);
        
        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                this.remove(toast);
            }, duration);
        }
        
        return toast;
    }
    
    createToast(message, type, duration) {
        const toast = {
            id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            message,
            type,
            duration
        };
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.element = document.createElement('div');
        toast.element.className = `toast toast--${type}`;
        toast.element.innerHTML = `
            <div class="toast__icon">${icons[type] || icons.info}</div>
            <div class="toast__message">${message}</div>
            <button class="toast__close" aria-label="Close notification">&times;</button>
        `;
        
        // Close button
        const closeBtn = toast.element.querySelector('.toast__close');
        closeBtn.addEventListener('click', () => this.remove(toast));
        
        return toast;
    }
    
    remove(toast) {
        toast.element.classList.add('toast--hide');
        
        setTimeout(() => {
            toast.element.remove();
            const index = this.toasts.indexOf(toast);
            if (index > -1) {
                this.toasts.splice(index, 1);
            }
        }, 300);
    }
    
    clear() {
        this.toasts.forEach(toast => this.remove(toast));
    }
}

/**
 * Lazy Loading Component for images and content
 */
class LazyLoader {
    constructor(options = {}) {
        this.options = {
            rootMargin: '50px',
            threshold: 0.1,
            ...options
        };
        
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            this.options
        );
        
        this.init();
    }
    
    init() {
        const lazyElements = document.querySelectorAll('[data-lazy]');
        lazyElements.forEach(element => {
            this.observer.observe(element);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadElement(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }
    
    loadElement(element) {
        const src = element.dataset.lazy;
        
        if (element.tagName === 'IMG') {
            element.src = src;
            element.classList.add('lazy-loaded');
        } else {
            // For other elements, you might load content dynamically
            element.classList.add('lazy-loaded');
        }
        
        element.removeAttribute('data-lazy');
    }
    
    observe(element) {
        this.observer.observe(element);
    }
    
    disconnect() {
        this.observer.disconnect();
    }
}

/**
 * Smooth Scroll Component
 */
class SmoothScroll {
    constructor(options = {}) {
        this.options = {
            duration: 800,
            easing: 'easeInOutCubic',
            offset: 0,
            ...options
        };
        
        this.init();
    }
    
    init() {
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (anchor) {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                this.scrollTo(targetId);
            }
        });
    }
    
    scrollTo(targetId, options = {}) {
        const target = document.getElementById(targetId);
        if (!target) return;
        
        const mergedOptions = { ...this.options, ...options };
        const startPosition = window.pageYOffset;
        const targetPosition = target.getBoundingClientRect().top + startPosition - mergedOptions.offset;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / mergedOptions.duration, 1);
            const easeValue = this.easingFunctions[mergedOptions.easing](progress);
            
            window.scrollTo(0, startPosition + distance * easeValue);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    easingFunctions = {
        linear: t => t,
        easeInQuad: t => t * t,
        easeOutQuad: t => t * (2 - t),
        easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInCubic: t => t * t * t,
        easeOutCubic: t => (--t) * t * t + 1,
        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    };
}

/**
 * Form Validator Component
 */
class FormValidator {
    constructor(form, rules = {}) {
        this.form = typeof form === 'string' ? document.querySelector(form) : form;
        this.rules = rules;
        this.errors = {};
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => {
            if (!this.validate()) {
                e.preventDefault();
            }
        });
        
        // Real-time validation
        this.form.addEventListener('input', (e) => {
            this.validateField(e.target);
        });
    }
    
    validate() {
        this.errors = {};
        let isValid = true;
        
        Object.keys(this.rules).forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field && !this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const fieldName = field.name;
        const fieldRules = this.rules[fieldName];
        
        if (!fieldRules) return true;
        
        let isValid = true;
        const value = field.value.trim();
        
        fieldRules.forEach(rule => {
            if (!this.runRule(rule, value, field)) {
                this.setFieldError(field, rule.message);
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });
        
        return isValid;
    }
    
    runRule(rule, value, field) {
        switch (rule.type) {
            case 'required':
                return value.length > 0;
            case 'min':
                return value.length >= rule.value;
            case 'max':
                return value.length <= rule.value;
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            case 'pattern':
                return new RegExp(rule.value).test(value);
            case 'custom':
                return rule.validator(value, field);
            default:
                return true;
        }
    }
    
    setFieldError(field, message) {
        this.errors[field.name] = message;
        field.classList.add('field--error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }
    
    clearFieldError(field) {
        delete this.errors[field.name];
        field.classList.remove('field--error');
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
}

/**
 * Memory Storage Helper with expiration (localStorage alternative for sandboxed environments)
 */
class StorageHelper {
    static set(key, value, expirationHours = 24) {
        // Use only memory storage since localStorage is restricted in sandboxed environment
        window._memoryStorage = window._memoryStorage || {};
        window._memoryStorage[key] = {
            value: value,
            timestamp: Date.now(),
            expiration: expirationHours * 60 * 60 * 1000
        };
    }
    
    static get(key) {
        // Use only memory storage
        window._memoryStorage = window._memoryStorage || {};
        const item = window._memoryStorage[key];
        
        if (!item) return null;
        
        const now = Date.now();
        if (now - item.timestamp > item.expiration) {
            delete window._memoryStorage[key];
            return null;
        }
        
        return item.value;
    }
    
    static remove(key) {
        // Use only memory storage
        if (window._memoryStorage) {
            delete window._memoryStorage[key];
        }
    }
    
    static clear() {
        // Use only memory storage
        window._memoryStorage = {};
    }
}

/**
 * Device Detection Utility
 */
class DeviceDetector {
    static isMobile() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    static isTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    }
    
    static isDesktop() {
        return window.innerWidth > 1024;
    }
    
    static isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    static getPlatform() {
        const userAgent = navigator.userAgent;
        if (/Windows/i.test(userAgent)) return 'Windows';
        if (/Macintosh|Mac OS X/i.test(userAgent)) return 'macOS';
        if (/Linux/i.test(userAgent)) return 'Linux';
        if (/Android/i.test(userAgent)) return 'Android';
        if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iOS';
        return 'Unknown';
    }
    
    static getBrowser() {
        const userAgent = navigator.userAgent;
        if (/Chrome/i.test(userAgent)) return 'Chrome';
        if (/Firefox/i.test(userAgent)) return 'Firefox';
        if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) return 'Safari';
        if (/Edge/i.test(userAgent)) return 'Edge';
        if (/Opera/i.test(userAgent)) return 'Opera';
        return 'Unknown';
    }
}

// Export components for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Modal,
        ProgressRing,
        AnimatedCounter,
        NotificationToast,
        LazyLoader,
        SmoothScroll,
        FormValidator,
        StorageHelper,
        DeviceDetector
    };
}

// Make components globally available
window.QuizComponents = {
    Modal,
    ProgressRing,
    AnimatedCounter,
    NotificationToast,
    LazyLoader,
    SmoothScroll,
    FormValidator,
    StorageHelper,
    DeviceDetector
};