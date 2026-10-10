import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Around 1450, a German craftsman … / In about 1450 → 1450年ごろ（around / about + 年 は時の句。約1450 にしない）
rep("""  function parsePP(i, lim, o) {
    o = o || {};
    const t = T[i];
    if (!t || i >= lim || t.k !== 'w' || (approxAt(i, lim) && !o.allowApprox)) return null;""",
    """  function parsePP(i, lim, o) {
    o = o || {};
    const t = T[i];
    if (t && t.k === 'w' && i + 1 < lim) {
      const kYr = /^(?:around|about|circa)$/.test(t.w) ? i + 1 : (t.w === 'in' && T[i + 1] && /^(?:around|about)$/.test(T[i + 1].w || '') ? i + 2 : -1);
      const yTk = kYr > 0 ? T[kYr] : null;
      if (yTk && yTk.k === 'num' && /^1[0-9]{3}$|^20[0-9]{2}$/.test(String(yTk.s || yTk.w)) && (kYr + 1 >= lim || T[kYr + 1].k === 'p' || (T[kYr + 1].k === 'w' && !nounC(T[kYr + 1])))) {
        const yJ = String(yTk.s || yTk.w) + '年ごろ';
        return { ja: yJ, adn: yJ + 'の', end: kYr + 1, kind: 'time', prep: t.w, obj: { ja: yJ, time: true, year: true, end: kYr + 1 } };
      }
    }
    if (!t || i >= lim || t.k !== 'w' || (approxAt(i, lim) && !o.allowApprox)) return null;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
