import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# can make you do the same → あなたに同じことをさせる（do / did の目的語の the same は「同じこと」）
rep("""      const ELL = { next: '次のもの', last: '最後のもの', first: '最初のもの', same: '同じもの', latter: '後者', former: '前者' };""",
    """      const ELL = { next: '次のもの', last: '最後のもの', first: '最初のもの', same: i > 0 && T[i - 1].k === 'w' && /^(?:do|does|did|done|doing)$/.test(T[i - 1].w) ? '同じこと' : '同じもの', latter: '後者', former: '前者' };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
