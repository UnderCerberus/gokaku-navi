import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# a researcher named Hermann Ebbinghaus → …という名前の研究者（「名前の研究者」を「名以前の研究者」にしない）
rep(""".replace(/前の(研究|調査|実験|報告)/g, '以前の$1');""",
    """.replace(/(?<!名)前の(研究|調査|実験|報告)/g, '以前の$1');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
