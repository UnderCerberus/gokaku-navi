import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) when 節どうしの比較: People spend more money when they pay by card than when they pay in cash
#    → 現金で支払うときより、カードで支払うときのほうが、より多くのお金を使う
rep("""      const m4 = mark();
      const je = isP(pv, ',') ? j - 1 : j;
      let mn4 = sentence(a, je, s2.key === 'since' ? Object.assign({}, o, { sinceCont: true }) : o) || (o.top ? imperative(a, je) : null);   // I have known her since … → 知っている（継続）""",
    """      const m4 = mark();
      const je = isP(pv, ',') ? j - 1 : j;
      if (s2.key === 'when' && !o.sub) {
        const tW = T.findIndex((x, q) => q > j + 1 && q < b - 2 && isW(x, 'than') && isW(T[q + 1], 'when'));
        const cmpW = tW > 0 && T.slice(a, j).some((x) => x.k === 'w' && (/^(?:more|less|fewer|better|worse)$/.test(x.w) || (!!adjC(x) && adjC(x).form === 'comp') || (!!advC(x) && !!advC(x).comp)));
        if (cmpW) {
          const mnC = sentence(a, je, o);
          const scA = mnC ? sentence(j + s2.len, tW, { sub: true }) : null;
          const scB = scA ? sentence(tW + 2, b, { sub: true }) : null;
          if (scB) {
            name('comparative');
            const nodeC = joinSub('when', scA, mnC);
            const outC = nodeC.out;
            nodeC.out = (z) => {
              const s0 = outC(z);
              for (const om of [null, scA.subj && scA.subj.pron, mnC.subj && mnC.subj.pron]) {
                const sa = subStr('when', scA, mnC, om || null);
                if (sa && s0.indexOf(sa) >= 0) return s0.replace(sa, subStr('when', scB, mnC, om || null).replace(/、$/, '') + 'より、' + sa.replace(/、$/, '') + 'のほうが、');
              }
              return subStr('when', scB, mnC, null).replace(/、$/, '') + 'より、' + s0;
            };
            return wrap(nodeC);
          }
          fail(m4);
        }
      }
      let mn4 = sentence(a, je, s2.key === 'since' ? Object.assign({}, o, { sinceCont: true }) : o) || (o.top ? imperative(a, je) : null);   // I have known her since … → 知っている（継続）""")

# 2) Prices are higher in Tokyo than in Osaka → 物価は東京では大阪より高い（形容詞の比較級 + 前置詞句 + than + 前置詞句）
rep("""          if (isW(T[e], 'than') && e + 2 === lim && T[e + 1].k === 'w' && TMW[T[e + 1].w] && !(T[e + 1].w === 'ever' || T[e + 1].w === 'usual' || T[e + 1].w === 'before')) return W(fin(P(deg + f.pred.s, f.pred.cls), lim, 'SVC', [TMW[T[e + 1].w] + 'より']));""",
    """          if (isW(T[e], 'than') && e + 2 === lim && T[e + 1].k === 'w' && TMW[T[e + 1].w] && !(T[e + 1].w === 'ever' || T[e + 1].w === 'usual' || T[e + 1].w === 'before')) return W(fin(P(deg + f.pred.s, f.pred.cls), lim, 'SVC', [TMW[T[e + 1].w] + 'より']));
          if (T[e] && T[e].k === 'w' && PREP[T[e].w] && !/^(?:than|to|of)$/.test(T[e].w) && e + 3 < lim) {
            const mPc = mark();
            const pc1 = parsePP(e, lim, {});
            const pc2 = pc1 && isW(T[pc1.end], 'than') && pc1.end + 2 < lim && T[pc1.end + 1].k === 'w' && PREP[T[pc1.end + 1].w] ? parsePP(pc1.end + 1, lim, {}) : null;
            if (pc2) return W(fin(P(deg + f.pred.s, f.pred.cls), tail(pc2.end, lim, st, o, vg), 'SVC', [pc1.ja.replace(/に$/, 'で') + 'は' + pc2.ja.replace(/(?:に|で|には|では)$/, '') + 'より']));
            fail(mPc);
          }""")

# 3) She was happier then than she is now → 当時は今より幸せだった
rep("""          const TMW = { yesterday: '昨日', today: '今日', tomorrow: '明日', tonight: '今夜', now: '今', before: '以前', usual: 'いつも', ever: 'これまで' };
          if (T[e] && T[e].k === 'w' && /^(?:today|now|tonight|yesterday|tomorrow)$/.test(T[e].w) && isW(T[e + 1], 'than') && e + 2 < lim) { st.other.push(TMW[T[e].w] + 'は'); e++; }""",
    """          const TMW = { yesterday: '昨日', today: '今日', tomorrow: '明日', tonight: '今夜', now: '今', before: '以前', usual: 'いつも', ever: 'これまで', then: '当時' };
          if (T[e] && T[e].k === 'w' && /^(?:today|now|tonight|yesterday|tomorrow|then)$/.test(T[e].w) && isW(T[e + 1], 'than') && e + 2 < lim) { st.other.push(TMW[T[e].w] + 'は'); e++; }""")
rep("""    const m = mark(), last = T[lim - 1];
    if (!last || last.k !== 'w') return null;
    // than before / than ever / than usual / than expected""",
    """    const m = mark(), last = T[lim - 1];
    if (!last || last.k !== 'w') return null;
    // than she is now / than it is today（主語 + be・助動詞 + 時の語 → 今・今日）
    if (lim - i >= 3 && /^(?:now|today|nowadays)$/.test(last.w) && T[lim - 2].k === 'w' && (BE[T[lim - 2].w] || DO[T[lim - 2].w] || MODAL[T[lim - 2].w] || HAVE[T[lim - 2].w])) {
      const TNOW = { now: '今', today: '今日', nowadays: '今' };
      const sjN = subject(i, lim - 2);
      if (sjN && sjN.end === lim - 2) return (sjN.pron && mainSj && samePerson(mainSj.pron, sjN.pron)) || sjN.pron === 'it' ? TNOW[last.w] : TNOW[last.w] + 'の' + sjN.ja;
      fail(m);
    }
    // than before / than ever / than usual / than expected""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
