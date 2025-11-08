/**
 * AI Module Loader - Lazy Load Optimization
 * 
 * Dynamically loads AI modules only when needed to improve page load performance
 * Prevents loading heavy AI scripts on pages that don't use them
 * 
 * @version 1.0.0
 * @author F-AI bian Platform
 */

class AIModuleLoader {
    constructor() {
        this.loadedModules = new Set();
        this.loadingPromises = new Map();
        this.moduleRegistry = {
            'form-correction': {
                url: '/static/form-correction-ai.js',
                className: 'FormCorrectionAI',
                dependencies: []
            },
            'injury-risk': {
                url: '/static/injury-risk-ai.js',
                className: 'InjuryRiskAI',
                dependencies: []
            },
            'progress-tracker': {
                url: '/static/progress-tracker-ai.js',
                className: 'ProgressTrackerAI',
                dependencies: []
            },
            'smart-exercise': {
                url: '/static/smart-exercise-library.js',
                className: 'SmartExerciseLibrary',
                dependencies: []
            },
            'patient-education': {
                url: '/static/patient-education-ai.js',
                className: 'PatientEducationAI',
                dependencies: []
            },
            'skeleton-optimizer': {
                url: '/static/skeleton-optimizer.js',
                className: 'SkeletonOptimizer',
                dependencies: []
            },
            'ai-batch-processor': {
                url: '/static/ai-batch-processor.js',
                className: 'AIBatchProcessor',
                dependencies: []
            },
            'device-integration': {
                url: '/static/device-integration-hub.js',
                className: 'DeviceIntegrationHub',
                dependencies: []
            },
            'trainer-ai': {
                url: '/static/trainer-ai-helper.js',
                className: 'TrainerAIHelper',
                dependencies: []
            }
        };
        
        console.log('✅ AI Module Loader initialized');
    }
    
    /**
     * Load a specific AI module dynamically
     * @param {string} moduleName - Name of the module to load
     * @returns {Promise<any>} - Promise that resolves to the module class/instance
     */
    async load(moduleName) {
        if (!this.moduleRegistry[moduleName]) {
            throw new Error(`Unknown module: ${moduleName}`);
        }
        
        // Return if already loaded
        if (this.loadedModules.has(moduleName)) {
            console.log(`✓ Module "${moduleName}" already loaded`);
            return this.getModuleClass(moduleName);
        }
        
        // Return existing loading promise if in progress
        if (this.loadingPromises.has(moduleName)) {
            console.log(`⏳ Module "${moduleName}" is loading...`);
            return this.loadingPromises.get(moduleName);
        }
        
        console.log(`📦 Loading module "${moduleName}"...`);
        
        const module = this.moduleRegistry[moduleName];
        
        // Load dependencies first
        if (module.dependencies && module.dependencies.length > 0) {
            await Promise.all(
                module.dependencies.map(dep => this.load(dep))
            );
        }
        
        // Create loading promise
        const loadingPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = module.url;
            script.async = true;
            
            script.onload = () => {
                this.loadedModules.add(moduleName);
                this.loadingPromises.delete(moduleName);
                console.log(`✅ Module "${moduleName}" loaded successfully`);
                
                const moduleClass = this.getModuleClass(moduleName);
                resolve(moduleClass);
            };
            
            script.onerror = () => {
                this.loadingPromises.delete(moduleName);
                console.error(`❌ Failed to load module "${moduleName}"`);
                reject(new Error(`Failed to load ${moduleName}`));
            };
            
            document.head.appendChild(script);
        });
        
        this.loadingPromises.set(moduleName, loadingPromise);
        return loadingPromise;
    }
    
    /**
     * Load multiple modules in parallel
     * @param {string[]} moduleNames - Array of module names
     * @returns {Promise<any[]>} - Promise that resolves to array of modules
     */
    async loadMultiple(moduleNames) {
        console.log(`📦 Loading ${moduleNames.length} modules in parallel...`);
        return Promise.all(moduleNames.map(name => this.load(name)));
    }
    
    /**
     * Preload modules in the background (low priority)
     * @param {string[]} moduleNames - Array of module names to preload
     */
    preload(moduleNames) {
        console.log(`🔮 Preloading ${moduleNames.length} modules in background...`);
        
        // Use requestIdleCallback if available, otherwise setTimeout
        const preloadFn = () => {
            moduleNames.forEach(name => {
                if (!this.loadedModules.has(name) && !this.loadingPromises.has(name)) {
                    this.load(name).catch(err => {
                        console.warn(`Preload failed for ${name}:`, err);
                    });
                }
            });
        };
        
        if ('requestIdleCallback' in window) {
            requestIdleCallback(preloadFn, { timeout: 5000 });
        } else {
            setTimeout(preloadFn, 2000);
        }
    }
    
    /**
     * Get module class from window object
     * @param {string} moduleName - Name of the module
     * @returns {any} - Module class or undefined
     */
    getModuleClass(moduleName) {
        const module = this.moduleRegistry[moduleName];
        if (!module) return undefined;
        
        return window[module.className];
    }
    
    /**
     * Check if a module is loaded
     * @param {string} moduleName - Name of the module
     * @returns {boolean} - True if loaded
     */
    isLoaded(moduleName) {
        return this.loadedModules.has(moduleName);
    }
    
    /**
     * Unload a module (for memory management)
     * @param {string} moduleName - Name of the module to unload
     */
    unload(moduleName) {
        if (!this.loadedModules.has(moduleName)) {
            console.warn(`Module "${moduleName}" is not loaded`);
            return;
        }
        
        const module = this.moduleRegistry[moduleName];
        if (module && module.className && window[module.className]) {
            delete window[module.className];
        }
        
        this.loadedModules.delete(moduleName);
        console.log(`🗑️ Module "${moduleName}" unloaded`);
    }
    
    /**
     * Get loading statistics
     * @returns {object} - Loading stats
     */
    getStats() {
        return {
            totalModules: Object.keys(this.moduleRegistry).length,
            loadedModules: this.loadedModules.size,
            loadingModules: this.loadingPromises.size,
            loadedList: Array.from(this.loadedModules),
            availableList: Object.keys(this.moduleRegistry)
        };
    }
}

// Helper functions for common loading patterns
const AILoader = {
    loader: new AIModuleLoader(),
    
    /**
     * Load modules for assessment page
     */
    async loadForAssessment() {
        return this.loader.loadMultiple([
            'form-correction',
            'skeleton-optimizer'
        ]);
    },
    
    /**
     * Load modules for unified dashboard
     */
    async loadForDashboard() {
        return this.loader.loadMultiple([
            'injury-risk',
            'progress-tracker',
            'smart-exercise',
            'patient-education',
            'ai-batch-processor'
        ]);
    },
    
    /**
     * Load modules for device integration
     */
    async loadForDeviceIntegration() {
        return this.loader.load('device-integration');
    },
    
    /**
     * Load modules for patient portal
     */
    async loadForPatientPortal() {
        return this.loader.load('trainer-ai');
    },
    
    /**
     * Preload all modules for full-featured experience
     */
    preloadAll() {
        const allModules = Object.keys(this.loader.moduleRegistry);
        this.loader.preload(allModules);
    },
    
    /**
     * Load individual module
     */
    async load(moduleName) {
        return this.loader.load(moduleName);
    },
    
    /**
     * Check if module is loaded
     */
    isLoaded(moduleName) {
        return this.loader.isLoaded(moduleName);
    },
    
    /**
     * Get loading statistics
     */
    getStats() {
        return this.loader.getStats();
    }
};

// Expose to global scope
window.AIModuleLoader = AIModuleLoader;
window.AILoader = AILoader;

// Auto-detect page type and load appropriate modules
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    // Determine which modules to load based on current page
    if (path.includes('assessment-enhanced')) {
        console.log('📄 Assessment page detected - loading assessment modules');
        AILoader.loadForAssessment().catch(console.error);
    } else if (path.includes('unified-dashboard')) {
        console.log('📄 Dashboard page detected - loading dashboard modules');
        AILoader.loadForDashboard().catch(console.error);
    } else if (path.includes('device-integration')) {
        console.log('📄 Device integration page detected - loading integration module');
        AILoader.loadForDeviceIntegration().catch(console.error);
    } else if (path.includes('patient-')) {
        console.log('📄 Patient portal page detected - loading patient modules');
        AILoader.loadForPatientPortal().catch(console.error);
    }
    
    // Preload other modules in the background after 5 seconds
    setTimeout(() => {
        const stats = AILoader.getStats();
        if (stats.loadedModules < stats.totalModules) {
            console.log('🔮 Starting background preload of remaining modules...');
            const unloadedModules = stats.availableList.filter(
                m => !stats.loadedList.includes(m)
            );
            AILoader.loader.preload(unloadedModules);
        }
    }, 5000);
});

console.log('✅ AI Module Loader ready');
