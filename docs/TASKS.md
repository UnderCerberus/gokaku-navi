# GOKAKU NAVI — 分担タスク仕様（未完了分）

各担当は **docs/CONTRACT.md 全文** と、このファイルの「共通ルール」+ 自分のセクションを読む。完了済みのファイルは作り直さない。

## 共通ルール

- プロジェクトルート `C:\Claude\gokaku-navi`（cwd）。担当ファイルだけを作成・修正する。`js/core/`, `js/app/`, `css/base.css`, `css/math.css`, `index.html`, `tools/`, `docs/CONTRACT.md` は変更禁止。
- ファイルは Write/Edit ツールで書く。**シェルの heredoc や node スクリプトで日本語・バックスラッシュを含むソースを生成しない**（文字が壊れる）。git 操作禁止。外部通信禁止。
- 一時スクリプトは `C:\Users\ecohi\AppData\Local\Temp\claude\C--Claude\426f4b5c-1e03-46cb-9603-b00d704a08ba\scratchpad\work\<担当名>\`（以下 `<S>\work\<担当名>`。`<S>` = `C:\Users\ecohi\AppData\Local\Temp\claude\C--Claude\426f4b5c-1e03-46cb-9603-b00d704a08ba\scratchpad`）に置く。前任者の検算スクリプトが残っている場合は流用してよい。
- **1 ファイル書き終えるごとに `node tools/validate.js <そのファイル>` をエラー 0 にしてから次へ進む**（途中で中断されても完成分が残るようにする）。
- **問題バンクは 2〜3 問ずつ Edit で追記し、そのつど validate エラー 0 を確認する**。図の定数（`FIG_X` など）を使う問題は、図の定義と同じ Edit で追記する（未定義の定数を参照したまま保存すると、ファイル全体が読み込めなくなる）。いつ中断されてもファイルが読み込める状態を保つ。
- 既存の完成分は作り直さない。大きいデータファイルを全文読まない（指定された行数だけ読む。id 一覧は `grep -n "id: '" <file>` で取る）。
- TeX は対応コマンドのみ（CONTRACT §2。`\Longleftrightarrow` `\square` `\ell` `\leq` `\geq` `\neq` も可）。リッチテキストの `**太字**` は数式をまたいでも可。ステップの `pro` は `lv: 1` のステップにだけ書く（簡潔モードは lv 1 しか表示しない）。
- 最終報告は 10 行以内: 作成/修正ファイル・件数・validator 結果・独立検算の方法・未完了があればその一覧。

### 計算機（数学）共通

- 見本 `js/math/ia-quad.js` を読み、構成・文体・粒度を合わせる。完成済みの例: `js/math/iib-proof.js`, `js/math/iiic-limit.js`。
- 各ファイル: IIFE + `'use strict'` + `const R = String.raw;`、`JK.registerCalc`。必須: `desc`, `form`, `inputs`（`def` つき）, `examples` 2 個以上, `intro.easy`（+ normal/pro）, `compute`。
- `compute` は「公式 → 代入 → 計算 → 結論」を 1 行ずつ。分数・根号は厳密値（`JK.Q`, `JK.poly`, `JK.util.sqrtTex`, `exactTrig`）+ 必要なら近似値。`result` 2〜5 個。図が有効なら `fig`。
- 学年別パーソナライズ: `easy` を持つステップ 2 個以上（数II・B / 数III・C は 3 個以上 + `lv: 3` の導入ステップ + 直感的な `intro.easy`。「未習の高1・高2 が読んで分かる」こと）、`lv: 2/3` の詳細ステップ、`pro`。
- 不正入力は `throw new JK.CalcError('日本語')`。どんな入力でも他の例外・NaN・undefined を出さない（validator が乱数入力 40 通りで叩く）。
- 代表的な入力の結果を node で独立に検算（数値微分・数値積分・総当たり）。

### シミュレーター（物理）共通

- 見本 `js/physics/mech-eom.js` を読み合わせる。完成済みの例: `js/physics/mech-fall.js`, `js/physics/thermo-gas.js`, `js/physics/em-ohm.js`。
- 各ファイル: IIFE + `const R = String.raw;`、`JK.registerSim`。必須: `field`, `unit`, `desc`, `form`（TeX 配列）, `inputs`（`unit`・`def`・`min`/`max`）, `examples` 2 個以上, `intro.easy`, `compute`, `exercise`。
- `compute`: `result`（単位つき、`JK.util.sig(x, 3)`）、`steps`（状況把握 → 立式（法則名）→ 文字式 → 代入 → 単位つき結論）、**入力値を反映した `fig` 必須**（`JK.plot.draw` / `graph`、色はクラスのみ）。
- `exercise(rng, level)`: きりのよい数値、問題文に定数明記（$g=9.8\,\mathrm{m/s^2}$ 等。数値は `1.0 kg` のように有効数字が分かる形）、図、設問 1〜3 個（`type:'num'`, `answer: Number(x.toPrecision(3))`, `rel: 0.02`, `unit`。指数つきの答えは `hint` に入力例）、解説 steps。`level` で難度を変える。物理的に不可能な値を出さない。
- `easy` を持つステップ 2 個以上、`lv`、`pro`。CalcError 以外の例外・NaN・Infinity を出さない。

### 問題バンク共通

- CONTRACT §4（問題）・§5（長文）。書式の実例: 数学 `js/data/exam-math-basic.js`、英語 `js/data/seikei-english-2023.js`。
- すべて自作（`source:{univ:'オリジナル'}`）。既存の入試問題・教材を写さない。答えは機械採点できる形（`num`/`expr`/`choice`/`multi`/`text`/`order`）に分解。
- 各問題に `time`, `tags`、solution の要所に `easy`/`pro`/`lv`。数値解答は node で独立検算。英語の選択問題は各設問に `explain` 必須、正解位置を偏らせない、空所の正解が一意であることを確認。
- 物理は問題ごとに図（`fig`）を付ける（7 割以上）。`choice` の選択肢に文字式・グラフ（`{fig}`）も使う。数値解答は `rel: 0.02` と `unit`。

---

## 現状

最新の状態と派遣中の作業は [PROGRESS.md](../PROGRESS.md) にある（このファイルには書かない）。2026-10-02 夜の時点で、以下の全節（計算機・シミュレーター・英語エンジン・問題バンク・成蹊類題）は作成済み。各節は仕様の記録として残してある。追加の作業（原文類似の点検、乱数演習の多様化など）の指示は PROGRESS.md の表を参照。

作成後に加わった共通ルール:

- `hint`（入力例）は正解と違う値で書く（CONTRACT §4。validator がエラーにする）。
- 乱数演習（`exercise`）は、種を変えたとき答えの組が 12 通り以上出るようにする（題材の制約があれば 8 通り以上）。また、`answer` と解説の最終行の数値を同じ値にする（途中を丸めた解説と丸めない答えが 36.7 / 36.8 のようにずれないこと）。計測は `node tools/simcheck.js [simId]`。
- 成蹊類題は、原文と文面・設定・数値・選択肢が近すぎないかをスキャン画像と突き合わせて点検する（S-PHYS / S-ENG の節の「著作権（厳守）」）。

## M-IA 数学計算機 数I・A 残り（course `IA`）

1. **修正** `js/math/ia-expr.js`: validator で `ia-sqrt` の example「3/√12」が `ReferenceError: g is not defined`（`rat1Calc` 付近）。原因を直し、ファイル全体をエラー 0 に。
2. **確認** `js/math/ia-int.js`: validator エラー 0 を確認（未対応コマンドがあれば対応コマンドに書き換える）。
3. **新規** `js/math/ia-quad2.js` — unit `m-quad`, group `2次関数`
   - `ia-quad-eq` 2 次方程式 $ax^2+bx+c=0$（係数 q）: 判別式 → 解の個数 → 因数分解できればその解法 / できなければ解の公式（根号簡約、$D<0$ は実数解なし + 虚数解の参考表示）。グラフと x 軸の交点の図。
   - `ia-quad-ineq` 2 次不等式（不等号 4 種 select）: $a<0$ は −1 倍、$D$ で場合分けし、グラフと x 軸の上下関係から解を読む。解の範囲を図で塗る。
   - `ia-quad-from` 2 次関数の決定: select（頂点と 1 点 / 3 点）。連立方程式の過程、一般形と平方完成形。
4. **新規** `js/math/ia-trig.js` — unit `m-trig1`, group `図形と計量`
   - `ia-trig-values` 角度（0〜180°）→ sin/cos/tan（15° 刻みは厳密値）、単位円の図、$180°-\theta$ の関係。
   - `ia-trig-relation` sin/cos/tan の 1 つの値（q）と鋭角/鈍角 → 残り 2 つ（相互関係の式の過程、根号簡約）。
   - `ia-sine-rule` 正弦定理: select（a と A → R / 2 角 1 辺 → 残りの辺）。三角形と外接円の図。
   - `ia-cosine-rule` 余弦定理: select（2 辺夾角 → 対辺 / 3 辺 → 角）。成立条件の検証。
   - `ia-tri-area` 面積と内接円: select（2 辺夾角 / ヘロン）→ S, $r=\frac{2S}{a+b+c}$。図。
5. **新規** `js/math/ia-geo.js` — unit `m-geo`, group `図形の性質`
   - `ia-tri-centers` 3 辺 → 面積・内接円半径・外接円半径 $R=\frac{abc}{4S}$。三角形と 2 円の図。
   - `ia-angle-bisector` 角の二等分線と比: BD:DC=AB:AC、BD・DC・AD の長さ。図。
   - `ia-ceva-menelaus` チェバ / メネラウス（select）: 2 つの比 → 残りの比。図。
   - `ia-power` 方べきの定理: select（2 弦・割線 / 接線）。図。

## M-IIB 数学計算機 数II・B 残り（course `IIB`）

1. **確認** `js/math/iib-coord.js`: validator エラー 0 を確認（`\square` は対応済みになった。他のエラーがあれば直す）。
2. **新規** `js/math/iib-trig.js` — unit `m-trig2`, group `三角関数`
   - `iib-radian` 度 ↔ ラジアン（π の分数）、扇形の弧長 $l=r\theta$・面積 $\frac12r^2\theta$。
   - `iib-trig-general` 一般角（度、15° 刻みは厳密値）→ sin/cos/tan、単位円と動径の図、象限と符号。
   - `iib-addition` 加法定理: α, β（15° 刻み）→ $\sin(\alpha\pm\beta)$ 等を公式に代入。2 倍角・半角。
   - `iib-compose` 合成 $a\sin\theta+b\cos\theta=r\sin(\theta+\alpha)$: r、α の決め方（点 (a,b) の図）、最大最小、グラフ。
   - `iib-trig-eq` 三角方程式・不等式: sin/cos/tan select、値 k、$0\le\theta<2\pi$ の解（特殊角は π の分数）。単位円の図。
3. **新規** `js/math/iib-calc.js` — unit `m-calc2`, group `微分・積分`
   - `iib-diff-poly` 多項式の微分と接線（poly、x=a）: 項ごとの微分 → $f'(a)$ → 接線。曲線と接線の図。`lv:3` で導関数の定義（平均変化率の極限）を数値例つきで。
   - `iib-extrema` 3 次関数の増減表と極値: $f'(x)=0$ の場合分け、増減表、極値。グラフ。
   - `iib-integ-poly` 多項式の不定積分・定積分 [a,b]: 分数で厳密に。面積を塗る図（符号つき面積の説明）。
   - `iib-area` 面積: select（放物線と x 軸 / 放物線と直線 / 2 放物線）。交点 → 上下 → 定積分。$\frac{|a|}{6}(\beta-\alpha)^3$ の検算（pro）。領域の図。
   - `iib-tangent-from` 曲線外の点から 2 次関数に引いた接線（接点を t とおく）。
4. **新規** `js/math/iib-seq.js` — unit `m-seq`, group `数列`
   - `iib-arith` 等差（a, d, n → 一般項・第 n 項・和）。`iib-geom` 等比（r=1 の場合分け）。
   - `iib-sigma` $\sum_{k=1}^{n}(ak^2+bk+c)$: 数値 n / n の式のまま（JK.poly で整理・因数分解形）。
   - `iib-recur` 漸化式: select（等差型 / 等比型 / $a_{n+1}=pa_n+q$（特性方程式）/ 階差型）。一般項 → 5 項で検算。
   - `iib-sum-from-sn` $S_n=pn^2+qn+r$ → $a_n$（$a_1$ の整合確認）。
5. **新規** `js/math/iib-vec.js` — unit `m-vec`, group `ベクトル`
   - `iib-vec-basic` 成分計算（2/3 次元 select）: $s\vec a+t\vec b$、大きさ。2 次元は矢印の図。
   - `iib-vec-dot` 内積・なす角・垂直/平行判定。`iib-vec-triangle` 3 点 → 三角形の面積。
   - `iib-vec-internal` 内分点・外分点・重心。`iib-vec-perp` 垂直/平行になる x。

## M-IIIC 数学計算機 数III・C 残り（course `IIIC`）

1. **新規** `js/math/iiic-integ.js` — unit `m-integ3`, group `積分法`
   - `iiic-int-basic` 基本関数の定積分: select（$x^p$（$p=-1$ は log）/ $e^{kx}$ / $\sin kx$ / $\cos kx$ / $\frac{1}{x+c}$ / $\frac{1}{\cos^2x}$）と区間。原始関数 → 代入 → 厳密値 + 近似。面積の図。
   - `iiic-int-sub` 置換積分（プロセス可視化）: $\int f(ax+b)dx$ 型と $\int g'(x)\{g(x)\}^ndx$ 型。$u=\cdots$ → $du$ → 区間の対応表 → u で積分。
   - `iiic-int-parts` 部分積分: select（$xe^{kx}$ / $x\sin kx$ / $x\cos kx$ / $\log x$ / $x^n\log x$ / $x^2e^x$）。f と g' の選び方を明示。定積分も。
   - `iiic-int-frac` 分数関数: $\int\frac{px+q}{(x-a)(x-b)}dx$（部分分数分解）と「割り算してから積分」。
   - `iiic-int-area` 面積・回転体の体積: 関数 select + 多項式入力、区間。$\int|f|dx$ と $V=\pi\int f^2dx$。円板のイメージ（easy + 図）。シンプソン法との照合（lv:3）。
   - `iiic-int-kubun` 区分求積法: f select、n=4,10,100 の和と長方形の図。
2. **新規** `js/math/iiic-cplane.js` — unit `m-cplane`, group `複素数平面`
   - `iiic-polar` 極形式（a+bi → r, θ。特殊角は厳密）。`iiic-mul-div` 極形式の積・商（回転と拡大）。
   - `iiic-demoivre` ド・モアブル（$z^n$、n は −12〜12、点列の図）。`iiic-roots` n 乗根（正 n 角形の図）。
   - `iiic-rotate` 点 α 中心の回転・拡大。`iiic-cplane-geometry` 距離・内分点・なす角・共線/垂直判定。
   - `iiic-locus` 方程式の表す図形: 円 / 垂直二等分線 / アポロニウスの円。すべて複素数平面の図つき。
3. **新規** `js/math/iiic-conic.js` — unit `m-conic`, group `2次曲線`
   - `iiic-ellipse`（焦点・頂点・長短軸・離心率、距離の和）、`iiic-hyperbola`（焦点・漸近線、符号 select）、`iiic-parabola`（$y^2=4px$ / $x^2=4py$、焦点・準線）。
   - `iiic-conic-general` $Ax^2+Cy^2+Dx+Ey+F=0$ → 平方完成 → 種類判定・中心・焦点。
   - `iiic-conic-tangent` 曲線上の点における接線（公式 + 陰関数の微分で確認）。`iiic-param` 媒介変数表示・極座標 ↔ 直交座標。すべて図つき（`equal: true`）。

## P-A 物理シミュレーター 力学の残り + 波動

`field: '力学'`
- `js/physics/mech-eom2.js`（unit `p-eom`）: `mech-connected` 水平面上の連結 2 物体を力 F で引く（μ′ 可）→ 加速度・張力。`mech-atwood` 滑車: select（定滑車の両側 / 机上の m₁ とつるした m₂）。
- `js/physics/mech-momentum.js`（`p-momentum`）: `mech-collision` 一直線上の衝突（m₁,v₁,m₂,v₂,e → 衝突後の速度・失われたエネルギー、前後の図）。`mech-impulse` 力積と運動量（F–t グラフ）。
- `js/physics/mech-energy.js`（`p-energy`）: `mech-energy-conservation` select（曲面をすべる / 振り子の最下点 / ばねで打ち出す）。`mech-work-friction` あらい面で止まるまでの距離（仕事とエネルギー）。
- `js/physics/mech-circular.js`（`p-circular`）: `mech-circular-uniform` 等速円運動（ω・T・向心加速度・向心力）。`mech-vertical-circle` 鉛直面内の円運動（最高点の速さ・張力・1 周条件）。`mech-conical` 円錐振り子。
- `js/physics/mech-shm.js`（`p-shm`）: `mech-spring-shm` ばね振り子（T・最大の速さ・x–t グラフ）。`mech-pendulum` 単振り子。

`field: '波動'`
- `js/physics/wave-basic.js`（`p-wave`）: `wave-fundamental` $v=f\lambda$ と正弦波（t=0 と t の波形）。`wave-string` 弦の固有振動（腹と節の図）。`wave-pipe` 気柱（閉管/開管）。`wave-refraction` 屈折の法則・臨界角。
- `js/physics/wave-doppler.js`（`p-doppler`）: `wave-doppler`（音源・観測者の近づく/遠ざかる select、符号の決め方を図と言葉で）。`wave-doppler-reflect` 動く反射板とうなり。
- `js/physics/wave-interference.js`（`p-interf`）: `wave-young`（$\Delta x=\frac{L\lambda}{d}$、経路差の導出）。`wave-grating` 回折格子。`wave-thin-film` 薄膜（反射での位相の反転を屈折率から判断）。

## P-B 物理シミュレーター 電磁気の残り + 原子

- **修正** `js/physics/em-static.js`: 172 行付近に構文エラー（テンプレート文字列）。直して validator エラー 0 に。内容: `em-coulomb`, `em-field-potential`, `em-capacitor`, `em-capacitor-combine`, `em-uniform-field`（不足があれば補う）。

`field: '電磁気'`
- `js/physics/em-magnetic.js`（unit `p-mag`）: `em-field-current` 電流がつくる磁場（直線/円形/ソレノイド select、右ねじの向きの図）。`em-force-current` $F=IBl\sin\theta$ と平行電流間の力（フレミング左手の図）。`em-lorentz` ローレンツ力と円運動（粒子 select、$r=\frac{mv}{qB}$, $T=\frac{2\pi m}{qB}$）。
- `js/physics/em-induction.js`（`p-induction`）: `em-rod` 磁場中を動く導体棒（$V=vBl$・電流・力・仕事率 = ジュール熱）。`em-faraday`（$V=N\frac{\Delta\Phi}{\Delta t}$、Φ–t と V–t グラフ）。`em-self-induction`（$V=L\frac{\Delta I}{\Delta t}$、$\frac12LI^2$）。
- `js/physics/em-ac.js`（`p-ac`）: `em-ac-basic` 実効値。`em-reactance` $X_L=\omega L$, $X_C=\frac{1}{\omega C}$ と位相。`em-rlc` RLC 直列（Z・位相差・共振周波数・フェーザ図）。`em-transformer` 変圧器。

`field: '原子'`
- `js/physics/atom-photon.js`（`p-photon`）: `atom-photon-energy`（$E=h\nu=\frac{hc}{\lambda}$、J と eV、運動量）。`atom-photoelectric` 光電効果（金属 select、$K=h\nu-W$、限界振動数、阻止電圧、K–ν グラフ。起こらない場合も結果として表示）。`atom-debroglie` 物質波と X 線の最短波長。
- `js/physics/atom-structure.js`（`p-atom`）: `atom-hydrogen` 水素原子（$E_n=-\frac{13.6}{n^2}$ eV、遷移の波長、系列名、準位図）。`atom-bohr` ボーア模型（量子条件の図解）。`atom-decay` 半減期（N–t グラフ）と α/β 崩壊。`atom-binding` 質量欠損と結合エネルギー（1 u = 931.5 MeV）。

## E-ENGINE 英語和訳エンジンと UI

読むもの: CONTRACT §5・§10・§11・§12、`js/core/ns.js`、`js/core/tex.js` 末尾の `JK.passage`、`css/base.css`、`js/app/exam.js` の `openVocab`/`drillPool`、辞書 `js/data/dict-a-l.js`・`dict-m-z.js`（約 5,400 語、[語, 品詞, 語義, レベル]）と `js/data/idioms.js`（889 件）の冒頭、`js/data/seikei-english-2023.js` 冒頭。

ユーザー要件: 「和訳するぞう」のようなシンプルな 2 画面（左に英文入力、右に和訳）。内蔵の長文対訳データと内蔵辞書・文法パターンだけで、入力英文が（部分）一致したとき高精度な和訳と重要単語・熟語リストを即座に出す。外部 API 禁止。

成果物（読み込み順 lemma → grammar → translator → ui。**読み込み時に DOM に触らない**）:
1. `js/english/lemma.js`: `JK.en.lemmas(word)`（不規則動詞 150 以上・不規則複数・比較級の表 + 規則変化）、`JK.en.lookup(word)` → `[{w,pos,ja,lv,form}]`。**完全一致のエントリと原形候補のエントリの両方を返す**（辞書には left, lay, bound, living, thought(名) など活用形と同綴りの見出しがある。found は無い）。
2. `js/english/grammar.js`: 文法パターン 45 個以上を `JK.registerGrammar`（`{id, name, level, test, explain, example:{en,ja}}`）。5 文型、受動態、完了形、進行形、助動詞、不定詞、動名詞、分詞・分詞構文、関係詞、比較、仮定法、仮主語/強調構文、so~that/too~to/enough to、相関接続詞、使役・知覚、There is、間接疑問、接続詞、倒置、無生物主語など。
3. `js/english/translator.js`: `JK.en.translate(text)` → `{sentences:[{en,ja,method,score,source,gloss:[{w,lemma,pos,ja}],grammar:[{name,explain}]}], vocab:[{w,pos,ja,lv}], idioms:[{phrase,ja,lv}]}`。文ごとに (a) 翻訳メモリ（`JK.passageList` の全文と正規化照合。完全一致 = 'exact'、語の一致率 0.8 以上 = 'fuzzy' + 出典）→ (b) 構文パターン訳 25 種以上（'pattern'）→ (c) 辞書ベース直訳（熟語照合 → 品詞推定 → 句にまとめる → 日本語の語順に並べ替え・助詞補完・時制/否定反映、'gloss'）。重要語はレベル 1 以上（**先頭エントリのレベルで判定**）。`JK.en.makeVocabQuiz({words, level, count, seed})` → 問題配列（各 `{title:'単語クイズ', word, body, parts:[{type:'choice', choices(4), answer, explain}], solution(2 ステップ以上)}`、seed で決定的、正解位置を偏らせない）。
4. `js/english/ui.js`: `JK.en.mount(el)`。左 = textarea・サンプル長文選択（登録済み全長文）・「和訳する」「クリア」「読み上げ」（speechSynthesis があれば）・400ms デバウンスの自動和訳。右 = ①和訳（文ごとの対訳、method バッジ、クリックで語注）②重要単語・熟語（表、単語帳に保存 = `JK.store.s.ui.vocabSaved` + `JK.store.save()`）③文法ポイント ④単語クイズ（5 問 4 択、回答ごとに `JK.hooks.vocabAnswered(word, ok)`）。共通クラスと CSS 変数のみ。固有スタイルは `css/english.css`（`.en-tool` 配下、新規作成）。
5. `js/data/passages-sample.js`: サンプル長文 6 本（basic 2 本 120〜180 語 / mid 2 本 200〜280 語 / adv 2 本 280〜380 語、完全自作、文単位の対訳、`vocab`）。

検証: `node tools/validate.js js/data/dict-a-l.js js/data/dict-m-z.js js/data/idioms.js js/data/seikei-english-2023.js js/data/passages-sample.js js/english/lemma.js js/english/grammar.js js/english/translator.js js/english/ui.js` エラー 0。node テストで lemmas 30 例、翻訳メモリ（1 文・3 文・1 語違い）、次の文が自然な日本語になること: "It is important for us to learn English." / "There are many books on the desk." / "He is so tired that he cannot walk." / "This problem is too difficult for me to solve." / "She is not only kind but also smart." / "If I had more time, I would travel abroad." / "The window was broken by the boy." / "He is taller than his father." / "I have lived in Tokyo for ten years." / "She gave me a book." / "The boy plays tennis every day." / "My mother made me clean the room." / "The man who lives next door is a doctor." / "Although it was raining, they went out." / "Scientists believe that the climate is changing rapidly." / "Reading books is fun."

## B-MATH 数学バンク 中堅 + 難関

- `js/data/exam-math-mid.js`（`level:'mid'`）と `js/data/exam-math-adv.js`（`level:'adv'`）。各 24 問 = 数学の grade ≥ 1 の 20 単元 × 1 問 + 頻出 4 単元もう 1 問（mid: m-calc2, m-vec, m-seq, m-integ3 / adv: m-integ3, m-vec, m-prob, m-seq）。id `m-mid-<単元>-NN` / `m-adv-<単元>-NN`。
- mid: 中堅私大の入試標準、誘導つき大問、3〜4 設問、solution 4〜8 ステップ。adv: 難関大のやや難（融合・場合分け・存在条件）、3〜5 設問、solution 5〜10 ステップ、`prereq` 明記。
- adv は前任者の検算スクリプト `<S>\work\bank-math-adv\indep.js` に問題設計が残っている。妥当なら活用し、必ず検算し直す。`js/data/seikei-math.js` の問題と設定が重ならないようにする。図は 3 割程度。

## B-PHYS 物理バンク

- `js/data/exam-physics-basic.js` / `-mid.js` / `-adv.js`: 各レベル 21 問 = 物理の grade ≥ 2 の 21 単元（p-kin 〜 p-atom）× 1 問。id `p-<level>-<単元の p- 以降>-NN`。basic: 教科書〜共通テスト（2〜3 設問）/ mid: 入試標準（3〜4 設問、誘導つき）/ adv: やや難（4〜5 設問、文字式の `choice` を含む）。
- `js/data/drills-physics.js`（`level:'drill'`）: 物理の全 24 単元（p-math0, p-ohm0, p-force0 を含む）× 3 問 = 72 問。id `d-<unit>-NN`。前提範囲の基礎確認の一問一答、各ステップに `easy` 必須。p-math0 は「比の計算・単位換算・指数（$10^n$）の計算・有効数字」、p-ohm0 は「V=RI・直列/並列の基本」、p-force0 は「力の分解・つり合い」。

## B-ENG 英語バンク

- `js/data/exam-english-basic.js` / `-mid.js` / `-adv.js`: 各レベル 15 カード = e-vocab ×3（各 5 設問）、e-idiom ×2（各 5）、e-grammar ×4（各 5、カードごとにテーマ）、e-struct ×2（各 4、`order`、`q` に日本語訳）、e-conv ×1（会話文の空所 4〜5）、e-reading ×3（書き下ろし長文 + 5〜7 設問。同じファイルで `JK.registerPassages`、id `ep-<level>-NN`。語数 basic 150〜220 / mid 250〜350 / adv 350〜500）。id `e-<level>-<種別>-NN`。
- `js/data/drills-english.js`（`level:'drill'`）: e-vocab ×5（各 6 設問）、e-idiom ×4、e-grammar0 ×5（5 文型・be/一般動詞・時制・助動詞・疑問/否定・比較・受動態・不定詞の基本）、e-grammar ×5、e-struct ×4（`order`）、e-conv ×3、e-reading ×3（60〜100 語、passage id `ep-drill-NN`）。id `d-<unit>-NN`。
- `order` の `words` は句読点なし・表示順（シャッフル済み）、`answer` は語を空白で連結した正しい英文。長文は文単位の対訳、`vocab`、必要なら `vocabExtra`。

## S-PHYS / S-ENG 成蹊大学 理工学部 類題

- 入力: 過去問スキャン画像 `<S>\pdf\<年>-physics\pNN.png`、`<S>\pdf\<年>-english\pNN.png`（p01 は表紙。Read ツールで画像として読む。読みにくければ PyMuPDF（`import pymupdf`）で `<S>\pdf\<年>-<教科>.pdf` を dpi=200 で `<S>\work\<担当名>\` に書き出す）。解答は付いていない。
- **著作権（厳守）**: 問題文・数値設定・図・英文を転記・翻訳・言い換えしない。出題分野・形式・難易度・設問の流れを把握する資料としてのみ使い、設定・数値・文面を変えた自作の類題にする。英語長文は題材から選び直して書き下ろす（元と同じ人物・企業・出来事を扱わない）。分析メモにも原文を引用しない。
- 成果物（年度ごと）: `js/data/seikei-physics-<年>.js` + `docs/seikei-analysis-physics-<年>.md`、`js/data/seikei-english-<年>.js` + `docs/seikei-analysis-english-<年>.md`。書式の実例: `js/data/seikei-math.js`, `js/data/seikei-english-2023.js`, `docs/seikei-analysis-math.md`。
- 共通フィールド: `level:'mid'`、`source:{univ:'成蹊大学', faculty:'理工学部', year, no:'第2問', kind:'類題'}`、id `sk-p-<年>-<大問><小問>` / `sk-e-<年>-<大問>`（長文は `sk-ep-<年>-<大問>`）。大問ごとに 1 カード（独立した小問集合は小問ごとに別カード）。
- 物理: 元がマーク式なので原則 `choice`（文字式・語句・グラフの選択肢 4〜6 個、グラフは `{fig}`）、数値は `num`。図は `JK.plot`。各設問に `explain`。全解答を独立検算。
- 英語: 元の設問形式を踏襲（空所 `{bN:}`・下線 `{uN:}`・内容一致・整序・記述 → `choice`/`text` に変換）、各設問 `explain` 必須、長文は元の 6〜8 割の語数（最低 280 語）、文単位の対訳、`vocab`。
- 分析 md: 大問 / 分野 / 形式・設問数 / 難易度 / 対応する類題 id の表 + 傾向メモ 8 行。
