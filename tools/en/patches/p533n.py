import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# We must make sure that everyone is safe / help make sure that these journeys continue → みんなが安全であるようにする（make sure (that) + 節）
rep("""    // He turned 18 last week → 先週18歳になった（turn + 年齢の数）""",
    """    if (L === 'make' && !vg.passive && isW(t, 'sure') && i + 3 < lim && (isW(T[i + 1], 'that') || (T[i + 1].k === 'w' && ((PRON[T[i + 1].w] && PRON[T[i + 1].w].sub) || DET[T[i + 1].w] !== undefined || /^(?:everyone|everybody|someone|nobody|nothing|everything)$/.test(T[i + 1].w))))) {
      const mMs = mark();
      const tcMs = thatClause(i + 1, lim, vg.past);
      if (tcMs && tcMs.end === lim && !tcMs.both) { name('idiom'); return done(vg, P(tcMs.str.replace(/だろう$/, '').replace(/だ$/, 'である') + 'ようにする', 'suru'), st, lim, 'SVO', o, [], { noStative: true }); }
      fail(mMs);
    }
    // He turned 18 last week → 先週18歳になった（turn + 年齢の数）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
