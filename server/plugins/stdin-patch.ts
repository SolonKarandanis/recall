import { definePlugin as defineNitroPlugin } from 'nitro'

export default defineNitroPlugin(() => {
	// On some hosts (e.g. Hostinger), fd 0 is not openable as a TCP socket.
	// When the Node.js ESM loader first syncs the `node:process` built-in's
	// named exports, it reads the `stdin` getter, which calls new Socket({fd:0})
	// and throws EEXIST — crashing the first SSR request.
	// Patching the getter here (before ssr.mjs lazy-loads) replaces it with a
	// no-op stub so the facade sync succeeds harmlessly.
	try {
		void process.stdin
	} catch (e: any) {
		if (e?.code === 'EEXIST') {
			const stub: any = {
				readable: false,
				writable: false,
				isPaused: () => true,
				on: () => stub,
				once: () => stub,
				off: () => stub,
				addListener: () => stub,
				removeListener: () => stub,
				resume: () => stub,
				pause: () => stub,
				pipe: () => stub,
				destroy: () => {},
				read: () => null,
			}
			Object.defineProperty(process, 'stdin', {
				configurable: true,
				enumerable: true,
				get: () => stub,
			})
		}
	}
})
