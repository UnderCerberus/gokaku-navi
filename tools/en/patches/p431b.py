import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };""",
    """      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };
      else if (L === 'determine' && /(?:^| )(?:cause|causes|reason|reasons|origin|origins|source|location|identity|age)$/.test(oh)) sense = { particle: 'を', core: '突き止める', tr: true };   // determine the cause of the disease → 病気の原因を突き止める""")

rep("""    ja = ja.replace(/([^、。]{1,6})として辞職/g, '$1を辞任')""",
    """    ja = ja.replace(/^(.+?)に(.+?)の高まる(必要性|需要|関心|懸念)がある(。?)$/, '$1では$2の$3が高まっている$4').replace(/^(.+?)の高まる(必要性|需要|関心|懸念)がある(。?)$/, '$1の$2が高まっている$3').replace(/([0-9０-９]+)番目の記念日/g, '$1周年').replace(/決定は(.*?)行われた/, '決定は$1下された');   // There is a growing need for skilled workers in the IT industry → IT業界では…の必要性が高まっている / the 100th anniversary → 100周年
    if (tokens.some((x, q) => x.w === 'access' && tokens[q + 1] && tokens[q + 1].w === 'to')) ja = ja.replace(/への接近/g, 'を利用できること');   // Access to clean water → きれいな水を利用できること
    ja = ja.replace(/([^、。]{1,6})として辞職/g, '$1を辞任')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
