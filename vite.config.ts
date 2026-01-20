import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [react()],

        // BASE URL CONFIGURATION
        // Critical for GitHub Pages: 
        // If repo is 'portfolio', base should be '/portfolio/'.
        // If User Site (nikki.github.io), base is '/'.
        // Usage: Set VITE_BASE_URL in .env or assume root.
        base: env.VITE_BASE_URL || '/',

        // Env variable exposure done automatically for VITE_ prefixed vars

        // Build Optimizations
        build: {
            outDir: 'dist',
            assetsDir: 'assets',
            sourcemap: false, // Cleaner prod build
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ['react', 'react-dom', 'framer-motion'],
                        // Split admin and public logic if possible, 
                        // but context is shared, so might be tricky.
                    }
                }
            }
        }
    }
})
