import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'leave me alone': '放っておいて', 'please leave me alone': '放っておいてください', 'do not keep me waiting': '待たせないで', 'sorry to keep you waiting': 'お待たせしてすみません', 'i am sorry to keep you waiting': 'お待たせしてすみません', 'sorry to have kept you waiting': 'お待たせしてすみません', 'i am sorry to have kept you waiting': 'お待たせしてすみませんでした', """)

# I want to get this done by tomorrow → これを明日までに終わらせたい
rep("""    ja = ja.replace(/中国の万里の長城/g, '万里の長城');""",
    """    ja = ja.replace(/中国の万里の長城/g, '万里の長城');
    if (tokens.some((x) => /^(?:get|got|gets|getting)$/.test(x.w || '')) && tokens.some((x) => x.w === 'done') && !tokens.some((x) => x.w === 'by' && tokens.some((y) => /^(?:mechanic|someone|somebody|professional|expert|experts)$/.test(y.w || '')))) ja = ja.replace(/(これ|それ|宿題|仕事|レポート|課題|すべて|全部)を([^、。]{0,12}?)してもら(いたい|った|う|わなければならない)/, (m0, a0, b0, c0) => a0 + 'を' + b0 + '終わらせ' + ({ 'いたい': 'たい', 'った': 'た', 'う': 'る', 'わなければならない': 'なければならない' })[c0]);   // I want to get this done by tomorrow → これを明日までに終わらせたい""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
