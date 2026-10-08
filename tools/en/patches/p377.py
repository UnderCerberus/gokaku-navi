import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I have to clean my room and do my homework → 部屋を掃除し、宿題をしなければならない（have to も法助動詞のように並列で共有）
rep("""  function modalList(a, b, o) {
    let mi = -1;
    for (let x = a + 1; x < Math.min(b - 2, a + 12); x++) {
      const tx = T[x];
      if (tx.k !== 'w') { if (isP(tx, ',')) continue; return null; }   // In some regions, farmers must …（文頭の句のコンマはよい）
      if (MODAL[tx.w]) { mi = x; break; }""",
    """  function modalList(a, b, o) {
    let mi = -1, mlen = 1;
    for (let x = a + 1; x < Math.min(b - 2, a + 12); x++) {
      const tx = T[x];
      if (tx.k !== 'w') { if (isP(tx, ',')) continue; return null; }   // In some regions, farmers must …（文頭の句のコンマはよい）
      if (MODAL[tx.w]) { mi = x; break; }
      if (/^(?:have|has|had)$/.test(tx.w) && isW(T[x + 1], 'to') && T[x + 2] && T[x + 2].k === 'w' && !!vc(T[x + 2], ['base']) && !BE[T[x + 2].w]) { mi = x; mlen = 2; break; }   // have to A and B""")
rep("""    if (mi < 0 || !/^(?:can|must|should|will|would|may|might)$/.test(T[mi].w)) return null;
    let v0 = mi + 1, neg = false;""",
    """    if (mi < 0 || (mlen === 1 && !/^(?:can|must|should|will|would|may|might)$/.test(T[mi].w))) return null;
    let v0 = mi + mlen, neg = false;""")
rep("""    if (neg && T[mi].w !== 'can') return null;""",
    """    if (neg && (T[mi].w !== 'can' || mlen === 2)) return null;""")
rep("""    const firstT = T.slice(a, mi).concat(T.slice(neg ? mi + 2 : mi + 1, ends[0]));""",
    """    const firstT = T.slice(a, mi).concat(T.slice(neg ? mi + 2 : mi + mlen, ends[0]));""")
rep("""      const lastT = T.slice(0, bl).concat([T[mi]], T.slice(bl, b));   // 前の語も残す（move them の them が前の名詞を受けられるように）""",
    """      const lastT = T.slice(0, bl).concat(T.slice(mi, mi + mlen), T.slice(bl, b));   // 前の語も残す（move them の them が前の名詞を受けられるように）""")
rep("""    const mw = T[mi].w;   // out は別のトークン列の上で呼ばれることがあるので、ここで取っておく""",
    """    const mw = mlen === 2 ? 'haveto' : T[mi].w;   // out は別のトークン列の上で呼ばれることがあるので、ここで取っておく""")
rep("""      const fm = /^(?:should|must|would)$/.test(mw) ? 'stem' : 'te';""",
    """      const fm = /^(?:should|must|would|haveto)$/.test(mw) ? 'stem' : 'te';""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
