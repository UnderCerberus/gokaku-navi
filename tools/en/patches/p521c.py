import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# he insists that his success came from hard work → 努力から来たと主張する（insist / suggest の that 節が直説法（過去・助動詞・3 単現・be の活用形）なら「と」。ように は仮定法現在だけ）
rep("""        if (suggInd) { name('that-clause'); return done(vg, P('示唆する', 'suru'), st, tc.end, 'SVO', o, [tStr.replace(/だ$/, 'だ') + 'と']); }""",
    """        if (suggInd) { name('that-clause'); return done(vg, P('示唆する', 'suru'), st, tc.end, 'SVO', o, [tStr.replace(/だ$/, 'だ') + 'と']); }
        const insInd = /^(?:insist|maintain)$/.test(L) && !!tc.cl && (!!tc.cl.past || !!tc.cl.perfect || /^(?:may|might|could|can|will|would|must|should)$/.test(tc.cl.modal || '') || T.slice(i, tc.end).some((x) => x.k === 'w' && (/^(?:is|are|was|were|has|does|am)$/.test(x.w) || (!!vc(x, ['3sg']) && !nounC(x)))));
        if (insInd) { name('that-clause'); return done(vg, P('主張する', 'suru'), st, tc.end, 'SVO', o, [tStr.replace(/だろう$/, '') + 'と']); }   // he insists that his success came from hard work → 来たと主張する""")
# Although he is often described as a genius, he himself insists … → 彼はよく…けれども、彼自身は…（強調の再帰代名詞つきの主語は前に出さない）
rep("""    const same = !!sp && sp === mp && /^(?:i|you|he|she|we|they)$/.test(sp);""",
    """    const same = !!sp && sp === mp && /^(?:i|you|he|she|we|they)$/.test(sp) && !(mn.subj && mn.subj.selfEmph);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
