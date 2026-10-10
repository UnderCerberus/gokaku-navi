import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# During a test or a discussion, … → 試験や話し合いの間（文頭の前置詞句の目的語の並列: コンマで終わるなら並列ありで読み直す）
rep("""        let pp = parsePP(a, b, { noRel: true, noCoord: true });""",
    """        let pp = parsePP(a, b, { noRel: true, noCoord: true });
        if (pp && pp.end + 1 < b && T[pp.end].k === 'w' && /^(?:or|and)$/.test(T[pp.end].w)) {   // During a test or a discussion, …
          const mCo = mark();
          const ppCo = parsePP(a, b, { noRel: true });
          if (ppCo && ppCo.end < b && isP(T[ppCo.end], ',')) pp = ppCo; else fail(mCo);
        }""")

# phones could be kept in bags → 電話はかばんの中に保てる（物の主語 + could + 受け身は可能。「保つかもしれない」で受け身を落とさない）
rep("""        if (!vg.perfect && !neg && sj && !anim && !(sj.pron && PRON[sj.pron] && PRON[sj.pron].an) && !o.subjunctive && !o.wish && !o.q &&
          !T.some((x, q) => x.k === 'w' && (x.w === 'now' || x.w === 'then' || (q !== vg.idx && !!vc(x, ['past']) && !vc(x, ['base', '3sg']) && !MODAL[x.w]))) &&""",
    """        if (!vg.perfect && !neg && sj && !anim && !(sj.pron && PRON[sj.pron] && PRON[sj.pron].an) && !o.subjunctive && !o.wish && !o.q && !canPassed &&
          !T.some((x, q) => x.k === 'w' && (x.w === 'now' || x.w === 'then' || (q !== vg.idx && !!vc(x, ['past']) && !vc(x, ['base', '3sg']) && !MODAL[x.w]))) &&""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
