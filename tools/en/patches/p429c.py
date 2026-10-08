import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    for (let p = a + 1; p < b; p++) {
      if (!verbStart(p)) continue;
      let s = p;""",
    """    for (let p = a + 1; p < b; p++) {
      if (!verbStart(p)) continue;
      // The decline in birth rates poses a problem（辞書の複合名詞 birth rate の 2 語目は、後ろに動詞があるなら動詞にしない）
      if (p - 1 > a && T[p - 1].k === 'w' && T[p].k === 'w' && !MODAL[T[p].w] && !BE[T[p].w] && (() => { const mw0 = multiAt(p - 1, b); return !!mw0 && mw0.len === 2; })() && T.slice(p + 1, b).some((x) => x.k === 'w' && !!vc(x, ['3sg', 'past']) && !vc(x, ['pp']) && !nounC(x))) continue;
      let s = p;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
