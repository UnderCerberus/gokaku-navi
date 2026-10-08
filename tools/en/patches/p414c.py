import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    ja = ja.replace(/^今では、あらゆる年齢の人々は小さい子どもたちから高齢者まで活動に加わる/, """,
    """    ja = ja.replace(/^今では、あらゆる年齢の人々は小さい子どもたちから高齢者まで活動に(?:加わる|参加している)/, """)

rep("""&& !T.some((x, q) => x.w === 'more' && isW(T[q + 1], 'and') && isW(T[q + 2], 'more'))""",
    """&& !T.some((x, q) => (x.w === 'more' && isW(T[q + 1], 'and') && isW(T[q + 2], 'more')) || x.w === 'than')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
