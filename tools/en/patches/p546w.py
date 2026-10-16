import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# releases melatonin about two hours later than it did in childhood → 子どものころより約2時間遅く
# （期間 + later / earlier than も比較の副詞句。than + 代名詞 + did + 時の前置詞句は、その時の句だけを比べる相手にする）
rep("""  function thanTimeJa(k, lim, o) {   // than のあとの句・節 → 「〜」（より は付けない）
    const elT = thanEllipsis(k, lim, o && o.subj);""",
    """  function thanTimeJa(k, lim, o) {   // than のあとの句・節 → 「〜」（より は付けない）
    if (T[k] && T[k].k === 'w' && ((PRON[T[k].w] && PRON[T[k].w].sub) || T[k].w === 'it') && T[k + 1] && /^(?:did|does|do|was|were|used)$/.test(T[k + 1].w || '') && k + 3 < lim && T[k + 2].k === 'w' && PREP[T[k + 2].w]) {
      const mTp = mark();
      const pTp = parsePP(k + 2, lim, { noRel: true });
      if (pTp && pTp.end === lim && (pTp.kind === 'time' || /(?:ころ|頃|時代|とき|期)(?:に|には|で)?$/.test(pTp.ja || ''))) return pTp.ja.replace(/(?:には|に|で)$/, '');
      fail(mTp);
    }
    const elT = thanEllipsis(k, lim, o && o.subj);""")
rep("""      const kLt = /^(?:much|far|a little|slightly)$/.test(t.w) && /^(?:later|earlier|sooner)$/.test((T[j + 1] || {}).w || '') ? j + 1 : j;
      if (/^(?:later|earlier|sooner)$/.test(T[kLt].w || '') && isW(T[kLt + 1], 'than') && kLt + 2 < lim && vg && vg.lemma !== 'be') {
        const thLt = thanTimeJa(kLt + 2, lim, o);
        if (thLt) { st.other.push(thLt + 'より' + (kLt > j ? ({ much: 'ずっと', far: 'はるかに', slightly: '少し' })[t.w] || '' : '') + (T[kLt].w === 'later' ? '遅く' : '早く')); name('comparative'); return lim; }""",
    """      let kLt = /^(?:much|far|a little|slightly)$/.test(t.w) && /^(?:later|earlier|sooner)$/.test((T[j + 1] || {}).w || '') ? j + 1 : j, msLt = '';
      if (kLt === j) {
        const NUMLt = { a: '1', an: '1', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', ten: '10', twenty: '20', thirty: '30', several: '数' };
        const UNLt = { second: '秒', minute: '分', hour: '時間', day: '日', week: '週間', month: 'か月', year: '年' };
        let kM = j, apM = '';
        if (/^(?:about|around|nearly|almost|roughly)$/.test(T[kM].w || '')) { apM = /^(?:nearly|almost)$/.test(T[kM].w) ? 'ほぼ' : '約'; kM++; }
        let nM = T[kM] && T[kM].k === 'w' ? NUMLt[T[kM].w] : (T[kM] && /^[0-9]+$/.test(T[kM].s || '') ? T[kM].s : undefined);
        if (nM && isW(T[kM], 'a') && isW(T[kM + 1], 'few')) { nM = '数'; kM++; }
        const uM = nM && T[kM + 1] ? UNLt[(T[kM + 1].w || '').replace(/s$/, '')] : undefined;
        if (uM && T[kM + 2] && /^(?:later|earlier|sooner)$/.test(T[kM + 2].w || '') && isW(T[kM + 3], 'than')) { msLt = apM + nM + uM; kLt = kM + 2; }
      }
      if (/^(?:later|earlier|sooner)$/.test(T[kLt].w || '') && isW(T[kLt + 1], 'than') && kLt + 2 < lim && vg && vg.lemma !== 'be') {
        const thLt = thanTimeJa(kLt + 2, lim, o);
        if (thLt) { st.other.push(thLt + 'より' + msLt + (kLt > j && !msLt ? ({ much: 'ずっと', far: 'はるかに', slightly: '少し' })[t.w] || '' : '') + (T[kLt].w === 'later' ? '遅く' : '早く')); name('comparative'); return lim; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
