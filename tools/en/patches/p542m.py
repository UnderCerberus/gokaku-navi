import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Heat produced by cars, air conditioners, and factories → 車やエアコン、工場によって生み出された熱（過去分詞 + by + 乗り物の複数形は行為者。「車で生産された」にしない）
rep("""        if (obj.head && TRANSPORT[obj.head] && !obj.det) return R(n + 'で', 'other');""",
    """        if (obj.head && TRANSPORT[obj.head] && !obj.det && (obj.pl || obj.coord) && (() => { let qB = obj.end - 1; while (qB > 0 && !isW(T[qB], 'by')) qB--; return qB > 0 && T[qB - 1].k === 'w' && !!vc(T[qB - 1], ['pp']) && !vc(T[qB - 1], ['base']); })()) return R(n + 'によって', 'agent', n + 'による');
        if (obj.head && TRANSPORT[obj.head] && !obj.det) return R(n + 'で', 'other');""")

# than the countryside around it / than the area near the sea（than + 名詞 + 場所の前置詞句は名詞につける。「その周りに田舎より」にしない）
rep("""            if (n && n.end < lim && T[n.end].k === 'w' && /^(?:on|in|at|of|from|inside|with)$/.test(T[n.end].w)) {""",
    """            if (n && n.end < lim && T[n.end].k === 'w' && /^(?:on|in|at|of|from|inside|with|around|near|outside|along|behind|below|above|beside|across|under|nearby)$/.test(T[n.end].w)) {""")

# Heat produced by cars → 車によって生み出された熱（受け身の produce / generate + 熱・エネルギー・音などの主語は「生み出す」。「生産された」にしない）
rep("""    if (usedGap && o.gap && o.gap.rel && !objs.length && !vg.passive) {   // 関係詞の穴が目的語のとき""",
    """    if (vg.passive && /^(?:produce|generate|create)$/.test(L) && o.subj && /^(?:field|fields|energy|current|currents|heat|light|sound|sounds|force|pressure|wave|waves|electricity|gas|gases|oxygen|power|noise|noises|signal|signals|vibration|vibrations|waste|smoke|emissions|pollution)$/.test(plainSubj(o.subj).head || '')) sense = { particle: 'を', core: '生み出す', tr: true };
    if (usedGap && o.gap && o.gap.rel && !objs.length && !vg.passive) {   // 関係詞の穴が目的語のとき""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
