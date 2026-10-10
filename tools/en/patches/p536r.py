import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I mixed up two orders / writing every order down / take orders → 注文（店・料理の文脈の order。順序 にしない）
rep("""    if (nom.head === 'space' && /宇宙$/.test(ja) && !detW && i > 0 && T[i - 1].k === 'w' && /^(?:of|empty|open|extra|free|enough|much|more|little|storage|parking|living|office|work)$/.test(T[i - 1].w)) ja = ja.replace(/宇宙$/, '空間');""",
    """    if (nom.head === 'space' && /宇宙$/.test(ja) && !detW && i > 0 && T[i - 1].k === 'w' && /^(?:of|empty|open|extra|free|enough|much|more|little|storage|parking|living|office|work)$/.test(T[i - 1].w)) ja = ja.replace(/宇宙$/, '空間');
    if (nom.head === 'order' && /順序$/.test(ja) && !isW(T[nom.end], 'of') && T.some((x) => x.k === 'w' && /^(?:restaurant|restaurants|cafe|customer|customers|menu|waiter|waiters|waitress|dish|dishes|food|kitchen|table|tables|delivery|online|cancel|cancelled|canceled|placed|meal|meals|pizza|coffee|lunch|dinner|plate|plates|take|took|taking|mixed|mix|shop|store)$/.test(x.w)) && !/^(?:in|out)$/.test((T[i - 1] || {}).w || '')) ja = ja.replace(/順序$/, '注文');""")

# a family with small children → 小さい子どものいる家族（人の集まり・人の名詞 + with + 子ども・ペット → 〜のいる・〜を連れた）
rep("""      if (isW(t, 'with') && node.head && /^(?:bird|birds|dog|dogs|cat|cats|animal|animals|man|men|woman|women|girl|girls|boy|boys|child|children|person|people|horse|horses)$/.test(node.head) && !node.pron && j + 1 < lim && !o.noPost) {""",
    """      if (isW(t, 'with') && node.head && /^(?:family|families|couple|couples|parent|parents|mother|mothers|father|fathers|woman|women|man|men|tourist|tourists|visitor|visitors|customer|customers)$/.test(node.head) && !node.pron && j + 2 < lim && !o.noPost) {
        const mWc = mark();
        const nWc = np(j + 1, lim, { noRel: true, noCoord: o.noCoord });
        if (nWc && /^(?:child|children|kid|kids|baby|babies|son|sons|daughter|daughters|dog|dogs|pet|pets|grandchildren)$/.test(nWc.head || '') && (nWc.end >= lim || T[nWc.end].k === 'p' || (T[nWc.end].k === 'w' && (!!PREP[T[nWc.end].w] || /^(?:and|but|or|who|that|which)$/.test(T[nWc.end].w) || !!vc(T[nWc.end], ['past', '3sg']))))) { node = Object.assign({}, node, { ja: nWc.ja + (/^(?:family|families|couple|couples)$/.test(node.head) ? 'のいる' : 'を連れた') + node.ja, end: nWc.end }); continue; }
        fail(mWc);
      }
      if (isW(t, 'with') && node.head && /^(?:bird|birds|dog|dogs|cat|cats|animal|animals|man|men|woman|women|girl|girls|boy|boys|child|children|person|people|horse|horses)$/.test(node.head) && !node.pron && j + 1 < lim && !o.noPost) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
