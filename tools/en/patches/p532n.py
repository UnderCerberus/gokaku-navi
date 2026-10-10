import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# take the first step → 最初の一歩を踏み出す（単数の step。take steps to do は 措置を講じる のまま）
rep("""      if (vob) sense = { particle: vob.particle, core: vob.core, tr: true };
      else if (L === 'drive' && !vg.passive""",
    """      if (vob && L === 'take' && oh === 'step' && !objs[0].pl) sense = { particle: 'を', core: '踏み出す', tr: true };
      else if (vob) sense = { particle: vob.particle, core: vob.core, tr: true };
      else if (L === 'drive' && !vg.passive""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
