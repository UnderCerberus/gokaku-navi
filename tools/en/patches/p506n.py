import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Children are less likely to develop poor eyesight than those who stay indoors → 屋内にいる人々より視力が低下する可能性が低い
rep("""        if (e0 >= lim) continue;
        const v = vpNonfin(e0, lim, it.shape === 'do' ? 'base' : 'ing', { subj: sj });
        if (!v) { fail(m1); continue; }""",
    """        if (e0 >= lim) continue;
        if (degP && degP !== '最も' && it.it && it.it.phrase === 'be likely to do') {   // more / less likely to V … than NP
          const kTh = T.findIndex((x, q) => q > e0 + 1 && q < lim - 1 && isW(x, 'than'));
          if (kTh > 0) {
            const mTh = mark();
            const vTh = vpNonfin(e0, kTh, 'base', { subj: sj });
            const elTh = vTh && vTh.end === kTh ? thanEllipsis(kTh + 1, lim, sj) : null;
            const nTh = vTh && vTh.end === kTh && !elTh ? np(kTh + 1, lim, {}) : null;
            if (vTh && vTh.end === kTh && (elTh || (nTh && nTh.end === lim))) {
              useIdiom(it.it); name('idiom'); name('comparative');
              return fin(P(fillDo('〜する可能性が' + (lessP ? '低い' : '高い'), vTh), 'i'), lim, 'SVC', [(elTh || nTh.ja) + 'より']);
            }
            fail(mTh);
          }
        }
        const v = vpNonfin(e0, lim, it.shape === 'do' ? 'base' : 'ing', { subj: sj });
        if (!v) { fail(m1); continue; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
