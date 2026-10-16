import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Your chronotype is controlled partly by your genes and partly by your age → 一部は遺伝子によって、一部は年齢によって
# The damage was caused mainly by the wind → 主に風によって（受け身のあとの partly / mainly by A (and partly by B) は動作主。「年齢までに」「風のそばに」にしない）
rep("""  function modOther(j, lim, st, o, vg) {
    const t = T[j];
    if (!t || j >= lim || t.k !== 'w') return -1;""",
    """  function modOther(j, lim, st, o, vg) {
    const t = T[j];
    if (!t || j >= lim || t.k !== 'w') return -1;
    const PTB = { partly: '一部は', mainly: '主に', largely: '主に', mostly: '主に', entirely: '完全に', partially: '一部は' };
    if (vg && vg.passive && PTB[t.w] && isW(T[j + 1], 'by') && j + 2 < lim) {
      const mPb = mark();
      const kAnd = T.findIndex((x, q) => q > j + 2 && q < lim - 2 && isW(x, 'and') && T[q + 1] && PTB[T[q + 1].w] && isW(T[q + 2], 'by'));
      const n1Pb = np(j + 2, kAnd > 0 ? (isP(T[kAnd - 1], ',') ? kAnd - 1 : kAnd) : lim, { noRel: true });
      const n2Pb = kAnd > 0 && n1Pb ? np(kAnd + 3, lim, { noRel: true }) : null;
      if (n1Pb && (kAnd < 0 || !!n2Pb)) {
        st.other.push(PTB[t.w] + n1Pb.ja.replace(/^(?:あなたの|私たちの)/, '') + 'によって' + (n2Pb ? '、' + PTB[T[kAnd + 1].w] + n2Pb.ja.replace(/^(?:あなたの|私たちの)/, '') + 'によって' : ''));
        st.agent = '';
        return n2Pb ? n2Pb.end : n1Pb.end;
      }
      fail(mPb);
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
