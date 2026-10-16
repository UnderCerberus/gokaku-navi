import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# two hours later than he did yesterday（期間 + later のあとに than が続けば「2時間後に」にせず、p546w の比較で読む）
rep("""        if (n1.dur && isW(nx, 'later')) { st.time.push(n1.ja + '後に'); return n1.end + 1; }""",
    """        if (n1.dur && isW(nx, 'later') && !isW(T[n1.end + 1], 'than')) { st.time.push(n1.ja + '後に'); return n1.end + 1; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
