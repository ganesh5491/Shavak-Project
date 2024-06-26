import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})



// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       crypto: 'crypto-browserify',
//       stream: 'stream-browserify',
//       os: 'os-browserify/browser',
//       buffer: 'buffer',
//     },
//   },
//   define: {
//     'process.env': {},
//     global: 'window',
//   },
//   optimizeDeps: {
//     include: ['buffer'],
//   },
// })
