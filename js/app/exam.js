/* GOKAKU NAVI — 過去問エンジン（3 教科共通）
   一覧 → 解答 → 自動採点 → 誤答の記録・原因選択 → 解説（学年別）→ 復習ドリル連動 */
(function () {
  'use strict';
  var store = JK.store, U = JK.util, esc = U.esc, rich = JK.rich;
  var NUM = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫';
  var root = null, subject = 'math';
  var state = { view: 'list', ctx: null };
  var clock = null;

  function level() {
    var p = store.s.profile;
    return p.levelOverride || JK.levelOf(p.target);
  }
  function srcLabel(s) {
    if (!s) return '';
    if (s.univ === 'オリジナル' || s.univ === 'ランダム演習' || s.univ === '単語クイズ') return s.univ;
    return [s.univ, s.faculty, s.year, s.no].filter(function (x) { return x != null && x !== ''; }).join(' ') + (s.kind ? '（' + s.kind + '）' : '');
  }
  function srcKey(p) {
    var s = p.source || {};
    if (p.custom) return '自分で追加';
    if (s.univ === 'オリジナル') return 'オリジナル';
    return s.univ + (s.year ? ' ' + s.year : '');
  }
  function filters() {
    var f = store.s.ui.filters;
    return f[subject] || (f[subject] = { area: '', src: '', st: '' });
  }
  function unitIndex(id) {
    for (var i = 0; i < JK.unitList.length; i++) if (JK.unitList[i].id === id) return i;
    return 999;
  }
  function stopClock() { if (clock) { clearInterval(clock); clock = null; } }

  /* ================= 一覧 ================= */
  function renderList() {
    stopClock();
    var lv = level(), info = JK.levelInfo(lv), f = filters();
    var all = JK.problems.filter(function (p) { return p.subject === subject && p.level === lv; });
    all.sort(function (a, b) { return (unitIndex(a.unit) - unitIndex(b.unit)) || (a.id < b.id ? -1 : 1); });
    var last = JK.analysis.lastByProblem();
    var areas = [], srcs = [];
    all.forEach(function (p) {
      var a = JK.units[p.unit].area, s = srcKey(p);
      if (areas.indexOf(a) < 0) areas.push(a);
      if (srcs.indexOf(s) < 0) srcs.push(s);
    });
    if (f.area && areas.indexOf(f.area) < 0) f.area = '';
    if (f.src && srcs.indexOf(f.src) < 0) f.src = '';
    var list = all.filter(function (p) {
      if (f.area && JK.units[p.unit].area !== f.area) return false;
      if (f.src && srcKey(p) !== f.src) return false;
      var la = last[p.id];
      if (f.st === 'new' && la) return false;
      if (f.st === 'ng' && !(la && !la.ok)) return false;
      if (f.st === 'ok' && !(la && la.ok)) return false;
      return true;
    });
    var ov = store.s.profile.levelOverride;
    var h = '<div class="filters"><span class="badge b-' + lv + '">' + esc(info.name) + '</span>' +
      '<span class="dim small">' + (ov ? '手動で固定中' : '志望偏差値 ' + esc(store.s.profile.target) + ' から自動判定') + '</span>' +
      '<select class="sel" id="exLv" style="width:auto" aria-label="レベル切替"><option value="">自動（志望偏差値に連動）</option>' +
      JK.cfg.levels.map(function (l) { return '<option value="' + l.id + '"' + (ov === l.id ? ' selected' : '') + '>' + esc(l.name) + ' に固定</option>'; }).join('') +
      '</select><span class="grow"></span><button class="btn sm" id="exAdd">＋ 過去問を自分で追加</button></div>';
    h += '<div class="filters"><span class="lbl">分野</span>' + chip('area', '', 'すべて', f.area) +
      areas.map(function (a) { return chip('area', a, a, f.area); }).join('') + '</div>';
    if (srcs.length > 1) {
      h += '<div class="filters"><span class="lbl">出典</span>' + chip('src', '', 'すべて', f.src) +
        srcs.map(function (s) { return chip('src', s, s, f.src); }).join('') + '</div>';
    }
    h += '<div class="filters"><span class="lbl">状態</span>' + chip('st', '', 'すべて', f.st) + chip('st', 'new', '未挑戦', f.st) +
      chip('st', 'ng', '前回 ×', f.st) + chip('st', 'ok', '正解済み', f.st) +
      '<span class="dim small" style="margin-left:auto">' + list.length + ' / ' + all.length + ' 問</span></div>';
    if (!all.length) h += '<div class="note">このレベルの問題データがまだ読み込まれていません。</div>';
    else if (!list.length) h += '<div class="note">条件に合う問題がありません。フィルターを変更してください。</div>';
    h += '<div class="plist">';
    list.forEach(function (p) {
      var la = last[p.id], u = JK.units[p.unit];
      h += '<button class="pcard' + (la ? (la.ok ? ' st-ok' : ' st-ng') : '') + '" data-pid="' + esc(p.id) + '">' +
        '<span class="p-title">' + esc(p.title) + '</span><span class="p-meta">' +
        '<span class="badge">' + esc(u.short || u.name) + '</span><span>' + esc(srcLabel(p.source)) + '</span>' +
        (p.time ? '<span>目安 ' + p.time + ' 分</span>' : '') + '<span>' + p.parts.length + ' 設問</span>' +
        (la ? (la.ok ? '<span class="badge b-ok">○ 正解</span>' : '<span class="badge b-ng">× 要復習</span>') : '') +
        '</span></button>';
    });
    h += '</div>';

    if (subject === 'physics' && JK.sims.length) {
      h += '<div class="sec-h">分野別ランダム演習（公式シミュレーター連動・数値は毎回変わります）</div><div class="plist">';
      JK.sims.forEach(function (s) {
        h += '<button class="pcard" data-sim="' + esc(s.id) + '"><span class="p-title">' + esc(s.title) + '</span><span class="p-meta"><span class="badge">' +
          esc(s.field) + '</span><span>自動生成 ・ 図つき ・ 自動採点</span></span></button>';
      });
      h += '</div>';
    }
    if (subject === 'english' && JK.en && typeof JK.en.makeVocabQuiz === 'function') {
      h += '<div class="sec-h">必須英単語クイズ（内蔵辞書から自動生成）</div><div class="plist">' +
        '<button class="pcard" data-vq="1"><span class="p-title">単語クイズ 5 問</span><span class="p-meta"><span class="badge">英単語</span><span>レベル連動 ・ 4 択</span></span></button></div>';
    }
    root.innerHTML = h;
    root.querySelectorAll('[data-f]').forEach(function (b) {
      b.addEventListener('click', function () { f[b.getAttribute('data-f')] = b.getAttribute('data-v'); store.save(); renderList(); });
    });
    root.querySelectorAll('[data-pid]').forEach(function (b) {
      b.addEventListener('click', function () {
        open(JK.problemById[b.getAttribute('data-pid')], { kind: 'exam', queue: list.map(function (p) { return p.id; }) });
      });
    });
    root.querySelectorAll('[data-sim]').forEach(function (b) {
      b.addEventListener('click', function () { openSim(b.getAttribute('data-sim')); });
    });
    var vq = root.querySelector('[data-vq]');
    if (vq) vq.addEventListener('click', function () { openVocab(null); });
    root.querySelector('#exLv').addEventListener('change', function (e) {
      store.s.profile.levelOverride = e.target.value;
      store.save();
      store.emit('profile');
    });
    root.querySelector('#exAdd').addEventListener('click', customForm);
  }
  function chip(key, val, label, cur) {
    return '<button class="chip' + (cur === val ? ' on' : '') + '" data-f="' + key + '" data-v="' + esc(val) + '">' + esc(label) + '</button>';
  }

  /* ================= 自動生成問題 ================= */
  function wrapGenerated(base, ex) {
    var p = {};
    Object.keys(ex).forEach(function (k) { p[k] = ex[k]; });
    Object.keys(base).forEach(function (k) { p[k] = base[k]; });
    p.title = ex.title || base.title;
    p.generated = true;
    return p;
  }
  function simExercise(sim, lv) {
    // 答えと解説の数値が丸めの境目でずれる出題（36.8 と 36.7 など）は、乱数を変えて作り直す
    var ex = null;
    for (var k = 0; k < 6; k++) {
      ex = sim.exercise(U.rng(), lv);
      if (!JK.check.roundGap(ex).length) break;
    }
    return wrapGenerated({ id: 'gen-' + sim.id, subject: 'physics', level: lv, unit: sim.unit, title: sim.title, source: { univ: 'ランダム演習' }, time: 5 }, ex);
  }
  function openSim(simId) {
    var sim = JK.simById[simId];
    if (!sim) return;
    var lv = level();
    open(simExercise(sim, lv), { kind: 'sim', again: function () { openSim(simId); } });
  }
  function openVocab(words) {
    var lvNum = { basic: 1, mid: 2, adv: 3 }[level()] || 2;
    var qs = JK.en.makeVocabQuiz({ words: words || null, level: lvNum, count: 5, seed: Date.now() & 0xffff });
    if (!qs || !qs.length) return;
    runQueue(qs.map(function (q, i) {
      return wrapGenerated({ id: 'gen-vocab-' + i, subject: 'english', level: level(), unit: 'e-vocab', title: '単語クイズ', source: { univ: '単語クイズ' }, time: 1 }, q);
    }), { kind: 'exam', label: '単語クイズ' });
  }
  // 複数問を続けて解く（単語クイズ・復習ドリル）
  function runQueue(problems, opts) {
    var session = { queue: problems, idx: 0, results: [], todoId: opts.todoId || null, unit: opts.unit || null, label: opts.label || '' };
    open(problems[0], { kind: opts.kind || 'exam', session: session });
  }

  /* ================= 復習ドリル ================= */
  function drillPool(unitId, todo) {
    var pool = [];
    if (unitId === 'e-vocab' && JK.en && typeof JK.en.makeVocabQuiz === 'function') {
      try {
        var qs = JK.en.makeVocabQuiz({ words: todo && todo.words && todo.words.length ? todo.words : null, level: 1, count: 4, seed: Date.now() & 0xffff }) || [];
        qs.forEach(function (q, i) {
          pool.push(wrapGenerated({ id: 'gen-vocab-' + i, subject: 'english', level: 'drill', unit: 'e-vocab', title: '必須英単語クイズ', source: { univ: '単語クイズ' }, time: 1 }, q));
        });
      } catch (e) { /* 辞書未搭載時は静的ドリルを使う */ }
      if (pool.length >= 3) return pool;
    }
    var last = JK.analysis.lastByProblem();
    var drills = JK.problems.filter(function (p) { return p.level === 'drill' && p.unit === unitId; });
    // 直近で正解していない問題を優先し、その中はランダム
    var r = U.rng();
    drills = r.shuffle(drills).sort(function (a, b) {
      var x = last[a.id] && last[a.id].ok ? 1 : 0, y = last[b.id] && last[b.id].ok ? 1 : 0;
      return x - y;
    });
    pool = pool.concat(drills.slice(0, 4));
    if (pool.length < 4) {
      JK.sims.filter(function (s) { return s.unit === unitId; }).forEach(function (s) {
        if (pool.length >= 4) return;
        try { var g = simExercise(s, 'basic'); g.level = 'drill'; pool.push(g); } catch (e) { /* 生成失敗は無視 */ }
      });
    }
    if (pool.length < 3) {
      JK.problems.filter(function (p) { return p.level === 'basic' && p.unit === unitId; }).forEach(function (p) {
        if (pool.length < 4) pool.push(p);
      });
    }
    return pool;
  }
  function startDrill(todoId) {
    var todo = JK.todo.list().filter(function (t) { return t.id === todoId; })[0];
    if (!todo) return;
    var unit = JK.units[todo.unit];
    subject = unit.subject;
    var pool = drillPool(todo.unit, todo);
    if (!pool.length) {
      state = { view: 'msg', ctx: { title: todo.title, text: 'この範囲の基礎演習データがまだ読み込まれていません。' } };
      render();
      return;
    }
    runQueue(pool, { kind: 'drill', todoId: todoId, unit: todo.unit, label: todo.title });
  }

  /* ================= 解答画面 ================= */
  function open(p, opts) {
    opts = opts || {};
    state = { view: 'solve', ctx: { p: p, kind: opts.kind || 'exam', session: opts.session || null, queue: opts.queue || null, again: opts.again || null, t0: Date.now(), graded: false, order: {}, depth: '' } };
    render();
    if (root && root.scrollIntoView && opts.scroll !== false) {
      var top = root.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.6) root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function partHtml(part, i, pid) {
    var h = '<div class="part" data-part="' + i + '"><div class="part-q">' + (part.label ? '<span class="part-l">' + esc(part.label) + '</span>' : '') +
      '<div>' + (part.q ? rich(part.q) : '') + '</div></div>';
    var name = 'pc' + i;
    if (part.type === 'num' || part.type === 'expr' || part.type === 'text') {
      var ph = part.type === 'num' ? '数値（例: 3/4, 2√3, 1.5）' : (part.type === 'expr' ? '式（例: 2x+1, x^2-3）' : '解答を入力');
      h += '<div class="ans-row"><input class="inp ans" data-i="' + i + '" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="' + ph + '" aria-label="解答 ' + (i + 1) + '">' +
        (part.unit ? '<span class="dim">' + esc(part.unit) + '</span>' : '') + '</div>';
      var hint = JK.check.hintFor(part);
      if (hint) h += '<div class="ans-hint">' + rich(hint) + '</div>';
    } else if (part.type === 'choice' || part.type === 'multi') {
      var figs = part.choices.some(function (c) { return c && typeof c === 'object' && c.fig; });
      h += '<div class="choices' + (figs ? ' figs' : '') + '">';
      part.choices.forEach(function (c, k) {
        var body = typeof c === 'string' ? rich(c) : ((c.fig ? '<div>' + c.fig + '</div>' : '') + (c.t ? rich(c.t) : ''));
        h += '<label class="choice" data-c="' + k + '"><input type="' + (part.type === 'choice' ? 'radio' : 'checkbox') + '" name="' + name + '" value="' + k + '">' +
          '<span class="c-no">' + NUM.charAt(k) + '</span><span>' + body + '</span></label>';
      });
      h += '</div>';
      if (part.type === 'multi') h += '<div class="ans-hint">当てはまるものをすべて選びます。</div>';
    } else if (part.type === 'order') {
      h += '<div class="order-line" data-line="' + i + '" aria-label="並べた語"></div><div class="order-pool" data-pool="' + i + '">';
      part.words.forEach(function (w, k) { h += '<button type="button" class="word" data-w="' + k + '">' + esc(w) + '</button>'; });
      h += '</div><div class="ans-hint">語をクリックして正しい順に並べます（並べた語をクリックすると戻せます）。</div>';
    }
    return h + '<div class="pv" data-pv="' + i + '"></div></div>';
  }

  function sessionBar(s) {
    var done = s.results.length;
    return '<div class="drill-bar"><span class="badge b-warn">' + (s.todoId ? '復習ドリル' : '連続演習') + '</span><b>' + esc(s.label) + '</b>' +
      '<div class="bar"><i style="width:' + (done / s.queue.length * 100).toFixed(0) + '%"></i></div><span class="mono">' + (s.idx + 1) + ' / ' + s.queue.length + '</span></div>';
  }

  function renderSolve() {
    stopClock();
    var ctx = state.ctx, p = ctx.p, unit = JK.units[p.unit];
    var passage = p.passage ? JK.passages[p.passage] : null;
    var lvInfo = JK.levelInfo(p.level);
    var h = '';
    if (ctx.session) h += sessionBar(ctx.session);
    h += '<div class="solve-head"><button class="btn ghost sm" id="svBack">← 一覧へ</button><h3>' + esc(p.title) + '</h3>' +
      '<span class="badge b-' + esc(p.level) + '">' + esc(lvInfo ? lvInfo.short : '') + '</span><span class="badge">' + esc(unit.name) + '</span>' +
      '<span class="dim small">' + esc(srcLabel(p.source)) + (p.time ? ' ・ 目安 ' + p.time + ' 分' : '') + '</span>' +
      '<span class="grow"></span><span class="mono dim" id="svClock">00:00</span></div>';
    h += '<div class="solve-grid' + (passage ? ' with-passage' : '') + '">';
    if (passage) h += '<div class="passage" id="svPassage"><h4>' + esc(passage.title) + '</h4>' + JK.passage.html(passage, {}) + '</div>';
    h += '<div><div class="pbody">' + rich(p.body) + '</div>' + (p.fig ? '<div class="pfig">' + p.fig + '</div>' : '') + '<div id="svParts">';
    p.parts.forEach(function (part, i) { h += partHtml(part, i, p.id); });
    h += '</div><div id="svMsg"></div><div class="actions" id="svActions"><button class="btn primary" id="svGrade">採点する</button>' +
      '<button class="btn" id="svGive">解けなかった（答えを見る）</button></div><div id="svAfter"></div></div></div>';
    root.innerHTML = h;

    root.querySelector('#svBack').addEventListener('click', function () { state = { view: 'list', ctx: null }; render(); });
    root.querySelector('#svGrade').addEventListener('click', function () { grade(false); });
    root.querySelector('#svGive').addEventListener('click', function () { grade(true); });
    root.querySelectorAll('input.ans').forEach(function (inp) {
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') grade(false); });
    });
    // 語句整序
    p.parts.forEach(function (part, i) {
      if (part.type !== 'order') return;
      ctx.order[i] = [];
      var line = root.querySelector('[data-line="' + i + '"]'), pool = root.querySelector('[data-pool="' + i + '"]');
      function redraw() {
        line.innerHTML = '';
        ctx.order[i].forEach(function (k, pos) {
          var b = document.createElement('button');
          b.type = 'button'; b.className = 'word'; b.textContent = part.words[k];
          b.addEventListener('click', function () { if (ctx.graded) return; ctx.order[i].splice(pos, 1); redraw(); });
          line.appendChild(b);
        });
        pool.querySelectorAll('.word').forEach(function (b) {
          b.classList.toggle('used', ctx.order[i].indexOf(Number(b.getAttribute('data-w'))) >= 0);
        });
      }
      pool.querySelectorAll('.word').forEach(function (b) {
        b.addEventListener('click', function () { if (ctx.graded) return; ctx.order[i].push(Number(b.getAttribute('data-w'))); redraw(); });
      });
    });
    var ck = root.querySelector('#svClock');
    clock = setInterval(function () {
      if (!document.body.contains(ck)) { stopClock(); return; }
      if (!ctx.graded) {
        var s = Math.floor((Date.now() - ctx.t0) / 1000);
        ck.textContent = JK.time.pad(Math.floor(s / 60)) + ':' + JK.time.pad(s % 60);
      }
    }, 1000);
  }

  function collect(p, ctx) {
    return p.parts.map(function (part, i) {
      if (part.type === 'num' || part.type === 'expr' || part.type === 'text') return root.querySelector('input.ans[data-i="' + i + '"]').value;
      if (part.type === 'choice') {
        var c = root.querySelector('input[name="pc' + i + '"]:checked');
        return c ? Number(c.value) : null;
      }
      if (part.type === 'multi') {
        return Array.prototype.map.call(root.querySelectorAll('input[name="pc' + i + '"]:checked'), function (x) { return Number(x.value); });
      }
      if (part.type === 'order') return (ctx.order[i] || []).map(function (k) { return part.words[k]; });
      return null;
    });
  }

  function depthFor(p, ctx) {
    if (ctx.depth) return ctx.depth;
    if (store.s.ui.depth) return store.s.ui.depth;
    if (p.level === 'drill') return 'easy';
    return JK.steps.depthFor(JK.units[p.unit].grade, Number(store.s.profile.grade));
  }

  function grade(giveUp) {
    var ctx = state.ctx, p = ctx.p;
    if (ctx.graded) return;
    var inputs = collect(p, ctx);
    var results = p.parts.map(function (part, i) { return giveUp ? { ok: false, blank: true } : JK.check.part(part, inputs[i]); });
    var msg = root.querySelector('#svMsg');
    msg.innerHTML = '';
    if (!giveUp) {
      if (results.every(function (r) { return r.blank; })) {
        msg.innerHTML = '<div class="note warn">解答が未入力です。分からないときは「解けなかった（答えを見る）」を押してください。</div>';
        return;
      }
      for (var k = 0; k < results.length; k++) {
        if (results[k].invalid) {
          msg.innerHTML = '<div class="note warn">' + esc(p.parts[k].label || '設問 ' + (k + 1)) + ' の入力を式として読み取れません。書き方（例: 3/4, 2√3, x^2+1）を確認してください。</div>';
          return;
        }
      }
    }
    ctx.graded = true;
    var okAll = results.every(function (r) { return r.ok; });
    var sec = Math.round((Date.now() - ctx.t0) / 1000);
    var logged = JK.analysis.log(p, {
      pid: p.id, subject: p.subject, unit: p.unit, level: p.level, kind: ctx.kind, ok: okAll, gaveUp: giveUp,
      parts: results.map(function (r) { return r.ok; }), sec: sec
    });
    ctx.attempt = logged.attempt;
    if (ctx.session) ctx.session.results.push(okAll);
    if (p.unit === 'e-vocab') {
      results.forEach(function (r, i) { JK.hooks.vocabAnswered(p.word || (p.id + '#' + i), r.ok); });
    }

    // 入力を固定し、設問ごとの判定を表示
    root.querySelectorAll('#svParts input, #svParts button').forEach(function (x) { x.disabled = true; });
    p.parts.forEach(function (part, i) {
      var r = results[i], pv = root.querySelector('[data-pv="' + i + '"]');
      if (part.type === 'choice' || part.type === 'multi') {
        var ans = part.type === 'choice' ? [part.answer] : part.answer;
        root.querySelectorAll('[data-part="' + i + '"] .choice').forEach(function (lab) {
          var c = Number(lab.getAttribute('data-c')), checked = lab.querySelector('input').checked;
          if (ans.indexOf(c) >= 0) lab.classList.add('is-ans');
          else if (checked) lab.classList.add('is-wrong');
        });
      }
      pv.innerHTML = '<div class="verdict ' + (r.ok ? 'ok' : 'ng') + '"><span class="mark">' + (r.ok ? '○' : '×') + '</span><div>' +
        (r.ok ? '<b>正解</b>' : '<b>' + (r.blank ? '未解答' : '不正解') + '</b> ／ 正解: ' + rich(JK.check.answerText(part))) +
        (part.explain ? '<div class="small" style="margin-top:3px;color:var(--fg-2)">' + rich(part.explain) + '</div>' : '') + '</div></div>';
    });
    var passEl = root.querySelector('#svPassage');
    if (passEl && p.passage && JK.passages[p.passage]) {
      var ps = JK.passages[p.passage];
      passEl.innerHTML = '<h4>' + esc(ps.title) + ' <button class="btn sm ghost" id="svJa">全訳を表示</button></h4>' + JK.passage.html(ps, { reveal: true });
      root.querySelector('#svJa').addEventListener('click', function () {
        passEl.innerHTML = '<h4>' + esc(ps.title) + '（全訳つき）</h4>' + JK.passage.html(ps, { reveal: true, ja: true });
      });
    }
    renderAfter(okAll, results, sec, logged.created);
  }

  function reviewNote(created) {
    if (!created || !created.length) return '';
    var h = '<div class="note warn" style="margin-top:10px"><b>前の範囲に戻って復習しましょう。</b> 次の「要復習」カードを ToDo に追加しました。<ul style="margin:6px 0 0;padding-left:1.2em">';
    created.forEach(function (t) {
      h += '<li>' + esc(t.title) + (state.ctx.session ? '' : ' <button class="btn primary sm" data-go="' + esc(t.id) + '">今すぐ復習する</button>') +
        '<div class="small dim">' + esc(t.reason) + '</div></li>';
    });
    return h + '</ul></div>';
  }

  function renderAfter(okAll, results, sec, created) {
    var ctx = state.ctx, p = ctx.p, s = ctx.session;
    var okN = results.filter(function (r) { return r.ok; }).length;
    var act = root.querySelector('#svActions'), after = root.querySelector('#svAfter');
    var h = '<div class="result-banner"><h4>' + (okAll ? '○ 全問正解' : '× ' + results.length + ' 設問中 ' + okN + ' 設問正解') + '</h4>' +
      '<div class="small dim">解答時間 ' + Math.floor(sec / 60) + ' 分 ' + (sec % 60) + ' 秒 ／ この結果は記録され、ダッシュボードの弱点分析とノルマに反映されます。</div>';
    if (!okAll) {
      h += '<div class="small" style="margin-top:8px">ミスの原因を選ぶと、復習の判定がより正確になります。</div><div class="causes">';
      JK.analysis.CAUSES.forEach(function (c) {
        h += '<button class="chip' + (ctx.attempt.cause === c.id ? ' on' : '') + '" data-cause="' + c.id + '">' + esc(c.name) + '</button>';
      });
      h += '</div>';
    }
    h += '<div id="svReview">' + reviewNote(created) + '</div></div>';
    var depth = depthFor(p, ctx);
    h += '<div class="sol"><div class="sol-head"><h4>解説</h4><div class="seg" id="svDepth">' +
      JK.steps.DEPTHS.map(function (d) { return '<button data-d="' + d + '"' + (d === depth ? ' class="on"' : '') + '>' + JK.steps.DEPTH_LABEL[d] + '</button>'; }).join('') +
      '</div><span class="dim small">学年（高' + esc(store.s.profile.grade) + '）と単元の履修時期から自動選択</span></div><div id="svSteps">' +
      JK.steps.render(p.solution, depth, p.parts) + '</div></div>';
    after.innerHTML = h;

    var a = '';
    if (s) {
      a += s.idx + 1 < s.queue.length ? '<button class="btn primary" id="svNext">次の問題へ（' + (s.idx + 2) + ' / ' + s.queue.length + '）</button>'
        : '<button class="btn primary" id="svNext">結果を見る</button>';
    } else {
      if (ctx.again) a += '<button class="btn primary" id="svAgain">別の数値でもう 1 問</button>';
      else {
        var q = ctx.queue || [], pos = q.indexOf(p.id);
        if (pos >= 0 && pos + 1 < q.length) a += '<button class="btn primary" id="svNext">次の問題へ</button>';
        a += '<button class="btn" id="svRetry">もう一度解く</button>';
      }
      a += '<button class="btn ghost" id="svList">一覧へ戻る</button>';
    }
    act.innerHTML = a;

    after.querySelectorAll('[data-cause]').forEach(function (b) {
      b.addEventListener('click', function () {
        var r = JK.analysis.setCause(p, ctx.attempt.id, b.getAttribute('data-cause'));
        after.querySelectorAll('[data-cause]').forEach(function (x) { x.classList.toggle('on', x === b); });
        var mine = JK.todo.list().filter(function (t) { return t.fromAttempt === ctx.attempt.id && !t.done; });
        after.querySelector('#svReview').innerHTML = reviewNote(mine) +
          (r.removed && !mine.length ? '<div class="note small" style="margin-top:10px">知識の抜けではなさそうなので、復習カードは追加しません。同じミスを防ぐ手順（見直し・時間配分）を決めておきましょう。</div>' : '');
        bindGo();
      });
    });
    function bindGo() {
      after.querySelectorAll('[data-go]').forEach(function (b) {
        b.addEventListener('click', function () { JK.app.startDrill(b.getAttribute('data-go')); });
      });
    }
    bindGo();
    after.querySelectorAll('#svDepth button').forEach(function (b) {
      b.addEventListener('click', function () {
        ctx.depth = b.getAttribute('data-d');
        after.querySelectorAll('#svDepth button').forEach(function (x) { x.classList.toggle('on', x === b); });
        after.querySelector('#svSteps').innerHTML = JK.steps.render(p.solution, ctx.depth, p.parts);
      });
    });
    var nx = act.querySelector('#svNext');
    if (nx) nx.addEventListener('click', function () {
      if (s) {
        if (s.idx + 1 < s.queue.length) { s.idx++; open(s.queue[s.idx], { kind: ctx.kind, session: s }); }
        else finishSession(s, ctx.kind);
      } else {
        var q2 = ctx.queue, pos2 = q2.indexOf(p.id);
        open(JK.problemById[q2[pos2 + 1]], { kind: 'exam', queue: q2 });
      }
    });
    var ag = act.querySelector('#svAgain');
    if (ag) ag.addEventListener('click', ctx.again);
    var rt = act.querySelector('#svRetry');
    if (rt) rt.addEventListener('click', function () { open(p, { kind: ctx.kind, queue: ctx.queue }); });
    var ls = act.querySelector('#svList');
    if (ls) ls.addEventListener('click', function () { state = { view: 'list', ctx: null }; render(); });
  }

  function finishSession(s, kind) {
    var okN = s.results.filter(Boolean).length, total = s.results.length;
    var passed = null, todo = null;
    if (s.todoId) {
      passed = JK.todo.finishReview(s.todoId, okN, total);
      todo = JK.todo.list().filter(function (t) { return t.id === s.todoId; })[0] || null;
    }
    state = { view: 'summary', ctx: { s: s, okN: okN, total: total, passed: passed, todo: todo, kind: kind } };
    render();
  }

  function renderSummary() {
    stopClock();
    var c = state.ctx, h = '<div class="result-banner"><h4>' + esc(c.s.label || '連続演習') + ' の結果: ' + c.total + ' 問中 ' + c.okN + ' 問正解</h4>';
    if (c.passed === true) h += '<div class="note good" style="margin-top:8px">✔ 合格（正答率 75% 以上）。この「要復習」カードは完了になりました。前提が固まったので、元の問題にもう一度挑戦しましょう。</div>';
    else if (c.passed === false) h += '<div class="note warn" style="margin-top:8px">⚠ もう少しです（合格ラインは正答率 75%）。解説を「やさしく」で読み直してから、もう一度挑戦しましょう。カードは ToDo に残ります。</div>';
    h += '<div class="actions">';
    if (c.passed === true && c.todo && c.todo.fromPid && JK.problemById[c.todo.fromPid]) h += '<button class="btn primary" id="smOrig">元の問題に再挑戦する</button>';
    if (c.passed === false) h += '<button class="btn primary" id="smRetry">もう一度復習する</button>';
    h += '<button class="btn" id="smList">問題一覧へ</button><button class="btn ghost" id="smDash">ダッシュボードへ</button></div></div>';
    root.innerHTML = h;
    var o = root.querySelector('#smOrig');
    if (o) o.addEventListener('click', function () {
      var p = JK.problemById[c.todo.fromPid];
      subject = p.subject;
      JK.app.setSubject(p.subject, true);
      open(p, { kind: 'exam' });
    });
    var r = root.querySelector('#smRetry');
    if (r) r.addEventListener('click', function () { startDrill(c.s.todoId); });
    root.querySelector('#smList').addEventListener('click', function () { state = { view: 'list', ctx: null }; render(); });
    root.querySelector('#smDash').addEventListener('click', function () { state = { view: 'list', ctx: null }; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* ================= 過去問を自分で追加 ================= */
  function customForm() {
    var units = JK.unitList.filter(function (u) { return u.subject === subject; });
    var bg = document.createElement('div');
    bg.className = 'modal-bg';
    bg.innerHTML = '<div class="card modal" role="dialog" aria-label="過去問を追加"><div class="card-h">過去問を自分で追加（この端末に保存されます）</div>' +
      '<div class="form-grid">' +
      '<div class="field"><label>レベル</label><select class="sel" id="cfLv">' + JK.cfg.levels.map(function (l) { return '<option value="' + l.id + '"' + (l.id === level() ? ' selected' : '') + '>' + esc(l.name) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label>単元</label><select class="sel" id="cfUnit">' + units.map(function (u) { return '<option value="' + u.id + '">' + esc(u.name) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label>大学名</label><input class="inp" id="cfUniv" placeholder="例: 成蹊大学"></div>' +
      '<div class="field"><label>年度・大問</label><input class="inp" id="cfNo" placeholder="例: 2024 第2問(1)"></div></div>' +
      '<div class="field"><label>タイトル</label><input class="inp" id="cfTitle" maxlength="40" placeholder="例: 対数関数の極値"></div>' +
      '<div class="field"><label>問題文（数式は $x^{2}$ のように $ で囲む）</label><textarea class="inp" id="cfBody"></textarea></div>' +
      '<div class="form-grid"><div class="field"><label>解答の形式</label><select class="sel" id="cfType"><option value="num">数値</option><option value="expr">式（x の式など）</option><option value="choice">選択肢</option><option value="text">語句</option></select></div>' +
      '<div class="field"><label id="cfAnsL">正解</label><input class="inp" id="cfAns" placeholder="例: 3/4"></div></div>' +
      '<div class="field hidden" id="cfChoicesF"><label>選択肢（1 行に 1 つ。正解の欄には番号を入力）</label><textarea class="inp" id="cfChoices" style="min-height:80px"></textarea></div>' +
      '<div class="field"><label>解説（任意。1 行が 1 ステップ）</label><textarea class="inp" id="cfSol" style="min-height:80px"></textarea></div>' +
      '<div id="cfMsg"></div><div class="actions"><button class="btn primary" id="cfSave">保存する</button><button class="btn ghost" id="cfCancel">キャンセル</button></div></div>';
    document.body.appendChild(bg);
    function q(id) { return bg.querySelector('#' + id); }
    function close() { document.body.removeChild(bg); }
    q('cfType').addEventListener('change', function () { q('cfChoicesF').classList.toggle('hidden', q('cfType').value !== 'choice'); });
    q('cfCancel').addEventListener('click', close);
    bg.addEventListener('click', function (e) { if (e.target === bg) close(); });
    q('cfSave').addEventListener('click', function () {
      var type = q('cfType').value, ans = q('cfAns').value.trim(), body = q('cfBody').value.trim(), title = q('cfTitle').value.trim();
      var part = { type: type, label: '', q: '' }, errMsg = '';
      if (!title || !body) errMsg = 'タイトルと問題文を入力してください。';
      else if (JK.richCheck(body).length) errMsg = '問題文の数式に誤りがあります: ' + JK.richCheck(body)[0];
      else if (type === 'num') { part.answer = U.parseNum(ans); if (!isFinite(part.answer)) errMsg = '正解を数値として読み取れません。'; }
      else if (type === 'expr') {
        part.answer = ans;
        var vars = (ans.match(/[a-df-zA-Z]/g) || []).filter(function (v, i2, arr) { return arr.indexOf(v) === i2; });
        part.vars = vars.length ? vars.slice(0, 3) : ['x'];
        if (!JK.expr.equal(ans, ans, part.vars)) errMsg = '正解の式を読み取れません（例: 2x+1）。';
      } else if (type === 'choice') {
        part.choices = q('cfChoices').value.split(/\r?\n/).map(function (x) { return x.trim(); }).filter(Boolean);
        part.answer = parseInt(ans, 10) - 1;
        if (part.choices.length < 2 || !(part.answer >= 0 && part.answer < part.choices.length)) errMsg = '選択肢を 2 つ以上入力し、正解の番号（1〜）を入れてください。';
      } else { part.answer = ans; if (!ans) errMsg = '正解を入力してください。'; }
      if (errMsg) { q('cfMsg').innerHTML = '<div class="note warn">' + esc(errMsg) + '</div>'; return; }
      var sol = q('cfSol').value.split(/\r?\n/).map(function (x) { return x.trim(); }).filter(Boolean).map(function (x) { return { n: x }; });
      if (!sol.length) sol = [{ n: '正解: ' + ans }];
      var p = {
        id: 'custom-' + Date.now().toString(36), subject: subject, level: q('cfLv').value, unit: q('cfUnit').value, title: title,
        source: { univ: q('cfUniv').value.trim() || '自分で追加', no: q('cfNo').value.trim(), kind: '過去問' },
        time: 10, body: body, parts: [part], solution: sol, custom: true
      };
      store.s.custom.push(p);
      store.saveNow();
      JK.registerProblems([p]);
      close();
      state = { view: 'list', ctx: null };
      render();
    });
  }

  /* ================= 入口 ================= */
  function render() {
    if (!root) return;
    if (state.view === 'solve') renderSolve();
    else if (state.view === 'summary') renderSummary();
    else if (state.view === 'msg') {
      root.innerHTML = '<div class="note warn"><b>' + esc(state.ctx.title) + '</b><br>' + esc(state.ctx.text) + '</div><div class="actions"><button class="btn" id="mgBack">問題一覧へ</button></div>';
      root.querySelector('#mgBack').addEventListener('click', function () { state = { view: 'list', ctx: null }; render(); });
    } else renderList();
  }

  JK.exam = {
    level: level,
    mount: function (el, subj) {
      if (subject !== subj && !(state.view === 'solve' && state.ctx && state.ctx.p.subject === subj)) state = { view: 'list', ctx: null };
      root = el;
      subject = subj;
      render();
    },
    unmount: function () { stopClock(); root = null; },
    refresh: function () { if (root && state.view === 'list') render(); },
    busy: function () { return state.view === 'solve' && state.ctx && !state.ctx.graded; },
    startDrill: startDrill,
    openSim: openSim,
    subject: function () { return subject; },
    loadCustom: function () {
      try { JK.registerProblems(store.s.custom.filter(function (p) { return p && p.id && !JK.problemById[p.id]; })); } catch (e) { /* 破損データは無視 */ }
    }
  };
})();
