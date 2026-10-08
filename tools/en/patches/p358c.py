import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Summer Festival at Green Park! → グリーン公園の夏祭り！（前置詞句つきの名詞句の断片・見出し）
rep("""        const nF = np(0, endF, {});
        if (nF && nF.end === endF && !nF.pron) return { ok: true, ja: nF.ja + (plF ? 'をお願いします。' : (isQF ? 'ですか。' : 'です。')), sp: '', names: ['fragment'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
        reset(tokens);""",
    """        const exF = !!tokens[b] && isP(tokens[b], '!');
        let nF = np(0, endF, {});
        if (!(nF && nF.end === endF)) { reset(tokens); nF = np(0, endF, { pp: true }); }
        if (nF && nF.end === endF && !nF.pron) return { ok: true, ja: nF.ja + (plF ? 'をお願いします。' : (isQF ? 'ですか。' : (exF ? '！' : 'です。'))), sp: '', names: ['fragment'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
        reset(tokens);""")

# Green Park → グリーン公園 / Central Station → セントラル駅（大文字の一般語 + 大文字の施設名）
rep("""      const mw = multiAt(j, lim);
      if (mw) {
        ja += (ja ? 'の' : '') + en.jp.first(mw.e.ja);""",
    """      const KATA_N = { green: 'グリーン', white: 'ホワイト', blue: 'ブルー', red: 'レッド', central: 'セントラル', north: 'ノース', south: 'サウス', east: 'イースト', west: 'ウエスト', river: 'リバー', lake: 'レイク', sunny: 'サニー', golden: 'ゴールデン', silver: 'シルバー', royal: 'ロイヤル', grand: 'グランド', ocean: 'オーシャン', maple: 'メープル', oak: 'オーク', pine: 'パイン', cherry: 'チェリー', rose: 'ローズ', star: 'スター', sun: 'サン', moon: 'ムーン', hill: 'ヒル', valley: 'バレー', forest: 'フォレスト', sky: 'スカイ', rainbow: 'レインボー', happy: 'ハッピー', lucky: 'ラッキー', new: 'ニュー', grace: 'グレース', liberty: 'リバティ', victoria: 'ビクトリア', city: 'シティ', harbor: 'ハーバー', bay: 'ベイ', park: 'パーク', main: 'メイン', spring: 'スプリング', maple: 'メープル', willow: 'ウィロー', cedar: 'シーダー', riverside: 'リバーサイド', lakeside: 'レイクサイド', seaside: 'シーサイド', hillside: 'ヒルサイド' };
      if (cnt === 0 && t.k === 'w' && KATA_N[t.w] && (t.cap || t.first) && j + 1 < lim && T[j + 1].k === 'w' && T[j + 1].cap && FACIL[T[j + 1].w] && !(t.first && !/^[A-Z]/.test(T[j + 1].s || ''))) {
        ja += KATA_N[t.w] + FACIL[T[j + 1].w]; pick(j + 1, { w: T[j + 1].w, pos: '名', ja: FACIL[T[j + 1].w], lv: 0 });
        lastC = { lemma: T[j + 1].w, e: null, form: 'base', proper: true }; head = T[j + 1].w; pl = false; an = false; time = false; prevProper = true; proper = true;
        j += 2; cnt++;
        continue;
      }
      const mw = multiAt(j, lim);
      if (mw) {
        ja += (ja ? 'の' : '') + en.jp.first(mw.e.ja);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
