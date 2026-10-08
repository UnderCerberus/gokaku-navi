import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 挿入の過去分詞句: 時の語（1600年に・1440年ごろに）があるか、一度きりの出来事の動詞（build / invent / write …）なら過去形。
# 繰り返し・習慣（repeated again and again / grown in Asia）は現在形のまま
rep(r"""? vq.parts.join('') + (vq.vg && HABIT[vq.vg.lemma] ? vq.pred.plain() : vq.pred.form('past')) + '\u0002'""",
    r"""? vq.parts.join('') + (vq.vg && !HABIT[vq.vg.lemma] && (vq.parts.some((x9) => /(?:[0-9０-９]+年|世紀|年代|前に|昨年|去年|先月|先週|昨日|ごろに)/.test(x9)) || /^(?:build|invent|found|establish|write|compose|paint|discover|design|create|publish|destroy|kill|bear|introduce|launch|complete|construct|develop|form|make|award|elect|appoint|give)$/.test(vq.vg.lemma)) ? vq.pred.form('past') : vq.pred.plain()) + '\u0002'""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
