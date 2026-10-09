import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# how many people use it / how many people start using it（how many + 名詞が主語: 名詞にもなる動詞を複合名詞に入れない。
#  後ろに述語の動詞が残らないときだけ。how many tour guides the museum employs は複合名詞のまま）
rep("""          if (n && !n.pron && nx.w === 'many' && n.c && DURUNIT[n.c.lemma] && UNIT[n.c.lemma] && n.end === i + 3) return""",
    """          if (n && !n.pron && n.end - (i + 2) >= 2 && T[n.end - 1].k === 'w' && !!vc(T[n.end - 1], ['base', '3sg', 'past']) &&
            (n.end >= lim || T[n.end].k === 'p' || (T[n.end].k === 'w' && ((PRON[T[n.end].w] && !/^(?:i|he|she|we|they)$/.test(T[n.end].w)) || DET[T[n.end].w] !== undefined || !!PREP[T[n.end].w] || !!vc(T[n.end], ['ing']) || !!nounC(T[n.end])))) &&
            !T.slice(n.end, lim).some((x) => x.k === 'w' && !nounC(x) && (!!vc(x, ['3sg', 'past', 'base']) || !!MODAL[x.w] || !!BE[x.w] || !!DO[x.w] || !!HAVE[x.w]))) {
            const mS = mark();
            const nS = np1(i + 2, n.end - 1, { noPost: true, noRel: true, noWhat: true });
            if (nS && nS.end === n.end - 1) n = nS; else fail(mS);
          }
          if (n && !n.pron && nx.w === 'many' && n.c && DURUNIT[n.c.lemma] && UNIT[n.c.lemma] && n.end === i + 3) return""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
