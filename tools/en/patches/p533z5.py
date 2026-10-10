import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the sun during the day → 日中の太陽（during the day / night は「日の間」にしない）
rep("""      case 'during':
""",
    """      case 'during':
        if (/^(?:day|night|daytime)$/.test(obj.head || '') && obj.det === 'the' && !obj.pron) { const dJ = obj.head === 'night' ? '夜の間' : '日中'; return R(dJ, 'time', dJ + 'の'); }
""")

# the position of the sun during the day and the stars at night → 日中の太陽と夜の星の位置（並列の前の項に時の前置詞句があれば、後ろの項の時の前置詞句も名詞にかける）
rep("""      let nx = np1(k, lim, oList);""",
    """      let nx = np1(k, lim, oList);
      if (nx && c === 'and' && nx.end + 1 < lim && T[nx.end].k === 'w' && /^(?:at|in|during|on)$/.test(T[nx.end].w) && T.slice(i + 1, first.end).some((x, q) => x.k === 'w' && /^(?:during|at|in)$/.test(x.w) && /^(?:the|night|day|morning|evening|afternoon|noon|summer|winter|spring|autumn)$/.test((T[i + 2 + q] || {}).w || ''))) {
        const mTx = mark();
        const pTx = parsePP(nx.end, lim, { noRel: true });
        if (pTx && pTx.kind === 'time' && pTx.adn) nx = Object.assign({}, nx, { ja: pTx.adn + nx.ja, end: pTx.end }); else fail(mTx);
      }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
