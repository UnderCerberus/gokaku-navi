import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Only when we lose something do we realize … → 何かを失って初めて、…に気づく（Only + 従属節・前置詞句 + 助動詞 + 主語 の倒置）
rep("""  function inversion(a, b) {
    const t = T[a], aux = T[a + 1];""",
    """  function inversion(a, b) {
    const t = T[a], aux = T[a + 1];
    if (isW(t, 'only') && aux && aux.k === 'w' && /^(?:when|after|once|if|by|in|then|later|recently|through|with|at)$/.test(aux.w) && b - a > 5) {
      for (let x = a + 2; x < b - 2; x++) {
        if (!(T[x].k === 'w' && (DO[T[x].w] || MODAL[T[x].w] || HAVE[T[x].w] || BE[T[x].w]))) continue;
        if (!(T[x + 1].k === 'w' && ((PRON[T[x + 1].w] && PRON[T[x + 1].w].sub) || DET[T[x + 1].w] !== undefined || !!nounC(T[x + 1])))) continue;
        const mO = mark();
        let unJa = '';
        const xe = isP(T[x - 1], ',') ? x - 1 : x;
        if (/^(?:when|after|once|if)$/.test(aux.w)) { const uc = sentence(a + 2, xe, { sub: true }); if (uc) unJa = uc.out({ part: 'が', form: 'te' }) + '初めて'; }
        else if (/^(?:then|later|recently)$/.test(aux.w) && x === a + 2) unJa = ({ then: 'そのとき', later: '後になって', recently: '最近になって' })[aux.w] + '初めて';
        else { const ppO = parsePP(a + 1, xe, {}); if (ppO && ppO.end === xe) unJa = aux.w === 'by' ? ppO.ja.replace(/(?:によって|で)$/, '') + 'によってのみ' : ppO.ja.replace(/[にで]$/, '') + 'になって初めて'; }
        if (!unJa) { fail(mO); continue; }
        const sjO = np1(x + 1, b, { noRel: true, noPost: true });
        if (!sjO) { fail(mO); continue; }
        const tO = T.slice(x + 1, sjO.end).concat([T[x]], T.slice(sjO.end, b));
        const cO = withTokens(tO, () => sentence(0, tO.length, { noInv: true, noStative: true }));
        if (!cO) { fail(mO); continue; }
        name('inversion');
        return { out: (y) => unJa + '、' + cO.out(y), sp: cO.sp, past: cO.past };
      }
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
