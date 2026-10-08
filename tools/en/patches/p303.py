import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    ja = ja.replace(/^あなたが([^、。]{1,10}?)から見られるように/, '$1から分かるように').replace(/([^、。はがを]{1,10}?)に(訪問者|観光客|来場者|旅行者)の数を示/, '$1への$2の数を示').replace(/(数|割合|人口|売上|気温|人数|件数)は(?:その)?頂上に達し/, '$1はピークに達し');   // As you can see from the graph → グラフから分かるように / reached its peak → ピークに達した
    if (tokens[0] && tokens[0].w === 'only' && !tokens.some((x) => /^(?:after|when|then|by|if|once|later|recently|yesterday|now|in)$/.test(x.w || '') && tokens.indexOf(x) === 1)) ja = ja.replace(/^([^、。]{1,16}?)だけ(?=[^がをはにでとの、。])/, '$1だけが');   // Only Tom passed the test → トムだけが試験に合格した
    if (tokens.some((x) => x.w === 'figure') && tokens.some((x) => /^(?:shows|show|showed|below|above)$/.test(x.w || '')) && !tokens.some((x) => x.k === 'num')) ja = ja.replace(/(この|その|下の|上の)?数字(は|を)/, (m0, a0, b0) => (a0 || '') + '図' + b0);   // This figure shows … → この図は…を示す
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
