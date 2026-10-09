import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# He asked me yesterday where I lived / asked me ten years ago where I would be living → 昨日私にどこに住んでいるか尋ねた（目的語の代名詞 + 時の句 + 疑問詞節）
rep("""    const need = OTOV[L] || CAUS[L] || INGO[L] || SVOCV[L] || TELLV[L] || L === 'get' || L === 'have';
    if (!need) return null;""",
    """    const need = OTOV[L] || CAUS[L] || INGO[L] || SVOCV[L] || TELLV[L] || L === 'get' || L === 'have';
    if (!need) return null;
    if (TELLV[L] && T[i] && T[i].k === 'w' && /^(?:me|him|her|us|them|you)$/.test(T[i].w) && i + 3 < lim && !WH[T[i + 1].w] && T.slice(i + 2, Math.min(lim, i + 7)).some((x) => x.k === 'w' && (WH[x.w] || x.w === 'whether'))) {
      const mTw = mark();
      const stTw = newSt(vg);
      const eTw = tail(i + 1, T.findIndex((x, q) => q > i + 1 && x.k === 'w' && (WH[x.w] || x.w === 'whether')), stTw, o, vg);
      const kTw = eTw > i + 1 && T[eTw] && T[eTw].k === 'w' && (WH[T[eTw].w] || T[eTw].w === 'whether') ? eTw : -1;
      const wcTw = kTw > 0 && stTw.time.length && !stTw.other.length ? whClause(kTw, lim) : null;
      if (wcTw && wcTw.end === lim) {
        stTw.time.forEach((x) => st.time.push(x));
        name('indirect-q');
        const PJo = { me: '私', him: '彼', her: '彼女', us: '私たち', them: '彼ら', you: 'あなた' };
        return done(vg, P(L === 'ask' ? '尋ねる' : (L === 'tell' ? '教える' : verbSense(vg.e, true).core), L === 'ask' ? 'v1' : 'v1'), st, lim, 'SVOO', o, [PJo[T[i].w] + 'に', wcTw.str]);   // asked me ten years ago where …
      }
      fail(mTw);
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
