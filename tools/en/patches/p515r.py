import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) after his death → 彼の死後
rep("""      case 'until': case 'till': case 'before': case 'after':
""", """      case 'until': case 'till': case 'before': case 'after':
        if (key === 'after' && /死$/.test(n) && obj.head === 'death') return R(n + '後', 'time', n + '後の');   // after his death → 彼の死後
""")

# 2) …until after his death, when his works began to sell … → …。それは〜ときだった（時を表す句のあとの , when も非制限）
rep("""T[q - 2] && (isW(T[q - 2], 'ago') || isW(T[q - 2], 'later') || isW(T[q - 2], 'before') || T[q - 2].k === 'num'));""",
    """T[q - 2] && (isW(T[q - 2], 'ago') || isW(T[q - 2], 'later') || isW(T[q - 2], 'before') || T[q - 2].k === 'num' || (/^(?:death|birth|war|midnight|retirement|graduation|marriage|childhood|youth|1[0-9]{3}s|20[0-9]0s)$/.test(T[q - 2].w || '') && T.slice(Math.max(0, q - 6), q - 2).some((y) => y.k === 'w' && /^(?:after|before|until|till|during|since|in|at)$/.test(y.w)))));""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
