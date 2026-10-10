import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# which weigh less than a coin → 硬貨より軽い / weighs more than his sister → 姉より重い（weigh + more / less than）
rep("""    // He turned 18 last week → 先週18歳になった（turn + 年齢の数）""",
    """    if (L === 'weigh' && !vg.passive && (isW(t, 'more') || isW(t, 'less')) && isW(T[i + 1], 'than') && i + 2 < lim) {
      const mWg = mark();
      const elWg = thanEllipsis(i + 2, lim, o.subj || null);
      const nWg = elWg ? null : np(i + 2, lim, { noRel: true });
      const eWg = elWg ? lim : (nWg ? tail(nWg.end, lim, st, o, vg) : -1);
      if ((elWg || nWg) && eWg === lim) { name('comparative'); return done(vg, P((elWg || nWg.ja) + 'より' + (isW(t, 'less') ? '軽い' : '重い'), 'i'), st, lim, 'SVC', o, [], { noStative: true }); }
      fail(mWg);
    }
    // He turned 18 last week → 先週18歳になった（turn + 年齢の数）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
