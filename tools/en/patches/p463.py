import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# spread from China to the Middle East and eventually to Europe → 中東へ、そして最終的にはヨーロッパへ（and + 副詞 + 前置詞句の並列）
rep("""    // 前置詞句の並列（by a star or by a mountain）
    if ((isW(t, 'and') || isW(t, 'or')) && j + 2 < lim && T[j + 1].k === 'w' && (PREP[T[j + 1].w] || mprepAt(j + 1)) && (st.other.length || st.agent || st.time.length || st.manner.length) &&""",
    """    // 前置詞句の並列（by a star or by a mountain）/ and eventually to Europe（and + 副詞 + 前置詞句）
    if ((isW(t, 'and') || isW(t, 'or')) && j + 3 < lim && T[j + 1].k === 'w' && /^(?:eventually|finally|then|later|even|also|later)$/.test(T[j + 1].w) && T[j + 2].k === 'w' && PREP[T[j + 2].w] && !(isW(T[j + 2], 'to') && T[j + 3] && T[j + 3].k === 'w' && vc(T[j + 3], ['base'])) && (st.other.length || st.time.length)) {
      const mAp = mark();
      const ppA = parsePP(j + 2, lim, { verbal: !!vg && vg.lemma !== 'be', lemma: vg ? vg.lemma : '' });
      if (ppA && ppA.ja) {
        const advA = ({ eventually: '最終的には', finally: '最後に', then: 'それから', later: 'のちに', even: 'さらには', also: 'また' })[T[j + 1].w];
        st.other.push('、' + (t.w === 'or' ? 'または' : 'そして') + advA + ppA.ja.replace(/に$/, 'へ'));
        return ppA.end;
      }
      fail(mAp);
    }
    if ((isW(t, 'and') || isW(t, 'or')) && j + 2 < lim && T[j + 1].k === 'w' && (PREP[T[j + 1].w] || mprepAt(j + 1)) && (st.other.length || st.agent || st.time.length || st.manner.length) &&""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
