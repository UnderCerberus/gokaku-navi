import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# how dangerous the sea could be → 海がどれほど危険になりうるか（how + 形容詞の空所 + can / could be は可能性。能力の「できる」にしない）
rep("""    switch (modal) {
      case 'can':
        if (vg.perfect) { p = P(p.form('past') + 'はずがない', 'i'); neg = false; past = false; }""",
    """    const uruAdj = vg.lemma === 'be' && !vg.passive && !vg.prog && !vg.perfect && !verbal(p) && !neg && !o.subjunctive && !o.wish && o.gap && o.gap.type === 'adj' && /^(?:can|could)$/.test(modal);
    if (uruAdj) { p = P(p.cls === 'i' ? p.plain().replace(/い$/, 'く') + 'なりうる' : p.plain().replace(/(?:だ|である|な)$/, '') + 'になりうる', 'fix'); past = false; }
    switch (uruAdj ? '' : modal) {
      case 'can':
        if (vg.perfect) { p = P(p.form('past') + 'はずがない', 'i'); neg = false; past = false; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
