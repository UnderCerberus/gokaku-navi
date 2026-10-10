import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# get thirty people together to film it / put all the clips together → 30人を集める・すべてのクリップをまとめる（動詞 + 目的語 + together。副詞のあとの to 不定詞も可）
rep("""      } else if (it.shape === 'obj' && n === 1 && !seq(i, it.lit) && !seq(i, ['not', 'so', 'much']) && /^(?:up|out|off|away|back|down|over|on|in|apart|free|around|round)$/.test(it.lit[0])) {""",
    """      } else if (it.shape === 'obj' && n === 1 && !seq(i, it.lit) && !seq(i, ['not', 'so', 'much']) && /^(?:up|out|off|away|back|down|over|on|in|apart|free|around|round|together)$/.test(it.lit[0])) {""")
rep("""        if (!a || a.end + 1 > lim || !(a.pron || a.end + 1 === lim || isP(T[a.end + 1], ',') || ppNext || advNext)) { fail(m); continue; }""",
    """        const infNext = !!a && a.end + 2 < lim && isW(T[a.end + 1], 'to') && !!vc(T[a.end + 2], ['base']);   // get thirty people together to film it
        if (!a || a.end + 1 > lim || !(a.pron || a.end + 1 === lim || isP(T[a.end + 1], ',') || ppNext || advNext || infNext)) { fail(m); continue; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
