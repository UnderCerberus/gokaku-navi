/* GOKAKU NAVI — 起動・モード切替（過去問 / 計算機）・勉強タイマー・教科タブ・テーマ */
(function () {
  'use strict';
  var store = JK.store, T = JK.time;
  function $(id) { return document.getElementById(id); }

  /* ================= 勉強タイマー（カウントアップ） =================
     過去問モード = 勉強中とみなして自動で計測。計算機モードでは非表示にして一時停止。
     計測した秒数は日別（学習時間グラフ・週ノルマ）と教科別に記録する。 */
  var tm = { paused: false, session: 0, last: Date.now(), sinceSave: 0 };
  function running() { return store.s.mode === 'exam' && !tm.paused; }
  function drawTimer() {
    var on = store.s.mode === 'exam';
    $('timerBox').classList.toggle('hidden', !on);
    $('timerBox').classList.toggle('paused', tm.paused);
    $('tClock').textContent = T.hms(tm.session);
    $('tState').textContent = tm.paused ? '一時停止中' : '勉強中';
    $('tPause').textContent = tm.paused ? '再開' : '一時停止';
    $('tToday').textContent = '今日の合計 ' + T.hm(store.s.timer.days[T.dayKey()] || 0);
    $('miniTimer').classList.toggle('on', on);
    $('miniClock').textContent = T.hms(tm.session);
  }
  function tickTimer() {
    var now = Date.now();
    if (running()) {
      var dt = Math.min(5, (now - tm.last) / 1000);      // スリープ復帰などの飛びは数えない
      if (dt > 0) {
        var key = T.dayKey(), days = store.s.timer.days, bs = store.s.timer.bySubject;
        tm.session += dt;
        days[key] = (days[key] || 0) + dt;
        bs[store.s.subject] = (bs[store.s.subject] || 0) + dt;
        tm.sinceSave += dt;
        if (tm.sinceSave >= 15) { tm.sinceSave = 0; store.save(); store.emit('timer'); }
      }
    }
    tm.last = now;
    drawTimer();
  }

  /* ================= ステージ（モード × 教科） ================= */
  function renderStage() {
    var mode = store.s.mode, subj = store.s.subject;
    $('modeExam').classList.toggle('on', mode === 'exam');
    $('modeCalc').classList.toggle('on', mode === 'calc');
    $('modeExam').setAttribute('aria-pressed', mode === 'exam');
    $('modeCalc').setAttribute('aria-pressed', mode === 'calc');
    document.querySelectorAll('.tab').forEach(function (b) {
      var on = b.getAttribute('data-subject') === subj;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', on);
    });
    $('modeHint').textContent = mode === 'exam'
      ? '過去問モード: 解いて採点 → 間違えたら前の範囲の「要復習」が ToDo に入ります。'
      : '計算機モード: 数値を入れると途中式つきで計算します（タイマー停止中）。';
    JK.exam.unmount();
    JK.calcui.unmount();
    var el = $('stage');
    el.style.setProperty('--sc', 'var(--s-' + subj + ')');
    if (mode === 'exam') JK.exam.mount(el, subj);
    else JK.calcui.mount(el, subj);
    drawTimer();
  }

  var app = JK.app = {
    setMode: function (mode) {
      if (store.s.mode !== mode) {
        store.s.mode = mode;
        tm.last = Date.now();
        if (mode === 'exam') tm.paused = false;       // 過去問モードに入ったら自動で計測開始
        else { store.emit('timer'); }
        store.saveNow();
      }
      renderStage();
    },
    setSubject: function (subj) {
      store.s.subject = subj;
      store.save();
      renderStage();
    },
    // ToDo の「要復習」カード → その単元の基礎演習を出題
    startDrill: function (todoId) {
      var todo = JK.todo.list().filter(function (t) { return t.id === todoId; })[0];
      if (!todo || !JK.units[todo.unit]) return;
      store.s.subject = JK.units[todo.unit].subject;
      app.setMode('exam');
      renderStage();
      JK.exam.startDrill(todoId);
      $('work').scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    openSim: function (simId) {
      store.s.subject = 'physics';
      app.setMode('exam');
      renderStage();
      JK.exam.openSim(simId);
    },
    setTheme: function (t) {
      store.s.theme = t;
      document.documentElement.setAttribute('data-theme', t);
      $('themeBtn').textContent = t === 'dark' ? '☀ ライト' : '☾ ダーク';
      store.save();
    }
  };

  function boot() {
    app.setTheme(store.s.theme === 'light' ? 'light' : 'dark');
    store.s.mode = 'calc';                             // 起動直後はタイマーを回さない（過去問モードに切り替えると開始）
    JK.exam.loadCustom();
    JK.dash.init();

    $('modeExam').addEventListener('click', function () { app.setMode('exam'); });
    $('modeCalc').addEventListener('click', function () { app.setMode('calc'); });
    document.querySelectorAll('.tab').forEach(function (b) {
      b.addEventListener('click', function () { app.setSubject(b.getAttribute('data-subject')); });
    });
    $('themeBtn').addEventListener('click', function () { app.setTheme(store.s.theme === 'dark' ? 'light' : 'dark'); });
    $('tPause').addEventListener('click', function () {
      tm.paused = !tm.paused;
      tm.last = Date.now();
      store.save();
      store.emit('timer');
      drawTimer();
    });
    $('tReset').addEventListener('click', function () { tm.session = 0; drawTimer(); });
    store.on('profile', function () { JK.exam.refresh(); if (store.s.mode === 'calc') JK.calcui.refresh(); });
    store.on('timer', function () { JK.dash.refresh(); });
    document.addEventListener('visibilitychange', function () { tm.last = Date.now(); if (document.hidden) store.saveNow(); });

    renderStage();
    setInterval(tickTimer, 1000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
