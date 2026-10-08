/* GOKAKU NAVI — 名前空間とレジストリ（全モジュールがここに登録する） */
(function (g) {
  'use strict';
  var JK = g.JK = g.JK || {};
  JK.VERSION = '1.0.0';

  JK.cfg = {
    subjects: [
      { id: 'math', name: '数学', icon: '∑' },
      { id: 'english', name: '英語', icon: 'Aa' },
      { id: 'physics', name: '物理', icon: '⚛' }
    ],
    // 志望偏差値 → 過去問レベル（min 以上 max 未満）
    levels: [
      { id: 'basic', name: '共通テスト/基礎レベル', short: '基礎', min: -Infinity, max: 50 },
      { id: 'mid', name: '中堅大レベル', short: '中堅', min: 50, max: 60 },
      { id: 'adv', name: '難関大レベル', short: '難関', min: 60, max: Infinity }
    ]
  };

  JK.levelOf = function (target) {
    var t = Number(target);
    if (!isFinite(t)) return 'mid';
    for (var i = 0; i < JK.cfg.levels.length; i++) {
      var lv = JK.cfg.levels[i];
      if (t >= lv.min && t < lv.max) return lv.id;
    }
    return 'mid';
  };
  JK.levelInfo = function (id) {
    for (var i = 0; i < JK.cfg.levels.length; i++) if (JK.cfg.levels[i].id === id) return JK.cfg.levels[i];
    if (id === 'drill') return { id: 'drill', name: '復習ドリル', short: '復習' };
    return null;
  };
  JK.subjectInfo = function (id) {
    for (var i = 0; i < JK.cfg.subjects.length; i++) if (JK.cfg.subjects[i].id === id) return JK.cfg.subjects[i];
    return null;
  };

  /* 入力不正などユーザーに見せるエラー */
  function CalcError(msg) {
    this.name = 'CalcError';
    this.message = msg;
    this.stack = (new Error(msg)).stack;
  }
  CalcError.prototype = Object.create(Error.prototype);
  CalcError.prototype.constructor = CalcError;
  JK.CalcError = CalcError;

  /* 登録時の不整合（ID 重複など）。validator が読む */
  JK._regErrors = [];

  /* ---- 単元 ---- */
  JK.units = {};
  JK.unitList = [];
  JK.registerUnits = function (subject, arr) {
    arr.forEach(function (u) {
      u.subject = subject;
      u.prereq = u.prereq || [];
      if (JK.units[u.id]) { JK._regErrors.push('単元 ID 重複: ' + u.id); return; }
      JK.units[u.id] = u;
      JK.unitList.push(u);
    });
  };

  /* ---- 問題 ---- */
  JK.problems = [];
  JK.problemById = {};
  JK.registerProblems = function (arr) {
    arr.forEach(function (p) {
      if (!p || !p.id) { JK._regErrors.push('id のない問題'); return; }
      if (JK.problemById[p.id]) { JK._regErrors.push('問題 ID 重複: ' + p.id); return; }
      JK.problemById[p.id] = p;
      JK.problems.push(p);
    });
  };

  /* ---- 英語長文 ---- */
  JK.passages = {};
  JK.passageList = [];
  JK.registerPassages = function (arr) {
    arr.forEach(function (p) {
      if (!p || !p.id) { JK._regErrors.push('id のない passage'); return; }
      if (JK.passages[p.id]) { JK._regErrors.push('passage ID 重複: ' + p.id); return; }
      JK.passages[p.id] = p;
      JK.passageList.push(p);
      if (p.vocabExtra && p.vocabExtra.length) JK.registerDict(p.vocabExtra, true);
    });
  };

  /* ---- 数学計算機 / 物理シミュレーター ---- */
  JK.calcs = [];
  JK.calcById = {};
  JK.registerCalc = function (def) {
    if (!def || !def.id) { JK._regErrors.push('id のない calc'); return; }
    if (JK.calcById[def.id]) { JK._regErrors.push('calc ID 重複: ' + def.id); return; }
    JK.calcById[def.id] = def;
    JK.calcs.push(def);
  };
  JK.sims = [];
  JK.simById = {};
  JK.registerSim = function (def) {
    if (!def || !def.id) { JK._regErrors.push('id のない sim'); return; }
    if (JK.simById[def.id]) { JK._regErrors.push('sim ID 重複: ' + def.id); return; }
    JK.simById[def.id] = def;
    JK.sims.push(def);
  };

  /* ---- 英語辞書 ---- */
  JK.dict = { words: {}, count: 0, idioms: [], idiomKeys: {} };
  // quiet=true: 既存の (語, 品詞) があれば黙ってスキップ（長文の vocabExtra 用）
  JK.registerDict = function (arr, quiet) {
    arr.forEach(function (e) {
      if (!e || typeof e[0] !== 'string') { JK._regErrors.push('辞書エントリ不正: ' + JSON.stringify(e)); return; }
      var w = e[0].toLowerCase();
      var list = JK.dict.words[w] || (JK.dict.words[w] = []);
      for (var i = 0; i < list.length; i++) {
        if (list[i].pos === e[1]) {
          if (!quiet) JK._regErrors.push('辞書 (語, 品詞) 重複: ' + w + ' / ' + e[1]);
          return;
        }
      }
      list.push({ w: w, pos: e[1], ja: e[2], lv: e[3] });
      JK.dict.count++;
    });
  };
  JK.registerIdioms = function (arr) {
    arr.forEach(function (e) {
      if (!e || typeof e[0] !== 'string') { JK._regErrors.push('熟語エントリ不正: ' + JSON.stringify(e)); return; }
      var k = e[0].toLowerCase();
      if (JK.dict.idiomKeys[k]) { JK._regErrors.push('熟語重複: ' + e[0]); return; }
      JK.dict.idiomKeys[k] = true;
      JK.dict.idioms.push({ phrase: e[0], ja: e[1], lv: e[2] });
    });
  };
  JK.grammar = [];
  JK.registerGrammar = function (arr) {
    arr.forEach(function (gm) { JK.grammar.push(gm); });
  };

  /* ---- モジュール間フック（アプリ側が上書きする） ---- */
  JK.hooks = {
    vocabAnswered: function (/* word, ok */) {}
  };

  JK.en = JK.en || {};
})(typeof window !== 'undefined' ? window : globalThis);
