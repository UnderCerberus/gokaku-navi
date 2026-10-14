import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# keeps temperatures high even after sunset → 日没後でさえ / before sunrise → 日の出前に（時の前置詞の sunset は「日没」。「夕日の後」にしない）
rep("""  function ppJa(key, obj, o) {
""",
    """  function ppJa(key, obj, o) {
    if (/^(?:after|before|until|till|by|at|since)$/.test(key) && obj.head === 'sunset' && /夕日$/.test(obj.ja || '')) obj = Object.assign({}, obj, { ja: obj.ja.replace(/夕日$/, '日没'), time: true });
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
