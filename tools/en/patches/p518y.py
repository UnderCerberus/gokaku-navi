import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# snap diff の見直し（第 513 組）
# 1) gave up smoking last year: 目的語なしの熟語のあとが ～ing・冠詞なしの名詞なら、目的語をとる熟語を先に
rep("""        if (i + n < lim && T[i + n].k === 'w' && (DET[T[i + n].w] !== undefined || (PRON[T[i + n].w] && !PRON[T[i + n].w].sub)) && !timeNx && list.some((x) => x.shape === 'obj' && x.lit.join(' ') === it.lit.join(' '))) continue;""",
    """        if (i + n < lim && T[i + n].k === 'w' && (DET[T[i + n].w] !== undefined || (PRON[T[i + n].w] && !PRON[T[i + n].w].sub) || ((!!vc(T[i + n], ['ing']) || (!!nounC(T[i + n]) && !PREP[T[i + n].w])) && !/^(?:today|tonight|tomorrow|yesterday|now|then|again|later|soon|early|late|home|here|there|together|once|twice|forever|immediately|completely|easily|quickly|altogether)$/.test(T[i + n].w))) && !timeNx && list.some((x) => x.shape === 'obj' && x.lit.join(' ') === it.lit.join(' '))) continue;""")

# 2) save money は 節約する のまま。給料・収入の一部と、save money for / to … は 貯める
rep("""'save|money salary income earnings wages allowance savings yen dollars|を|貯める',""",
    """'save|salary income earnings wages allowance|を|貯める',""")
rep("""      if (L === 'save' && /^(?:part|half|some|most|much|all|portion|percent)$/.test(oh)""",
    """      if (L === 'save' && oh === 'money' && !vg.passive && T[objs[0].end] && T[objs[0].end].k === 'w' && (isW(T[objs[0].end], 'for') || (isW(T[objs[0].end], 'to') && T[objs[0].end + 1] && !!vc(T[objs[0].end + 1], ['base'])))) sense = { particle: 'を', core: '貯める', tr: true };   // saved money for a new car → お金を貯めた
      if (L === 'save' && /^(?:part|half|some|most|much|all|portion|percent)$/.test(oh)""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
