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
      else if (L === 'draw' && /(?:^| )(?:criticism|criticisms|complaints|protests|anger)$/.test(oh)) sense = { particle: 'を', core: '浴びる', tr: true };   // has drawn criticism → 批判を浴びた
      else if (L === 'draw' && /(?:^| )(?:attention|interest|crowd|crowds|visitors|tourists|people|fans|customers|support)$/.test(oh)) sense = { particle: 'を', core: '集める', tr: true };   // drew large crowds → 大勢の人を集めた""")

rep("""    ja = ja.replace(/^世論は(.+?)の上で分けられている/, '$1をめぐって世論が分かれている')""",
    """    ja = ja.replace(/^(.+?)への高まる(関心|需要|懸念|人気|興味)があった(。?)$/, '$1への$2が高まっている$3').replace(/^世論は(.+?)の上で分けられている/, '$1をめぐって世論が分かれている')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
