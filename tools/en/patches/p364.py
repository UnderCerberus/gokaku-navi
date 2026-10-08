import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# More and more elderly people live alone → 一人で暮らしている高齢者がますます増えている
rep("""    else if (subjShown && (sj.an || /(?:都市|会社|企業|国|学校|町|店)$/.test(sj.ja)) && /^(?:より(?:少ない|多くの)|ますます多くの)/.test(sj.ja) && cl.pred""",
    """    else if (subjShown && (sj.an || /(?:都市|会社|企業|国|学校|町|店)$/.test(sj.ja)) && /^(?:より(?:少ない|多くの)|ますます(?:多くの)?)/.test(sj.ja) && cl.pred""")
rep("""      const restF = sj.ja.replace(/^(?:より(?:少ない|多くの)|ますます多くの)/, '');""",
    """      const restF = sj.ja.replace(/^(?:より(?:少ない|多くの)|ますます(?:多くの)?)/, '');""")

# save resources → 節約する
rep("""      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };""",
    """      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };
      else if (L === 'save' && /(?:^| )(?:resource|resources|energy|water|electricity|power|fuel|paper|gas|oil)$/.test(oh)) sense = { particle: 'を', core: '節約する', tr: true };   // Recycling helps save natural resources → 天然資源を節約する""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
