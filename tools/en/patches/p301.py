import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""  const PN = dic({ """, """  const PN = dic({ olympics: 'オリンピック', paralympics: 'パラリンピック', """)

# To achieve my dream → 夢をかなえるために
rep("""    if (usedGap && o.gap && o.gap.rel && !objs.length && !vg.passive) {""",
    """    if (objs.length === 1 && !vg.passive && /^(?:achieve|realize|realise|fulfill|fulfil)$/.test(L) && /(?:^| )(?:dream|dreams)$/.test(objs[0].head || '')) sense = { particle: 'を', core: 'かなえる', tr: true };   // To achieve my dream → 夢をかなえるために
    if (usedGap && o.gap && o.gap.rel && !objs.length && !vg.passive) {""")

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    if (tokens.some((x) => x.w === 'wanted') && tokens.some((x) => /^(?:have|has)$/.test(x.w || '')) && tokens.some((x) => x.w === 'since')) ja = ja.replace(/たい(?=。|$)/, 'たいとずっと思っている');   // I have wanted to be a nurse since I was little → 看護師になりたいとずっと思っている
    ja = ja.replace(/であることは(?:私の)?夢だった/, 'になることが夢だった').replace(/^私の夢を(かなえ|達成)/, '夢を$1').replace(/(オリンピック|パラリンピック|ワールドカップ)に(金メダル|メダル|銀メダル|銅メダル)を/, '$1で$2を');   // Being a scientist was my dream → 科学者になることが夢だった / win a gold medal at the Olympics → オリンピックで金メダルを
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
