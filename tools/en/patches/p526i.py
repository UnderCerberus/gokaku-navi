import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Hardly a day goes by without someone asking me about the accident → 誰かが私に事故について尋ねない日はほとんどない
# Not a day passes without thinking of her → 彼女のことを考えない日は1日もない
rep("""    {
      let kF = -1, kindF = '';
      if (isW(T[a], 'considering') && a + 2 < b) { kF = a + 1; kindF = 'cons'; }""",
    """    if (T[a] && /^(?:hardly|scarcely|not|never)$/.test(T[a].w || '') && isW(T[a + 1], 'a') && T[a + 2] && /^(?:day|week|month|year)$/.test(T[a + 2].w || '') && T[a + 3] && /^(?:goes|passes|went|passed)$/.test(T[a + 3].w || '')) {
      const kWd = isW(T[a + 4], 'by') ? a + 5 : a + 4;
      if (isW(T[kWd], 'without') && kWd + 1 < b) {
        const mWd = mark();
        let negWd = '', endWd = -1;
        const pWd = parsePP(kWd, b, {});
        if (pWd && pWd.subjIng) { negWd = (pWd.subjIng.any ? '誰も' : pWd.subjIng.n.ja + 'が') + vpJoin(pWd.subjIng.vp, 'neg'); endWd = pWd.end; }
        else {
          fail(mWd);
          const vWd = T[kWd + 1].k === 'w' && !!vc(T[kWd + 1], ['ing']) ? vpNonfin(kWd + 1, b, 'ing', {}) : null;
          if (vWd && verbal(vWd.pred)) { negWd = vpJoin(vWd, 'neg'); endWd = vWd.end; }
          else if (!vWd) { const nWd = np(kWd + 1, b, { pp: true }); if (nWd && nWd.end === b && !nWd.pron) { negWd = nWd.ja + 'のない'; endWd = b; } }
        }
        if (negWd && endWd === b) {
          const unitWd = ({ day: '日', week: '週', month: '月', year: '年' })[T[a + 2].w];
          const pastWd = /^(?:went|passed)$/.test(T[a + 3].w);
          const tailWd = /^(?:hardly|scarcely)$/.test(T[a].w) ? (pastWd ? 'はほとんどなかった' : 'はほとんどない') : (T[a + 2].w === 'day' ? (pastWd ? 'は1日もなかった' : 'は1日もない') : (pastWd ? 'はなかった' : 'はない'));
          name('idiom');
          return wrap({ out: () => negWd + unitWd + tailWd, sp: 'SV' });
        }
        fail(mWd);
      }
    }
    {
      let kF = -1, kindF = '';
      if (isW(T[a], 'considering') && a + 2 < b) { kF = a + 1; kindF = 'cons'; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
