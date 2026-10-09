import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# She saved part of her salary every month → 給料の一部を貯めた（save + お金の名詞は 貯める）
rep("""    'make|money fortune|を|稼ぐ',""",
    """    'make|money fortune|を|稼ぐ', 'save|money salary income earnings wages allowance savings yen dollars|を|貯める',""")
rep("""      if (L === 'get' && oh === 'exercise' && !vg.passive) {""",
    """      if (L === 'save' && /^(?:part|half|some|most|much|all|portion|percent)$/.test(oh) && !vg.passive && T.slice(vg.idx + 1, objs[0].end).some((x) => x.k === 'w' && /^(?:salary|money|income|earnings|wages|allowance|pay|paycheck)$/.test(x.w))) sense = { particle: 'を', core: '貯める', tr: true };   // saved part of her salary → 給料の一部を貯めた
      if (L === 'get' && oh === 'exercise' && !vg.passive) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
