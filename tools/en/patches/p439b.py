import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""{ lead += ({ perhaps: 'たぶん', maybe: 'たぶん', probably: 'おそらく', hopefully: 'うまくいけば',""",
    """{ lead += ({ now: '今では', perhaps: 'たぶん', maybe: 'たぶん', probably: 'おそらく', hopefully: 'うまくいけば',""")

rep("""    if (tokens[0] && tokens[0].w === 'now' && !(tokens[1] && tokens[1].k === 'p')) ja = ja.replace(/^今(彼女|彼|私|私たち|彼ら|あなた)は/, '今では$1は');""",
    """    if (tokens[0] && tokens[0].w === 'now' && !(tokens[1] && tokens[1].k === 'p')) ja = ja.replace(/^今(彼女|彼|私|私たち|彼ら|あなた)は/, '今では$1は').replace(/^今(?!では|日|年|月|週|朝|夜|晩|度|後|すぐ|まで)([^、。]{1,8}?)は/, '今では$1は');   // Now the town attracts many tourists → 今では町は""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
