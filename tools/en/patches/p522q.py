import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# learn new ones later（ones = languages）→ 新しい言語 / the strongest species … but the ones that are most able → 種
#（ones は前の物の複数名詞を受ける。the ones who は人々）
rep("""      if ((t.w === 'one' || t.w === 'ones') && nmod > 0 && cnt === 0) { ja += 'もの'; head = 'one'; lastC = { lemma: 'one', e: null, form: 'base' }; j++; cnt++; break; }""",
    """      if ((t.w === 'one' || t.w === 'ones') && nmod > 0 && cnt === 0) { ja += (t.w === 'ones' && onesAnte(i)) || 'もの'; head = 'one'; lastC = { lemma: 'one', e: null, form: 'base' }; j++; cnt++; break; }""")
rep("""    if (t.w === 'the' && isW(T[i + 1], 'ones') && i + 2 <= lim) return postMod({ ja: 'もの', end: i + 2, pron: 'one', pl: true }, lim, o);""",
    """    if (t.w === 'the' && isW(T[i + 1], 'ones') && i + 2 <= lim) return postMod({ ja: isW(T[i + 2], 'who') ? '人々' : (onesAnte(i) || 'もの'), end: i + 2, pron: 'one', pl: true, an: isW(T[i + 2], 'who') }, lim, o);""")
rep("""  function mprepAt(i) {""",
    """  // ones の先行詞: 前のいちばん近い物の複数名詞の訳（人・時なら null）
  function onesAnte(i) {
    for (let x = i - 1; x >= 0; x--) {
      const t = T[x];
      if (!t || t.k !== 'w' || PRON[t.w]) continue;
      const c = cand(t, '名', ['pl']);
      if (!c || !c.e || (vc(t, ['3sg', 'past']) && !(T[x - 1] && T[x - 1].k === 'w' && (!!adjC(T[x - 1]) || DET[T[x - 1].w] !== undefined || isW(T[x - 1], 'of'))))) continue;
      if (isPerson(c) || PERSONS[c.lemma] || TIMEN[c.lemma]) return null;
      const jaA = en.jp.first(c.e.ja);
      return jaA && !/[;；〜]/.test(jaA) ? jaA : null;
    }
    return null;
  }
  function mprepAt(i) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
