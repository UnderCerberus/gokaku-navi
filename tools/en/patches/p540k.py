import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# My little brother listened to it so many times that he could recite the first part himself → 何度も聞いたので、…暗唱できた
# （so many times that … も so + 副詞 + that と同じ「〜ので」。many times は「何度も」）
rep("""    if (isW(t, 'so') && j + 3 < lim && (advC(T[j + 1]) || isW(T[j + 1], 'much')) && !st.soThat) {
      // so quickly that … / so quickly on such days that …（that の前に前置詞句が入ってもよい）
      let jt = isW(T[j + 2], 'that') ? j + 2 : -1;
      if (jt < 0) { for (let x = j + 2; x < lim - 1 && x < j + 10; x++) {""",
    """    const mtSo = isW(t, 'so') && isW(T[j + 1], 'many') && isW(T[j + 2], 'times');
    if (isW(t, 'so') && j + 3 < lim && (advC(T[j + 1]) || isW(T[j + 1], 'much') || mtSo) && !st.soThat) {
      // so quickly that … / so quickly on such days that …（that の前に前置詞句が入ってもよい）
      const k1So = mtSo ? j + 2 : j + 1;
      let jt = isW(T[k1So + 1], 'that') ? k1So + 1 : -1;
      if (jt < 0) { for (let x = k1So + 1; x < lim - 1 && x < j + 10; x++) {""")

rep("""        let ok = jt === j + 2;
        if (!ok) { const st9 = newSt(vg); const e9 = tail(j + 2, jt, st9, o, vg); ok = e9 === jt; if (ok) mid.push.apply(mid, st9.time.concat(st9.other, st9.manner)); }""",
    """        let ok = jt === k1So + 1;
        if (!ok) { const st9 = newSt(vg); const e9 = tail(k1So + 1, jt, st9, o, vg); ok = e9 === jt; if (ok) mid.push.apply(mid, st9.time.concat(st9.other, st9.manner)); }""")

rep("""          const a1 = isW(T[j + 1], 'much') ? { ja: 'たくさん' } : advC(T[j + 1]);   // I ate so much that … → とてもたくさん食べたので
          mid.forEach((x) => st.other.push(x));
          st.manner.push('とても' + a1.ja);""",
    """          const a1 = isW(T[j + 1], 'much') ? { ja: 'たくさん' } : (mtSo ? { ja: '何度も' } : advC(T[j + 1]));   // I ate so much that … → とてもたくさん食べたので
          mid.forEach((x) => st.other.push(x));
          st.manner.push((mtSo ? '' : 'とても') + a1.ja);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
