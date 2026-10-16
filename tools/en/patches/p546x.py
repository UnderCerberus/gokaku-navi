import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# He arrived two hours later than he did yesterday（目的語の位置の「期間 + later / earlier than」は目的語にせず、p546w の比較の副詞句として読む）
rep("""      if (advOnly) { k = modOther(j0, lim, st, o, vg); if (k > 0) { j = k; continue; } }""",
    """      if (advOnly) { k = modOther(j0, lim, st, o, vg); if (k > 0) { j = k; continue; } }
      const msrLt = (() => {
        let kM = j0;
        if (/^(?:about|around|nearly|almost|roughly)$/.test((T[kM] || {}).w || '')) kM++;
        if (isW(T[kM], 'a') && isW(T[kM + 1], 'few')) kM++;
        if (!(T[kM] && (T[kM].k === 'num' || /^[0-9]+$/.test(T[kM].s || '') || /^(?:a|an|one|two|three|four|five|six|ten|twenty|thirty|several|few)$/.test(T[kM].w || '')))) return false;
        return !!T[kM + 1] && /^(?:seconds?|minutes?|hours?|days?|weeks?|months?|years?)$/.test(T[kM + 1].w || '') && !!T[kM + 2] && /^(?:later|earlier|sooner)$/.test(T[kM + 2].w || '') && isW(T[kM + 3], 'than');
      })();
      if (msrLt) { k = modOther(j0, lim, st, o, vg); if (k > 0) { j = k; continue; } }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
