import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# He called my grandmother to tell her I was safe → 私が安全だと伝えるために（to 不定詞の tell でも、文の主節が過去なら伝達内容の過去形は現在に戻す）
rep("""      const tc2 = isW(tj, 'that') || isW(tj, 'there') || (tj.k === 'w' && PRON[tj.w] && PRON[tj.w].sub && !WH[tj.w]) ? thatClause(j, lim, vg.past) : null;""",
    """      const mpT = !!vg.past || (!!vg.nonfin && T.slice(0, Math.max(0, vg.idx || 0)).some((x, q) => x.k === 'w' && (/^(?:was|were|had|did|could|would)$/.test(x.w) || (q > 0 && !!vc(x, ['past']) && T[q - 1].k === 'w' && ((!!PRON[T[q - 1].w] && !!PRON[T[q - 1].w].sub) || (!!nounC(T[q - 1]) && DET[T[q - 1].w] === undefined))))));
      const tc2 = isW(tj, 'that') || isW(tj, 'there') || (tj.k === 'w' && PRON[tj.w] && PRON[tj.w].sub && !WH[tj.w]) ? thatClause(j, lim, mpT) : null;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
