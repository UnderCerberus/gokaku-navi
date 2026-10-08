// 共通: プロジェクトの core + 辞書 + 指定ファイルを vm に読み込む
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..', '..');      // gokaku-navi/
const CORE = ['js/core/ns.js', 'js/core/util.js', 'js/core/tex.js', 'js/core/plot.js', 'js/core/steps.js', 'js/data/units.js',
  'js/data/dict-a-l.js', 'js/data/dict-m-z.js', 'js/data/idioms.js', 'js/data/seikei-english-2023.js'];
module.exports = function load(extra, opts) {
  opts = opts || {};
  const sandbox = { console, setTimeout, clearTimeout, setInterval, clearInterval };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.navigator = { userAgent: 'node' };
  vm.createContext(sandbox);
  const list = (opts.core || CORE).concat(extra || []);
  list.forEach((rel) => {
    const abs = path.isAbsolute(rel) ? rel : path.join(ROOT, rel);
    if (!fs.existsSync(abs)) { if (opts.verbose) console.log('missing', rel); return; }
    vm.runInContext(fs.readFileSync(abs, 'utf8'), sandbox, { filename: abs });
  });
  return sandbox.JK;
};
