import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# right now → 1 語（I'm busy right now の right を名詞・形容詞に読まない）
rep(""".replace(/\\bonce in a blue moon\\b/gi, 'bluemoonadv')""",
    """.replace(/\\bonce in a blue moon\\b/gi, 'bluemoonadv').replace(/\\b([Rr])ight now\\b/g, (m0, r0) => (r0 === 'R' ? 'Rightnowadv' : 'rightnowadv'))""")
rep("""    const SURF = { firstcomeadv:""", """    const SURF = { rightnowadv: 'right now', firstcomeadv:""")
rep("""bluemoonadv: ['ごくまれに', 'f'],""", """bluemoonadv: ['ごくまれに', 'f'], rightnowadv: ['今', 't'],""")

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    if (tokens.some((x) => x.w === 'rightnowadv') && (/(?:なさい|ください|しろ|て)(?:。|$)/.test(ja) || (tokens[0] && tokens[0].w !== 'rightnowadv' && !!vc(tokens[0], ['base']) && !PRON[tokens[0].w] && DET[tokens[0].w] === undefined && !BE[tokens[0].w] && !MODAL[tokens[0].w] && !DO[tokens[0].w]))) ja = ja.replace(/今(?!すぐ|日|朝|夜|週|月|年|度|後|まで)/, '今すぐ');   // Do it right now → 今すぐそれをしなさい / I'm busy right now → 今忙しい
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
