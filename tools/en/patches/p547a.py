import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# ran as hard as I could, hearing nothing but my own breathing → 自分の呼吸しか聞こえずに / hearing nothing → 何も聞こえずに
# （付帯状況の分詞が否定（nothing / しか）なら「〜ながら」ではなく「〜ずに」）
rep("""      if (g && verbal(g.pred)) { name('participle-const'); const ngr = g.parts.join('') + g.pred.form('stem') + 'ながら';""",
    """      if (g && verbal(g.pred)) { name('participle-const'); const negGr = !!g.neg || g.parts.some((x) => /(?:しか|^何も|^誰も)$/.test(x)); const ngr = g.parts.join('') + (negGr ? (g.pred.cls === 'suru' && /する$/.test(g.pred.s) ? g.pred.s.slice(0, -2) + 'せ' : g.pred.form('nai')) + 'ずに' : g.pred.form('stem') + 'ながら');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
