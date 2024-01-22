import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@lib': fileURLToPath(new URL('./lib', import.meta.url)),
		},
	}
})
