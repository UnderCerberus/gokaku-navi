// onnxruntime-web（wasm 版）を、file:// でも読める普通の <script> 2 本に詰め直す
//   js/vendor/ort/ort-src.js  … window.JK_ORT_SRC  = ort.wasm.bundle.min.mjs の本文（Blob URL にして import する）
//   js/vendor/ort/ort-wasm.js … window.JK_ORT_WASM = ort-wasm-simd-threaded.wasm の base64
// 使い方: node tools/nmt/build-vendor.js <onnxruntime-web のフォルダ>
'use strict';
const fs = require('fs');
const path = require('path');
const src = process.argv[2];
if (!src) { console.error('使い方: node tools/nmt/build-vendor.js <node_modules/onnxruntime-web>'); process.exit(1); }
const ver = JSON.parse(fs.readFileSync(path.join(src, 'package.json'), 'utf8')).version;
const out = path.join(__dirname, '..', '..', 'js', 'vendor', 'ort');
fs.mkdirSync(out, { recursive: true });
const head = '/* ONNX Runtime Web ' + ver + '（MIT License, (c) Microsoft Corporation。LICENSE を参照）。tools/nmt/build-vendor.js で生成 */\n';
const mjs = fs.readFileSync(path.join(src, 'dist', 'ort.wasm.bundle.min.mjs'), 'utf8');
fs.writeFileSync(path.join(out, 'ort-src.js'), head + 'window.JK_ORT_SRC = ' + JSON.stringify(mjs) + ';\n');
const wasm = fs.readFileSync(path.join(src, 'dist', 'ort-wasm-simd-threaded.wasm'));
fs.writeFileSync(path.join(out, 'ort-wasm.js'), head + 'window.JK_ORT_WASM = "' + wasm.toString('base64') + '";\n');
const lic = ['LICENSE', 'LICENSE.txt', 'LICENSE.md'].map((f) => path.join(src, f)).find((f) => fs.existsSync(f));
if (lic) fs.copyFileSync(lic, path.join(out, 'LICENSE'));
console.log('onnxruntime-web', ver, 'mjs', mjs.length, 'wasm', wasm.length, lic ? 'LICENSE ok' : 'LICENSE なし');
