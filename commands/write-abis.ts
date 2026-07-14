import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import path from "path";
import { format, resolveConfig } from "prettier";

import { CanonicalAddresses, KnownContracts } from "../src/contracts.js";
import { defaultMastercopiesDir } from "../src/mastercopies.js";

const DEFAULT_ABIS_DIR = path.join("src", "abis");

const identifier = (v: string) => v.replace(/[^a-zA-Z0-9_$]/g, "_");

const sortedDirs = (dir: string) =>
  !existsSync(dir)
    ? []
    : readdirSync(dir, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
        .sort();

export async function writeAbis({
  mastercopiesDir = defaultMastercopiesDir(),
  abisDir = DEFAULT_ABIS_DIR,
}: {
  mastercopiesDir?: string;
  abisDir?: string;
} = {}): Promise<void> {
  if (!existsSync(mastercopiesDir)) return;

  rmSync(abisDir, { recursive: true, force: true });
  mkdirSync(abisDir, { recursive: true });

  const registry: Record<string, Record<string, string>> = {};

  for (const moduleName of sortedDirs(mastercopiesDir)) {
    for (const version of sortedDirs(path.join(mastercopiesDir, moduleName))) {
      const asset = findCanonicalAsset({
        mastercopiesDir,
        moduleName,
        version,
      });
      if (!asset) continue;

      const abiPath = path.join(
        mastercopiesDir,
        moduleName,
        version,
        asset,
        "abi.json"
      );
      const abi = readFileSync(abiPath, "utf8").trim();
      const exportName = `${identifier(moduleName)}_${version.replace(
        /\./g,
        "_"
      )}_ABI`;

      mkdirSync(path.join(abisDir, moduleName), { recursive: true });
      writeFileSync(
        path.join(abisDir, moduleName, `${version}.ts`),
        `export const ${exportName} = ${abi} as const;\n`
      );

      (registry[moduleName] ??= {})[version] = exportName;
    }
  }

  const indexPath = path.join(abisDir, "index.ts");
  const prettierConfig = await resolveConfig(indexPath);
  const index = await format(renderIndex(registry), {
    ...prettierConfig,
    filepath: indexPath,
  });
  writeFileSync(indexPath, index);
}

function findCanonicalAsset({
  mastercopiesDir,
  moduleName,
  version,
}: {
  mastercopiesDir: string;
  moduleName: string;
  version: string;
}) {
  const versionDir = path.join(mastercopiesDir, moduleName, version);
  const assets = sortedDirs(versionDir);
  const expected =
    CanonicalAddresses[moduleName as KnownContracts]?.[
      version as keyof (typeof CanonicalAddresses)[KnownContracts]
    ]?.toLowerCase();

  return (
    assets.find((asset) => {
      const bytecodePath = path.join(versionDir, asset, "bytecode.json");
      if (!expected || !existsSync(bytecodePath)) return false;
      const bytecode = JSON.parse(readFileSync(bytecodePath, "utf8"));
      return bytecode.address?.toLowerCase() === expected;
    }) || assets[0]
  );
}

function renderIndex(registry: Record<string, Record<string, string>>) {
  const entries = Object.entries(registry);
  const imports = entries
    .flatMap(([mod, vers]) =>
      Object.entries(vers).map(
        ([ver, name]) => `import { ${name} } from "./${mod}/${ver}.js";`
      )
    )
    .join("\n");

  const body = entries
    .map(
      ([mod, vers]) =>
        `  ${JSON.stringify(mod)}: {\n${Object.entries(vers)
          .map(([ver, name]) => `    ${JSON.stringify(ver)}: ${name},`)
          .join("\n")}\n  },`
    )
    .join("\n");

  return `${imports}\n\nexport const ABIs = {\n${body}\n} as const;\n`;
}
