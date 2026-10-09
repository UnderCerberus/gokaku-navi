import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# it is never too late to learn something new → 何か新しいことを学ぶのに遅すぎることは決してない（never も否定の too … to）
# It is too late to go back now → 今戻るには遅すぎる（late は「遅すぎて〜できない」にしない）
rep("""            if (vg.neg && f2.stem !== null && (f2.kind === 'i' || f2.kind === 'na')) {
              vg.neg = false; st.neg = false;
              const rNt = fin(P(f2.stem + 'すぎることはない', 'i'), inf.end, 'SVC', [(ft.np ? ft.np.ja + 'が' : '') + vpJoin(inf, 'dict') + 'のに']);""",
    """            const neverTt = (vg.advs || []).some((x) => x.w === 'never') || !!st.never;
            if ((vg.neg || neverTt) && f2.stem !== null && (f2.kind === 'i' || f2.kind === 'na')) {
              vg.neg = false; st.neg = false;
              if (neverTt) { vg.advs = (vg.advs || []).filter((x) => x.w !== 'never'); st.never = false; }
              const rNt = fin(P(f2.stem + 'すぎることは' + (neverTt ? '決して' : '') + 'ない', 'i'), inf.end, 'SVC', [(ft.np ? ft.np.ja + 'が' : '') + vpJoin(inf, 'dict') + 'のに']);""")
rep("""            const pre = tooTe(f2);
            st.neg = true;""",
    """            if (a2.lemma === 'late' && !ft.np && f2.stem) { const mLt = mark(); const infLt = vpNonfin(ft.end + 1, lim, 'base', { subj: sj }); if (infLt && infLt.end === inf.end) { const rLt = fin(P(f2.stem + 'すぎる', 'v1'), infLt.end, 'SVC', [vpJoin(infLt, 'dict') + 'には']); if (rLt && sj && sj.pron === 'it') rLt.noSubj = true; return rLt; } fail(mLt); }   // It is too late to go back now → 今戻るには遅すぎる
            const pre = tooTe(f2);
            st.neg = true;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
