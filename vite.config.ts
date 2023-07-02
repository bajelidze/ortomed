import { resolve } from 'path';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import vue from '@vitejs/plugin-vue';
import alias from '@rollup/plugin-alias';

const electronDir = 'electron';
const electronDirFull = resolve(__dirname, electronDir);

export default defineConfig({
  plugins: [
    vue(),
    electron([
      {
        entry: `${electronDir}/main.ts`,
        vite: {
          plugins: [
            alias({
              entries: [
                { find: '@', replacement: electronDirFull },
              ],
            }),
          ],
          build: {
            rollupOptions: {
              external: [ // C/C++ modules that can't be built properly.
                'sqlite3',
                'knex',
              ],
            },
            sourcemap: true,
          },
        },
      },
      {
        entry: `${electronDir}/preload/preload.ts`,
        onstart(options) {
          // Notify the Renderer-Process to reload the page
          // when the Preload-Scripts build is complete,
          // instead of restarting the entire Electron App.
          options.reload();
        },
      },
    ]),
    renderer(),
  ],
});
