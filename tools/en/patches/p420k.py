import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'can i keep it': 'もらってもいいですか', 'may i keep it': 'もらってもいいですか', """)

rep("""    ja = ja.replace(/それが雨がや/g, '雨がや');   // if it stopped raining → 雨がやんだら""",
    """    ja = ja.replace(/それが雨がや/g, '雨がや');   // if it stopped raining → 雨がやんだら
    if (tokens.some((x) => /^(?:keep|keeps)$/.test(x.w || '')) && !tokens.some((x) => /^(?:will|can|could|would|should|must|may|might|to|if|when)$/.test(x.w || ''))) ja = ja.replace(/を飼う(。?)$/, 'を飼っている$1');   // We keep two dogs → 2匹の犬を飼っている""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
