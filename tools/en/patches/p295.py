import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# World War II / the Second World War → 第二次世界大戦
rep(""".replace(/\\bU\\.S\\.(?:A\\.)?/g, 'USA')""",
    """.replace(/\\b(?:[Tt]he )?(?:Second World War|World War (?:II|2|Two)(?![A-Za-z0-9]))/g, 'WWtwo').replace(/\\b(?:[Tt]he )?(?:First World War|World War (?:I|1|One)(?![A-Za-z0-9]))/g, 'WWone').replace(/\\bU\\.S\\.(?:A\\.)?/g, 'USA')""")
rep("""    const SURF = { overthere: 'over there',""", """    const SURF = { wwtwo: 'World War II', wwone: 'World War I', overthere: 'over there',""")
rep("""  const PN = dic({ """, """  const PN = dic({ wwtwo: '第二次世界大戦', wwone: '第一次世界大戦', """)

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    ja = ja.replace(/世界への(?:その|彼らの)?ドアを開け(た|る)/, (m0, a0) => '世界に門戸を開' + (a0 === 'た' ? 'いた' : 'く')).replace(/日本の憲法/g, '日本国憲法').replace(/影響の中に置かれ(た|る)/, (m0, a0) => '施行され' + a0);   // Japan opened its doors to the world / The Constitution of Japan was put into effect → 施行された
    ja = ja.replace(/(大統領|市長|知事|会長|議長|首相|リーダー|キャプテン|代表|委員長|生徒会長|議員)を選出され(た|る)/, '$1に選ばれ$2').replace(/独立を得(た|る)/, (m0, a0) => (a0 === 'た' ? '独立した' : '独立する')).replace(/([^、。]{1,8}?)のそばに生計を立て/, (m0, a0) => (a0 === '釣り' ? '漁業' : a0) + 'で生計を立て').replace(/^過去の人々は以前は/, '昔の人々は').replace(/から([^、。]{1,8}?)へ動かされ(た|る)/, 'から$1へ移され$2').replace(/両方の国/g, '両国');   // He was elected president → 大統領に選ばれた / make a living by fishing → 漁業で生計を立てる
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
