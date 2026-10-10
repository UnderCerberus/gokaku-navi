import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# All through the interview, I kept worrying … → 面接の間ずっと、私は…（文頭の all through 句も前置きの前置詞句として読む）
rep("""      if (k < 0 && T[a].k === 'w' && (PREP[T[a].w] || mprepAt(a) || seq(a, ['rather', 'than'])) && T[a].w !== 'to') {""",
    """      if (k < 0 && T[a].k === 'w' && (PREP[T[a].w] || mprepAt(a) || seq(a, ['rather', 'than']) || seq(a, ['all', 'through'])) && T[a].w !== 'to') {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
