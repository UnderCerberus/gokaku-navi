import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# has changed over the years / since then → 変わってきた（変わっている は「風変わりだ」と読まれる。変化の動詞 + 期間・以来 は 〜てきた）
rep("""      (st.manner.concat(st.time).some((x) => /^(?:長い間|長年|何年も|何世紀も|何十年も|何千年も|ずっと)$/.test(x)) || (st.freq.concat(st.manner, st.time).some((x) => x === 'いつも')""",
    """      (st.manner.concat(st.time).some((x) => /^(?:長い間|長年|何年も|何世紀も|何十年も|何千年も|ずっと)$/.test(x)) || (/^(?:change|grow|increase|decrease|rise|fall|develop|improve|decline|evolve|shrink|expand|spread|drop|worsen|transform)$/.test(vg.lemma) && (st.cont || st.manner.concat(st.time).some((x) => /(?:にわたって|以来|年間|世紀の間)$/.test(x)))) || (st.freq.concat(st.manner, st.time).some((x) => x === 'いつも')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
