import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# streets lined with trees … cooler than those without them → それらのない通り（比較の相手の those + 前置詞句は前の複数名詞を補う。人でなければ「人々」にしない）
rep("""        const pp = parsePP(j, lim, { noRel: o.noRel });
        if (pp && pp.kind !== 'agent') { node = Object.assign({}, node, { ja: pp.adn + '人々', end: pp.end, an: true, pl: true, pron: null, bare: false }); continue; }""",
    """        const pp = parsePP(j, lim, { noRel: o.noRel });
        const thN = pp && pp.kind !== 'agent' && cmpBefore(j - 1) ? (() => {
          let hd = null, an = false;
          for (let x = j - 2; x >= 0; x--) {
            if (isP(T[x], ',')) break;
            if (T[x].k !== 'w') continue;
            if (SUB[T[x].w] || isW(T[x], 'when') || isW(T[x], 'that')) break;
            if (PRON[T[x].w] || UNIT[T[x].w] || MEASURE[T[x].w]) continue;
            const cP = cand(T[x], '名', ['pl']);
            if (!cP || !cP.e || vc(T[x], ['3sg'])) continue;
            if (isPerson(cP) || PERSONS[cP.lemma] || /^(?:people|persons)$/.test(T[x].w)) an = true;
            hd = cP;
          }
          return hd && !an ? hd : null;
        })() : null;
        if (pp && pp.kind !== 'agent') { node = Object.assign({}, node, { ja: pp.adn + (thN ? en.jp.first(thN.e.ja) : '人々'), end: pp.end, an: !thN, pl: true, pron: null, bare: false, head: thN ? thN.lemma : node.head }); continue; }""")

# We clean the room and help cook dinner → 夕食を作るのを手伝う（help + 名詞にもなる原形: cook / wash / paint / pack）
rep("""|plan|light|heat|cool|test|measure)$/.test(t.w))) {
      const kH = isW(t, 'to') ? i + 1 : i;""",
    """|plan|light|heat|cool|test|measure|cook|wash|paint|pack)$/.test(t.w))) {
      const kH = isW(t, 'to') ? i + 1 : i;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
