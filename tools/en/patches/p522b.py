import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# a stick that was three times its size → その3倍の大きさの棒 / three times the size of a bus → バスの3倍の大きさ（倍数 + the / 所有格 + 大きさの名詞）
rep("""    {
      const mu = timesAt(i, lim);
      const k0 = mu ? mu.end : i;
      if (isW(T[k0], 'as') && k0 + 3 < lim && (isW(T[k0 + 1], 'much') || isW(T[k0 + 1], 'many'))""",
    """    {
      const mu = timesAt(i, lim);
      const k0 = mu ? mu.end : i;
      const DIMJ = { size: '大きさ', length: '長さ', weight: '重さ', height: '高さ', width: '幅', area: '面積', number: '数', amount: '量', price: '値段', cost: '費用', speed: '速さ', distance: '距離', volume: '体積', population: '人口', value: '価値', depth: '深さ', age: '年齢' };
      if (mu && /倍/.test(mu.ja) && k0 + 1 < lim && T[k0].k === 'w' && /^(?:the|its|his|her|their|our|my|your)$/.test(T[k0].w) && T[k0 + 1].k === 'w' && DIMJ[T[k0 + 1].w]) {
        const POSJ = { its: 'その', his: '彼の', her: '彼女の', their: '彼らの', our: '私たちの', my: '私の', your: 'あなたの' };
        if (T[k0].w !== 'the' && (k0 + 2 >= lim || T[k0 + 2].k === 'p' || (T[k0 + 2].k === 'w' && !nounC(T[k0 + 2])))) return postMod({ ja: POSJ[T[k0].w] + mu.ja + 'の' + DIMJ[T[k0 + 1].w], end: k0 + 2, head: T[k0 + 1].w }, lim, o);
        if (T[k0].w === 'the' && isW(T[k0 + 2], 'of') && k0 + 3 < lim) {
          const mTs = mark();
          const nTs = np(k0 + 3, lim, { noRel: o.noRel, noCoord: o.noCoord });
          if (nTs) return { ja: nTs.ja + 'の' + mu.ja + 'の' + DIMJ[T[k0 + 1].w], end: nTs.end, head: T[k0 + 1].w };
          fail(mTs);
        }
      }
      if (isW(T[k0], 'as') && k0 + 3 < lim && (isW(T[k0 + 1], 'much') || isW(T[k0 + 1], 'many'))""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
