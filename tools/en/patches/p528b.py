import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# on her way home from school → 学校からの帰り道で（決まり文句の 帰り道で で切らず、from までを前置詞句で読む）
rep("""      if (/^on (?:the|my|his|her|our|their|your) way(?: back)?$/.test(fx[k].toks.join(' ')) && isW(T[j + 3], 'back')""",
    """      if (/^on (?:the|my|his|her|our|their|your) way(?: home)?$/.test(fx[k].toks.join(' ')) && isW(T[j + 3], 'home') && isW(T[j + 4], 'from') && j + 5 < lim) continue;
      if (/^on (?:the|my|his|her|our|their|your) way(?: back)?$/.test(fx[k].toks.join(' ')) && isW(T[j + 3], 'back')""")
rep("""    if (!idi && key === 'on' && j + 2 < lim && T[j].k === 'w' && /^(?:my|his|her|our|their|your|the)$/.test(T[j].w) && isW(T[j + 1], 'way') && isW(T[j + 2], 'back')) {""",
    """    if (!idi && key === 'on' && j + 4 < lim && T[j].k === 'w' && /^(?:my|his|her|our|their|your|the)$/.test(T[j].w) && isW(T[j + 1], 'way') && isW(T[j + 2], 'home') && isW(T[j + 3], 'from')) {
      const mWh = mark();
      const nWh = np(j + 4, lim, { noRel: true, noCoord: o.noCoord });
      if (nWh && !nWh.pron) return { ja: nWh.ja + 'からの帰り道で', adn: nWh.ja + 'からの帰り道の', end: nWh.end, kind: 'other', prep: key, obj: nWh };
      fail(mWh);
    }
    if (!idi && key === 'on' && j + 2 < lim && T[j].k === 'w' && /^(?:my|his|her|our|their|your|the)$/.test(T[j].w) && isW(T[j + 1], 'way') && isW(T[j + 2], 'back')) {""")

# It's my fault / it was not your fault → 私のせいだ・あなたのせいではなかった（所有格 + fault は「せい」。欠点 にしない）
rep("""    if (node && !node.pron && node.end >= 2 && isW(T[node.end - 1], 'savings')""",
    """    if (node && !node.pron && node.end >= 2 && isW(T[node.end - 1], 'fault') && /^(?:my|your|his|her|its|our|their)$/.test(T[node.end - 2].w || '') && /欠点/.test(node.ja || '') && T.slice(Math.max(0, node.end - 5), node.end - 2).some((x) => x.k === 'w' && !!BE[x.w])) node = Object.assign({}, node, { ja: node.ja.replace(/^自分の/, (node.end >= 2 && T[node.end - 2].w === 'my') ? '私の' : '自分の').replace('欠点', 'せい') });
    if (node && !node.pron && node.end >= 2 && isW(T[node.end - 1], 'savings')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
