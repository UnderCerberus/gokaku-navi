import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I believe online games are fun / I think online classes will become popular（that のない節が「形容詞 + 名詞」で始まる）
rep("""|| (!WH[t.w] && ((PRON[t.w] && PRON[t.w].sub) || DET[t.w] !== undefined || nounC(t) || (THINKV[L] && ingVerb(i, lim)))))) {   // I think there is another way""",
    """|| (!WH[t.w] && ((PRON[t.w] && PRON[t.w].sub) || DET[t.w] !== undefined || nounC(t) || (THINKV[L] && ingVerb(i, lim)) || (!!adjC(t) && T[i + 1] && T[i + 1].k === 'w' && !!nounC(T[i + 1]) && T.slice(i + 2, lim).some((x) => x.k === 'w' && (!!BE[x.w] || !!MODAL[x.w] || (!!vc(x, ['3sg', 'past', 'base']) && !nounC(x))))))))) {   // I think there is another way""")

rep("""'for half an hour': '30分間', """,
    """'for half an hour': '30分間', 'at any time': 'いつでも', """)

rep("""    ja = ja.replace(/私的な生活/g, '私生活')""",
    """    if (tokens.some((x) => x.w === 'anywhere') && tokens.some((x) => /^(?:can|could)$/.test(x.w || ''))) ja = ja.replace(/いつでもどこかで/g, 'いつでもどこでも').replace(/どこかで/g, 'どこでも');   // people can study anywhere at any time → いつでもどこでも勉強できる
    ja = ja.replace(/私的な生活/g, '私生活')""")

rep("""      else if (L === 'allow' && objs.length === 1 && !objs[0].an && !objs[0].pron && /(?:^| )(?:smartphone|""",
    """      else if (L === 'allow' && objs.length === 1 && !objs[0].an && !objs[0].pron && /(?:^| )(?:hours|work|flexibility|telework|leave|holidays|vacation|vacations|breaks)$/.test(oh)) sense = { particle: 'を', core: '認める', tr: true };   // allow flexible working hours → 柔軟な勤務時間を認める
      else if (L === 'allow' && objs.length === 1 && !objs[0].an && !objs[0].pron && /(?:^| )(?:smartphone|""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
