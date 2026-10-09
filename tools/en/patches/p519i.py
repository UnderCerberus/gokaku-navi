import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# it was at least a million years ago → 少なくとも100万年前だった（be + 期間 + ago は「〜前だ」。ある にしない）
rep("""    const exist = () => P(anim ? 'いる' : 'ある', anim ? 'v1' : 'aru');
    if (vg.lemma === 'be' && !vg.passive) {""",
    """    const exist = () => P(anim ? 'いる' : 'ある', anim ? 'v1' : 'aru');
    if (vg.lemma === 'be' && !vg.passive && lim - i >= 2 && isW(T[lim - 1], 'ago')) {
      const kAg = seq(i, ['at', 'least']) ? i + 2 : (T[i] && /^(?:about|around|only|just|nearly|almost|over|roughly|approximately)$/.test(T[i].w || '') ? i + 1 : i);
      const preAg = kAg === i + 2 ? '少なくとも' : (kAg === i + 1 ? ({ about: '約', around: '約', only: 'わずか', just: 'ちょうど', nearly: 'ほぼ', almost: 'ほぼ', over: '', roughly: '約', approximately: '約' })[T[i].w] : '');
      const mAg = mark();
      const nAg = np1(kAg, lim - 1, { noPost: true, noRel: true });
      if (nAg && nAg.end === lim - 1 && (nAg.dur || /^何(?:十|百|千|万|百万|千万|億|十億)?(?:年|か月|週間|日)も$/.test(nAg.ja || ''))) return fin(P(preAg + nAg.ja.replace(/間$/, '') + (T[i].w === 'over' ? '以上' : '') + '前だ', 'da'), lim);   // it was at least a million years ago → 少なくとも100万年前だった
      fail(mAg);
    }
    if (vg.lemma === 'be' && !vg.passive) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
