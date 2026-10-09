import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 変化の量があれば（have risen by ten percent since last year）〜てきた にしない → 10%上がった
rep("""/^(?:change|grow|increase|decrease|rise|fall|develop|improve|decline|evolve|shrink|expand|spread|drop|worsen|transform)$/.test(vg.lemma) && (st.cont ||""",
    """/^(?:change|grow|increase|decrease|rise|fall|develop|improve|decline|evolve|shrink|expand|spread|drop|worsen|transform)$/.test(vg.lemma) && !st.other.concat(st.manner).some((x) => /(?:%|倍|ポイント)$/.test(x)) && (st.cont ||""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
