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
    if (tokens.some((x) => /^(?:click|press|tap|push|select|choose)$/.test(x.w || ''))) ja = ja.replace(/始まるために/, '開始するには、').replace(/(終わる|終了する)ために/, '終了するには、');   // Click the button to start → 開始するには、ボタンをクリックしなさい
    ja = ja.replace(/電池は少なくなっている/, '電池が切れかけている').replace(/(AI|ロボット|機械|人工知能|コンピューター|自動化)が([^、。]{0,10}?)仕事を取(る|った|って|ら|り)/g, (m0, a0, b0, c0) => a0 + 'が' + b0 + '仕事を奪' + ({ 'る': 'う', 'った': 'った', 'って': 'って', 'ら': 'わ', 'り': 'い' })[c0]);   // My battery is running low / AI will take their jobs → 仕事を奪う""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
