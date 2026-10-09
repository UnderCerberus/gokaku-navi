import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# fail to keep their New Year's resolutions → 新年の抱負（決意 にしない）/ set (make) resolutions → 抱負を立てる
rep("""    if (nom.head === 'cause' && /原因$/.test(ja) && nom.end < lim && isW(T[nom.end], 'for')) ja = ja.replace(/原因$/, '理由');
""",
    """    if (nom.head === 'cause' && /原因$/.test(ja) && nom.end < lim && isW(T[nom.end], 'for')) ja = ja.replace(/原因$/, '理由');
    if (nom.head === 'resolution' && /決意$/.test(ja) && T.some((x, q) => isW(x, 'year') && isW(T[q - 1], 'new'))) ja = ja.replace(/決意$/, '抱負');   // New Year's resolutions → 新年の抱負
""")
rep("""      if (nx2.head === 'core' && /核心$/.test(nx2.ja) && /^(?:earth|planet|sun|moon|mars|star)$/.test(node.head || '')) nx2.ja = nx2.ja.replace(/核心$/, '核');   // the Earth's core → 地球の核
""",
    """      if (nx2.head === 'core' && /核心$/.test(nx2.ja) && /^(?:earth|planet|sun|moon|mars|star)$/.test(node.head || '')) nx2.ja = nx2.ja.replace(/核心$/, '核');   // the Earth's core → 地球の核
      if (nx2.head === 'resolution' && /決意$/.test(nx2.ja) && node.head === 'new year') nx2.ja = nx2.ja.replace(/決意$/, '抱負');   // New Year's resolutions → 新年の抱負
""")
rep("""    'set|record records|を|樹立する', 'set|goal goals target targets|を|設定する',""",
    """    'set|record records|を|樹立する', 'set|goal goals target targets|を|設定する', 'set|resolution resolutions|を|立てる', 'make|resolution resolutions|を|立てる',""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
