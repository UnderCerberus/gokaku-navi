import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I can be as patient with others as he was with me → 彼が私に対してそうだったのと同じくらい、他の人たちに対して忍耐強く / as patient as he was → 彼と同じくらい（as + 形容詞 (+ 前置詞句) + as + 代名詞 + be (+ 前置詞句) の省略）
rep("""      if ((isW(T[k], 'as') || (isW(T[k], 'so') && vg.neg)) && k + 3 < lim) {
        const a3 = adjC(T[k + 1]);""",
    """      if ((isW(T[k], 'as') || (isW(T[k], 'so') && vg.neg)) && k + 3 < lim && !!adjC(T[k + 1])) {
        const a4 = adjC(T[k + 1]);
        let k2 = k + 2, ppA = null;
        const mPa = mark();
        if (T[k2] && T[k2].k === 'w' && PREP[T[k2].w] && !isW(T[k2], 'as')) { ppA = parsePP(k2, lim, { noRel: true }); if (ppA && isW(T[ppA.end], 'as')) k2 = ppA.end; else { fail(mPa); ppA = null; } }
        if (isW(T[k2], 'as') && T[k2 + 1] && T[k2 + 1].k === 'w' && PRON[T[k2 + 1].w] && PRON[T[k2 + 1].w].sub && T[k2 + 2] && T[k2 + 2].k === 'w' && (!!BE[T[k2 + 2].w] || (!!DO[T[k2 + 2].w] && k2 + 3 === lim))) {
          let kE = k2 + 3, ppE = null;
          const mPe = mark();
          if (kE < lim && T[kE].k === 'w' && PREP[T[kE].w]) { ppE = parsePP(kE, lim, { noRel: true }); if (ppE && ppE.end === lim) kE = lim; else { fail(mPe); ppE = null; } }
          if (kE === lim) {
            const f4 = en.jp.adj(anim && a4.lemma === 'old' ? '年をとった' : a4.e.ja);
            pick(k + 1, a4.e);
            name('as-as');
            const pj = PRON[T[k2 + 1].w].ja || '';
            const ngA = vg.neg;
            const ppEj = ppE && ppA && ppE.prep === 'with' && ppE.obj && /に対して$/.test(ppA.ja) ? ppE.obj.ja + 'に対して' : (ppE ? ppE.ja : '');   // as he was with me → 彼が私に対して
            const cmpJ = ppE ? pj + 'が' + ppEj + 'そうだった' + (ngA ? 'ほど' : 'のと同じくらい') : pj + (ngA ? 'ほど' : 'と同じくらい');
            return fin(f4.pred, lim, 'SVC', [cmpJ].concat(ppA ? [ppA.ja] : []));
          }
        }
        fail(mPa);
      }
      if ((isW(T[k], 'as') || (isW(T[k], 'so') && vg.neg)) && k + 3 < lim) {
        const a3 = adjC(T[k + 1]);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
