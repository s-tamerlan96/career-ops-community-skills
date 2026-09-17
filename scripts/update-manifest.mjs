import fs from 'node:fs';
import path from 'node:path';
import { checkPackage, listFiles, packageRoot, digest } from './check-package.mjs';

const result = checkPackage(packageRoot, { hashes: false });
if (!result.ok) {
  console.error(JSON.stringify(result, null, 2));
  process.exitCode = 1;
} else {
  const files = Object.fromEntries(listFiles(packageRoot).files
    .filter(p => p !== 'package-manifest.json')
    .map(p => [p, digest(fs.readFileSync(path.join(packageRoot, p)))]));
  fs.writeFileSync(path.join(packageRoot, 'package-manifest.json'), JSON.stringify({ schema_version: 1, files }, null, 2) + '\n');
  console.log(`Manifest updated for ${Object.keys(files).length} reviewed files. Run npm test.`);
}
