import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# raised dots → 盛り上がった点
rep("""      const adnPa = ({ fade: '色あせた',""",
    """      if (pp.lemma === 'raise') return { ja: /^(?:dot|dots|letter|letters|bump|bumps|line|lines|pattern|patterns|surface|area|areas)$/.test(nPa) ? '盛り上がった' : '上げた', end: i + 1 };   // small raised dots → 小さい盛り上がった点
      const adnPa = ({ fade: '色あせた',""")

rep("""    ja = ja.replace(/^(春|夏|秋|冬)に、/, '$1には、');""",
    """    ja = ja.replace(/^(春|夏|秋|冬)に、/, '$1には、');
    ja = ja.replace(/見られない人々/g, '目の見えない人々').replace(/見られない人(?=[のにはがを])/g, '目の見えない人').replace(/書くことの制度/g, '文字の体系').replace(/自分の視力/g, '視力').replace(/今までに一番(いい|良い|よい)/g, '今までで最高の').replace(/今までに一番/g, '今までで一番').replace(/は(?:とても)?すてきそうに見えなかった/, 'は見た目があまりよくなかった');   // people who cannot see → 目の見えない人々 / the best present ever → 今までで最高の贈り物""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
