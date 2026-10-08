import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    ja = ja.replace(/授業の(新聞|会議|代表|写真|旅行|目標)/g, (m0, a0) => ({ '新聞': '学級新聞', '会議': '学級会', '代表': 'クラス代表', '写真': 'クラス写真', '旅行': 'クラス旅行', '目標': 'クラスの目標' })[a0]).replace(/([^、。はがを]{1,6}?)の修学旅行に行/, '$1へ修学旅行に行').replace(/逃した試験を埋め合わせ/, '受けられなかった試験の追試を受け').replace(/(委員長|会長|キャプテン|代表|リーダー|部長|議長)として選ばれ/, '$1に選ばれ').replace(/毎日([^、。]{1,6}?)を除いて/, '$1以外は毎日').replace(/一番いい教科/g, '得意な教科').replace(/一番好きな教科/g, '一番好きな教科');   // the class newspaper → 学級新聞 / a school trip to Kyoto → 京都へ修学旅行に / was chosen as class president → 学級委員長に選ばれた / except Monday → 月曜日以外は毎日 / My best subject → 得意な教科
    if (tokens.some((x) => x.w === 'absent') && tokens.some((x) => /^(?:was|were)$/.test(x.w || '')) && tokens.some((x) => /^(?:yesterday|last|ago)$/.test(x.w || ''))) ja = ja.replace(/欠席していた/, '欠席した');   // I was absent from school yesterday → 昨日学校を欠席した
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
