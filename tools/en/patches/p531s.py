import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# someone's wallet / everyone's opinion / one's health → 誰かの財布・みんなの意見・自分の健康（不定代名詞の所有格）
rep("""    if (p && !(isDet && nomNext) && !(t.w === 'one' && nomNext)) {""",
    """    if (p && /^(?:someone|everyone|anyone|somebody|everybody|anybody|one)$/.test(t.w) && T[i + 1] && T[i + 1].k === 'pos' && i + 2 < lim) {
      const mPs = mark();
      const nPs = nominal(i + 2, lim, true);
      if (nPs) {
        const pJ = { someone: '誰かの', somebody: '誰かの', everyone: 'みんなの', everybody: 'みんなの', anyone: '誰かの', anybody: '誰かの', one: '自分の' }[t.w];
        return postMod({ ja: pJ + nPs.ja, end: nPs.end, head: nPs.head, pl: nPs.pl, an: nPs.an, time: nPs.time, c: nPs.c, det: 'poss' }, lim, o);
      }
      fail(mPs);
    }
    if (p && !(isDet && nomNext) && !(t.w === 'one' && nomNext)) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
