import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# cook dinner at least twice a week / visit her at least once a month → 少なくとも週に2回（at least once / twice のあとの a + 時の単位は頻度。目的語にしない）
rep("""    for (let len = 5; len >= 2; len--) {                                        // the very next day（4 語）/ in the years to come（5 語）
      const key = phraseKey(j, len, lim);""",
    """    if (seq(j, ['at', 'least']) && T[j + 2] && /^(?:once|twice)$/.test(T[j + 2].w || '') && j + 4 < lim + 1 && T[j + 3] && /^(?:a|an|every|per|each)$/.test(T[j + 3].w || '')) {
      const rAl = perUnit({ ja: T[j + 2].w === 'twice' ? '2回' : '1回', end: j + 3 }, lim);
      if (rAl.rate) { st.manner.push('少なくとも' + rAl.ja); st.times = true; return rAl.end; }
    }
    for (let len = 5; len >= 2; len--) {                                        // the very next day（4 語）/ in the years to come（5 語）
      const key = phraseKey(j, len, lim);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
