import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# They are less confident → あまり自信がない（than のない less + 形容詞は「あまり〜ない」。より少なく自信がある にしない）
rep("""          return W(fin(predD(mulDeg || deg ? '' : (cmp === 'less' ? 'より少なく' : 'もっと')), tail(e, lim, st, o, vg)));""",
    """          if (cmp === 'less' && !mulDeg && !deg && a.lemma !== 'born' && !vg.neg) { const pLs = f.pred.aux('neg'); return W(fin(P('あまり' + pLs.plain(), pLs.cls), tail(e, lim, st, o, vg))); }   // less confident → あまり自信がない
          return W(fin(predD(mulDeg || deg ? '' : (cmp === 'less' ? 'より少なく' : 'もっと')), tail(e, lim, st, o, vg)));""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
