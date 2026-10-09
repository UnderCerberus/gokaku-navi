import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# snap diff の見直し（第 511 組）
# 1) learn that → 知る は感情の形容詞のあと（disappointed to learn that …）だけ。経験から学ぶ文は「学ぶ」のまま
rep("""    if (L === 'learn') return P('知る', 'v5');   // was disappointed to learn that … → 〜と知ってがっかりした""",
    """    if (L === 'learn' && T.some((x) => x.k === 'w' && /^(?:disappointed|surprised|shocked|glad|happy|sad|pleased|relieved|excited|sorry|amazed|upset|delighted)$/.test(x.w))) return P('知る', 'v5');   // was disappointed to learn that … → 〜と知ってがっかりした""")
# 2) be expected to は「期待されている」のまま出し、文末の置換（予想・予定・見込み）に任せる。て形（〜されていて）も置換で予想に
rep("""        if (L === 'expect' && o.subj && !o.subj.an && !(o.subj.pron && /^(?:i|you|he|she|we|they)$/.test(o.subj.pron))) return done(Object.assign({}, vg, { passive: false }), P(vpJoin(infP, 'dict') + 'と予想されている', 'v1'), st, infP.end, 'SV', o, [], { noStative: true });""",
    """        if (L === 'expect' && o.subj && !o.subj.an && !(o.subj.pron && /^(?:i|you|he|she|we|they)$/.test(o.subj.pron))) return done(Object.assign({}, vg, { passive: false }), P(vpJoin(infP, 'dict') + 'と期待されている', 'v1'), st, infP.end, 'SV', o, [], { noStative: true });""")
rep("""unemployment|weather)$/.test(x.w || ''))) ja = ja.replace(/と期待されて(いる|いた)/g, 'と予想されて$1');""",
    """unemployment|weather|robots|robot|technology|ai)$/.test(x.w || ''))) ja = ja.replace(/と期待されて(いる|いた|いて)/g, 'と予想されて$1');""")
# 3) recognize の 分かる は 代名詞・場所だけ（recognize human faces は 認識する）
rep("""'recognize|it him her them place town village city face faces voice voices|が|分かる',""",
    """'recognize|it him her them place town village city|が|分かる',""")
# 4) get (more) exercise → もっと運動する（VOBJ では「より多くの運動をする」になるので個別に）
rep("""'get|exercise|を|する', """, "")
rep("""      if (L === 'miss' && /^connections?$/.test(oh)""",
    """      if (L === 'get' && oh === 'exercise' && !vg.passive) { sense = { particle: '', core: (T.slice(vg.idx + 1, objs[0].end).some((x) => isW(x, 'more')) ? 'もっと' : '') + '運動する', tr: true, noParticle: true }; objs[0] = Object.assign({}, objs[0], { ja: '' }); }   // get more exercise → もっと運動する
      if (L === 'miss' && /^connections?$/.test(oh)""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
