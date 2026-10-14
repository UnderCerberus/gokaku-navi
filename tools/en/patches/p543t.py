import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# This has important implications for how we treat animals → 私たちが動物をどのように扱うかに対して重要な意味を持つ（implications / consequences for は「〜に対して」。「〜かのために」にしない）
rep("""  function ppJa(key, obj, o) {
""",
    """  function ppJa(key, obj, o) {
    if (key === 'for' && T.some((x, q) => x.k === 'w' && /^(?:implication|implications|consequence|consequences)$/.test(x.w) && isW(T[q + 1], 'for'))) return { ja: obj.ja + 'に対して', kind: 'other', adn: obj.ja + 'に対する' };
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
