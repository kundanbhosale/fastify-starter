import { defineConfig } from 'vite'
import path from 'path'
import { VitePluginNode } from 'vite-plugin-node'
import dotenv from 'dotenv'

// https://vitejs.dev/config/
export default ({ mode }) => {
    const { parsed } = dotenv.config({
        path: '.env',
    })

    const envs = {
        'process.env.NODE_ENV': JSON.stringify(mode),
    }

    parsed &&
        Object.keys(parsed).map((k) => {
            envs['process.env.' + k] = JSON.stringify(parsed[k]) || undefined
        })

    return defineConfig({
        mode: 'production',
        define: {
            ...envs,
        },

        preview: {
            port: Number(parsed?.PORT),
        },
        server: {
            port: Number(parsed?.PORT),
        },

        build: {
            sourcemap: true,
            minify: 'terser',
            outDir: path.resolve(__dirname, 'dist'),
            emptyOutDir: path.resolve(__dirname, 'dist'),
        },

        resolve: {
            alias: [
                {
                    find: '@/',
                    replacement: path.resolve(__dirname, 'src') + '/',
                },
            ],
        },
        plugins: [
            ...VitePluginNode({
                adapter: 'fastify',
                appPath: path.resolve(__dirname, 'src/index.ts'),
            }),
        ],
    })
}
