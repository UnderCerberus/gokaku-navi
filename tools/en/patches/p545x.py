import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# needed to run the lights day and night → 昼も夜も照明をつけておくのに必要な（名詞のあとの day and night は複合名詞にしない。照明・機械の run は「つける・動かす」）
rep("""      const more = ppNext || (!!nx && nx.k === 'w' && !!multiAt(md.end, lim) && !PREP[nx.w]) ||""",
    """      const tphN = !!nx && md.end + 2 < lim && !!TIMEPH[T.slice(md.end, md.end + 3).map((x) => x.w || '').join(' ')] && isW(T[md.end + 1], 'and');
      const more = !tphN && (ppNext || (!!nx && nx.k === 'w' && !!multiAt(md.end, lim) && !PREP[nx.w])) ||""")
rep("""      else if (L === 'run' && /^(?:system|systems|network|networks|service|services|program|programs|website|site|server""",
    """      else if (L === 'run' && /^(?:light|lights|lamp|lamps|heater|heaters|air conditioner|air conditioners|fan|fans|pump|pumps)$/.test(oh)) sense = { particle: 'を', core: 'つけておく', tr: true };
      else if (L === 'run' && /^(?:machine|machines|engine|engines|motor|motors|generator|generators|factory|factories|computer|computers)$/.test(oh)) sense = { particle: 'を', core: '動かす', tr: true };
      else if (L === 'control' && /^(?:temperature|temperatures|light|humidity|heat|speed|volume|flow|pressure|level|levels|amount|brightness)$/.test(oh)) sense = { particle: 'を', core: '調節する', tr: true };
      else if (L === 'run' && /^(?:system|systems|network|networks|service|services|program|programs|website|site|server""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
