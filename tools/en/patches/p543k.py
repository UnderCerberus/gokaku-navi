import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Scientists must rely on careful observation and avoid … → 注意深い観察に頼っていて、…避けなければならない（義務の列挙の連用形が「〜てい」で終わるときは「〜ていて」。「頼ってい、」にしない）
rep("""      let s = withObj(c0.out({ form: fm, part: x.part, omit: x.omit }), c0.pred.form(fm)) + '、';
      rest.slice(0, -1).forEach((r) => { s += selfP(r.out({ form: fm, omit: sp })) + '、'; });""",
    """      const outFm = (nd, oo) => { const s1 = nd.out(Object.assign({}, oo, { form: fm })); return fm === 'stem' && /[てで]い$/.test(s1) ? nd.out(Object.assign({}, oo, { form: 'te' })) : s1; };
      let s = withObj(outFm(c0, { part: x.part, omit: x.omit }), c0.pred.form(fm)) + '、';
      rest.slice(0, -1).forEach((r) => { s += selfP(outFm(r, { omit: sp })) + '、'; });""")

# You should stop and wear a helmet → 立ち止まり、ヘルメットをかぶるべきだ（自動詞の訳の最初の動詞とは目的語を共有しない。「ヘルメットを立ち止まり」にしない）
rep("""      const shObj = singleV1 && !(c0.parts || []).length &&""",
    """      const intrV1 = !!c0.pred && /(?:立ち止まる|止まる|来る|行く|帰る|座る|立つ|寝る|起きる|走る|歩く|泳ぐ|笑う|泣く|休む|待つ|急ぐ|戻る|出かける|集まる|始まる|終わる|落ち着く|リラックスする|くつろぐ)$/.test(c0.pred.s || '');
      const shObj = singleV1 && !intrV1 && !(c0.parts || []).length &&""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
