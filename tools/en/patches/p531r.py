import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# make someone's day a little better / I found someone's wallet → 誰かの（someone's / everyone's + 名詞は所有格。is の短縮にしない）
rep("""    // 'd → had（過去分詞・better の前）/ would
    out.forEach((t, i) => {
      if (t.w !== "'d") return;""",
    """    // someone's wallet / everyone's favorite food（不定代名詞 's + 名詞・形容詞 + 名詞は所有格）
    out.forEach((t, i) => {
      const pv = out[i - 1], nx = out[i + 1], nx2 = out[i + 2];
      if (t.w !== 'is' || t.s !== '' || !pv || !nx || nx.k !== 'w' || !/^(?:someone|everyone|anyone|somebody|everybody|anybody|one)$/.test(pv.w)) return;
      const plainN = (x) => !!x && x.k === 'w' && !!nounC(x) && !vc(x, ['ing', 'pp', 'past']) && DET[x.w] === undefined && !PREP[x.w] && !ADV[x.w] && !PRON[x.w];
      if ((plainN(nx) && !adjC(nx)) || (!!adjC(nx) && !ADV[nx.w] && plainN(nx2))) { t.w = "'s"; t.k = 'pos'; }
    });
    // 'd → had（過去分詞・better の前）/ would
    out.forEach((t, i) => {
      if (t.w !== "'d") return;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
