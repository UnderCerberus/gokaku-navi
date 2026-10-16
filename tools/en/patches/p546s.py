import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# In my second year of junior high school → 中学2年のとき / in her first year of university → 大学1年のとき
# （in + 所有格 + 序数 + year of + 学校は学年。「中学校の私の2番目の年に」にしない）
rep("""    const mGn = key === 'for' && obj.num""",
    """    if (key === 'in' && typeof obj.end === 'number') {
      let kYr = -1;
      for (let x = obj.end - 2; x >= Math.max(2, obj.end - 7); x--) { if (isW(T[x], 'year') && isW(T[x + 1], 'of')) { kYr = x; break; } }
      const ORDY = { first: '1', second: '2', third: '3', fourth: '4', fifth: '5', sixth: '6', final: '最終', last: '最終' };
      if (kYr > 1 && T[kYr - 1] && ORDY[T[kYr - 1].w] && /^(?:my|your|his|her|our|their)$/.test(T[kYr - 2].w || '') && isW(T[kYr - 3], 'in')) {
        const kSc = isW(T[kYr + 2], 'the') ? kYr + 3 : kYr + 2;
        const wsSc = T.slice(kSc, obj.end).map((x) => x.w || '').join(' ');
        const SCH = { 'junior high school': '中学', 'junior high': '中学', 'middle school': '中学', 'high school': '高校', 'senior high school': '高校', 'elementary school': '小学校', 'primary school': '小学校', 'university': '大学', 'college': '大学' };
        const nY = ORDY[T[kYr - 1].w];
        if (SCH[wsSc]) { const yJ = SCH[wsSc] + nY + (/^[0-9]$/.test(nY) ? '年' : '学年'); return R(yJ + 'のとき', 'time', yJ + 'の'); }
      }
    }
    const mGn = key === 'for' && obj.num""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
