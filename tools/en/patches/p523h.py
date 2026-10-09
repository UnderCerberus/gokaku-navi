import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# She never fails to call her grandmother on her birthday, no matter how busy she is → 彼女はどんなに忙しくても、…
# I will help you, no matter what happens / He never gives up, however difficult the task is（文末の譲歩の節は前に出して読む）
rep("""    // 0') Whatever ..., / No matter what ..., （譲歩）
    if (T[a].k === 'w' && (/^(?:whatever|whoever|whichever|however)$/.test(T[a].w) || seq(a, ['no', 'matter'])) && a + 4 < b) {
      const cs = concession(a, b, o);
      if (cs) return wrap(cs);
    }""",
    """    // 0') Whatever ..., / No matter what ..., （譲歩）
    if (T[a].k === 'w' && (/^(?:whatever|whoever|whichever|however)$/.test(T[a].w) || seq(a, ['no', 'matter'])) && a + 4 < b) {
      const cs = concession(a, b, o);
      if (cs) return wrap(cs);
    }
    if (!o.sub && b - a > 6) {
      for (let x = a + 3; x < b - 3; x++) {
        if (!((seq(x, ['no', 'matter']) && T[x + 2] && /^(?:how|what|who|where|when)$/.test(T[x + 2].w || '')) || (T[x].k === 'w' && /^(?:however|whatever|whoever)$/.test(T[x].w) && isP(T[x - 1], ',') && !isP(T[x + 1], ',')))) continue;
        const cm = isP(T[x - 1], ',') ? x - 1 : x;
        const cmTok = isP(T[x - 1], ',') ? T[x - 1] : { k: 'p', w: ',', raw: ',' };
        const tCs = T.slice(x, b).concat([cmTok], T.slice(a, cm));
        const mCs = mark();
        const csT = withTokens(tCs, () => concession(0, tCs.length, o));
        if (csT) return wrap(csT);   // …, no matter how busy she is → どんなに忙しくても、…
        fail(mCs);
        break;
      }
    }""")

# no matter how busy she is, she … → 彼女はどんなに忙しくても、…（主語が同じ代名詞なら 1 回だけ）
rep("""        pre = sj.ja + 'がどんなに' + en.jp.adj(a1.e.ja).pred.form('te') + 'も、';""",
    """        pre = sj.ja + 'がどんなに' + en.jp.adj(a1.e.ja).pred.form('te') + 'も、';
        if (sj.pron && /^(?:i|he|she|we|they)$/.test(sj.pron)) preSame = { sp: sj.pron, str: 'どんなに' + en.jp.adj(a1.e.ja).pred.form('te') + 'も、' };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
