import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# children under the age of four / people over the age of 65 → 4歳未満の子ども・65歳以上の人々（under / over / at / from the age of + 数）
rep("""    if (--BUDGET < 0) return null;
    const m = mark();
    if (t.w === 'on' && isW(T[i + 1], 'the') && i + 2 < lim && T[i + 2]) {""",
    """    if (--BUDGET < 0) return null;
    const m = mark();
    if (/^(?:under|over|above|below|from|after|until|by|before)$/.test(t.w) && seq(i + 1, ['the', 'age', 'of']) && i + 4 < lim + 1 && T[i + 4]) {
      const nAg = parseNumAt(i + 4, lim);
      if (nAg && Number.isInteger(nAg.val) && nAg.val > 0 && nAg.val < 130) {
        const aJ = nAg.val + '歳';
        const AGP = { under: [aJ + '未満で', aJ + '未満の'], below: [aJ + '未満で', aJ + '未満の'], over: [aJ + '以上で', aJ + '以上の'], above: [aJ + '以上で', aJ + '以上の'], at: [aJ + 'で', aJ + 'の'], from: [aJ + 'から', aJ + 'からの'], after: [aJ + '以降に', aJ + '以降の'], until: [aJ + 'まで', aJ + 'までの'], by: [aJ + 'までに', aJ + 'までの'], before: [aJ + '前に', aJ + '前の'] }[t.w];
        return { ja: AGP[0], adn: AGP[1], end: nAg.end, kind: t.w === 'at' || t.w === 'by' || t.w === 'before' || t.w === 'after' || t.w === 'until' ? 'time' : 'other', prep: t.w, obj: { ja: aJ, end: nAg.end, num: nAg } };
      }
    }
    if (t.w === 'on' && isW(T[i + 1], 'the') && i + 2 < lim && T[i + 2]) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
