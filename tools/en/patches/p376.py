import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/^(春|夏|秋|冬)に、/, '$1には、');"
assert s.count(old) == 1
s = s.replace(old, old + """
    if (tokens.some((x, q) => /^(?:was|were)$/.test(x.w || '') && tokens.slice(q + 1, q + 3).some((y) => y.w === 'happy')) && !tokens.some((x) => /^(?:with|together|life|lives|ever|marriage|childhood|family|days|time|times)$/.test(x.w || ''))) ja = ja.replace(/(とても|本当に|すごく|非常に)?幸せだった(?=。|$|が、|ので)/, (m0, a0) => (a0 || '') + 'うれしかった');   // my mother was very happy → 母はとてもうれしかった（出来事への反応）""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
