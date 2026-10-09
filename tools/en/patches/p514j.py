import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# despite strong opposition from the public → 国民からの強い反対にもかかわらず（despite / in spite of の名詞句は from / of / among の句まで含める）
rep("""    if (obj && !obj.an && !obj.pron && obj.end < lim && isW(T[obj.end], 'alone')) obj = Object.assign({}, obj, { ja: obj.ja + 'だけ', end: obj.end + 1 });   // by one country alone → 1か国だけによって""",
    """    if (obj && !obj.an && !obj.pron && obj.end < lim && isW(T[obj.end], 'alone')) obj = Object.assign({}, obj, { ja: obj.ja + 'だけ', end: obj.end + 1 });   // by one country alone → 1か国だけによって
    if (obj && /^(?:despite|in spite of)$/.test(key || (idi && idi.toks ? idi.toks.join(' ') : '')) && obj.end < lim && T[obj.end].k === 'w' && /^(?:from|of|among|by|against|in)$/.test(T[obj.end].w)) { const mDs = mark(); const oDs = np(j, lim, { noCoord: o.noCoord, noWhat: true, pp: true }); if (oDs && oDs.end > obj.end) obj = oDs; else fail(mDs); }""")

# letters could take weeks → 何週間もかかることがあった（could / can + take は可能性）
rep("""          name('it-takes');
          return done(vg, P(vpJoin(iTk, 'dict').replace(/^到着する$/, '届く') + 'のに' + dJa + 'かかる', 'v5'), st, lim, 'SVO', o, [], { noStative: true });""",
    """          name('it-takes');
          const canTk = /^(?:can|could)$/.test(vg.modal || '');
          return done(canTk ? Object.assign({}, vg, { modal: '' }) : vg, P(vpJoin(iTk, 'dict').replace(/^到着する$/, '届く') + 'のに' + dJa + (canTk ? (vg.modal === 'could' ? 'かかることもあった' : 'かかることもある') : 'かかる'), canTk ? 'fix' : 'v5'), st, lim, 'SVO', o, [], { noStative: true });""")

# get used to life in the new country → 新しい国での生活に慣れる（get / be used to の目的語は前置詞句まで）
rep("""          if (!obj) obj = gerundNP(s0, lim) || np(s0, lim, {});""",
    """          if (!obj && it.it && /^(?:get used to ~|be used to ~|become used to ~|adapt to ~|adjust to ~|get accustomed to ~)$/.test(it.it.phrase) && !ingVerb(s0, lim)) { const mUt = mark(); const oUt = np(s0, lim, { pp: true }); if (oUt && oUt.end === lim) obj = oUt; else fail(mUt); }
          if (!obj) obj = gerundNP(s0, lim) || np(s0, lim, {});""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
