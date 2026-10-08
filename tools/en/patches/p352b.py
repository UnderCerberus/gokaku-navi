import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)
rep("""        return done(vg, P(body.replace(/だ$/, 'な') + (itLk ? 'ようだ' : 'ように見える'), itLk ? 'da' : 'v1'), st, lim, 'SVC', o, [], { noStative: true });""",
    """        return done(vg, P(body.replace(/だ$/, 'な') + (itLk ? 'ようだ' : (L === 'feel' ? 'ような気がする' : (L === 'sound' ? 'ように聞こえる' : 'ように見える'))), itLk ? 'da' : (L === 'feel' ? 'suru' : 'v1')), st, lim, 'SVC', o, [], { noStative: true });   // I feel like I am dreaming → 夢を見ているような気がする""")
rep("""    ja = ja.replace(/(練習|買い物|勉強|散歩|見学|観光|登山|調査|取材|応援)するために(行|来)/g, '$1しに$2');""",
    """    ja = ja.replace(/(練習|買い物|勉強|散歩|見学|観光|登山|調査|取材|応援)するために(行|来)/g, '$1しに$2').replace(/に親切でありたい/g, 'に親切にしたい').replace(/驚いていたが、幸せだった/, '驚いたが、うれしかった');""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
