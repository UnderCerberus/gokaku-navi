import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""st.other = st.other.map((x) => x.replace(/(近く|中|上|下|前|後ろ|隣|間|北|南|東|西|中心|海岸|沿岸|端)で$/, '$1に')); }   // The town is located near the sea → 海の近くにある""",
    """st.other = st.other.map((x) => x.replace(/(近く|中|上|下|前|後ろ|隣|間|北|南|東|西|中心|海岸|沿岸|端)で$/, '$1に').replace(/(島|諸島|半島|プレート|大陸|丘|山|川|湖)で$/, '$1に').replace(/プレートに$/, 'プレートの上に')); }   // The town is located near the sea → 海の近くにある""")

# It took over ten years → 10年以上かかった（take over + 数 は「〜以上」）
rep(""".replace(/\\bU\\.S\\.(?:A\\.)?/g, 'USA')""",
    """.replace(/\\bU\\.S\\.(?:A\\.)?/g, 'USA').replace(/\\b(take|takes|took|taken|taking) over (?=(?:\\d|a |an |one |two |three |four |five |six |seven |eight |nine |ten |twenty |thirty |forty |fifty |a hundred |hundreds ))/gi, '$1 more than ')""")

rep("""    ja = ja.replace(/お互いと話/g, '互いに話');""",
    """    ja = ja.replace(/お互いと話/g, '互いに話');
    ja = ja.replace(/中国の万里の長城/g, '万里の長城');
    if (tokens.some((x) => /^(?:stretch|stretches|stretched|extend|extends|extended)$/.test(x.w || '')) && tokens.some((x) => /^(?:for|from|along|across)$/.test(x.w || ''))) ja = ja.replace(/広がる(?=。|$)/, '延びている').replace(/広がった(?=。|$)/, '延びていた');   // It stretches for thousands of kilometers → 延びている""")

rep("""    if (key === 'for' && /^何(?:十|百|千|万)?(?:キロメートル|メートル|マイル|キロ)も$/.test(n)) return R(n.replace(/も$/, '') + 'にもわたって',""",
    """    if (key === 'for' && /^何(?:十|百|千|万)?(?:キロメートル|メートル|マイル|キロ)もの?$/.test(n)) return R(n.replace(/もの?$/, '') + 'にもわたって',""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
