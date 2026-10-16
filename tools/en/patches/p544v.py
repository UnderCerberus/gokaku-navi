import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I arrived at the port about an hour before the ferry was supposed to leave → フェリーが出発することになっている約1時間前に、私は港に到着した
# She came two days after I left → 私が出発した2日後に
# （期間 + before / after + 節は、期間ごと従属節の接続詞として読む。「約1時間を到着した」にしない）
rep("""    for (let k = 0; k < MSUB.length; k++) {
      const ws = MSUB[k].split(' ');""",
    """    if (j > 1 && t.w !== 'before' && t.w !== 'after') {
      const NUMD = { a: '1', an: '1', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9', ten: '10', twelve: '12', fifteen: '15', twenty: '20', thirty: '30', forty: '40', fifty: '50', several: '数', few: '数' };
      const UND = { second: '秒', minute: '分', hour: '時間', day: '日', week: '週間', month: 'か月', year: '年', decade: '十年' };
      let kD = j, apD = '';
      if (/^(?:about|around|nearly|almost|roughly)$/.test(T[kD].w || '')) { apD = /^(?:about|around|roughly)$/.test(T[kD].w) ? '約' : 'ほぼ'; kD++; }
      let nD = T[kD] && T[kD].k === 'w' ? NUMD[T[kD].w] : (T[kD] && /^[0-9]+$/.test(T[kD].s || '') ? T[kD].s : undefined);
      if (nD && isW(T[kD], 'a') && isW(T[kD + 1], 'few')) { nD = '数'; kD++; }
      if (nD) kD++;
      const uD = nD && T[kD] && T[kD].k === 'w' ? UND[(T[kD].w || '').replace(/s$/, '')] : undefined;
      if (uD && T[kD + 1] && /^(?:before|after)$/.test(T[kD + 1].w || '') && kD + 3 < b && T[kD + 2].k === 'w' && ((PRON[T[kD + 2].w] && PRON[T[kD + 2].w].sub) || DET[T[kD + 2].w] !== undefined) &&
        T.slice(kD + 3, b).some((x) => x.k === 'w' && (!!BE[x.w] || !!MODAL[x.w] || !!HAVE[x.w] || !!DO[x.w] || (!!vc(x, ['past', '3sg']) && !nounC(x)))) && !(T[j - 1] && T[j - 1].k === 'w' && /^(?:for|in|within|after|before|of|than|spend|spent|spends|take|took|takes|wait|waited|waits)$/.test(T[j - 1].w))) {
        return { key: 'dur:' + apD + nD + uD + ':' + T[kD + 1].w, len: kD + 2 - j };
      }
    }
    for (let k = 0; k < MSUB.length; k++) {
      const ws = MSUB[k].split(' ');""")
rep("""  function subStr(key, sc, mn, omit, noTo) {
    const S = (form, past) => sc.out({ part: 'が', form: form, past: past, omit: omit });
    switch (key) {""",
    """  function subStr(key, sc, mn, omit, noTo) {
    const S = (form, past) => sc.out({ part: 'が', form: form, past: past, omit: omit });
    if (/^dur:/.test(key)) { const [, dJa, dW] = key.split(':'); return dW === 'before' ? S('attr', false) + dJa + '前に、' : S('attr', true) + dJa + '後に、'; }
    switch (key) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
