import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Rice and wheat, which feed most of the world's population, require … → 世界の人口のほとんどを養う米と小麦は…
# （名詞句の並列の最後の項のあとの「, which / who …」は並列全体にかける。「米と…小麦は」にしない）
rep("""      let nx = np1(k, lim, oList);
      if (nx && c === 'and' && nx.end + 1 < lim""",
    """      let nx = np1(k, lim, oList);
      if (nx && c && nx.rel && !oList.noRel) {
        const mNr = mark();
        const nxNr = np1(k, lim, Object.assign({}, oList, { noRel: true }));
        if (nxNr && nxNr.end + 2 < lim && isP(T[nxNr.end], ',') && /^(?:which|who)$/.test(T[nxNr.end + 1].w || '') && (items.every((x) => !x.an) || /^who$/.test(T[nxNr.end + 1].w))) { nx = Object.assign({}, nxNr, { relAfter: true }); } else fail(mNr);
      }
      if (nx && c === 'and' && nx.end + 1 < lim""")
rep("""    return { ja: ja, end: j, an: items.every((x) => x.an), pl: true, coord: true,
      time: items.every((x) => x.time), head: first.head, itemsJa: then ? undefined : items.map((x) => x.ja) };
  }""",
    """    const resC = { ja: ja, end: j, an: items.every((x) => x.an), pl: true, coord: true,
      time: items.every((x) => x.time), head: first.head, itemsJa: then ? undefined : items.map((x) => x.ja) };
    if (last.relAfter) {
      const mRa = mark();
      const rRa = relClause(resC, lim, o);
      if (rRa && rRa.end > j + 1) return Object.assign({}, rRa, { coord: true, pl: true, itemsJa: undefined });
      fail(mRa);
    }
    return resC;
  }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
