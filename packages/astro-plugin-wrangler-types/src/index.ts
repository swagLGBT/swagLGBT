import { execFile as execFileCb } from 'node:child_process';
import { resolve } from 'node:path';
import { promisify } from 'node:util';
import type { Plugin, ResolvedConfig } from 'vite';

const execFile = promisify(execFileCb);

export interface WranglerTypesOptions {
  /** Paths to watch relative to the Vite project root. Defaults to ['wrangler.jsonc', 'wrangler.toml', '.dev.vars']. */
  watchedPaths?: string[];
}

const DEFAULT_WATCHED_PATHS = ['wrangler.jsonc', 'wrangler.toml', '.dev.vars'];

export default function wranglerTypes(options: WranglerTypesOptions = {}): Plugin {
  const { watchedPaths = DEFAULT_WATCHED_PATHS } = options;
  let root: string;
  let resolvedPaths: string[];
  let wranglerBin: string;

  async function run(onError?: (msg: string) => void): Promise<void> {
    try {
      const { stdout, stderr } = await execFile(wranglerBin, ['types'], { cwd: root });
      if (stdout) process.stdout.write(stdout);
      if (stderr) process.stderr.write(stderr);
    } catch (err) {
      onError?.(
        `[wrangler-types] wrangler types failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  return {
    name: 'wrangler-types',

    configResolved(config: ResolvedConfig) {
      root = config.root;
      wranglerBin = resolve(root, 'node_modules/.bin/wrangler');
      resolvedPaths = watchedPaths.map((p) => resolve(root, p));
    },

    async buildStart() {
      await run((msg) => this.warn(msg));
    },

    async configureServer(server) {
      await run((msg) => console.warn(msg));
      for (const p of resolvedPaths) {
        server.watcher.add(p);
      }
      const handler = (file: string) => {
        if (resolvedPaths.includes(file)) {
          void run((msg) => console.warn(msg));
        }
      };
      server.watcher.on('change', handler);
      return () => server.watcher.off('change', handler);
    },
  };
}
