import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Curiosity is what drives people to … → 好奇心は人々を…に駆り立てるものだ（名詞の主語 + be + what 節は「もの」）
rep("""    let n4 = gerundNP(j, lim) || np(j, lim, {});""",
    """    let n4 = gerundNP(j, lim) || np(j, lim, {});
    if (n4 && n4.clause && isW(T[j], 'what') && sj && !sj.pron && !sj.gerund && /こと$/.test(n4.ja || '') && !/(?:言った|言う|話した|したい|欲しい|ほしい)こと$/.test(n4.ja)) n4 = Object.assign({}, n4, { ja: n4.ja.replace(/こと$/, 'もの') });""")

# 無生物の主語 + drive + 人 → 駆り立てる（Curiosity drives people → 車で送る にしない）
rep("""      const vob = !vg.passive && VOBJ[L] && oh ? VOBJ[L].find((x) => x.re.test(oh)) : null;
      if (vob) sense = { particle: vob.particle, core: vob.core, tr: true };""",
    """      const vob = !vg.passive && VOBJ[L] && oh ? VOBJ[L].find((x) => x.re.test(oh)) : null;
      if (vob) sense = { particle: vob.particle, core: vob.core, tr: true };
      else if (L === 'drive' && !vg.passive && (objs[0].an || /^(?:them|people|us|him|her|me)$/.test(objs[0].pron || '')) && o.subj && !o.subj.an && !(o.subj.pron && /^(?:i|you|he|she|we|they)$/.test(o.subj.pron)) && !/(?:^| )(?:car|cars|bus|buses|taxi|taxis|truck|trucks|driver|drivers)$/.test(plainSubj(o.subj).head || '')) sense = { particle: 'を', core: '駆り立てる', tr: true };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
