import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# no more than 1,000 yen → only（1000円しか持っていない）/ no less than → as many as（1000円も）/ not more than → at most / not less than → at least
rep(r"""      .replace(/\b(Mr|Mrs|Ms|Dr|Prof|Jr|Sr|St|Mt)\./g, '$1')                    // 敬称などの省略のピリオドは文末と区別する
""", r"""      .replace(/\b(Mr|Mrs|Ms|Dr|Prof|Jr|Sr|St|Mt)\./g, '$1')                    // 敬称などの省略のピリオドは文末と区別する
      .replace(/\b([Nn]o|[Nn]ot) (more|less) than (?=\$?[0-9]|(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|a hundred|a thousand|a few|a couple)\b)/g, (m0, n0, ml) => {   // no more than 1,000 yen → 1000円しか / no less than 500 people → 500人もの / not more than → 多くても / not less than → 少なくとも
        const up = /^[NA-Z]/.test(n0);
        const r0 = /^no$/i.test(n0) ? (ml === 'more' ? 'only' : 'as many as') : (ml === 'more' ? 'at most' : 'at least');
        return (up ? r0.charAt(0).toUpperCase() + r0.slice(1) : r0) + ' ';
      })
""")

rep("""    // She went to the store only to find it closed.""",
    """    // He is nothing but a child. → 彼は子どもにすぎない / He is not a man to give up easily. → 彼は簡単にあきらめるような男ではない
    if (b > 4) {
      const kNb = T.findIndex((x, q) => q >= 1 && q <= 5 && /^(?:is|are|was|were|am)$/.test(x.w || '') && x.k === 'w');
      if (kNb > 0 && seq(kNb + 1, ['nothing', 'but']) && kNb + 3 < b) {
        const mNb = mark();
        const sNb = np(0, kNb, { noRel: true });
        const oNb = sNb && sNb.end === kNb ? np(kNb + 3, b, {}) : null;
        if (oNb && oNb.end === b) return { ok: true, ja: sNb.ja + 'は' + oNb.ja + (/^(?:was|were)$/.test(T[kNb].w) ? 'にすぎなかった' : 'にすぎない') + '。', sp: 'SVC', names: ['idiom'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
        fail(mNb);
      }
      const MNb = { man: '男', person: '人', woman: '女性', guy: '人', type: 'タイプの人', boy: '少年', girl: '少女' };
      if (kNb > 0 && isW(T[kNb + 1], 'not') && isW(T[kNb + 2], 'a') && T[kNb + 3] && MNb[T[kNb + 3].w] && isW(T[kNb + 4], 'to') && vc(T[kNb + 5], ['base'])) {
        const mNm = mark();
        const sNm = np(0, kNb, { noRel: true });
        const vNm = sNm && sNm.end === kNb ? vpNonfin(kNb + 5, b, 'base', {}) : null;
        if (vNm && vNm.end === b && verbal(vNm.pred)) { name('inf-adj'); return { ok: true, ja: sNm.ja + 'は' + vpJoin(vNm, 'dict') + 'ような' + MNb[T[kNb + 3].w] + (/^(?:was|were)$/.test(T[kNb].w) ? 'ではなかった' : 'ではない') + '。', sp: 'SVC', names: NAMES.slice(), sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() }; }
        fail(mNm);
      }
      reset(tokens);
    }
    // She went to the store only to find it closed.""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
