import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# hearing nothing but my own breathing → 自分自身の呼吸 / I heard my breathing → 私の呼吸（所有格 (+ own) + 名詞の語がない -ing は動名詞の名詞。「する」名詞なら「する」を取る）
rep("""    if (t.k === 'q') return t.speech ? null : { ja: t.ja, end: i + 1, quote: true };      // 語句の引用（"…" を 1 語にまとめたもの）。発言は動詞の枠で読む""",
    """    if (t.k === 'q') return t.speech ? null : { ja: t.ja, end: i + 1, quote: true };      // 語句の引用（"…" を 1 語にまとめたもの）。発言は動詞の枠で読む
    if (t.k === 'w' && /^(?:my|your|his|her|our|their)$/.test(t.w)) {
      const kGo = isW(T[i + 1], 'own') ? i + 2 : i + 1;
      const tGo = T[kGo];
      if (tGo && kGo < lim && tGo.k === 'w' && !!vc(tGo, ['ing']) && !nounC(tGo) && !adjC(tGo) && (kGo + 1 >= lim || T[kGo + 1].k === 'p' || !!PREP[T[kGo + 1].w] || /^(?:and|or|but|is|was|are|were)$/.test(T[kGo + 1].w))) {
        const cGo = vc(tGo, ['ing']);
        const coreGo = cGo && cGo.e ? verbSense(cGo.e, true).core : '';
        if (/^[一-龯ァ-ヶー]+する$/.test(coreGo)) {
          pick(kGo, cGo.e);
          const POSG = { my: '私の', your: 'あなたの', his: '彼の', her: '彼女の', our: '私たちの', their: '彼らの' };
          return { ja: (kGo > i + 1 ? '自分自身の' : POSG[t.w]) + coreGo.replace(/する$/, ''), end: kGo + 1, head: tGo.w, gerund: false };
        }
      }
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
