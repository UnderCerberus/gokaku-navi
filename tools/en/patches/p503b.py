import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# thanked her friends for helping her prepare → 友達に、準備を手伝ってくれたことを感謝した（thank A for + 動名詞）
rep("""        const ja2 = it.ja.replace(/A/, '\\u0001').replace(/B/, '\\u0002').replace(a.ja ? '\\u0001' : /\\u0001(?:を|に|が|と|の)?/, a.ja).replace('\\u0002', b.ja);""",
    """        if (it.it && it.it.phrase === 'thank A for B' && b.gerund && /こと$/.test(b.ja || '') && a.ja) {
          const bTe = P(b.ja.replace(/こと$/, '')).form('te');
          r = done(vg, P(a.ja + 'に、' + bTe + 'くれたことを感謝する', 'suru'), st, tail(b.end, lim, st, o, vg), 'SVO', o, [], { noStative: true });
          if (r) { useIdiom(it.it); name('idiom'); return r; }
          fail(m); continue;
        }
        const ja2 = it.ja.replace(/A/, '\\u0001').replace(/B/, '\\u0002').replace(a.ja ? '\\u0001' : /\\u0001(?:を|に|が|と|の)?/, a.ja).replace('\\u0002', b.ja);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
