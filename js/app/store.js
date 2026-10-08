/* GOKAKU NAVI — 状態の保存（localStorage）・イベントバス・日時ユーティリティ */
(function () {
  'use strict';
  var KEY = 'gokaku-navi-v1';

  function defaults() {
    return {
      v: 1,
      profile: { grade: 3, cur: 50, target: 55, convert: false, examDate: '', levelOverride: '' },
      theme: 'dark',
      mode: 'calc',                    // 'exam'（過去問モード）| 'calc'（計算機モード）
      subject: 'math',
      timer: { days: {}, bySubject: {} },   // days: {'2026-10-02': 秒}
      attempts: [],                    // 解答ログ
      todos: [],
      vocabLog: [],                    // {w, ok, ts}
      calcLog: [],                     // {id, ts}
      custom: [],                      // ユーザーが追加した問題
      ui: { depth: '', calc: {}, filters: {} }
    };
  }

  function merge(def, s) {
    if (!s || typeof s !== 'object') return def;
    Object.keys(def).forEach(function (k) {
      if (s[k] === undefined || s[k] === null) return;
      if (def[k] && typeof def[k] === 'object' && !Array.isArray(def[k])) {
        if (typeof s[k] === 'object' && !Array.isArray(s[k])) {
          Object.keys(s[k]).forEach(function (kk) { def[k][kk] = s[k][kk]; });
        }
      } else if (Array.isArray(def[k])) {
        if (Array.isArray(s[k])) def[k] = s[k];
      } else def[k] = s[k];
    });
    return def;
  }

  var S;
  try {
    var raw = window.localStorage.getItem(KEY);
    S = merge(defaults(), raw ? JSON.parse(raw) : null);
  } catch (e) {
    S = defaults();
  }

  var timer = null, subs = {};
  function saveNow() {
    if (timer) { clearTimeout(timer); timer = null; }
    try { window.localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* 保存不可の環境ではメモリのみ */ }
  }

  JK.store = {
    get s() { return S; },
    save: function () {
      if (timer) return;
      timer = setTimeout(function () { timer = null; saveNow(); }, 400);
    },
    saveNow: saveNow,
    on: function (ev, fn) { (subs[ev] = subs[ev] || []).push(fn); },
    emit: function (ev, data) { (subs[ev] || []).forEach(function (fn) { fn(data); }); },
    exportJson: function () { return JSON.stringify(S, null, 1); },
    reset: function () { S = defaults(); saveNow(); }
  };

  function pad(n) { return n < 10 ? '0' + n : String(n); }
  JK.time = {
    pad: pad,
    dayKey: function (d) { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); },
    // 週の開始（月曜 0:00）
    weekStart: function (d) {
      d = new Date(d || new Date());
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
      return d;
    },
    hms: function (sec) {
      sec = Math.max(0, Math.floor(sec));
      return pad(Math.floor(sec / 3600)) + ':' + pad(Math.floor(sec % 3600 / 60)) + ':' + pad(sec % 60);
    },
    hm: function (sec) {
      sec = Math.max(0, Math.floor(sec));
      var h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60);
      return h ? h + '時間' + pad(m) + '分' : m + '分';
    },
    dateJa: function (d) {
      return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日（' + '日月火水木金土'.charAt(d.getDay()) + '）';
    }
  };

  window.addEventListener('pagehide', saveNow);
  window.addEventListener('beforeunload', saveNow);
})();
