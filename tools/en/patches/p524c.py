import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 文頭の決まった前置き（コンマまで）:
#  Considering how little time we had, … → 〜を考えると / Judging from the dark clouds in the west, … → 〜から判断すると
#  When it comes to learning a foreign language, … → 〜こととなると / If it were not for smartphones, … → もし〜がなければ
#  Far from being boring, … → 退屈どころか
rep("""    const mainOpt = (sc, key) => Object.assign({}, o, { subjunctive: key === 'if' && !!sc.past && !o.reported });""",
    """    {
      let kF = -1, kindF = '';
      if (isW(T[a], 'considering') && a + 2 < b) { kF = a + 1; kindF = 'cons'; }
      else if (isW(T[a], 'judging') && (isW(T[a + 1], 'from') || isW(T[a + 1], 'by'))) { kF = a + 2; kindF = 'judge'; }
      else if (seq(a, ['when', 'it', 'comes', 'to'])) { kF = a + 4; kindF = 'comes'; }
      else if (seq(a, ['if', 'it', 'were', 'not', 'for']) || seq(a, ['if', 'it', 'was', 'not', 'for'])) { kF = a + 5; kindF = 'notfor'; }
      else if (seq(a, ['far', 'from']) && (isW(T[a + 2], 'being') || ingVerb(a + 2, b))) { kF = a + 2; kindF = 'far'; }
      let cF = -1;
      if (kF > 0) for (let x = kF + 1; x < b - 1; x++) if (isP(T[x], ',')) { cF = x; break; }
      if (cF > 0) {
        const mF = mark();
        let objF = '';
        if (kindF === 'far') {
          if (isW(T[kF], 'being') && kF + 2 === cF && adjC(T[kF + 1])) { const aF = adjC(T[kF + 1]); pick(kF + 1, aF.e); const fF = en.jp.adj(aF.e.ja); objF = (fF.kind === 'na' && fF.stem ? fF.stem : fF.pred.plain()) + 'どころか、'; }
          else if (ingVerb(kF, cF)) { const vF = vpNonfin(kF, cF, 'ing', {}); if (vF && vF.end === cF) objF = vpJoin(vF, 'dict') + 'どころか、'; }
        } else {
          const wF = T[kF].k === 'w' && WH[T[kF].w] ? whClause(kF, cF) : null;
          if (wF && wF.end === cF) objF = wF.str;
          else {
            fail(mF);
            const gF = ingVerb(kF, cF) ? gerundNP(kF, cF) : null;
            const nF = gF && gF.end === cF ? gF : np(kF, cF, {});
            if (nF && nF.end === cF) objF = nF.ja;
          }
          if (objF) objF = (kindF === 'notfor' ? 'もし' : '') + objF + ({ cons: 'を考えると、', judge: 'から判断すると、', comes: 'となると、', notfor: 'がなければ、' })[kindF];
        }
        const mnF = objF ? sentence(cF + 1, b, Object.assign({}, o, kindF === 'notfor' ? { subjunctive: true } : {})) : null;
        if (mnF) { name('idiom'); const nodeF = Object.assign({}, mnF); nodeF.out = (y) => objF + mnF.out(y); return wrap(nodeF); }   // Considering how little time we had, …
        fail(mF);
      }
    }
    const mainOpt = (sc, key) => Object.assign({}, o, { subjunctive: key === 'if' && !!sc.past && !o.reported });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
