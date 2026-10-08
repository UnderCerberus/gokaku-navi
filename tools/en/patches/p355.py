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
    ja = ja.replace(/遅く夜更かし(する|した|して)/g, (m0, a0) => '遅くまで起きて' + ({ 'する': 'いる', 'した': 'いた', 'して': 'いて' })[a0]).replace(/お互いと仲良く/g, '互いに仲良く').replace(/(駅|空港|学校|バス停|ホテル)で(あなた|彼|彼女|君|みんな)?を?迎えに行/g, (m0, a0, b0) => a0 + 'まで' + (b0 ? b0 + 'を' : '') + '迎えに行');   // stay up late → 遅くまで起きている / pick you up at the station → 駅まであなたを迎えに行く
    ja = ja.replace(/(真実|事実|理由|答え|秘密|真相|原因|結果|名前|住所)を見つけ出(す|した|して|そう)/g, (m0, a0, b0) => a0 + 'を知' + ({ 'す': 'る', 'した': 'った', 'して': 'って', 'そう': 'ろう' })[b0]);   // I found out the truth → 真実を知った
    if (tokens.some((x) => x.w === 'off') && tokens.some((x) => /^(?:put|puts|putting)$/.test(x.w || '')) && tokens.some((x) => /^(?:homework|work|studying|assignment|assignments|report|chores)$/.test(x.w || ''))) ja = ja.replace(/を延期し/g, 'を後回しにし');   // Don't put off your homework → 宿題を後回しにしてはいけません""")

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'do not let me down': '私をがっかりさせないで', 'i will not let you down': 'あなたをがっかりさせません', """)

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
