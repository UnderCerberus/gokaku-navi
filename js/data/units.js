/* GOKAKU NAVI — 単元グラフ
   prereq が「1 つ前の前提範囲」。誤答時にここを辿って「要復習」タスクが自動生成される。
   grade: 履修学年の目安（0=中学, 1=高1, 2=高2, 3=高3）。解説の噛み砕き度合いの判定に使う。 */
(function () {
  'use strict';

  JK.registerUnits('math', [
    { id: 'm-junior', name: '中学数学（計算・一次方程式・比）', short: '中学計算', area: '基礎(中学)', grade: 0, prereq: [] },
    { id: 'm-geo0', name: '中学図形（三平方の定理・相似）', short: '中学図形', area: '基礎(中学)', grade: 0, prereq: [] },
    { id: 'm-expr', name: '数と式（展開・因数分解）', short: '数と式', area: '数I・A', grade: 1, prereq: ['m-junior'] },
    { id: 'm-quad', name: '2次関数', short: '2次関数', area: '数I・A', grade: 1, prereq: ['m-expr'] },
    { id: 'm-trig1', name: '図形と計量（三角比）', short: '三角比', area: '数I・A', grade: 1, prereq: ['m-geo0'] },
    { id: 'm-data', name: 'データの分析', short: 'データ', area: '数I・A', grade: 1, prereq: ['m-junior'] },
    { id: 'm-prob', name: '場合の数・確率', short: '確率', area: '数I・A', grade: 1, prereq: ['m-junior'] },
    { id: 'm-int', name: '整数の性質', short: '整数', area: '数I・A', grade: 1, prereq: ['m-expr'] },
    { id: 'm-geo', name: '図形の性質', short: '図形の性質', area: '数I・A', grade: 1, prereq: ['m-geo0'] },
    { id: 'm-proof', name: '式と証明', short: '式と証明', area: '数II・B', grade: 2, prereq: ['m-expr'] },
    { id: 'm-complex', name: '複素数と方程式', short: '複素数', area: '数II・B', grade: 2, prereq: ['m-quad', 'm-expr'] },
    { id: 'm-coord', name: '図形と方程式', short: '図形と方程式', area: '数II・B', grade: 2, prereq: ['m-quad', 'm-geo0'] },
    { id: 'm-trig2', name: '三角関数', short: '三角関数', area: '数II・B', grade: 2, prereq: ['m-trig1'] },
    { id: 'm-explog', name: '指数・対数関数', short: '指数対数', area: '数II・B', grade: 2, prereq: ['m-expr'] },
    { id: 'm-calc2', name: '微分・積分（数II）', short: '微積(数II)', area: '数II・B', grade: 2, prereq: ['m-quad', 'm-expr'] },
    { id: 'm-seq', name: '数列', short: '数列', area: '数II・B', grade: 2, prereq: ['m-expr'] },
    { id: 'm-vec', name: 'ベクトル', short: 'ベクトル', area: '数II・B', grade: 2, prereq: ['m-trig1', 'm-coord'] },
    { id: 'm-limit', name: '極限', short: '極限', area: '数III・C', grade: 3, prereq: ['m-seq', 'm-explog'] },
    { id: 'm-diff3', name: '微分法（数III）', short: '微分(数III)', area: '数III・C', grade: 3, prereq: ['m-calc2', 'm-trig2', 'm-explog'] },
    { id: 'm-integ3', name: '積分法（数III）', short: '積分(数III)', area: '数III・C', grade: 3, prereq: ['m-diff3', 'm-calc2'] },
    { id: 'm-cplane', name: '複素数平面', short: '複素数平面', area: '数III・C', grade: 3, prereq: ['m-complex', 'm-trig2'] },
    { id: 'm-conic', name: '2次曲線', short: '2次曲線', area: '数III・C', grade: 3, prereq: ['m-coord', 'm-quad'] }
  ]);

  JK.registerUnits('physics', [
    { id: 'p-math0', name: '比の計算・単位と指数', short: '比・単位', area: '基礎', grade: 0, prereq: [] },
    { id: 'p-ohm0', name: 'オームの法則の基本（中学）', short: 'オームの法則', area: '基礎', grade: 0, prereq: ['p-math0'] },
    { id: 'p-force0', name: '力のつり合い・力の分解', short: '力のつり合い', area: '基礎', grade: 1, prereq: ['p-math0'] },
    { id: 'p-kin', name: '等加速度運動', short: '等加速度運動', area: '力学', grade: 2, prereq: ['p-math0'] },
    { id: 'p-fall', name: '落体の運動', short: '落体', area: '力学', grade: 2, prereq: ['p-kin'] },
    { id: 'p-rigid', name: '剛体（力のモーメント）', short: '剛体', area: '力学', grade: 3, prereq: ['p-force0'] },
    { id: 'p-eom', name: '運動方程式', short: '運動方程式', area: '力学', grade: 2, prereq: ['p-force0', 'p-kin'] },
    { id: 'p-momentum', name: '運動量と力積', short: '運動量', area: '力学', grade: 3, prereq: ['p-eom'] },
    { id: 'p-energy', name: '仕事と力学的エネルギー', short: 'エネルギー', area: '力学', grade: 2, prereq: ['p-eom'] },
    { id: 'p-circular', name: '円運動', short: '円運動', area: '力学', grade: 3, prereq: ['p-eom'] },
    { id: 'p-shm', name: '単振動', short: '単振動', area: '力学', grade: 3, prereq: ['p-circular'] },
    { id: 'p-heat', name: '熱量と比熱', short: '熱量', area: '熱力学', grade: 2, prereq: ['p-math0'] },
    { id: 'p-gas', name: 'ボイル・シャルルの法則', short: '気体の法則', area: '熱力学', grade: 3, prereq: ['p-math0'] },
    { id: 'p-thermo1', name: '熱力学第一法則', short: '熱力学第一法則', area: '熱力学', grade: 3, prereq: ['p-gas', 'p-energy'] },
    { id: 'p-wave', name: '波の性質', short: '波の性質', area: '波動', grade: 2, prereq: ['p-math0'] },
    { id: 'p-doppler', name: 'ドップラー効果', short: 'ドップラー', area: '波動', grade: 3, prereq: ['p-wave'] },
    { id: 'p-interf', name: '光の干渉', short: '光の干渉', area: '波動', grade: 3, prereq: ['p-wave'] },
    { id: 'p-estat', name: '静電気（電場と電位）', short: '静電気', area: '電磁気', grade: 3, prereq: ['p-force0', 'p-energy'] },
    { id: 'p-circuit', name: 'オームの法則と合成抵抗', short: '直流回路', area: '電磁気', grade: 2, prereq: ['p-ohm0'] },
    { id: 'p-mag', name: '電流と磁場', short: '電流と磁場', area: '電磁気', grade: 3, prereq: ['p-circuit'] },
    { id: 'p-induction', name: '電磁誘導', short: '電磁誘導', area: '電磁気', grade: 3, prereq: ['p-mag'] },
    { id: 'p-ac', name: '交流', short: '交流', area: '電磁気', grade: 3, prereq: ['p-circuit', 'p-induction'] },
    { id: 'p-photon', name: '光の粒子性', short: '光の粒子性', area: '原子', grade: 3, prereq: ['p-wave', 'p-energy'] },
    { id: 'p-atom', name: '原子構造', short: '原子構造', area: '原子', grade: 3, prereq: ['p-photon', 'p-circular'] }
  ]);

  JK.registerUnits('english', [
    { id: 'e-vocab', name: '必須英単語', short: '英単語', area: '語彙・熟語', grade: 1, prereq: [] },
    { id: 'e-idiom', name: '熟語・イディオム', short: '熟語', area: '語彙・熟語', grade: 1, prereq: ['e-vocab'] },
    { id: 'e-grammar0', name: '中学英文法（文型・時制の基本）', short: '中学文法', area: '文法・語法', grade: 0, prereq: [] },
    { id: 'e-grammar', name: '文法・語法', short: '文法', area: '文法・語法', grade: 1, prereq: ['e-grammar0', 'e-vocab'] },
    { id: 'e-struct', name: '構文・語句整序', short: '整序', area: '整序・構文', grade: 2, prereq: ['e-grammar'] },
    { id: 'e-conv', name: '会話文', short: '会話文', area: '会話文', grade: 1, prereq: ['e-idiom'] },
    { id: 'e-reading', name: '長文読解', short: '長文', area: '長文読解', grade: 2, prereq: ['e-vocab', 'e-struct'] }
  ]);
})();
