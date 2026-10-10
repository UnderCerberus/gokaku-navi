import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Less obviously, it can also raise blood pressure → それほど目立たないが、（文頭の less / more / most + 副詞 + コンマ）
rep("""'good point': 'いい指摘だね。', 'good idea': 'いい考えだね。', 'great idea': 'すばらしい考えだね。'""",
    """'good point': 'いい指摘だね。', 'good idea': 'いい考えだね。', 'great idea': 'すばらしい考えだね。', 'less obviously': 'それほど目立たないが', 'more surprisingly': 'さらに驚くべきことに', 'most surprisingly': '最も驚くべきことに', 'less surprisingly': '当然ながら', 'more seriously': 'さらに深刻なことに'""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
