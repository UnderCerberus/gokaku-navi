/* GOKAKU NAVI — 誤答分析と「前の範囲に引き戻す」復習連動ロジック、ToDo の管理
   JK.analysis: 解答ログの記録・集計・復習要否の判定 / JK.todo: ToDo の追加・完了 */
(function () {
  'use strict';
  var store = JK.store;
  var DAY = 864e5;

  var CAUSES = [
    { id: 'knowledge', name: '公式・知識があいまい', w: 1.2 },
    { id: 'blank', name: '手が出なかった', w: 1.5 },
    { id: 'calc', name: '計算ミス', w: 0.7 },
    { id: 'read', name: '問題文の読み違い', w: 0.3 },
    { id: 'time', name: '時間が足りなかった', w: 0.5 }
  ];
  function causeWeight(id) {
    for (var i = 0; i < CAUSES.length; i++) if (CAUSES[i].id === id) return CAUSES[i].w;
    return 1.0;                                   // 原因未選択
  }

  function attempts() { return store.s.attempts; }
  function uid(prefix) { return prefix + Date.now().toString(36) + Math.floor(Math.random() * 1e5).toString(36); }

  /* ---------- 集計 ---------- */
  function unitStats(unit, days) {
    var since = days ? Date.now() - days * DAY : 0, n = 0, ok = 0, miss = 0;
    attempts().forEach(function (a) {
      if (a.unit !== unit || a.ts < since) return;
      n++;
      if (a.ok) ok++; else miss++;
    });
    return { n: n, ok: ok, miss: miss, acc: n ? ok / n : null };
  }
  // 直近 6 回の正答率（データなしは null）
  function mastery(unit) {
    var list = attempts().filter(function (a) { return a.unit === unit; }).slice(-6);
    if (!list.length) return null;
    return list.filter(function (a) { return a.ok; }).length / list.length;
  }
  function subjectAcc(subject) {
    var list = attempts().filter(function (a) { return a.subject === subject; }).slice(-30);
    if (!list.length) return null;
    return list.filter(function (a) { return a.ok; }).length / list.length;
  }
  function weakUnits(limit) {
    var map = {};
    attempts().slice(-400).forEach(function (a) {
      var m = map[a.unit] || (map[a.unit] = { unit: a.unit, n: 0, ok: 0 });
      m.n++;
      if (a.ok) m.ok++;
    });
    var arr = Object.keys(map).map(function (k) { var m = map[k]; m.acc = m.ok / m.n; return m; })
      .filter(function (m) { return JK.units[m.unit]; });
    arr.sort(function (x, y) { return (x.acc - y.acc) || (y.n - x.n); });
    return arr.slice(0, limit || 5);
  }
  function causeStats(days) {
    var since = Date.now() - (days || 30) * DAY, out = {}, total = 0;
    attempts().forEach(function (a) {
      if (a.ok || a.ts < since || !a.cause) return;
      out[a.cause] = (out[a.cause] || 0) + 1;
      total++;
    });
    return { total: total, by: out };
  }
  // 今週（月曜始まり）の実績
  function weekCounts() {
    var since = JK.time.weekStart().getTime();
    var c = { math: { exam: 0 }, physics: { exam: 0, sim: 0 }, english: { reading: 0, set: 0 }, drills: 0, vocab: 0, calc: 0, sec: 0 };
    attempts().forEach(function (a) {
      if (a.ts < since) return;
      if (a.kind === 'drill') { c.drills++; return; }
      if (a.subject === 'math') c.math.exam++;
      else if (a.subject === 'physics') { if (a.kind === 'sim') c.physics.sim++; else c.physics.exam++; }
      else if (a.subject === 'english') { if (a.unit === 'e-reading') c.english.reading++; else c.english.set++; }
    });
    store.s.vocabLog.forEach(function (v) { if (v.ts >= since) c.vocab++; });
    store.s.calcLog.forEach(function (v) { if (v.ts >= since) c.calc++; });
    var d = new Date(since);
    for (var i = 0; i < 7; i++) {
      c.sec += store.s.timer.days[JK.time.dayKey(d)] || 0;
      d.setDate(d.getDate() + 1);
    }
    return c;
  }

  /* ---------- ToDo ---------- */
  function todos() { return store.s.todos; }
  function openReview(unit) {
    return todos().filter(function (t) { return t.kind === 'review' && t.unit === unit && !t.done; })[0] || null;
  }
  JK.todo = {
    list: todos,
    openReview: openReview,
    openReviews: function () { return todos().filter(function (t) { return t.kind === 'review' && !t.done; }); },
    add: function (t) {
      t.id = t.id || uid('t');
      t.created = t.created || Date.now();
      t.done = t.done || null;
      todos().unshift(t);
      store.save();
      store.emit('todo');
      return t;
    },
    addManual: function (title) {
      return JK.todo.add({ kind: 'manual', title: title });
    },
    toggle: function (id) {
      todos().forEach(function (t) { if (t.id === id) t.done = t.done ? null : Date.now(); });
      store.save(); store.emit('todo');
    },
    remove: function (id) {
      store.s.todos = todos().filter(function (t) { return t.id !== id; });
      store.save(); store.emit('todo');
    },
    // 復習ドリルの結果を反映。合格（正答率 75% 以上）で完了にする
    finishReview: function (id, okCount, total) {
      var passed = total > 0 && okCount / total >= 0.75;
      todos().forEach(function (t) {
        if (t.id !== id) return;
        t.tries = (t.tries || 0) + 1;
        t.last = { ok: okCount, total: total, ts: Date.now() };
        if (passed) t.done = Date.now();
      });
      store.save(); store.emit('todo');
      return passed;
    }
  };

  /* ---------- 復習要否の判定 ----------
     誤答した問題 P（単元 U）について、前提単元 R ごとに「戻るべき度合い」をスコア化する。
       score = 原因の重み × 前提の定着度係数 + 0.4 ×（U での直近 14 日の誤答数 − 1）
     score ≥ 1.0 なら「要復習：R の基礎演習」を ToDo に自動生成する。
       原因の重み: 手が出なかった 1.5 / 知識があいまい 1.2 / 未選択 1.0 / 計算ミス 0.7 / 時間切れ 0.5 / 読み違い 0.3
       定着度係数: R の直近正答率が 80% 以上 → 0.35（定着済みなので原因ではなさそう）/ 60〜80% → 1.0 / 60% 未満 → 1.3 / 未学習 → 1.0 */
  function decide(problem, attempt) {
    var unit = JK.units[attempt.unit];
    if (!unit) return [];
    var prereqs = (problem && problem.prereq && problem.prereq.length) ? problem.prereq : unit.prereq;
    var w = attempt.gaveUp ? Math.max(1.5, causeWeight(attempt.cause)) : causeWeight(attempt.cause);
    var recentMiss = unitStats(unit.id, 14).miss;
    var wants = [];
    prereqs.forEach(function (r) {
      if (!JK.units[r]) return;
      var m = mastery(r);
      var f = m === null ? 1.0 : (m >= 0.8 ? 0.35 : (m >= 0.6 ? 1.0 : 1.3));
      var score = w * f + 0.4 * Math.max(0, recentMiss - 1);
      if (score >= 1.0) wants.push({ unit: r, score: score, why: 'prereq' });
    });
    // 計算ミスが続くときは計算の土台へ
    if (attempt.cause === 'calc') {
      var since = Date.now() - 7 * DAY;
      var calcMiss = attempts().filter(function (a) { return !a.ok && a.cause === 'calc' && a.ts >= since && a.subject === attempt.subject; }).length;
      var base = attempt.subject === 'math' ? 'm-junior' : (attempt.subject === 'physics' ? 'p-math0' : null);
      if (base && calcMiss >= 2 && !wants.some(function (x) { return x.unit === base; })) wants.push({ unit: base, score: 1, why: 'calc' });
    }
    // 前提に戻る必要がなさそうでも、同じ単元で誤答が重なったら同単元の基礎演習へ
    if (!wants.length && recentMiss >= 2 && attempt.cause !== 'read' && attempt.cause !== 'time') {
      wants.push({ unit: unit.id, score: 1, why: 'same' });
    }
    // 前提を持たない土台の単元は、その単元自身の基礎演習
    if (!wants.length && !prereqs.length && w >= 1.0) wants.push({ unit: unit.id, score: w, why: 'same' });
    return wants;
  }

  // 判定結果を ToDo に反映（この解答が生成したカードだけを増減させる）
  function reconcile(problem, attempt) {
    var wants = attempt.ok ? [] : decide(problem, attempt);
    var created = [], removed = 0;
    var mine = todos().filter(function (t) { return t.kind === 'review' && t.fromAttempt === attempt.id; });
    mine.forEach(function (t) {
      var still = wants.some(function (x) { return x.unit === t.unit; });
      if (!still && !t.done && !t.tries) { JK.todo.remove(t.id); removed++; }
    });
    var fromUnit = JK.units[attempt.unit];
    wants.forEach(function (x) {
      if (openReview(x.unit)) return;                       // すでに未完了のカードがある
      var u = JK.units[x.unit];
      var reason = x.why === 'calc'
        ? '計算ミスが続いているため、計算の土台を確認します'
        : (x.why === 'same'
          ? '「' + fromUnit.name + '」で誤答が重なったため、同じ範囲の基礎を確認します'
          : '「' + fromUnit.name + '」の誤答' + (problem ? '（' + problem.title + '）' : '') + 'から自動生成。前提となる範囲です');
      var t = {
        kind: 'review', unit: x.unit, title: '要復習：' + u.name + ' の基礎演習', reason: reason,
        fromUnit: attempt.unit, fromPid: attempt.pid, fromAttempt: attempt.id
      };
      // 長文読解の誤答 → その長文の重要語を単語クイズにする
      if (x.unit === 'e-vocab' && problem && problem.passage && JK.passages[problem.passage]) {
        t.words = (JK.passages[problem.passage].vocab || []).slice(0, 20);
      }
      created.push(JK.todo.add(t));
    });
    return { created: created, removed: removed };
  }

  JK.analysis = {
    CAUSES: CAUSES,
    unitStats: unitStats,
    mastery: mastery,
    subjectAcc: subjectAcc,
    weakUnits: weakUnits,
    causeStats: causeStats,
    weekCounts: weekCounts,
    decide: decide,
    lastByProblem: function () {
      var map = {};
      attempts().forEach(function (a) { map[a.pid] = a; });
      return map;
    },
    // 解答を記録し、復習カードの生成結果を返す
    log: function (problem, data) {
      var a = {
        id: uid('a'), pid: data.pid, subject: data.subject, unit: data.unit, level: data.level, kind: data.kind || 'exam',
        ok: !!data.ok, gaveUp: !!data.gaveUp, parts: data.parts || [], cause: data.gaveUp ? 'blank' : null,
        ts: Date.now(), sec: data.sec || 0
      };
      attempts().push(a);
      if (attempts().length > 3000) attempts().splice(0, attempts().length - 3000);
      var r = reconcile(problem, a);
      store.save();
      store.emit('attempt', a);
      return { attempt: a, created: r.created };
    },
    // 誤答の原因が選ばれたら再判定する
    setCause: function (problem, attemptId, cause) {
      var a = attempts().filter(function (x) { return x.id === attemptId; })[0];
      if (!a) return { created: [], removed: 0 };
      a.cause = cause;
      var r = reconcile(problem, a);
      store.save();
      store.emit('attempt', a);
      return r;
    }
  };

  JK.hooks.vocabAnswered = function (word, ok) {
    store.s.vocabLog.push({ w: String(word), ok: !!ok, ts: Date.now() });
    if (store.s.vocabLog.length > 4000) store.s.vocabLog.splice(0, store.s.vocabLog.length - 4000);
    store.save();
    store.emit('vocab');
  };
})();
