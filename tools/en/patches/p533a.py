import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# How they manage to find their way has puzzled scientists → 彼らがどのように道を見つけるかは科学者を悩ませてきた（疑問詞節の主語）
rep("""    // today / tomorrow / yesterday が主語（Today was my school's sports day.）
    if (s === a + 1 && /^(?:today|tomorrow|yesterday|tonight)$/.test(t.w)) return { ja: ADV[t.w][0], end: s, time: true };""",
    """    if (t.k === 'w' && /^(?:how|why|where|when|who|which)$/.test(t.w) && a + 2 < s && !isP(T[s - 1], ',')) {
      const mWs = mark();
      const wcS = whClause(a, s);
      if (wcS && wcS.end === s && wcS.str) { name('subject-clause'); return { ja: wcS.str, end: s, gerund: true, clause: true }; }
      fail(mWs);
    }
    // today / tomorrow / yesterday が主語（Today was my school's sports day.）
    if (s === a + 1 && /^(?:today|tomorrow|yesterday|tonight)$/.test(t.w)) return { ja: ADV[t.w][0], end: s, time: true };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
