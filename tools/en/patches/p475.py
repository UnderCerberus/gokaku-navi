import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Cities may become less safe → 安全でなくなる（become / be のあとの less + 形容詞にもなる語は「より少ない＋名詞」にしない）
rep("""  function modifier(i, lim, allowPart) {
    const t = T[i];
    if (!t || i >= lim || t.k !== 'w') return null;
""", """  function modifier(i, lim, allowPart) {
    const t = T[i];
    if (!t || i >= lim || t.k !== 'w') return null;
    if (t.w === 'less' && T[i + 1] && T[i + 1].k === 'w' && !!adjC(T[i + 1]) && T[i - 1] && /^(?:become|becomes|became|becoming|get|gets|got|getting|grow|grows|grew|growing|is|are|was|were|be|been|being|seem|seems|seemed|look|looks|looked|feel|feels|felt|remain|remains|remained|much|far|even|slightly|increasingly)$/.test(T[i - 1].w || '') &&
      (i + 2 >= lim || T[i + 2].k === 'p' || /^(?:than|and|or|for|to|in|at|on|with|because|when|if|as|now|than|today)$/.test(T[i + 2].w || ''))) return null;
""")

rep("""'for half an hour': '30分間', """,
    """'for half an hour': '30分間', 'in recent decades': 'ここ数十年で', 'over recent decades': 'ここ数十年で', 'in the years to come': '今後', 'in the years ahead': '今後', 'for years to come': '今後何年にもわたって', 'in the decades to come': '今後数十年で', """)

rep("""    ja = ja.replace(/知識の隙間/g, '知識の空白')""",
    """    if (tokens.some((x, k) => x.w === 'such' && tokens[k + 1] && tokens[k + 1].w === 'as')) ja = ja.replace(/([^、。をがはにでとや]{1,12})と([^、。をがはにでとや]{1,12})のような/g, '$1や$2などの');   // problems such as traffic congestion and air pollution → 交通渋滞や大気汚染などの問題
    ja = ja.replace(/一方で、また/g, '一方で、');
    ja = ja.replace(/知識の隙間/g, '知識の空白')""")

# bring + 抽象名詞 → もたらす
rep("""      else if (L === 'say' && ((objs[0].pron""",
    """      else if (L === 'bring' && !vg.passive && /(?:^| )(?:problem|problems|benefit|benefits|change|changes|happiness|joy|peace|prosperity|success|danger|dangers|risk|risks|advantage|advantages|disadvantage|disadvantages|improvement|improvements|growth|wealth|luck|misfortune|disaster|disasters|damage|harm|hope|relief|comfort|progress|innovation|opportunity|opportunities|challenge|challenges|stress|pollution|congestion|convenience|conveniences|result|results|effect|effects|consequence|consequences)$/.test(oh) && !T.slice(vg.idx + 1, lim).some((x) => /^(?:here|home|back|along|with)$/.test(x.w || ''))) sense = { particle: 'を', core: 'もたらす', tr: true };   // it also brings problems → 問題をもたらす
      else if (L === 'say' && ((objs[0].pron""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
