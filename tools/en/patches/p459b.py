import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    ja = ja.replace(/(?:彼らの|自分の|私たちの)家に配達/g, '自宅に配達')""",
    """    ja = ja.replace(/知識の隙間/g, '知識の空白').replace(/儀式で(スピーチ|あいさつ|演説)/g, '式典で$1').replace(/(宿題|課題|小テスト|テスト|試験)をくれ(た|る)/g, '$1を出し$2'.replace('出し$2', '出し$2')).replace(/(宿題|課題|小テスト|テスト|試験)を出しる/g, '$1を出す');   // fills a gap in our knowledge → 知識の空白を埋める / The teacher gave us a lot of homework → 宿題を出した
    ja = ja.replace(/(?:彼らの|自分の|私たちの)家に配達/g, '自宅に配達')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
