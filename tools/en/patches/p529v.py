import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It was the first time to meet him → 彼に会うのは初めてだった（for のない the first time to do。最初の時間 にしない）
rep("""    if (vg.lemma === 'be' && !vg.neg && seq(j, ['the', 'first', 'time']) && isW(T[j + 3], 'for') && j + 5 < b) {""",
    """    if (vg.lemma === 'be' && !vg.neg && seq(j, ['the', 'first', 'time', 'to']) && j + 4 < b && T[j + 4].k === 'w' && !!vc(T[j + 4], ['base'])) {
      const mF0 = mark();
      const infF0 = vpNonfin(j + 4, b, 'base', {});
      if (infF0 && infF0.end === b) { name('it-to'); return mkClause(null, done(vg, P('初めてだ', 'da'), st, b, 'SVC', o, [vpJoin(infF0, 'dict') + 'のは'], { noStative: true }), ''); }
      fail(mF0);
    }
    if (vg.lemma === 'be' && !vg.neg && seq(j, ['the', 'first', 'time']) && isW(T[j + 3], 'for') && j + 5 < b) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
