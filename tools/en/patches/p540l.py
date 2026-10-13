import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I began to speak more slowly than I had planned → 予定していたよりゆっくりと / It took longer than we had expected → 予想していたより
# （than + 代名詞 + had + 予定・予想の動詞の過去分詞 は「〜していたより」）
rep("""  function thanEllipsis(i, lim, mainSj) {
""",
    """  function thanEllipsis(i, lim, mainSj) {
    if (i + 3 === lim && T[i].k === 'w' && PRON[T[i].w] && PRON[T[i].w].sub && isW(T[i + 1], 'had') && T[i + 2].k === 'w') {
      const wvH = vc(T[i + 2], ['pp']);
      const WHH = { plan: '予定して', expect: '予想して', think: '思って', imagine: '想像して', hope: '望んで', intend: '意図して', guess: '推測して', predict: '予測して', fear: '恐れて', anticipate: '予期して', want: '望んで', estimate: '見積もって', thought: '思って' };
      if (wvH && WHH[wvH.lemma]) return (/^(?:i|we)$/.test(T[i].w) || (mainSj && mainSj.pron && samePerson(mainSj.pron, T[i].w)) ? '' : (PRON[T[i].w].ja || '') + 'が') + WHH[wvH.lemma] + 'いた';
    }
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
