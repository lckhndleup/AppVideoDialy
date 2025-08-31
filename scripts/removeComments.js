/*
  Strips all comments from JS/TS/JSX/TSX files under app/ and src/ using Babel parser/generator.
  Usage: node scripts/removeComments.js
*/

const fs = require('fs');
const path = require('path');
const fg = require('fast-glob');
const parser = require('@babel/parser');
const generate = require('@babel/generator').default;

const ROOT = process.cwd();

/** @type {import('@babel/parser').ParserPlugin[]} */
const plugins = [
  'jsx',
  'typescript',
  'decorators-legacy',
  'classProperties',
  'classPrivateProperties',
  'classPrivateMethods',
  'objectRestSpread',
  'dynamicImport',
  'optionalChaining',
  'nullishCoalescingOperator',
  'topLevelAwait',
];

async function main() {
  const patterns = [
    'app/**/*.{ts,tsx,js,jsx}',
    'src/**/*.{ts,tsx,js,jsx}',
  ];
  const ignore = [
    '**/node_modules/**',
    '**/.expo/**',
    '**/dist/**',
    '**/build/**',
  ];

  const files = await fg(patterns, { ignore, dot: false, cwd: ROOT });

  let changed = 0;
  let failed = 0;

  for (const rel of files) {
    const abs = path.join(ROOT, rel);
    const code = fs.readFileSync(abs, 'utf8');

    try {
      const ast = parser.parse(code, {
        sourceType: 'unambiguous',
        plugins,
        allowReturnOutsideFunction: true,
        allowAwaitOutsideFunction: true,
        tokens: false,
        ranges: false,
        attachComment: false,
      });

      const out = generate(ast, { comments: false, retainLines: true }, code).code;

      if (out !== code) {
        fs.writeFileSync(abs, out, 'utf8');
        changed++;
        process.stdout.write(`stripped: ${rel}\n`);
      }
    } catch (err) {
      failed++;
      process.stderr.write(`Failed to process ${rel}: ${err.message}\n`);
    }
  }

  console.log(`\nDone. Changed: ${changed}, Failed: ${failed}, Scanned: ${files.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

