import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the purpose of the contest was not to win but to share my ideas with others → 勝つことではなく、自分の考えを他の人たちと共有することだった
# （be not to A but to B の補語は「A ことではなく、B ことだ」）
rep("""    if (isW(t, 'to') && j + 1 < lim && vc(T[j + 1], ['base'])) {
      const plan = !sj || anim || !!sj.pron || sj.time ||""",
    """    if (vg.neg && isW(t, 'to') && j + 1 < lim && vc(T[j + 1], ['base'])) {
      const kBt = T.findIndex((x, q) => q > j + 1 && q < lim - 2 && isW(x, 'but') && isW(T[q + 1], 'to'));
      if (kBt > 0) {
        const mBt = mark();
        const eAt = isP(T[kBt - 1], ',') ? kBt - 1 : kBt;
        const iAt = vpNonfin(j + 1, eAt, 'base', {});
        const iBt = iAt && iAt.end === eAt ? vpNonfin(kBt + 2, lim, 'base', {}) : null;
        if (iBt) {
          const ngBt = vg.neg, sngBt = st.neg;
          vg.neg = false; st.neg = false;
          name('not-but');
          const rBt = fin(P(vpJoin(iAt, 'dict') + 'ことではなく、' + vpJoin(iBt, 'dict') + 'ことだ', 'da'), iBt.end, 'SVC');
          if (rBt) return rBt;
          vg.neg = ngBt; st.neg = sngBt;
        }
        fail(mBt);
      }
    }
    if (isW(t, 'to') && j + 1 < lim && vc(T[j + 1], ['base'])) {
      const plan = !sj || anim || !!sj.pron || sj.time ||""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
