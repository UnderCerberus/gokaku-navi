# GOKAKU NAVI — 実装契約書（全モジュール共通）

志望校逆算ダッシュボード + 3教科（数学・英語・物理）過去問演習 / 計算機 / 和訳ツールの **完全オフライン静的Webアプリ**。
この文書が唯一の仕様。各担当はここに書かれた形式・API だけに依存して実装する。

## 0. 絶対ルール

1. **外部通信ゼロ**。CDN・Webフォント・fetch・外部API・外部画像 すべて禁止。全ロジック・データをローカル JS に内蔵。
2. **プレースホルダー禁止**。「TODO」「サンプル」「ダミー」「省略」で終わらせない。書いた問題・解説・計算は全て完成品。
3. **正確性最優先**。数値・解答・和訳は必ず自分で検算（node スクリプトで別経路から再計算）してから書く。
4. **著作権**: 既存の入試問題・参考書・Web 記事の文面を転記しない。問題文・英文・解説はすべて自作（数値・設定・文面を自分で作る）。
5. `index.html` から **クラシック `<script src>`** で読む（`file://` で動かすため ES Modules 不可）。各ファイルは IIFE + `'use strict'`。グローバルは `window.JK` のみ使用。
6. 自分の担当ファイル以外を作成・変更しない（特に `js/core/`, `js/app/`, `css/base.css`, `css/math.css`, `index.html`, `tools/`, `docs/CONTRACT.md` はリード担当）。
7. 文字コード UTF-8（BOM なし）。ファイル書き込みは Write/Edit ツールで行う（シェルの heredoc で日本語・バックスラッシュを書かない）。
8. 表示文言は日本語（高校生向け・です/ます調の丁寧な解説）。

### 文字列の書き方（重要な落とし穴）

TeX を含む文字列は **必ず `String.raw` テンプレート** で書く。各ファイル先頭で `const R = String.raw;` と定義して ``R`...` `` を使う。

```js
const R = String.raw;
body: R`2次関数 $y = x^{2} - 4x + 1$ の頂点を求めよ。`
m: R`\frac{-b \pm \sqrt{b^{2}-4ac}}{2a}`
```

- 通常の `'...'` に `\frac` `\theta` `\times` 等を書くと `\f` `\t` が制御文字に化ける。**禁止**（validator が制御文字を検出して失敗させる）。
- テンプレート内で `$` の直後に `{` を書くと式展開になる。`$ {` と空白を入れるか、`\C{n}{r}` 等のマクロを使う。
- バッククォート `` ` `` は本文中で使わない。

## 1. ディレクトリと担当

```
gokaku-navi/
  index.html, css/base.css, css/math.css        … リード
  js/core/{ns,util,tex,plot,steps}.js            … リード（共通基盤）
  js/app/*.js                                    … リード（ダッシュボード/タイマー/ToDo/過去問エンジン/誤答分析/計算機シェル）
  js/data/units.js                               … リード（単元グラフ）
  js/data/exam-<subject>-<level>.js              … 問題バンク担当
  js/data/drills-<subject>.js                    … 問題バンク担当（基礎復習ドリル）
  js/data/seikei-<subject>.js                    … 成蹊類題担当
  js/data/dict-a-l.js, dict-m-z.js, idioms.js    … 辞書担当
  js/data/passages-sample.js                     … 英語エンジン担当
  js/math/*.js                                   … 数学計算機担当
  js/physics/*.js                                … 物理シミュレーター担当
  js/english/{lemma,grammar,translator,ui}.js, css/english.css … 英語エンジン担当
  tools/validate.js                              … リード（検証ツール）
```

`<subject>` = `math` | `physics` | `english`、`<level>` = `basic` | `mid` | `adv`。

## 2. リッチテキストと数式（mini-TeX）

問題文・解説などの **テキスト欄** は「リッチテキスト」:

- `$...$` インライン数式、`$$...$$` ディスプレイ数式（独立行）
- 改行はそのまま改行、空行で段落
- `**太字**`、`__下線__`
- それ以外の HTML は書けない（エスケープされる）。図は専用の `fig` 欄に SVG 文字列で渡す。

**数式欄**（steps の `m`、`form`、result の `tex`）は `$` なしの TeX を直接書く。

### 対応 TeX コマンド（これ以外は validator がエラーにする）

| 種類 | 書き方 |
|---|---|
| 分数 | `\frac{a}{b}` `\dfrac{a}{b}` |
| 根号 | `\sqrt{x}` `\sqrt[3]{x}` |
| 上付き・下付き | `x^{2}` `a_{n}` `x^2` `a_n`（1文字なら波括弧省略可） `x_{1}^{2}` |
| 大型演算子 | `\int_{a}^{b}` `\sum_{k=1}^{n}` `\prod` `\lim_{x \to a}` |
| 関数名 | `\sin \cos \tan \log \ln \exp \max \min \arg` |
| ギリシャ | `\alpha \beta \gamma \delta \epsilon \varepsilon \theta \lambda \mu \nu \pi \rho \sigma \tau \phi \varphi \omega \Delta \Omega \Sigma \Phi \Lambda \Gamma` |
| 記号 | `\times \div \cdot \pm \mp \le \ge \ne \approx \equiv \fallingdotseq \to \Rightarrow \Leftrightarrow \infty \angle \triangle \perp \parallel \degree \cdots \ldots \therefore \because \in \subset \cup \cap \propto \sim \prime` |
| 空白 | `\,` `\;` `\quad` `\qquad` `\ `（バックスラッシュ+空白） |
| 装飾 | `\vec{a}` `\overline{AB}` `\bar{z}` `\hat{x}` `\dot{x}` `\underline{x}` `\boxed{ア}`（空欄の枠） |
| 文字 | `\text{日本語や単位}` `\mathrm{kg}` `\mathbf{a}` |
| 括弧 | `\left( \right)` `\left[ \right]` `\left| \right|` `\left\{ \right\}` `\left. \right|`、`\{ \}`、`\|` |
| 組合せ | `\C{n}{r}` → ₙCᵣ、`\P{n}{r}` → ₙPᵣ、`\H{n}{r}` → ₙHᵣ |
| 場合分け | `\begin{cases} a & (x \ge 0) \\ -a & (x < 0) \end{cases}` |
| 式変形 | `\begin{aligned} y &= x^{2}-4x+1 \\ &= (x-2)^{2}-3 \end{aligned}` |
| ベクトル成分 | `\begin{pmatrix} 1 \\ 2 \end{pmatrix}` |

- 数式内の日本語は `\text{}` 推奨（直接書いても立体で表示される）。
- 単位は `\,\mathrm{m/s^{2}}` の形で。`°` は `\degree`（`30\degree`）。
- 複数行の式変形は `aligned` か、`m` を文字列配列にする（1要素=1行）。

## 3. 単元グラフ（unit）

単元 ID は全教科共通の名前空間。`prereq` が「1つ前の前提範囲」。誤答時にここを辿って復習タスクが自動生成される。
`grade` は履修学年の目安（0=中学、1=高1、2=高2、3=高3）。解説の噛み砕き度合いの判定に使う。

### 数学（subject: `math`）

| id | 名称 | area | grade | prereq |
|---|---|---|---|---|
| m-junior | 中学数学（計算・一次方程式・比） | 基礎(中学) | 0 | — |
| m-geo0 | 中学図形（三平方の定理・相似） | 基礎(中学) | 0 | — |
| m-expr | 数と式（展開・因数分解） | 数I・A | 1 | m-junior |
| m-quad | 2次関数 | 数I・A | 1 | m-expr |
| m-trig1 | 図形と計量（三角比） | 数I・A | 1 | m-geo0 |
| m-data | データの分析 | 数I・A | 1 | m-junior |
| m-prob | 場合の数・確率 | 数I・A | 1 | m-junior |
| m-int | 整数の性質 | 数I・A | 1 | m-expr |
| m-geo | 図形の性質 | 数I・A | 1 | m-geo0 |
| m-proof | 式と証明 | 数II・B | 2 | m-expr |
| m-complex | 複素数と方程式 | 数II・B | 2 | m-quad, m-expr |
| m-coord | 図形と方程式 | 数II・B | 2 | m-quad, m-geo0 |
| m-trig2 | 三角関数 | 数II・B | 2 | m-trig1 |
| m-explog | 指数・対数関数 | 数II・B | 2 | m-expr |
| m-calc2 | 微分・積分（数II） | 数II・B | 2 | m-quad, m-expr |
| m-seq | 数列 | 数II・B | 2 | m-expr |
| m-vec | ベクトル | 数II・B | 2 | m-trig1, m-coord |
| m-limit | 極限 | 数III・C | 3 | m-seq, m-explog |
| m-diff3 | 微分法（数III） | 数III・C | 3 | m-calc2, m-trig2, m-explog |
| m-integ3 | 積分法（数III） | 数III・C | 3 | m-diff3, m-calc2 |
| m-cplane | 複素数平面 | 数III・C | 3 | m-complex, m-trig2 |
| m-conic | 2次曲線 | 数III・C | 3 | m-coord, m-quad |

### 物理（subject: `physics`）

| id | 名称 | area | grade | prereq |
|---|---|---|---|---|
| p-math0 | 比の計算・単位と指数 | 基礎 | 0 | — |
| p-ohm0 | オームの法則の基本（中学） | 基礎 | 0 | p-math0 |
| p-force0 | 力のつり合い・力の分解 | 基礎 | 1 | p-math0 |
| p-kin | 等加速度運動 | 力学 | 2 | p-math0 |
| p-fall | 落体の運動 | 力学 | 2 | p-kin |
| p-rigid | 剛体（力のモーメント） | 力学 | 3 | p-force0 |
| p-eom | 運動方程式 | 力学 | 2 | p-force0, p-kin |
| p-momentum | 運動量と力積 | 力学 | 3 | p-eom |
| p-energy | 仕事と力学的エネルギー | 力学 | 2 | p-eom |
| p-circular | 円運動 | 力学 | 3 | p-eom |
| p-shm | 単振動 | 力学 | 3 | p-circular |
| p-heat | 熱量と比熱 | 熱力学 | 2 | p-math0 |
| p-gas | ボイル・シャルルの法則 | 熱力学 | 3 | p-math0 |
| p-thermo1 | 熱力学第一法則 | 熱力学 | 3 | p-gas, p-energy |
| p-wave | 波の性質 | 波動 | 2 | p-math0 |
| p-doppler | ドップラー効果 | 波動 | 3 | p-wave |
| p-interf | 光の干渉 | 波動 | 3 | p-wave |
| p-estat | 静電気（電場と電位） | 電磁気 | 3 | p-force0, p-energy |
| p-circuit | オームの法則と合成抵抗 | 電磁気 | 2 | p-ohm0 |
| p-mag | 電流と磁場 | 電磁気 | 3 | p-circuit |
| p-induction | 電磁誘導 | 電磁気 | 3 | p-mag |
| p-ac | 交流 | 電磁気 | 3 | p-circuit, p-induction |
| p-photon | 光の粒子性 | 原子 | 3 | p-wave, p-energy |
| p-atom | 原子構造 | 原子 | 3 | p-photon, p-circular |

### 英語（subject: `english`）

| id | 名称 | area | grade | prereq |
|---|---|---|---|---|
| e-vocab | 必須英単語 | 語彙・熟語 | 1 | — |
| e-idiom | 熟語・イディオム | 語彙・熟語 | 1 | e-vocab |
| e-grammar0 | 中学英文法（文型・時制の基本） | 文法・語法 | 0 | — |
| e-grammar | 文法・語法 | 文法・語法 | 1 | e-grammar0, e-vocab |
| e-struct | 構文・語句整序 | 整序・構文 | 2 | e-grammar |
| e-conv | 会話文 | 会話文 | 1 | e-idiom |
| e-reading | 長文読解 | 長文読解 | 2 | e-vocab, e-struct |

## 4. 問題データ（3教科共通スキーマ）

```js
(function () {
  'use strict';
  const R = String.raw;
  JK.registerProblems([
    {
      id: 'm-mid-calc2-01',            // 全体で一意。命名: <教科頭文字>-<level>-<単元略>-<連番>
      subject: 'math',                 // 'math' | 'physics' | 'english'
      level: 'mid',                    // 'basic' | 'mid' | 'adv' | 'drill'
      unit: 'm-calc2',                 // §3 の単元 ID
      title: '3次関数の極値と接線',      // 一覧に出る短い見出し（20字以内）
      source: { univ: 'オリジナル' },    // 出典。成蹊類題は {univ:'成蹊大学', faculty:'理工学部', year:2024, no:'第2問', kind:'類題'}
      time: 12,                        // 目安時間（分）
      body: R`関数 $f(x) = x^{3} - 3x^{2} - 9x + 5$ について、次の問いに答えよ。`,
      fig: null,                       // 任意: SVG 文字列（物理の図など）
      passage: null,                   // 任意: 英語長文の passage id（§5）
      parts: [                         // 設問。1問でも配列。各設問ごとに自動採点
        { label: '(1)', q: R`極大値を求めよ。`, type: 'num', answer: 10 },
        { label: '(2)', q: R`極小値を求めよ。`, type: 'num', answer: -22 },
        { label: '(3)', q: R`$x = 1$ における接線の方程式 $y = \boxed{\ \ }$ を求めよ。`, type: 'expr', answer: '-12x+6', vars: ['x'] }
      ],
      solution: [                      // 解説ステップ（§6）。必須・省略禁止
        { t: '導関数を求める', m: R`f'(x) = 3x^{2} - 6x - 9 = 3(x+1)(x-3)`, n: R`$f'(x)=0$ となるのは $x=-1,\,3$ です。` },
        { t: '増減を調べる', n: R`$x<-1$ で増加、$-1<x<3$ で減少、$x>3$ で増加。よって $x=-1$ で極大、$x=3$ で極小。`, lv: 2 },
        { t: '極値', m: [R`f(-1) = -1 - 3 + 9 + 5 = 10`, R`f(3) = 27 - 27 - 27 + 5 = -22`] },
        { t: '接線', m: R`y - f(1) = f'(1)(x-1) \;\Rightarrow\; y = -12x + 6`, n: R`$f(1)=-6,\ f'(1)=-12$ を代入します。` }
      ],
      prereq: ['m-quad', 'm-expr'],    // 任意: この問題固有の前提単元（省略時は単元の prereq）
      tags: ['増減表', '接線']           // 任意
    }
  ]);
})();
```

### 設問タイプ（`parts[i].type`）

| type | フィールド | 採点 |
|---|---|---|
| `num` | `answer: Number`、任意 `rel`（相対許容誤差。物理は `0.02` 目安）、`tol`（絶対許容誤差）、`unit: 'm/s'`（表示用）、`show: R\`\frac{3}{2}\``（正解表示用 TeX） | 入力は数式として評価（`3/4`, `2√3`, `sqrt(2)`, `π/3`, `1.5e-3`, `2^10` 可）。許容: `rel` / `tol` を付けたら `|差| ≤ max(tol, rel·|answer|)`、付けなければ `|差| ≤ 5e-4·|answer|`（どちらも丸め誤差ぶんのごく小さい余裕つき。余裕は答えの大きさに比例するので、$3.3 \times 10^{-19}$ のような小さい答えでも 0 や 2 倍の値は不正解になる） |
| `expr` | `answer: 'x^2-2x+3'`、`vars: ['x']`、任意 `show` | 変数に乱数を代入して数値的に等価判定。`2x+1` `1+2x` `(4x+2)/2` いずれも正解 |
| `choice` | `choices: [..]`（リッチテキスト、または `{t:'説明', fig:'<svg..>'}`）、`answer: 0始まりの添字` | 単一選択 |
| `multi` | `choices: [..]`、`answer: [0,2]` | 複数選択の完全一致 |
| `text` | `answer: 'word'` または `['a','b']`（許容解の列挙） | 前後空白・全角半角・大文字小文字・末尾ピリオドを正規化して一致 |
| `order` | `words: ['to','want','I','go']`（表示順=シャッフル済み）、`answer: 'I want to go'` | 並べた語を空白連結して一致 |

共通の任意フィールド: `label`（'(1)' 'ア' など）、`q`（設問文）、`explain`（その設問の解説。英語の選択問題では必須）、`hint`（入力例。`num` / `expr` / `text` の入力欄の下に表示）。

`hint` の入力例は **正解と違う値** で書く（書き方だけを示す。例: 答えが $\frac{25}{4}$ なら `例: 3/4 や 0.75`）。入力例をそのまま入力して正解になる `hint` は validator がエラーにし、画面にも表示しない（判定は `JK.check.hintLeak(part)`。`hint` の中の式・語を取り出して採点する。「小数第 3 位」「2 桁」のような数は対象外）。乱数演習（`exercise`）の入力例は固定の値なので、答えになりにくい値を使う。

設計上の注意:
- 答えは機械採点できる形に分解する。範囲 `1 < a < 3` は「下限」「上限」の2設問に分ける。記述・証明は「結論の数値/式」を問う形にする。
- `expr` の式構文: `+ - * / ^ ( )`、省略乗算（`2x`, `3√2`, `(x+1)(x-1)`）、`sqrt() sin() cos() tan() log()(自然対数) ln() exp() abs()`、定数 `pi`/`π`/`e`。変数は1文字。
- 無理数・分数の答えは `answer` に JS の数値（`Math.sqrt(3)/2`、`2/3`）を書き、`show` に TeX を付ける。
- 物理は有効数字 2〜3 桁の数値を答えさせ、`rel: 0.02`〜`0.03` と `unit` を付ける。問題文に使用する定数（$g = 9.8\,\mathrm{m/s^2}$ など）を明記する。
- `solution` は最低 3 ステップ（drill は 2 ステップ可）。途中式を省かない。

### `source` の書き方

- 自作: `{ univ: 'オリジナル' }`
- 大学過去問準拠の類題: `{ univ: '成蹊大学', faculty: '理工学部', year: 2024, no: '第1問[1]', kind: '類題' }`
- 後から本物の過去問を足す場合: `kind: '過去問'`（ユーザー自身が追加する用途）

### レベルの目安

| level | 想定 | 難易度 |
|---|---|---|
| `basic` | 共通テスト/基礎（志望偏差値 50 未満） | 教科書章末〜共通テスト標準。1問 3〜8 分 |
| `mid` | 中堅大（50〜60）例: 成蹊・日東駒専〜GMARCH下位 | 入試標準。誘導つき大問。1問 8〜15 分 |
| `adv` | 難関大（60 以上）例: 早慶・旧帝 | 入試やや難。複数単元融合。1問 15〜25 分 |
| `drill` | 復習ドリル（前提範囲の基礎演習） | 基礎確認の一問一答。1問 1〜3 分 |

## 5. 英語長文（passage）

```js
JK.registerPassages([
  {
    id: 'ep-mid-01',
    title: 'Why We Sleep',
    level: 'mid',
    topic: '科学・健康',
    source: { univ: 'オリジナル' },
    paras: [                                  // 段落 → 文。文単位の対訳が和訳ツールの翻訳メモリになる
      [
        { en: R`Most people spend about a third of their lives {b1:asleep}.`, ja: 'ほとんどの人は人生のおよそ3分の1を眠って過ごす。' },
        { en: R`{u2:This simple fact} has puzzled scientists for centuries.`, ja: 'この単純な事実は何世紀にもわたって科学者を悩ませてきた。' }
      ]
    ],
    vocab: ['spend', 'puzzle', 'century'],     // 重要語（辞書にあれば辞書の語義、なければ vocabExtra）
    vocabExtra: [ ['asleep', '形', '眠って', 1] ]  // 辞書形式（§9）で追加登録
  }
]);
```

- `{bN:語}` = 空所 N（演習表示では `( N )`、正解の語は `語`）。`{uN:語句}` = 下線部 N。和訳ツール側では印を外した完全な英文として扱う。
- 1 文 = 1 オブジェクト。`ja` は自然で正確な日本語（直訳調に寄せすぎない、だ・である体）。
- 英文は完全自作。語数目安: basic 150〜220 語、mid 250〜350 語、adv 350〜500 語。

長文問題は `passage: 'ep-mid-01'` を付けた問題（`unit: 'e-reading'`）で、空所補充・下線部の意味・内容一致などを `parts` に並べる。

## 6. 解説ステップ（steps）

計算機の途中式、物理の解法、過去問の `solution` はすべて同じ形式。

```js
{ t: '見出し（任意）',
  m: R`TeX`,            // ディスプレイ数式。文字列 or 文字列配列（1要素1行）
  n: R`標準の説明（リッチテキスト）`,
  easy: R`未習者向けの噛み砕き（図的イメージ・たとえ・用語の定義）`,   // 任意
  pro: R`既習者向けの一言（入試での定石・時短・別解）`,             // 任意
  fig: '<svg…>',        // 任意
  lv: 1 }               // 粒度: 1=常に表示（既定）/ 2=標準と「やさしく」で表示 / 3=「やさしく」のみ表示
```

`m` `n` の少なくとも一方が必須。

### 学年別パーソナライズ（depth）

表示モード `depth` は「ユーザーの学年」と「単元の grade」から自動決定（ユーザーが手動切替も可）:

| 条件 | depth | 表示 |
|---|---|---|
| 学年 < 単元 grade（未習） | `easy` | 全ステップ（lv 1〜3）+ 各ステップの `easy` + 冒頭の `intro.easy`。公式を天下りに使わず「なぜそうなるか」を図・イメージで説明 |
| 学年 = 単元 grade | `normal` | lv 1〜2 のステップ + `n` |
| 学年 > 単元 grade（既習） | `pro` | lv 1 のステップ + `n` + `pro` |

**書き方の基準**（計算機・シミュレーター担当は必須）:
- `easy`: その単元を習っていない高1・高2が読んで理解できること。専門用語は初出で定義する。「グラフでいうと〜」「〜と同じ考え方」のようにイメージを添える。公式は「何を表すか」を言葉で言い直してから使う。
- `lv: 3` ステップ: 「そもそも微分とは」「なぜ平方完成するのか」のような前提の導入、分数計算など細かい計算の展開。
- `pro`: 「共通テストでは軸の位置で場合分けが定番」のような実戦コメント。
- 数値を代入する前に必ず文字式の公式を示す（`m` を2行にする等）。
- 問題・演習の解説では、**各設問の答えを出す式のステップを `lv: 1`** にする（補足・検算は `lv: 2`、前提の導入は `lv: 3`）。画面（`JK.steps.render(steps, depth, parts)`）は、数値の答えが表示中のステップに出てこないとき、その値が出てくる隠れたステップも表示に加えるが、もとから `lv: 1` にしておく。
- 数値を代入した式は、**表示されている数値どうしを計算すると表示の結果になる**ように書く。丸めた途中の値を次の式に代入して `0.25 \times 13.9 = 3.46`（計算すると 3.48）のようにしない。問題文の数値だけを代入した式にするか、途中の値を必要な桁まで表示する。

## 7. 共通基盤 API（`js/core/`、リード実装）

### `JK` 登録関数

`JK.registerProblems(arr)` / `JK.registerPassages(arr)` / `JK.registerCalc(def)` / `JK.registerSim(def)` / `JK.registerDict(arr)` / `JK.registerIdioms(arr)` / `JK.registerGrammar(arr)`

### `JK.Q` — 有理数（厳密計算用）

```js
const q = JK.Q(3, 4);          // 3/4（自動で約分・分母正）。JK.Q(5) = 5
JK.Q.from('3/4'); JK.Q.from(0.75); JK.Q.from('-1.5');   // 文字列・小数から。失敗時 null
q.add(r) q.sub(r) q.mul(r) q.div(r) q.neg() q.inv() q.abs() q.pow(n /*整数*/)   // 引数は Q か整数
q.eq(r) q.cmp(r) /* -1,0,1 */ q.sign() q.isInt() q.isZero()
q.n  q.d                       // 分子・分母（整数）
q.val()                        // Number
q.tex()                        // '\frac{3}{4}' / '-\frac{3}{4}' / '5'
q.toString()                   // '3/4'
```

### `JK.poly` — 1変数多項式（係数は Q の配列、**添字 = 次数**の昇順）

```js
JK.poly.parse('x^3 - 3x^2 + 2', 'x')   // → [Q(2), Q(0), Q(-3), Q(1)]。`(x-1)(x+2)^2` や `1/2x^2` も可。失敗時 throw JK.CalcError
JK.poly.of([2, 0, -3, 1])              // 数値配列（昇順）→ Q 配列
JK.poly.deg(p)  JK.poly.add(p,q)  JK.poly.sub(p,q)  JK.poly.mul(p,q)  JK.poly.scale(p, k)
JK.poly.deriv(p)  JK.poly.integ(p)     // integ は積分定数 0
JK.poly.eval(p, x)                     // x が Q なら Q、Number なら Number
JK.poly.divmod(p, d)                   // → { q, r }
JK.poly.tex(p, 'x')                    // 'x^{3} - 3x^{2} + 2'（降べき、係数1省略、分数係数は \frac）
JK.poly.rationalRoots(p)               // 有理数解（Q の配列、重複なし）
JK.poly.fn(p)                          // x => Number（グラフ用）
```

### `JK.util`

```js
JK.util.gcd(a,b)  JK.util.lcm(a,b)  JK.util.fact(n)  JK.util.nCr(n,r)  JK.util.nPr(n,r)
JK.util.primeFactors(n)          // [[p,e],...]
JK.util.sqrtSimplify(n)          // 整数 n → { out, in }  (√n = out·√in)
JK.util.sqrtTex(n)               // 整数 or Q → '2\sqrt{3}' / '\frac{\sqrt{6}}{3}' / '4'
JK.util.fmt(x, digits)           // Number → 表示用文字列（既定小数4桁・末尾0除去・整数はそのまま）。TeX としても使える
JK.util.sig(x, n)                // 有効数字 n 桁の TeX（'3.0', '1.2 \times 10^{-3}'）。丸めは roundSig と同じ
JK.util.roundSig(x, n)           // 有効数字 n 桁に四捨五入した Number（15.75 → 15.8。2 進数の誤差で 15.7 にならない）。設問の答えに使う
JK.util.round(x, d)              // 小数 d 桁に丸めた Number
JK.util.signed(texOrQ)           // 連結用の符号付き項: Q(3)→'+ 3', Q(-2)→'- 2'
JK.util.paren(q)                 // 代入表示用: 負なら '(-3)'、正なら '3'（Q or Number）
JK.util.parseNum(str)            // 数式文字列 → Number（'2√3', '3/4', 'π/6' 可）。失敗時 NaN
JK.util.exactTrig(deg)           // 15°刻みの角 → { sin, cos, tan }（各 TeX、tan が定義されない場合は null）。それ以外は null
JK.util.rng(seed)                // 乱数: r.int(a,b) r.pick(arr) r.float(a,b) r.shuffle(arr)
JK.util.esc(str)                 // HTML エスケープ
JK.util.h(tag, attrs, children)  // DOM 生成（UI を書く担当のみ）
JK.CalcError                     // new JK.CalcError('a は 0 以外を入力してください') — 入力不正時に throw
```

### `JK.tex` / `JK.rich` / `JK.steps`

```js
JK.tex.render(texStr, display /*bool*/)  // TeX → HTML 文字列
JK.rich(str)                             // リッチテキスト → HTML 文字列
JK.steps.render(steps, depth, parts)     // steps → HTML 文字列。parts（設問の配列）は任意: 渡すと、数値の答えを出しているステップを lv にかかわらず表示する
JK.steps.filter(steps, depth, parts)     // 表示するステップの配列（render と同じ選び方）
```

### `JK.plot` — SVG 生成（文字列を返す。DOM 不要）

**関数グラフ**

```js
JK.plot.graph({
  w: 340, h: 240,
  x: [-3, 5], y: [-6, 6],               // y 省略で自動スケール
  equal: false,                          // true で縦横等倍（円・2次曲線）
  curves: [{ f: x => x*x - 4*x + 1, cls: 'c1', dash: false, domain: [0, 4] }],
  param:  [{ x: t => 3*Math.cos(t), y: t => 2*Math.sin(t), t: [0, 2*Math.PI], cls: 'c2' }],
  fills:  [{ f: x => x*x, g: x => x + 2, from: -1, to: 2, cls: 'f1' }],   // f と g(既定0) の間を塗る
  points: [{ x: 2, y: -3, label: '頂点(2,-3)', cls: 'c3', pos: 'br' }],     // pos: tr|tl|br|bl
  vlines: [{ x: 2, label: 'x=2', dash: true }],
  hlines: [{ y: 1, dash: true }],
  segs:   [{ x1: 0, y1: 0, x2: 3, y2: 2, cls: 'c2', arrow: true, dash: false, label: 'a' }],
  labels: [{ x: 1, y: 4, text: 'y = f(x)', cls: 'c1' }],
  axis: ['x', 'y'], grid: true
}) // → '<svg ...>...</svg>'
```

**自由図形**（物理の図・回路・幾何）。座標は px、y は下向き。

```js
const d = JK.plot.draw(360, 220);          // 幅・高さ（viewBox）
d.line(x1,y1,x2,y2,{cls:'fg', dash:false, w:1.5});
d.arrow(x1,y1,x2,y2,{cls:'c1', label:'F', w:2});       // ベクトル矢印（ラベルは先端付近）
d.rect(x,y,w,h,{cls:'fg', fill:'f1', rx:2, rot:30, ox:cx, oy:cy});   // rot は (ox,oy) 中心の回転角[deg]
d.circle(cx,cy,r,{cls:'fg', fill:'f2'});
d.poly([[x,y],...],{cls:'fg', fill:'f0', close:true});
d.path('M10 10 L 50 50',{cls:'c2', fill:null});
d.text(x,y,'m = 2.0 kg',{cls:'fg', size:12, anchor:'middle', italic:false});
d.arc(cx,cy,r,a0,a1,{cls:'c3'});           // 角度は度。x 軸正方向から反時計回り（画面上）
d.angle(cx,cy,r,a0,a1,'θ',{cls:'c3'});     // 弧 + ラベル
d.hatch(x1,y1,x2,y2,{side:1});             // 床・壁（線分 + ハッチング。side=±1 でハッチ側）
d.spring(x1,y1,x2,y2,{n:8, amp:6, cls:'fg'});
d.resistor(x1,y1,x2,y2,{label:'R₁'});      // 抵抗（長方形）
d.battery(x1,y1,x2,y2,{label:'E'});        // 電池（長い線が＋極 = (x1,y1) 側）
d.capacitor(x1,y1,x2,y2,{label:'C'});
d.coil(x1,y1,x2,y2,{label:'L', n:5});
d.acsource(cx,cy,r,{label:'~'});           // 交流電源
d.meter(cx,cy,r,'A');                      // 電流計 A / 電圧計 V
d.wire([[x,y],[x,y],...]);                 // 導線（折れ線）
d.dot(x,y,{cls:'fg', r:3});                // 接続点・質点
d.group(svgString);                        // 生の SVG 片を追加
d.svg();                                   // → '<svg ...>...</svg>'
```

- 色は **クラス指定のみ**（テーマ切替に追従）。線: `fg`（標準）`dim`（補助）`c1`（シアン）`c2`（紫）`c3`（アンバー）`c4`（グリーン）。塗り: `f0`（面）`f1`〜`f4`（各アクセントの半透明）。色コード直書き禁止。
- 文字に下付きが必要なら Unicode（`v₀`, `R₁`, `θ`）を使う。
- 図は横 320〜400px 想定。ラベルが重ならないよう配置。

## 8. 数学計算機（`JK.registerCalc`）

```js
JK.registerCalc({
  id: 'ia-quad-vertex',                 // 一意
  course: 'IA',                         // 'IA' | 'IIB' | 'IIIC'
  unit: 'm-quad',                       // §3
  group: '2次関数',                      // サイドバーのグループ名
  title: '平方完成・頂点・軸',
  desc: '2次関数を平方完成して頂点と軸を求めます。',
  form: R`y = ax^{2} + bx + c`,         // 入力の一般形（TeX）
  inputs: [
    { key: 'a', label: 'a', type: 'q', def: '1' },
    { key: 'b', label: 'b', type: 'q', def: '-4' },
    { key: 'c', label: 'c', type: 'q', def: '1' }
  ],
  examples: [ { label: '分数係数', v: { a: '1/2', b: '3', c: '-1' } } ],   // 任意: ワンクリック入力例
  intro: {                              // 冒頭の導入（リッチテキスト）。easy は必須
    easy: R`2次関数のグラフは放物線です。**平方完成**は式を $a(x-p)^{2}+q$ の形に直す変形で、…`,
    normal: R`…`, pro: R`…`             // 任意
  },
  compute(v, ctx) {                     // v: 型変換済みの入力。ctx = { grade: 1|2|3, depth: 'easy'|'normal'|'pro' }
    if (v.a.isZero()) throw new JK.CalcError('a は 0 以外を入力してください（2次関数にならないため）');
    return {
      result: [ { label: '頂点', tex: R`(2,\ -3)` }, { label: '軸', tex: R`x = 2` } ],
      steps: [ /* §6 */ ],
      fig: JK.plot.graph({ /* 任意 */ })
    };
  }
});
```

入力 `type`: `q`（有理数 → `JK.Q`。`3/4` `0.75` `-2` を受理）/ `num`（実数 → Number。数式可）/ `int`（整数 → Number）/ `select`（`options: [['値','表示'],...]` → 値文字列）/ `list`（カンマ・空白区切りの数値列 → Number[]）/ `text`（文字列そのまま）/ `poly`（多項式文字列 → `JK.poly` の Q 配列。`var: 'x'` 指定可）。
任意: `min` `max`（num/int/q の範囲検証）、`hint`（入力欄の下の補足）、`unit`、`show: v => bool`（他入力に応じて表示切替）。

要件:
- `compute` は純関数（DOM・乱数・日時を使わない）。同じ入力に同じ出力。
- **結果だけでなく全途中式**。「公式 → 代入 → 計算 → 結論」を 1 行ずつ。暗算で飛ばさない。
- 分数・根号は可能な限り厳密値（`JK.Q`, `sqrtTex`）で示し、必要なら近似値を併記。
- 不正入力・定義されない場合は `JK.CalcError` を日本語メッセージで throw。
- すべての calc に `intro.easy` と、`easy` を持つステップ 2 個以上、`lv` による粒度分けを入れる。
- グラフで理解が進む計算機には `fig` を付ける（頂点・接線・面積・領域・単位円・曲線など）。

## 9. 物理シミュレーター（`JK.registerSim`）

```js
JK.registerSim({
  id: 'mech-incline',
  field: '力学',                         // '力学' | '熱力学' | '波動' | '電磁気' | '原子'
  unit: 'p-eom',
  title: '斜面上の物体の運動方程式',
  desc: '…',
  form: [R`ma = mg\sin\theta - \mu' N`, R`N = mg\cos\theta`],   // 使う公式（TeX 配列）
  inputs: [ { key: 'm', label: '質量 m', unit: 'kg', type: 'num', def: '2.0', min: 0.1, max: 100 }, … ],
  intro: { easy: R`…` },
  compute(v, ctx) {                     // 数学計算機と同じ規約
    return { result: [ { label: '加速度 a', tex: R`2.9\,\mathrm{m/s^{2}}` } ], steps: [...], fig: d.svg() };
  },
  exercise(rng, level) {                // ブラウザ演習の自動生成。rng = JK.util.rng(seed)。level = 'basic'|'mid'|'adv'
    return {                            // §4 の問題と同じ形（id/subject/level/unit はエンジンが付与）
      title: '斜面をすべる物体',
      body: R`傾き $30\degree$ のなめらかな斜面上に質量 $2.0\,\mathrm{kg}$ の物体を…。重力加速度を $9.8\,\mathrm{m/s^{2}}$ とする。`,
      fig: '<svg…>',
      parts: [ { label: '(1)', q: R`加速度の大きさ`, type: 'num', answer: 4.9, rel: 0.02, unit: 'm/s²' } ],
      solution: [ /* steps */ ]
    };
  }
});
```

要件:
- `compute` の `fig` は入力値を反映した図（斜面角・回路構成・波形など）を必ず描く。
- `exercise` は**きりのよい数値**を乱数で選び、問題文・図・設問（1〜3 問）・解説ステップを生成。`level` で設問数や条件（摩擦の有無など）を変える。問題文に定数を明記。
  - 種を変えたとき、答えの組が **12 通り以上** 出るようにする（題材の制約があれば 8 通り以上）。
  - `answer` と解説の最終行の数値は **同じ値** にする。答えは `U.roundSig(x, 3)`、解説の表示は `U.sig(x, 3)` を通す（同じ丸め。15.75 のような半端は切り上げ）。`toPrecision` / `toFixed` を答えに使わない（2 進数の誤差で、半端な値が解説と 1 ずれる）。問題文で「$\sqrt{3} = 1.73$」「$\pi = 3.14$」のように値を指定したら、答えも解説もその値で計算する。画面は `JK.check.roundGap(ex)` でずれのある出題を検出して作り直すが、もとからずれない作りにしておく。
  - 解説は **その演習の設問の順・向き** で書く。計算機（`compute`）のステップを流用するときは、設問で求める量を既知として使っていないか、すべての設問の答えが式の結果として出てくるかを確かめ、足りないステップを足す。
  - 小さい値・大きい値の表示は丸めすぎない（0.0025 を `0.003`、0.0004 を `0` と表示しない。`U.sig` か指数表記を使う）。
  - 点検: `node tools/simcheck.js [simId] [種の数]`（通り数／答えと解説のずれ／解説に答えが出ない設問／式が合わない出題）、`node tools/exdump.js <simId> <level> <種>`（1 題の全文）。
- 解説は「図で状況把握 → 立式（公式名を明示）→ 代入 → 計算 → 単位つき結論」。有効数字 2〜3 桁。
- 単位は SI。`result[].tex` は単位つき。

## 10. 英語データ（辞書・熟語）

```js
JK.registerDict([
  // [見出し語(小文字・原形), 品詞, 語義(日本語。複数は '; ' 区切り), レベル]
  ['abandon', '動', '〜を捨てる; 〜を断念する', 2],
  ['ability', '名', '能力', 1]
]);
JK.registerIdioms([
  // [熟語, 意味, レベル]。`~` は任意の語句、`one's` は所有格、`oneself` は再帰代名詞、`do`/`doing` は動詞の原形/-ing を表す
  ['take ~ into account', '〜を考慮に入れる', 2],
  ['be good at ~', '〜が得意である', 1]
]);
```

- 品詞: `名` `動` `形` `副` `前` `接` `代` `助`（助動詞）`冠` `間` `数`。同じ語で品詞が違えば別エントリ。
- レベル: `0`=中学基本語・機能語（重要語リストには出さない）/ `1`=高校基礎 / `2`=共通テスト〜中堅大 / `3`=難関大。
- 語義は受験で問われる訳語を簡潔に（15 字程度まで×1〜3 個）。

## 11. 英語エンジン API（英語エンジン担当が提供）

```js
JK.en.lemmas(word)            // 活用形 → 原形候補の配列（'studied' → ['study'], 'better' → ['good','well']）
JK.en.lookup(word)            // → [{w, pos, ja, lv}]（原形化込み）。なければ []
JK.en.translate(text)         // → { sentences:[{en, ja, method:'exact'|'fuzzy'|'pattern'|'gloss', score, source, ref:{en,ja,title,score}|null, gloss:[{w,lemma,pos,ja}], grammar:[{name,explain}]}], vocab:[{w,pos,ja,lv}], idioms:[{phrase,ja,lv}] }
                              //   ref = 似た内蔵文があるのに、語が違うためエンジンの訳を出したときの参考（fuzzy は構文解析できない文・つづり誤りだけの文に限る）
JK.en.makeVocabQuiz({ words, level, count, seed })   // → §4 形式の問題配列（unit:'e-vocab', type:'choice' の4択）
JK.en.mount(el)               // 和訳ツール UI を el に描画（左: 英文入力 / 右: 和訳・重要語・文法）
```

単語クイズ回答時は `JK.hooks.vocabAnswered(word, ok)` を呼ぶ（学習ログ連携。リードが実装）。

## 12. UI 部品（UI を書く担当のみ）

CSS 変数: `--bg --panel --panel-2 --line --fg --dim --c1 --c2 --c3 --c4 --good --bad --warn`。色コード直書き禁止。
クラス: `.card` `.card-h`（見出し）/ `.row` `.col` `.grid2` / `.btn` `.btn.primary` `.btn.ghost` `.btn.sm` / `.inp`（input, textarea）`.sel` / `.chip`（`.on` で選択状態）/ `.badge`（`.b-basic` `.b-mid` `.b-adv` `.b-ok` `.b-ng` `.b-warn`）/ `.dim` `.small` `.mono` / `.tbl`。

## 13. 検証

```bash
node tools/validate.js js/data/exam-math-mid.js          # 指定ファイルを共通基盤に読み込んで検証
node tools/validate.js --all                              # index.html の読み込み順で全体検証
```

検証内容: スキーマ・必須項目・ID 重複・単元 ID の存在・設問タイプ別の解答整合・全テキストの TeX レンダリング（未対応コマンド検出）・制御文字混入・calc/sim の既定値と examples での実行・`exercise` の多数シード実行・SVG の整形式。
**エラー 0 になるまで修正してから完了報告する。** さらに数値解答は validator とは別に、担当者自身が node で独立に再計算して確認すること（validator は「正しさ」までは検証しない）。
