import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)
rep("""    // as ~ as / just as ~ as before（ちょうど以前と同じくらい強く）
    {""",
    """    // Do it like I do / Be kind like your father was → 私がするように・父がそうだったように（like + 主語 + 助動詞だけ）
    if (isW(t, 'like') && j + 2 < lim) {
      const mLc = mark();
      const nLc = np(j + 1, lim, { noRel: true, noCoord: true });
      if (nLc && nLc.end + 1 === lim && T[nLc.end].k === 'w' && (DO[T[nLc.end].w] || BE[T[nLc.end].w] || MODAL[T[nLc.end].w] || HAVE[T[nLc.end].w])) {
        const awLc = T[nLc.end].w, pastLc = /^(?:did|was|were|had|could|would)$/.test(awLc);
        name('like-clause');
        st.other.push(nLc.ja + 'が' + (BE[awLc] ? (pastLc ? 'そうだったように' : 'そうであるように') : (pastLc ? 'したように' : 'するように')));
        return lim;
      }
      fail(mLc);
    }
    // as ~ as / just as ~ as before（ちょうど以前と同じくらい強く）
    {""")
rep("""    ja = ja.replace(/中国の万里の長城/g, '万里の長城');""",
    """    ja = ja.replace(/中国の万里の長城/g, '万里の長城');
    ja = ja.replace(/(練習|買い物|勉強|散歩|見学|観光|登山|調査|取材|応援)するために(行|来)/g, '$1しに$2');   // She went to practice → 練習しに行った""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
