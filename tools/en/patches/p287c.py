import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    ja = ja.replace(/([^、。]{1,8}?)でどこにも([^、。]{0,6}?)(許されていない|禁止されている)/, '$1のどこでも$2$3');   // Smoking is not allowed anywhere in the building → 建物のどこでも許されていない
""", "")
rep("""ja = ja.replace(/どこかで/g, 'どこにも').replace(/どこかに/g, 'どこにも');   // I can't find my keys anywhere → どこにも見つからない""",
    """ja = ja.replace(/どこかで/g, 'どこにも').replace(/どこかに/g, 'どこにも').replace(/([^、。]{1,8}?)でどこにも([^、。]{0,6}?)(許されていない|禁止されている)/, '$1のどこでも$2$3');   // I can't find my keys anywhere → どこにも見つからない / Smoking is not allowed anywhere in the building → 建物のどこでも許されていない""")

rep("""    if (tokens.some((x) => x.w === 'checkout') && !tokens.some((x) => /^(?:hotel|room|rooms|time|check|inn|stay|guests|guest)$/.test(x.w || ''))) ja = ja.replace(/チェックアウト/g, 'レジ');""",
    """    if (tokens.some((x) => x.w === 'checkout') && !tokens.some((x) => x.k === 'num' || /^(?:hotel|room|rooms|time|check|inn|stay|guests|guest|noon)$/.test(x.w || ''))) ja = ja.replace(/チェックアウト/g, 'レジ');
    ja = ja.replace(/^(チェックアウト|チェックイン)は((?:午前|午後)?[0-9０-９]+時(?:半|[0-9０-９]+分)?(?:まで|から)?)にある/, '$1は$2だ');   // Checkout is at 11 a.m. → チェックアウトは午前11時だ""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
