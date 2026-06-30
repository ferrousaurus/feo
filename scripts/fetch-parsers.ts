import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

type RemoteFile = readonly [filename: string, url: string];
type RemoteSource = { filetype: string; files: readonly RemoteFile[] };

const ROOT = resolve(import.meta.dir, "..");
const PARSERS_DIR = join(ROOT, "src/parsers");

const SOURCES: readonly RemoteSource[] = [
  {
    filetype: "json",
    files: [
      [
        "tree-sitter-json.wasm",
        "https://github.com/tree-sitter/tree-sitter-json/releases/download/v0.24.8/tree-sitter-json.wasm",
      ],
      [
        "highlights.scm",
        "https://raw.githubusercontent.com/tree-sitter/tree-sitter-json/master/queries/highlights.scm",
      ],
    ],
  },
  {
    filetype: "yaml",
    files: [
      [
        "tree-sitter-yaml.wasm",
        "https://github.com/tree-sitter-grammars/tree-sitter-yaml/releases/download/v0.7.2/tree-sitter-yaml.wasm",
      ],
      [
        "highlights.scm",
        "https://raw.githubusercontent.com/tree-sitter-grammars/tree-sitter-yaml/master/queries/highlights.scm",
      ],
    ],
  },
  {
    filetype: "toml",
    files: [
      [
        "tree-sitter-toml.wasm",
        "https://github.com/tree-sitter-grammars/tree-sitter-toml/releases/download/v0.7.0/tree-sitter-toml.wasm",
      ],
      [
        "highlights.scm",
        "https://raw.githubusercontent.com/tree-sitter-grammars/tree-sitter-toml/master/queries/highlights.scm",
      ],
    ],
  },
];

const download = async (url: string, dest: string): Promise<void> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, new Uint8Array(await res.arrayBuffer()));
};

const fetchSource = async ({ filetype, files }: RemoteSource): Promise<void> => {
  await Promise.all(
    files.map(async ([filename, url]) => {
      const dest = join(PARSERS_DIR, filetype, filename);
      await download(url, dest);
      console.log(`fetched ${url} -> ${dest}`);
    }),
  );
};

const main = async (): Promise<void> => {
  await Promise.all(SOURCES.map(fetchSource));
};

if (import.meta.main) {
  await main();
}
