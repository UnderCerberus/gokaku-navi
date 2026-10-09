import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# she began to appreciate the food she had eaten as a child → 自分が子どものころに食べた食べ物の良さが（関係詞節 + の でも 自分が）
rep("""(?:た|だ|る|ている|ていた|でいる|でいた|ない)[^、。をにがでへのとは]{1,10}(?:を|に|で|から|へ)$').test(x)""",
    """(?:た|だ|る|ている|ていた|でいる|でいた|ない)[^、。をにがでへのとは]{1,10}(?:を|に|で|から|へ|の)$').test(x)""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
