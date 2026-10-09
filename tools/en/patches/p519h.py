import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It happened hundreds of years ago / millions of years ago → 何百年も前に（hundreds of + 期間 + ago）
rep("""        if (n1.dur && isW(nx, 'ago')) { st.time.push(n1.ja + '前に'); return n1.end + 1; }""",
    """        if (n1.dur && isW(nx, 'ago')) { st.time.push(n1.ja + '前に'); return n1.end + 1; }
        if (bigQ && isW(nx, 'ago') && /^何(?:十|百|千|万|百万|千万|億|十億)(?:年|か月|週間|日)も$/.test(n1.ja || '')) { st.time.push(n1.ja.replace(/(年|か月|週間|日)も$/, '$1も') + '前に'); return n1.end + 1; }   // thousands of years ago → 何千年も前に""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
