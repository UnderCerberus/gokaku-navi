import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 文末の結果の分詞構文: …, threatening marine life / …, putting pressure on … → 〜て、…を脅かしている（現在の主節なら「〜している」）
rep("""      if (!(isP(T[x], ',') && T[x + 1].k === 'w' && /^(?:making|causing|leading|resulting|leaving|killing|forcing|bringing|giving|allowing|enabling|preventing|creating|raising|reducing|increasing|destroying|damaging|adding|contributing|producing|spreading|affecting)$/.test(T[x + 1].w))) continue;""",
    """      if (!(isP(T[x], ',') && T[x + 1].k === 'w' && /^(?:making|causing|leading|resulting|leaving|killing|forcing|bringing|giving|allowing|enabling|preventing|creating|raising|reducing|increasing|destroying|damaging|adding|contributing|producing|spreading|affecting|threatening|putting|pushing|harming|endangering|costing|saving|driving|turning|changing|attracting|drawing|prompting|sparking|triggering|generating|providing|offering|helping|encouraging|placing|posing|reaching|ending|limiting|lowering|boosting|improving|worsening|transforming|replacing|shaping)$/.test(T[x + 1].w))) continue;""")
rep("""      if (lfRP && vRP && vRP.end === b) { name('participle-const'); return wrap({ out: (y) => lfRP.out(Object.assign({}, y || {}, { form: 'te' })) + '、' + vpJoin(vRP, lfRP.past ? 'past' : 'dict'), sp: lfRP.sp, subj: lfRP.subj, past: lfRP.past }); }""",
    """      if (lfRP && vRP && vRP.end === b) { name('participle-const'); return wrap({ out: (y) => lfRP.out(Object.assign({}, y || {}, { form: 'te' })) + '、' + (lfRP.past && !lfRP.perfect ? vpJoin(vRP, 'past') : (verbal(vRP.pred) && !/(?:ている|でいる)$/.test(vRP.pred.plain()) ? vpJoin(vRP, 'te') + 'いる' : vpJoin(vRP, 'dict'))), sp: lfRP.sp, subj: lfRP.subj, past: lfRP.past }); }""")

# a luxury that only the rich could afford → 金持ちだけが買う余裕があったぜいたく（関係詞の穴が afford の目的語）
rep("""      else if (L === 'make' && /^(?:impression|impressions)$/.test(gaA)) sense = { particle: 'を', core: '与える', tr: true };""",
    """      else if (L === 'make' && /^(?:impression|impressions)$/.test(gaA)) sense = { particle: 'を', core: '与える', tr: true };
      else if (L === 'afford' && gaA && !/^(?:time|risk)$/.test(gaA)) sense = { particle: 'を', core: '買う余裕がある', tr: true };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
