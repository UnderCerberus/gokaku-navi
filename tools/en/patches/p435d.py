import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""台湾)の劇/g, '$1ドラマ')""", """台湾)の劇(?!場|団|作家|的)/g, '$1ドラマ')""")

rep("""    ja = ja.replace(/世紀の最中に/g, '世紀半ばに').replace(/世紀の終わりに/g, '世紀末に');""",
    """    ja = ja.replace(/世紀の最中に/g, '世紀半ばに').replace(/世紀の終わりに/g, '世紀末に');
    if (tokens.some((x, q) => x.w === 'form' && tokens[q + 1] && tokens[q + 1].w === 'of') && tokens.some((x) => /^(?:theater|theatre|drama)$/.test(x.w || ''))) ja = ja.replace(/劇場/g, '演劇');   // a traditional form of Japanese theater → 日本の演劇
    ja = ja.replace(/([^、。はがを]{1,10})の伝統的な形(?=だ|です|。|$)/, '伝統的な$1の一形態');   // a traditional form of Japanese theater → 伝統的な日本の演劇の一形態""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
