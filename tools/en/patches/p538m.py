import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# plant trees along busy roads → 交通量の多い道路 / a school near a busy airport → 混雑した空港（場所の名詞の busy は「忙しい」にしない）
rep("""  const ADJN = COLL([
    'free|dessert desserts""",
    """  const ADJN = COLL([
    'busy|road roads highway highways intersection intersections street streets crossing crossings|交通量の多い',
    'busy|airport airports station stations port ports terminal terminals|混雑した',
    'busy|city cities town towns area areas district districts neighborhood neighborhoods market markets|にぎやかな',
    'free|dessert desserts""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
