import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Thanks again for your help → 改めて、助けてくれてありがとう
rep("""    const tyO = seq(0, ['thank', 'you', 'for']) ? 3 :""",
    """    if (seq(0, ['thanks', 'again', 'for']) || seq(0, ['thank', 'you', 'again', 'for'])) {
      const kAg = T.findIndex((x) => isW(x, 'again'));
      const tAg = T.filter((x, q) => q !== kAg).map((x, k) => Object.assign({}, x, { i: k, first: k === 0 }));
      const rAg = translate1(tAg);
      reset(tokens);
      if (rAg && rAg.ok) return Object.assign({}, rAg, { ja: '改めて、' + rAg.ja });
    }
    const tyO = seq(0, ['thank', 'you', 'for']) ? 3 :""")

# see you last week の last は動詞にしない
rep("""  const vc = (t, forms) => (t && t.k === 'w' && !PRON[t.w] && DET[t.w] === undefined ? cand(t, '動', forms) : null);""",
    """  const vc = (t, forms) => (t && t.k === 'w' && !PRON[t.w] && DET[t.w] === undefined && !(t.w === 'last' && T[t.i + 1] === undefined ? false : (t.w === 'last' && T[t.i] === t && /^(?:week|month|year|night|summer|winter|spring|fall|autumn|weekend|sunday|monday|tuesday|wednesday|thursday|friday|saturday|semester|term|season|century|decade|time)$/.test(T[t.i + 1].w || ''))) ? cand(t, '動', forms) : null);   // It was nice to see you last week の last は「続く」ではない""")

# イベントが何時に始まるか
rep("""|special|annual|charity|sports|music|school|online|big|fun)$/.test(x.w || ''))) ja = ja.replace(/出来事/g, 'イベント');""",
    """|special|annual|charity|sports|music|school|online|big|fun|start|starts|started|begin|begins|began|end|ends|ended|finish|finishes)$/.test(x.w || ''))) ja = ja.replace(/出来事/g, 'イベント');""")

# I'm afraid I can't come to the meeting → 会議に行けない
rep("""    ja = ja.replace(/中国の万里の長城/g, '万里の長城');""",
    """    ja = ja.replace(/中国の万里の長城/g, '万里の長城');
    if (tokens.some((x, q) => /^(?:i|we)$/.test(x.w || '') && tokens[q + 1] && /^(?:can|could|will)$/.test(tokens[q + 1].w || '') && tokens[q + 2] && tokens[q + 2].w === 'not' && tokens[q + 3] && tokens[q + 3].w === 'come')) ja = ja.replace(/(会議|パーティー|集まり|イベント|式|練習|授業|試合|発表会|コンサート)に来られな/, '$1に行けな');   // I'm afraid I can't come to the meeting → 会議に行けない""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
