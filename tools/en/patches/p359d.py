import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# people in their thirties → 30代の人々（人 + in + 所有格 + 年代）
rep("""  function postMod(node, lim, o) {
    if (o.noPost) return node;
    for (let guard = 0; guard < 4; guard++) {
      const j = node.end, t = T[j];
      if (j >= lim || !t) break;""",
    """  function postMod(node, lim, o) {
    if (o.noPost) return node;
    for (let guard = 0; guard < 4; guard++) {
      const j = node.end, t = T[j];
      if (j >= lim || !t) break;
      if (isW(t, 'in') && (node.an || /^(?:people|those|women|men|adults|workers|users|players|customers|voters|respondents)$/.test(node.head || '')) && T[j + 1] && /^(?:my|your|his|her|our|their)$/.test(T[j + 1].w || '')) {
        let kDc = j + 2, preDc = '';
        if (T[kDc] && /^(?:early|mid|late)$/.test(T[kDc].w || '')) { preDc = ({ early: '前半', mid: '半ば', late: '後半' })[T[kDc].w]; kDc++; }
        const DECn = { teens: '10代', twenties: '20代', thirties: '30代', forties: '40代', fifties: '50代', sixties: '60代', seventies: '70代', eighties: '80代', nineties: '90代' };
        if (T[kDc] && DECn[T[kDc].w] && kDc < lim) { node = Object.assign({}, node, { ja: DECn[T[kDc].w] + preDc + 'の' + node.ja.replace(/^(?:彼らの|その)/, ''), end: kDc + 1 }); continue; }
      }""")

# He answered no → 彼は「いいえ」と答えた
rep("""    // Hi, Ken. → こんにちは、ケン""",
    """    {
      const kAn = T.findIndex((x, q) => q > 0 && /^(?:answer|answers|answered|say|says|said|reply|replies|replied)$/.test(x.w || '') && T[q + 1] && /^(?:yes|no)$/.test(T[q + 1].w || '') && q + 2 === b);
      if (kAn > 0 && /^(?:answer|answers|answered|reply|replies|replied)$/.test(T[kAn].w)) {
        const ynA = T[kAn + 1].w;
        const tAn = T.filter((x, q) => q !== kAn + 1).map((x, k) => Object.assign({}, x, { i: k, first: k === 0 }));
        const rAn = translate1(tAn);
        reset(tokens);
        if (rAn && rAn.ok && /答え|返事/.test(rAn.ja)) return Object.assign({}, rAn, { ja: rAn.ja.replace(/(答え|返事をし)/, (ynA === 'yes' ? '「はい」と' : '「いいえ」と') + '$1').replace(/「(はい|いいえ)」と返事をし/, '「$1」と答え') });
      }
    }
    // Hi, Ken. → こんにちは、ケン""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
