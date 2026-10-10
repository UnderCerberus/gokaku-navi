import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# He was patient with me / Be kind with your children → 私に対して忍耐強かった（態度の形容詞 + with + 人 → に対して。「と一緒に」にしない）
rep("""    if (--BUDGET < 0) return null;
    const m = mark();
    if (/^(?:under|over|above|below|at|from|after|until|by|before)$/.test(t.w) && seq(i + 1, ['the', 'age', 'of'])""",
    """    if (--BUDGET < 0) return null;
    const m = mark();
    if (t.w === 'with' && i > 0 && T[i - 1].k === 'w' && /^(?:patient|kind|gentle|strict|honest|polite|rude|friendly|generous|harsh|fair|nice|mean|cruel|frank|impatient|unkind|unfair|open)$/.test(T[i - 1].w) && i + 1 < lim) {
      const nAt = np(i + 1, lim, { noRel: true, noCoord: !!o.noCoord });
      if (nAt) return { ja: nAt.ja + 'に対して', adn: nAt.ja + 'に対する', end: nAt.end, kind: 'other', prep: 'with', obj: nAt };
      fail(m);
    }
    if (/^(?:under|over|above|below|at|from|after|until|by|before)$/.test(t.w) && seq(i + 1, ['the', 'age', 'of'])""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
