/* GOKAKU NAVI — 志望校逆算ダッシュボード
   入試日の自動予測 / リアルタイムカウントダウン / 偏差値ギャップから今週のノルマを算出 / ToDo / 学習時間と弱点 */
(function () {
  'use strict';
  var store = JK.store, T = JK.time, esc = JK.util.esc;
  function $(id) { return document.getElementById(id); }

  /* ================= 入試日の予測 =================
     ・受験年度: 4〜12 月なら「翌年 1〜2 月」が今年度の入試。高2 は +1 年、高1 は +2 年。
     ・共通テスト: 1 月 13 日以降の最初の土曜（1 日目）。
     ・志望偏差値帯 → 本番とみなす試験:
         50 未満      共通テスト（1 月中旬）
         50〜60       中堅私大の一般入試（2 月上旬 = 2/7 目安）
         60〜65       難関私大の一般入試（2 月中旬 = 2/13 目安）
         65 以上      国公立大 2 次試験 前期日程（2/25）
     ・すでに過ぎていれば翌年度に繰り越す。 */
  function kyotsuDay(year) {
    var d = new Date(year, 0, 13, 9, 30, 0, 0);
    while (d.getDay() !== 6) d.setDate(d.getDate() + 1);
    return d;
  }
  function candidate(year, target) {
    var t = Number(target), band = JK.levelOf(t), date, label, basis;
    var kyotsu = kyotsuDay(year);
    if (band === 'basic') {
      date = kyotsu; label = '大学入学共通テスト（1日目）';
      basis = '志望偏差値 50 未満 → 共通テストを本番と想定（1月13日以降の最初の土曜）';
    } else if (band === 'mid') {
      date = new Date(year, 1, 7, 9, 30); label = '私立大 一般入試（2月上旬）';
      basis = '志望偏差値 50〜60 → 中堅私大の個別試験が集中する 2 月上旬を想定';
    } else if (t < 65) {
      date = new Date(year, 1, 13, 9, 30); label = '難関私大 一般入試（2月中旬）';
      basis = '志望偏差値 60〜65 → 難関私大の個別試験が集中する 2 月中旬を想定';
    } else {
      date = new Date(year, 1, 25, 9, 30); label = '国公立大 2次試験（前期日程）';
      basis = '志望偏差値 65 以上 → 国公立大 前期日程（2月25日）を想定';
    }
    return { date: date, label: label, basis: basis, kyotsu: kyotsu, year: year, band: band };
  }
  function predict(profile, now) {
    now = now || new Date();
    var grade = Number(profile.grade) || 3;
    var season = now.getMonth() >= 3 ? now.getFullYear() + 1 : now.getFullYear();
    var year = season + (3 - grade);
    if (profile.examDate) {
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(profile.examDate);
      if (m) {
        var d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 9, 30);
        if (d > now) {
          return { date: d, label: '入試本番（手動で指定した日付）', basis: '入試日を手動で指定中', kyotsu: kyotsuDay(d.getMonth() === 0 && d.getDate() < 13 ? d.getFullYear() - 1 : d.getFullYear()), year: d.getFullYear(), band: JK.levelOf(profile.target), manual: true };
        }
      }
    }
    var c = candidate(year, profile.target);
    if (c.date <= now) { c = candidate(year + 1, profile.target); c.rolled = true; }
    c.gradeNote = '高' + grade + ' → ' + c.year + ' 年 1〜2 月実施の入試';
    return c;
  }

  /* ================= 今週のノルマ =================
     必要学習時間 = 偏差値ギャップ ×「偏差値 +1 に必要な時間」（基礎 40h / 中堅 60h / 難関 90h、3 教科合計）
                   × 伸びにくさ補正（現在 60 以上 ×1.25、65 以上 ×1.5）
     週あたり = 必要学習時間 ÷ 残り週数（学年別の最低ライン: 高1 7h / 高2 10h / 高3 14h）
     教科配分 = 基本比（数学 40% / 英語 35% / 物理 25%）× 直近の正答率が低い教科ほど厚く */
  var HOURS_PER_POINT = { basic: 40, mid: 60, adv: 90 };
  var AVG_MIN = { basic: 6, mid: 12, adv: 20 };
  var BASE_WEEKLY = { 1: 7, 2: 10, 3: 14 };
  var BASE_SPLIT = { math: 0.4, english: 0.35, physics: 0.25 };
  var LOAD = [
    { name: '無理のないペース', cls: 'good' }, { name: '標準的な受験生ペース', cls: 'good' },
    { name: 'かなりハード', cls: 'warn' }, { name: '現実的な上限を超過', cls: 'bad' }
  ];

  function plan(profile, now, exam) {
    var cur = Number(profile.cur), target = Number(profile.target);
    var curEff = profile.convert ? cur - 10 : cur;
    var gap = Math.round((target - curEff) * 10) / 10;
    var days = Math.max(0, (exam.date - now) / 864e5), weeks = Math.max(1, days / 7);
    var band = JK.levelOf(target);
    var hard = curEff >= 65 ? 1.5 : (curEff >= 60 ? 1.25 : 1);
    var need = Math.max(0, gap) * HOURS_PER_POINT[band] * hard;
    var base = BASE_WEEKLY[profile.grade] || 10;
    var weekly = Math.max(base, need / weeks);
    var load = weekly <= 21 ? 0 : (weekly <= 35 ? 1 : (weekly <= 56 ? 2 : 3));
    var w = {}, sum = 0;
    ['math', 'english', 'physics'].forEach(function (s) {
      var acc = JK.analysis.subjectAcc(s);
      if (acc === null) acc = 0.6;
      w[s] = BASE_SPLIT[s] * (1 + 1.2 * (1 - acc));
      sum += w[s];
    });
    var H = {};
    ['math', 'english', 'physics'].forEach(function (s) { H[s] = weekly * w[s] / sum; });
    var wc = JK.analysis.weekCounts(), avg = AVG_MIN[band], lv = JK.levelInfo(band).name;
    function n(x) { return Math.max(1, Math.round(x)); }
    var subjects = [
      { id: 'math', hours: H.math, tasks: [
        { name: '【' + lv + '】数学の過去問', unit: '問', target: n(H.math * 60 * 0.65 / avg), done: wc.math.exam },
        { name: '途中式つき計算トレーニング（計算機モード）', unit: '回', target: n(H.math * 60 * 0.35 / 6), done: wc.calc }
      ] },
      { id: 'english', hours: H.english, tasks: [
        { name: '必須英単語（単語クイズ）', unit: '語', target: n(H.english * 60 * 0.3 * 2), done: wc.vocab },
        { name: '【' + lv + '】長文読解', unit: '題', target: n(H.english * 60 * 0.4 / 20), done: wc.english.reading },
        { name: '文法・語彙・整序の問題セット', unit: 'セット', target: n(H.english * 60 * 0.3 / 8), done: wc.english.set }
      ] },
      { id: 'physics', hours: H.physics, tasks: [
        { name: '【' + lv + '】物理の過去問', unit: '問', target: n(H.physics * 60 * 0.6 / avg), done: wc.physics.exam },
        { name: '公式ランダム演習（シミュレーター連動）', unit: '問', target: n(H.physics * 60 * 0.4 / 5), done: wc.physics.sim }
      ] }
    ];
    var total = 0, got = 0;
    subjects.forEach(function (s) { s.tasks.forEach(function (t) { total += 1; got += Math.min(1, t.done / t.target); }); });
    return {
      gap: gap, curEff: curEff, days: days, weeks: weeks, band: band, need: need, weekly: weekly, load: load,
      pace: Math.max(0, gap) / weeks, subjects: subjects, doneSec: wc.sec, drills: wc.drills,
      progress: total ? got / total : 0, reviews: JK.todo.openReviews().length
    };
  }

  /* ================= 描画 ================= */
  var lastExam = null;

  function renderProfile() {
    var p = store.s.profile;
    $('dProfile').innerHTML =
      '<div class="card-h">プロフィール設定<span class="sp">入力するとカウントダウン・ノルマ・過去問レベルが即時に切り替わります</span></div><div class="pf-grid">' +
      '<div class="field"><label for="fGrade">現在の学年</label><select id="fGrade" class="sel">' +
      [1, 2, 3].map(function (g) { return '<option value="' + g + '"' + (Number(p.grade) === g ? ' selected' : '') + '>高' + g + '</option>'; }).join('') +
      '</select></div>' +
      '<div class="field"><label for="fCur">現在の高校の偏差値</label><input id="fCur" class="inp" type="number" min="25" max="80" step="0.5" value="' + esc(p.cur) + '">' +
      '<label class="check"><input id="fConv" type="checkbox"' + (p.convert ? ' checked' : '') + '><span>高校偏差値として入力（大学受験の模試偏差値に換算: −10 目安）</span></label></div>' +
      '<div class="field"><label for="fTarget">志望大学の偏差値（目標ランク）</label><input id="fTarget" class="inp" type="number" min="30" max="80" step="0.5" value="' + esc(p.target) + '">' +
      '<span class="hint">50 未満: 共通テスト/基礎 ・ 50〜60: 中堅大 ・ 60 以上: 難関大</span></div>' +
      '<div class="field"><label for="fDate">入試日（任意・空欄なら自動予測）</label><input id="fDate" class="inp" type="date" value="' + esc(p.examDate || '') + '"></div></div>';
    function upd() {
      p.grade = Number($('fGrade').value) || 3;
      var c = parseFloat($('fCur').value), t = parseFloat($('fTarget').value);
      if (isFinite(c)) p.cur = Math.min(80, Math.max(25, c));
      if (isFinite(t)) p.target = Math.min(80, Math.max(30, t));
      p.convert = $('fConv').checked;
      p.examDate = $('fDate').value || '';
      store.save();
      refresh();
      store.emit('profile');
    }
    ['fGrade', 'fCur', 'fTarget', 'fConv', 'fDate'].forEach(function (id) {
      $(id).addEventListener('change', upd);
      if (id === 'fCur' || id === 'fTarget') $(id).addEventListener('input', upd);
    });
  }

  function renderCountdownShell() {
    $('dCount').innerHTML =
      '<div class="card-h">入試本番までのカウントダウン<span class="sp" id="cdLevel"></span></div>' +
      '<div class="cd-title" id="cdTitle"></div>' +
      '<div class="cd-main" aria-live="off">' +
      '<span><span class="cd-num" id="cdD">–</span><span class="cd-unit">日</span></span>' +
      '<span><span class="cd-num" id="cdH">–</span><span class="cd-unit">時間</span></span>' +
      '<span><span class="cd-num" id="cdM">–</span><span class="cd-unit">分</span></span>' +
      '<span class="cd-sec"><span id="cdS">–</span> 秒</span></div>' +
      '<div class="cd-date" id="cdDate"></div><div class="cd-basis" id="cdBasis"></div>';
  }

  function tick() {
    var now = new Date();
    if (!lastExam || lastExam.date <= now) { refresh(); return; }
    var ms = lastExam.date - now, s = Math.floor(ms / 1000);
    var d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60);
    $('cdD').textContent = d;
    $('cdH').textContent = T.pad(h);
    $('cdM').textContent = T.pad(m);
    $('cdS').textContent = T.pad(s % 60);
    var mini = $('miniCd');
    if (mini) mini.innerHTML = '本番まで <b>' + d + '</b> 日 <b>' + T.pad(h) + '</b>:<b>' + T.pad(m) + '</b>';
  }

  function refresh() {
    var p = store.s.profile, now = new Date();
    var exam = lastExam = predict(p, now);
    var pl = plan(p, now, exam);
    var lvInfo = JK.levelInfo(pl.band);

    // カウントダウン
    $('cdLevel').innerHTML = '<span class="badge b-' + pl.band + '">' + esc(lvInfo.name) + '</span>';
    $('cdTitle').textContent = exam.label + ' まで あと';
    var kd = Math.ceil((exam.kyotsu - now) / 864e5);
    $('cdDate').innerHTML = '<span>予測日 <b>' + esc(T.dateJa(exam.date)) + '</b></span>' +
      (exam.band !== 'basic' && kd > 0 ? '<span class="dim">共通テストまで ' + kd + ' 日（' + esc(T.dateJa(exam.kyotsu)) + '）</span>' : '');
    $('cdBasis').textContent = '予測の根拠: ' + (exam.gradeNote ? exam.gradeNote + ' ／ ' : '') + exam.basis +
      (exam.rolled ? ' ／ 今年度の日程は終了したため翌年度で計算' : '') + '。実際の日程は募集要項で確認し、上の「入試日」に入力すると置き換わります。';
    tick();

    // ギャップ
    var gapTxt = pl.gap > 0 ? '+' + pl.gap.toFixed(1) : (pl.gap === 0 ? '±0' : pl.gap.toFixed(1));
    var ld = LOAD[pl.load];
    $('dGap').innerHTML =
      '<div class="card-h">偏差値ギャップと必要ペース</div>' +
      '<div class="gap-row"><div class="gap-box"><b>' + pl.curEff.toFixed(1) + '</b><span>現在' + (p.convert ? '（換算後）' : '') + '</span></div>' +
      '<div class="gap-arrow">→</div><div class="gap-box"><b>' + Number(p.target).toFixed(1) + '</b><span>志望</span></div></div>' +
      '<div class="hero">' + esc(gapTxt) + '<small>' + (pl.gap > 0 ? '本番までに上げる偏差値' : '目標圏内（維持・上積み）') + '</small></div>' +
      '<div style="margin-top:8px">' +
      '<div class="kv"><span>残り</span><b>' + pl.weeks.toFixed(1) + ' 週（' + Math.floor(pl.days) + ' 日）</b></div>' +
      '<div class="kv"><span>必要ペース</span><b>週あたり +' + pl.pace.toFixed(2) + '</b></div>' +
      '<div class="kv"><span>必要な総学習時間（目安）</span><b>' + Math.round(pl.need) + ' 時間</b></div>' +
      '<div class="kv"><span>今週の目標学習時間</span><b>' + pl.weekly.toFixed(1) + ' 時間（1日 ' + (pl.weekly / 7).toFixed(1) + ' 時間）</b></div>' +
      '</div><div class="note ' + ld.cls + ' small" style="margin-top:8px">' + (ld.cls === 'good' ? '✔ ' : '⚠ ') + esc(ld.name) +
      (pl.load === 3 ? '。志望校の再検討か、学習開始時期・時間の見直しが必要です。' : (pl.load === 2 ? '。毎日の固定時間を先に確保しましょう。' : '。')) + '</div>';

    // ノルマ
    var pct = Math.round(pl.progress * 100);
    var h = '<div class="card-h">今週クリアすべき学習ノルマ<span class="sp">達成率 <b>' + pct + '%</b></span></div>' +
      '<div class="small" style="color:var(--fg-2)">' +
      (pl.gap > 0
        ? '本番までに偏差値を <b>あと ' + pl.gap.toFixed(1) + '</b> 上げるために、今週は <b>' + pl.weekly.toFixed(1) + ' 時間</b>・次の量をこなします。'
        : '目標偏差値に到達済みです。実力維持と上積みのため、今週は <b>' + pl.weekly.toFixed(1) + ' 時間</b>・次の量をこなします。') +
      '</div>' +
      '<div class="task" style="margin-top:8px"><span class="t-name">学習時間（過去問モードのタイマーで自動計測）</span><span class="mono">' +
      esc(T.hm(pl.doneSec)) + ' / ' + pl.weekly.toFixed(1) + ' 時間</span><div class="bar"><i style="width:' +
      Math.min(100, pl.doneSec / 3600 / pl.weekly * 100).toFixed(1) + '%"></i></div></div><div class="norma-sub">';
    pl.subjects.forEach(function (s) {
      var info = JK.subjectInfo(s.id);
      h += '<div class="norma-s" style="--sc:var(--s-' + s.id + ')"><h4>' + esc(info.name) + '<span>目安 ' + s.hours.toFixed(1) + ' 時間</span></h4>';
      s.tasks.forEach(function (t) {
        var done = t.done >= t.target;
        h += '<div class="task' + (done ? ' done' : '') + '"><span class="t-name">' + esc(t.name) + '</span><span class="mono">' +
          Math.min(t.done, 9999) + ' / ' + t.target + ' ' + esc(t.unit) + '</span><div class="bar"><i style="width:' +
          Math.min(100, t.done / t.target * 100).toFixed(1) + '%"></i></div></div>';
      });
      h += '</div>';
    });
    h += '</div>';
    if (pl.reviews) h += '<div class="note warn small" style="margin-top:10px">⚠ 要復習カードが <b>' + pl.reviews + ' 件</b> 残っています。新しい問題より先に ToDo の復習を片付けましょう。</div>';
    $('dNorma').innerHTML = h;

    renderStats();
  }

  function renderTodo() {
    var list = JK.todo.list();
    var open = list.filter(function (t) { return !t.done; }), done = list.filter(function (t) { return t.done; }).slice(0, 5);
    var h = '<div class="card-h">ToDo リスト<span class="sp">未完了 ' + open.length + ' 件</span></div><div class="todo-list">';
    if (!open.length && !done.length) h += '<div class="dim small">まだタスクはありません。過去問で間違えると、前提範囲の「要復習」カードがここに自動で追加されます。</div>';
    open.concat(done).forEach(function (t) {
      var review = t.kind === 'review';
      h += '<div class="todo' + (review ? ' review' : '') + (t.done ? ' done' : '') + '">' +
        (review ? '<span class="badge b-warn">要復習</span>' : '<input type="checkbox" data-toggle="' + esc(t.id) + '"' + (t.done ? ' checked' : '') + ' aria-label="完了">') +
        '<span class="t-title">' + esc(t.title) + (t.done ? ' <span class="badge b-ok">✔ 完了</span>' : '') + '</span>' +
        (review && !t.done ? '<button class="btn primary sm" data-drill="' + esc(t.id) + '">復習を始める</button>'
          : '<button class="btn ghost sm" data-del="' + esc(t.id) + '" aria-label="削除">✕</button>') +
        (t.reason ? '<span class="t-why">' + esc(t.reason) + (t.last ? ' ／ 前回 ' + t.last.ok + '/' + t.last.total + ' 問正解' : '') + '</span>' : '') +
        '</div>';
    });
    h += '</div><div class="todo-add"><input id="todoNew" class="inp" placeholder="自分のタスクを追加（例: 英単語帳 Section 5）" maxlength="80"><button class="btn sm" id="todoAdd">追加</button></div>';
    var el = $('dTodo');
    el.innerHTML = h;
    el.querySelectorAll('[data-drill]').forEach(function (b) {
      b.addEventListener('click', function () { JK.app.startDrill(b.getAttribute('data-drill')); });
    });
    el.querySelectorAll('[data-del]').forEach(function (b) {
      b.addEventListener('click', function () { JK.todo.remove(b.getAttribute('data-del')); });
    });
    el.querySelectorAll('[data-toggle]').forEach(function (b) {
      b.addEventListener('change', function () { JK.todo.toggle(b.getAttribute('data-toggle')); });
    });
    function add() {
      var v = $('todoNew').value.trim();
      if (v) JK.todo.addManual(v);
    }
    $('todoAdd').addEventListener('click', add);
    $('todoNew').addEventListener('keydown', function (e) { if (e.key === 'Enter') add(); });
  }

  function renderStats() {
    var days = store.s.timer.days, ws = T.weekStart(), todayKey = T.dayKey();
    var max = 3600, vals = [], d = new Date(ws), i;
    for (i = 0; i < 7; i++) {
      var k = T.dayKey(d), v = days[k] || 0;
      vals.push({ k: k, v: v, label: '月火水木金土日'.charAt(i) });
      if (v > max) max = v;
      d.setDate(d.getDate() + 1);
    }
    var total = vals.reduce(function (a, b) { return a + b.v; }, 0);
    var h = '<div class="card-h">学習時間と弱点分析</div>' +
      '<div class="row" style="gap:18px"><div><div class="dim small">今日</div><div class="hero" style="font-size:1.5rem">' + esc(T.hm(days[todayKey] || 0)) + '</div></div>' +
      '<div><div class="dim small">今週の合計</div><div class="hero" style="font-size:1.5rem">' + esc(T.hm(total)) + '</div></div></div>' +
      '<div class="week-chart" role="img" aria-label="今週の日別学習時間">';
    vals.forEach(function (x) {
      h += '<div class="wc' + (x.k === todayKey ? ' today' : '') + '" title="' + x.label + '曜: ' + esc(T.hm(x.v)) + '"><i style="height:' +
        (x.v / max * 100).toFixed(1) + '%"></i><span>' + x.label + '</span></div>';
    });
    h += '</div>';
    var weak = JK.analysis.weakUnits(4);
    h += '<div class="sec-h">正答率の低い単元</div>';
    if (!weak.length) h += '<div class="dim small">解答データがたまると、ここに弱点単元とミスの傾向が表示されます。</div>';
    else {
      h += '<div class="weak">';
      weak.forEach(function (m) {
        var u = JK.units[m.unit];
        h += '<div class="weak-row" style="--sc:var(--s-' + u.subject + ')" title="' + esc(u.name) + ': ' + m.ok + '/' + m.n + ' 問正解"><span>' + esc(u.short || u.name) +
          ' <span class="dim">' + esc(JK.subjectInfo(u.subject).name) + '</span></span><div class="bar"><i style="width:' + (m.acc * 100).toFixed(0) + '%"></i></div><b class="mono">' +
          (m.acc * 100).toFixed(0) + '%</b></div>';
      });
      h += '</div>';
    }
    var cs = JK.analysis.causeStats(30);
    if (cs.total) {
      h += '<div class="sec-h">ミスの原因（直近 30 日）</div><div class="row" style="gap:6px">';
      JK.analysis.CAUSES.forEach(function (c) {
        if (cs.by[c.id]) h += '<span class="badge">' + esc(c.name) + ' ' + cs.by[c.id] + '</span>';
      });
      h += '</div>';
    }
    $('dStats').innerHTML = h;
  }

  JK.dash = {
    predict: predict,
    plan: plan,
    exam: function () { return lastExam; },
    refresh: refresh,
    init: function () {
      renderProfile();
      renderCountdownShell();
      refresh();
      renderTodo();
      setInterval(tick, 1000);
      store.on('attempt', function () { refresh(); });
      store.on('vocab', function () { refresh(); });
      store.on('calc', function () { refresh(); });
      store.on('todo', function () { renderTodo(); refresh(); });
      store.on('timer', function () { renderStats(); });
    }
  };
})();
