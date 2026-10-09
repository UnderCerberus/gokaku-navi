import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# develop poor eyesight → 視力が悪くなる（開発する にしない）
rep("""      else if (L === 'develop' && /(?:^| )(?:cancer|diabetes|disease|diseases|illness|illnesses|dementia|allergy|allergies|asthma|symptoms|infection|infections|depression|heart disease)$/.test(oh)) sense""",
    """      else if (L === 'develop' && /(?:^| )(?:eyesight|vision|myopia|nearsightedness)$/.test(oh) && !vg.passive) { sense = { particle: '', core: '視力が悪くなる', tr: true, noParticle: true }; objs[0] = Object.assign({}, objs[0], { ja: '' }); }
      else if (L === 'develop' && /(?:^| )(?:cancer|diabetes|disease|diseases|illness|illnesses|dementia|allergy|allergies|asthma|symptoms|infection|infections|depression|heart disease)$/.test(oh)) sense""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
