import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "ja = ja.replace(/(とても|本当に|すごく|非常に)?幸せだった(?=。|$|が、|ので)/, (m0, a0) => (a0 || '') + 'うれしかった');   // my mother was very happy → 母はとてもうれしかった（出来事への反応）"
assert s.count(old) == 1
s = s.replace(old, old + """
    if (tokens.some((x) => x.w === 'happy') && tokens.some((x, q) => x.w === 'those' && tokens[q + 1] && /^(?:days|years|times)$/.test(tokens[q + 1].w || ''))) ja = ja.replace(/当時うれしかった/, '当時は幸せだった');   // We were happy in those days → 当時は幸せだった
    if (tokens.some((x, q) => x.w === 'happy' && tokens[q + 1] && tokens[q + 1].w === 'with')) ja = ja.replace(/に幸せだった(?=。|$)/, 'に満足していた').replace(/に幸せだ(?=。|$)/, 'に満足している');   // She was happy with the result → 結果に満足していた""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
