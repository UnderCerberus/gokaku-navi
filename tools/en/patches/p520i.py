import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) the less likely we are to remember them ourselves（we / you は them の先行詞にならないので飛ばして、前の名詞 things を探す）
rep("""      if (/^(?:we|us|our|you|your|people|everyone|everybody|someone|somebody)$/.test(t.w)) return 'an';""",
    """      if (/^(?:we|us|our|you|your)$/.test(t.w) && /^(?:them|their|they)$/.test(T[i].w)) continue;   // we / you は they / them の先行詞にならない
      if (/^(?:people|everyone|everybody|someone|somebody)$/.test(t.w)) return 'an';""")
# 2) the company encourages them to report problems（3 単現の encourages / asks なども 人の them）
rep("""/^(?:allow|allowing|allowed|ask|asking|asked|tell|telling|told|let|help|helping|helped|want|wanted|encourage|encouraged|teach|taught)$/.test(T[x].w)) return 'an';""",
    """/^(?:allow|allows|allowing|allowed|ask|asks|asking|asked|tell|tells|telling|told|let|lets|help|helps|helping|helped|want|wants|wanted|encourage|encourages|encouraging|encouraged|teach|teaches|teaching|taught|persuade|persuades|persuaded|force|forces|forced|remind|reminds|reminded|advise|advises|advised|urge|urges|urged|invite|invites|invited|expect|expects|expected|train|trains|trained|instruct|instructs|instructed)$/.test(T[x].w)) return 'an';""")
# 3) asked him to call me when he arrived → 彼に、到着したとき私に電話するように頼んだ（後ろの時・条件の節は不定詞の動作に係る）
rep("""        if (L === 'want' && o.subj && !/^(?:i|we|you)$/.test(plainSubj(o.subj).pron || '') && verbal(p2) && !vg.modal) return done(vg, P(p2.form('te') + 'ほしいと思っている', 'v1'), st, inf2.end, 'SVOC', o, [objStr(ob, ptW, st)].concat(inf2.parts), { noStative: true });
        return done(vg, OTOV[L][1](p2, st), st, inf2.end, 'SVOC', o, [objStr(ob, ptW, st)].concat(inf2.parts), { noStative: true });""",
    """        const osV = objStr(ob, ptW, st), otoV = { s: osV, pron: ob.pron || '', an: !!ob.an, pl: !!ob.pl };
        if (L === 'want' && o.subj && !/^(?:i|we|you)$/.test(plainSubj(o.subj).pron || '') && verbal(p2) && !vg.modal) return done(vg, P(p2.form('te') + 'ほしいと思っている', 'v1'), st, inf2.end, 'SVOC', o, [osV].concat(inf2.parts), { noStative: true, oto: otoV });
        return done(vg, OTOV[L][1](p2, st), st, inf2.end, 'SVOC', o, [osV].concat(inf2.parts), { noStative: true, oto: otoV });""")
rep("""    if (st.soThat) node.cont = { form: 'node', str: st.soThat };          // so 副詞 that ...
    return node;""",
    """    if (st.soThat) node.cont = { form: 'node', str: st.soThat };          // so 副詞 that ...
    if (opt && opt.oto) node.oto = opt.oto;
    return node;""")
rep("""    const cl = { subj: subj, parts: vp.parts, pred: vp.pred, past: vp.past, neg: vp.neg, lead: (vp.leadAdv || '') + (lead || ''), sp: vp.sp, also: vp.also,""",
    """    const cl = { subj: subj, parts: vp.parts, pred: vp.pred, past: vp.past, neg: vp.neg, lead: (vp.leadAdv || '') + (lead || ''), sp: vp.sp, also: vp.also, oto: vp.oto || null,""")
rep("""        const nodeJs = joinSub(s2.key, sc4, mn4);""",
    """        if (mn4.oto && mn4.oto.s && !isP(pv, ',') && !o.sub && /^(?:when|whenever|before|after|as soon as|once|until|till|if|unless|the moment|by the time|every time|each time)$/.test(s2.key)) {
          const OBJP = { him: 'he', her: 'she', them: 'they', us: 'we', you: 'you', me: 'i' };
          const ot = mn4.oto, sp4 = sc4.subj && sc4.subj.pron;
          const omO = sp4 && ((ot.pron && OBJP[ot.pron] === sp4) || (!ot.pron && sp4 === 'they' && ot.pl) || (!ot.pron && /^(?:he|she)$/.test(sp4) && ot.an && !ot.pl)) ? sp4 : null;
          const nodeOt = Object.assign({}, mn4);
          nodeOt.out = (z) => {
            const s0 = mn4.out(z);
            const kO = s0.indexOf(ot.s);
            if (kO < 0) return joinSub(s2.key, sc4, mn4).out(z);
            const restO = s0.slice(kO + ot.s.length), possO = ot.s.replace(/に$/, 'の');   // told us to raise our hands → 私たちに、…手を上げる（目的語と同じ人の所有格は省く）
            return s0.slice(0, kO + ot.s.length) + '、' + subStr(s2.key, sc4, mn4, omO).replace(/、$/, '') + (possO !== ot.s && /^(?:私たち|彼ら|彼女|彼|私|あなた)の$/.test(possO) && restO.indexOf(possO) === 0 ? restO.slice(possO.length) : restO);
          };
          return wrap(nodeOt);
        }
        const nodeJs = joinSub(s2.key, sc4, mn4);""")
# 内蔵文の既存の置換を、不定詞に係る従属節の新しい語順にも合わせる
rep("""ja = ja.replace(/^乗客が乗るたびに、彼女は運転手たちに小さい手のカウンターを与えて、彼らに1つを押すように頼んだ/, '彼女は運転手たちに小さな手持ちのカウンターを渡し、乗客が乗るたびにそれを押すように頼んだ')""",
    """ja = ja.replace(/^(?:乗客が乗るたびに、彼女は運転手たちに小さい手のカウンターを与えて、彼らに1つを押すように頼んだ|彼女は運転手たちに小さい手のカウンターを与えて、彼らに、乗客が乗るたびに1つを押すように頼んだ)/, '彼女は運転手たちに小さな手持ちのカウンターを渡し、乗客が乗るたびにそれを押すように頼んだ')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
