import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The village is not easy to reach → 村に着くのは簡単ではない（不定詞の動詞の目的語の助詞を使う: 村を着く にしない）
# The village is by no means easy to reach → 村に着くのは決して簡単ではない（決して は形容詞の前へ）
rep("""            if (TOUGH[a.lemma] && verbal(pv) && vg.neg && gap.used) st.subjWo = true;   // Its causes are not difficult to understand → その原因を理解するのは
            if (TOUGH[a.lemma] && verbal(pv) && vg.neg) { name('tough'); vg.neg = false; st.neg = false; return fin(P(pv.plain() + 'のは' + deg + f.pred.aux('neg').plain(), 'i'), inf3.end, 'SVC', inf3.parts); }   // not difficult to understand → 理解するのは難しくない""",
    """            if (TOUGH[a.lemma] && verbal(pv) && vg.neg && gap.used) { const spTg = inf3.vg && inf3.vg.e ? verbSense(inf3.vg.e, true).particle : ''; st.subjWo = /^(?:に|と|から)$/.test(spTg || '') ? spTg : 'を'; }   // Its causes are not difficult to understand → その原因を理解するのは
            if (TOUGH[a.lemma] && verbal(pv) && vg.neg) { name('tough'); vg.neg = false; st.neg = false; const kTg = (vg.advs || []).some((x) => x.w === 'by no means') ? '決して' : ''; if (kTg) vg.advs = vg.advs.filter((x) => x.w !== 'by no means'); return fin(P(pv.plain() + 'のは' + kTg + deg + f.pred.aux('neg').plain(), 'i'), inf3.end, 'SVC', inf3.parts); }   // not difficult to understand → 理解するのは難しくない""")

rep("""subjSfx: st.subjSfx || '', subjWo: !!st.subjWo, leadAdv""",
    """subjSfx: st.subjSfx || '', subjWo: st.subjWo || false, leadAdv""")
rep("""subjWo: !!vp.subjWo, gaObj""",
    """subjWo: vp.subjWo || false, gaObj""")
rep("""    else if (subjShown && cl.subjWo && !o.part) s += sj.ja + 'を';""",
    """    else if (subjShown && cl.subjWo && !o.part) s += sj.ja + (typeof cl.subjWo === 'string' ? cl.subjWo : 'を');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
