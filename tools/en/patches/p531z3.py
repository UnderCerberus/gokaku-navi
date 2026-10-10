import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# streets lined with trees → 木が並ぶ通り（名詞 + lined with ～。「木で並ばれた」にしない）
rep("""    if (isW(t, 'left') && !node.pron && !o.noPart && j + 2 < e && T[j + 1].k === 'w' && /^(?:on|in|at|under|near|by|inside|outside|behind|beside)$/.test(T[j + 1].w)) {""",
    """    if (isW(t, 'lined') && isW(T[j + 1], 'with') && !node.pron && !o.noPart && j + 2 < e) {
      const mLn = mark();
      const ppLn = parsePP(j + 1, e, { noRel: true });
      if (ppLn && ppLn.obj) { name('participle-mod'); return Object.assign({}, node, { ja: ppLn.obj.ja + 'が並ぶ' + node.ja, end: ppLn.end }); }
      fail(mLn);
    }
    if (isW(t, 'left') && !node.pron && !o.noPart && j + 2 < e && T[j + 1].k === 'w' && /^(?:on|in|at|under|near|by|inside|outside|behind|beside)$/.test(T[j + 1].w)) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
