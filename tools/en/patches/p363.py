import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Mt. Fuji is most beautiful in winter / This is most important → 最も〜（the のない most + 形容詞）
rep("""        if (!(k2 + 1 < lim && nounC(T[k2 + 1]) && !PREP[T[k2 + 1].w])) { sup = true; k = k2; }
      }""",
    """        if (!(k2 + 1 < lim && nounC(T[k2 + 1]) && !PREP[T[k2 + 1].w])) { sup = true; k = k2; }
      }
      else if (isW(T[k], 'most') && k + 1 < lim && adjC(T[k + 1]) && adjC(T[k + 1]).form === 'base' && !(k + 2 < lim && T[k + 2].k === 'w' && nounC(T[k + 2]) && !PREP[T[k + 2].w] && !ADV[T[k + 2].w])) { sup = true; k = k + 1; }   // Mt. Fuji is most beautiful in winter""")

# New Year's Day → 元日 / New Year's Eve → 大みそか
rep(""".replace(/\\bU\\.S\\.(?:A\\.)?/g, 'USA')""",
    """.replace(/\\bU\\.S\\.(?:A\\.)?/g, 'USA').replace(/\\bNew Year's Day\\b/g, 'Newyearsday').replace(/\\bnew year's day\\b/g, 'newyearsday').replace(/\\bNew Year's Eve\\b/g, 'Newyearseve').replace(/\\bnew year's eve\\b/g, 'newyearseve')""")
rep("""    const SURF = { rightnowadv: 'right now',""",
    """    const SURF = { newyearsday: "New Year's Day", newyearseve: "New Year's Eve", rightnowadv: 'right now',""")
rep("""  const PN = dic({ beidou: '北斗',""",
    """  const PN = dic({ newyearsday: '元日', newyearseve: '大みそか', beidou: '北斗',""")

# 冬で最も美しい → 冬が最も美しい / 時速〜で進める → 走れる / 紙を折りたたむ → 折る
rep("""    ja = ja.replace(/中国の万里の長城/g, '万里の長城');""",
    """    ja = ja.replace(/中国の万里の長城/g, '万里の長城');
    ja = ja.replace(/^([^、。]{1,12}?)は(春|夏|秋|冬|朝|夜|夕方)で最も/, '$1は$2が最も').replace(/(時速[^、。]+?)で進め(る|た)/, '$1で走れ$2').replace(/紙を折りたた(む|んだ|んで)/g, (m0, a0) => '紙を折' + ({ 'む': 'る', 'んだ': 'った', 'んで': 'って' })[a0]);   // Mt. Fuji is most beautiful in winter → 冬が最も美しい / origami → 紙を折る""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
