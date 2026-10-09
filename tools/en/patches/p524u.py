import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# in the corner (of the room) → 部屋の隅に（in + corner は内側の「隅」。on / at the corner は「角」のまま）
rep("""  function ppJa(key, obj, o) {
""",
    """  function ppJa(key, obj, o) {
    if (key === 'in' && /^(?:corner|corners)$/.test(obj.head || '') && /角/.test(obj.ja || '')) obj = Object.assign({}, obj, { ja: obj.ja.replace(/角(?!.*角)/, '隅') });
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
