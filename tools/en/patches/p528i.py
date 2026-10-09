import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# We ran out of milk, so I went to the store to buy some → 少し買いに行った（先行する名詞が不可算（milk / water / bread …）なら some は「少し」。いくつかを にしない）
rep("""    if (n.anyIn && (st.neg || st.vgNeg || st.vgNever || st.vgHardly)) {""",
    """    if (n.pron === 'some' && n.ja === 'いくつか' && particle === 'を') {
      const qS = T.findIndex((x) => isW(x, 'some') && x.k === 'w');
      let cS = -1;
      for (let x = (qS > 0 ? qS : T.length) - 1; x >= 0; x--) if (isP(T[x], ',')) { cS = x; break; }
      for (let x = (cS > 0 ? cS : (qS > 0 ? qS : T.length)) - 1; x >= 0; x--) { if (T[x].k === 'w' && !!nounC(T[x]) && !PRON[T[x].w] && DET[T[x].w] === undefined) { if (UNCOUNT[T[x].w]) return '少し'; break; } }
    }
    if (n.anyIn && (st.neg || st.vgNeg || st.vgNever || st.vgHardly)) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
