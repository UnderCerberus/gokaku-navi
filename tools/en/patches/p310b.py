import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep(""".replace(/\\bU\\.S\\.(?:A\\.)?/g, 'USA')""",
    """.replace(/\\bonce in a blue moon\\b/gi, 'bluemoonadv').replace(/\\bU\\.S\\.(?:A\\.)?/g, 'USA')""")
rep("""    const SURF = { wideadv: 'wide',""", """    const SURF = { bluemoonadv: 'once in a blue moon', wideadv: 'wide',""")
rep("""overthere: ['あそこに', 'p'], wideadv: ['大きく', 'm'],""", """overthere: ['あそこに', 'p'], wideadv: ['大きく', 'm'], bluemoonadv: ['ごくまれに', 'f'],""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
