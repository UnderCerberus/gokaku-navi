import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# He gave up smoking: 目的語なしの熟語（give up）が節末まで読めず、目的語をとる同じ熟語（give up ~）があるなら、そちらを試す
rep("""      if (r) { useIdiom(it.it); name('idiom'); return r; }
    }
    return null;""",
    """      if (r && it.shape === 'fixed' && typeof r.end === 'number' && r.end < lim && !isP(T[r.end], ',') && list.some((x) => x.shape === 'obj' && x.lit.join(' ') === it.lit.join(' '))) { fail(m); continue; }   // gave up smoking → give up ~ で読む
      if (r) { useIdiom(it.it); name('idiom'); return r; }
    }
    return null;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
