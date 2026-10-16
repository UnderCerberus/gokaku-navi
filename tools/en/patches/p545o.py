import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# compared with only a few times on a traditional farm → 伝統的な農場でのわずか数回と比べて
# （compared with / to・than のあとの (only / just) + a few / several / 数 + times は回数の名詞句。直後の場所の前置詞句もその名詞句にかける。「ただいくつかの時間」にしない）
rep("""    if (t.k === 'q') return t.speech ? null : { ja: t.ja, end: i + 1, quote: true };      // 語句の引用（"…" を 1 語にまとめたもの）。発言は動詞の枠で読む
    const m = mark();""",
    """    if (t.k === 'q') return t.speech ? null : { ja: t.ja, end: i + 1, quote: true };      // 語句の引用（"…" を 1 語にまとめたもの）。発言は動詞の枠で読む
    if ((t.k === 'w' || t.k === 'num') && i > 0 && T[i - 1].k === 'w' && (/^(?:than)$/.test(T[i - 1].w) || (/^(?:with|to)$/.test(T[i - 1].w) && isW(T[i - 2], 'compared')))) {
      const NUMT = { two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9', ten: '10', twenty: '20', several: '数' };
      let kT = i, preT = '';
      if (/^(?:only|just)$/.test(t.w || '')) { preT = 'わずか'; kT++; }
      let nT = '';
      if (isW(T[kT], 'a') && isW(T[kT + 1], 'few')) { nT = '数'; kT += 2; } else if (T[kT] && (NUMT[T[kT].w] || /^[0-9]+$/.test(T[kT].s || ''))) { nT = NUMT[T[kT].w] || T[kT].s; kT++; }
      if (nT && kT < lim && isW(T[kT], 'times')) {
        let jaT = preT + nT + '回', eT = kT + 1;
        if (eT + 1 < lim && T[eT].k === 'w' && /^(?:on|in|at)$/.test(T[eT].w)) {
          const mT = mark();
          const pT = parsePP(eT, lim, { noRel: true });
          if (pT && pT.obj && !pT.obj.time && /で$/.test(pT.ja || '')) { jaT = pT.ja.replace(/で$/, 'での') + jaT; eT = pT.end; } else fail(mT);
        }
        return { ja: jaT, end: eT, head: 'time', pl: true, freqNP: true };
      }
    }
    const m = mark();""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
