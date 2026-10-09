import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Hardly a day goes by without news of … → …のニュースのない日はほとんどない / Not a day passes without thinking of her → 彼女のことを考えない日は1日もない
rep("""    // 0) The 比較級 ..., the 比較級 ...
""",
    """    if (a + 5 < b && /^(?:hardly|scarcely|not|barely)$/.test(T[a].w || '') && isW(T[a + 1], 'a') && /^(?:day|week|month|year|moment)$/.test(T[a + 2].w || '') && /^(?:goes|go|went|passes|pass|passed)$/.test(T[a + 3].w || '') && (isW(T[a + 4], 'without') || (isW(T[a + 4], 'by') && isW(T[a + 5], 'without')))) {
      const mHd = mark();
      const kH = isW(T[a + 4], 'by') ? a + 6 : a + 5;
      const UNH = { day: '日', week: '週', month: '月', year: '年', moment: '瞬間' }[T[a + 2].w];
      const pastH = /^(?:went|passed)$/.test(T[a + 3].w);
      const tailH = T[a].w === 'not' ? 'は1' + (UNH === '瞬間' ? '瞬' : UNH) + 'も' + (pastH ? 'なかった' : 'ない') : 'はほとんど' + (pastH ? 'なかった' : 'ない');
      const gH = ingVerb(kH, b) ? vpNonfin(kH, b, 'ing', {}) : null;
      if (gH && gH.end === b) { name('idiom'); const pH = gH.pred.aux('neg'); return wrap({ out: () => gH.parts.join('') + pH.plain() + UNH + tailH, sp: 'SV', end: b }); }
      fail(mHd);
      const nH = np(kH, b, {});
      if (nH && nH.end === b) { name('idiom'); return wrap({ out: () => nH.ja + 'のない' + UNH + tailH, sp: 'SV', end: b }); }
      fail(mHd);
    }
    // 0) The 比較級 ..., the 比較級 ...
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
