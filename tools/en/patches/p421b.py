import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""        let right = (thenPred && left.subj && T[rs].k === 'w' && !!vc(T[rs], ['3sg', 'past', 'base'])""",
    """        // Yuki visits him and helps with the farm work（3 人称単数の主語 + 3 単現の動詞 and 3 単現 → 主語を共有する述語の並列を先に試す: helps を名詞の主語にしない）
        if (isCC && w === 'and' && je === j && rs === j + 1 && left.subj && !left.past && !left.modal && !left.passive && T[rs] && T[rs].k === 'w' && !!vc(T[rs], ['3sg']) && !!cand(T[rs], '名', ['pl']) && !left.subj.pl && !(left.subj.pron && /^(?:i|you|we|they)$/.test(left.subj.pron)) && T.slice(a, je).some((x) => x.k === 'w' && !!vc(x, ['3sg']))) {
          const mPf = mark();
          const rvPf = predOnly(rs, b, Object.assign({}, o, { subj: left.subj, pastHint: false }));
          if (rvPf) return wrap(joinCoord(w, left, rvPf));
          fail(mPf);
        }
        let right = (thenPred && left.subj && T[rs].k === 'w' && !!vc(T[rs], ['3sg', 'past', 'base'])""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
