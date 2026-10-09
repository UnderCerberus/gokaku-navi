import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) …, eager to V は tail だけでなく目的語の並びの中（vpGeneric）でも来るので modOther の先頭へ移す
rep("""      if (j0 > j && isP(T[j], ',') && T[j0] && T[j0].k === 'w' && /^(?:eager|anxious|keen|desperate|determined|afraid|unable|ready|willing)$/.test(T[j0].w) && isW(T[j0 + 1], 'to') && j0 + 2 < lim) {
        const mEg = mark();
        const iEg = vpNonfin(j0 + 2, lim, 'base', {});
        if (iEg && iEg.end === lim && verbal(iEg.pred)) {
          const wEg = T[j0].w;
          st.other.unshift(/^(?:eager|anxious|keen|desperate)$/.test(wEg) ? iEg.parts.join('') + iEg.pred.form('stem') + 'たくて' : (wEg === 'determined' ? vpJoin(iEg, 'dict') + 'と決意して' : (wEg === 'afraid' ? vpJoin(iEg, 'dict') + 'のを恐れて' : (wEg === 'unable' ? vpJoin(iEg, 'neg').replace(/ない$/, 'られず') : vpJoin(iEg, 'dict') + 'つもりで'))));
          j = lim; continue;
        }
        fail(mEg);
      }
""", "")
rep("""  function modOther(j, lim, st, o, vg) {
    const t = T[j];
    if (!t || j >= lim || t.k !== 'w') return -1;
""", """  function modOther(j, lim, st, o, vg) {
    const t = T[j];
    if (!t || j >= lim || t.k !== 'w') return -1;
    // rushed out of the classroom, eager to enjoy the vacation → 休暇を楽しみたくて（文末の , 形容詞 + to do）
    if (j > 0 && isP(T[j - 1], ',') && /^(?:eager|anxious|keen|desperate|determined|afraid|unable|ready|willing)$/.test(t.w) && isW(T[j + 1], 'to') && j + 2 < lim) {
      const mEg = mark();
      const iEg = vpNonfin(j + 2, lim, 'base', {});
      if (iEg && iEg.end === lim && verbal(iEg.pred)) {
        const wEg = t.w;
        st.other.unshift(/^(?:eager|anxious|keen|desperate)$/.test(wEg) ? iEg.parts.join('') + iEg.pred.form('stem') + 'たくて' : (wEg === 'determined' ? vpJoin(iEg, 'dict') + 'と決意して' : (wEg === 'afraid' ? vpJoin(iEg, 'dict') + 'のを恐れて' : (wEg === 'unable' ? vpJoin(iEg, 'neg').replace(/ない$/, 'られず') : vpJoin(iEg, 'dict') + 'つもりで'))));
        return lim;
      }
      fail(mEg);
    }
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
