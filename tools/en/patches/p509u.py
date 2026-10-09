import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# if we are to solve global problems → 世界的な問題を解決するためには（if 節の be to = 意図。「解決することになっていたら」にしない）
rep("""      if (inf4) return plan ? fin(P(vpJoin(inf4, 'dict') + 'ことになっている', 'v1'), inf4.end, 'SV') : fin(P(vpJoin(inf4, 'dict') + 'ことだ', 'da'), inf4.end, 'SVC');""",
    """      const ifBe = T.slice(0, j).some((x, q) => isW(x, 'if') && !T.slice(q + 1, j - 1).some((y) => y.k === 'w' && (!!vc(y, ['3sg', 'past']) && !nounC(y) || MODAL[y.w] || SUB[y.w])));
      if (inf4 && ifBe && plan && !vg.past && !vg.neg) { const rIf = fin(P(vpJoin(inf4, 'dict') + 'ことになっている', 'v1'), inf4.end, 'SV'); if (rIf) rIf.ifPurpose = vpJoin(inf4, 'dict') + 'ためには'; return rIf; }
      if (inf4) return plan ? fin(P(vpJoin(inf4, 'dict') + 'ことになっている', 'v1'), inf4.end, 'SV') : fin(P(vpJoin(inf4, 'dict') + 'ことだ', 'da'), inf4.end, 'SVC');""")
rep("""      noSubj: !!vp.noSubj, cont: vp.cont || null, perfect: !!vp.perfect,""",
    """      noSubj: !!vp.noSubj, ifPurpose: vp.ifPurpose || '', cont: vp.cont || null, perfect: !!vp.perfect,""")
rep("""      case 'if':
        if (sc.subj && sc.subj.pron === 'you' && !(sc.parts || []).length""",
    """      case 'if':
        if (sc.ifPurpose) return sc.ifPurpose + '、';
        if (sc.subj && sc.subj.pron === 'you' && !(sc.parts || []).length""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
