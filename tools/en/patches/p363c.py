import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    ja = ja.replace(/中国の万里の長城/g, '万里の長城');""",
    """    ja = ja.replace(/中国の万里の長城/g, '万里の長城');
    ja = ja.replace(/(クリスマスイブ|クリスマス|元日|大みそか|誕生日|お正月)の上に/g, '$1に').replace(/^(大みそか|元日|クリスマスイブ|クリスマス|お正月)に、/, '$1には、');   // on Christmas Eve → クリスマスイブに
    if (tokens.some((x) => /^(?:got|get|gets|getting)$/.test(x.w || '')) && tokens.some((x) => /^(?:birthday|christmas|present|presents|gift|gifts|from|souvenir|souvenirs|prize)$/.test(x.w || ''))) ja = ja.replace(/を得(た|る|て)(?=[。、]|$|いる|いた)/, (m0, a0) => 'をもら' + ({ 'た': 'った', 'る': 'う', 'て': 'って' })[a0]);   // I got a bike on my birthday → 誕生日に自転車をもらった""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
