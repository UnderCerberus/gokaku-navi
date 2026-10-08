import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    // I tried to open the window, but I couldn't. → 私は窓を開けようとしたが、開けられなかった（but のあとの助動詞だけの省略は前の動詞を補う）""",
    """    // Tom did. / I do! → トムです・私です（誰がしたかの答え）
    if (b === 2 && T[0].k === 'w' && ((PRON[T[0].w] && PRON[T[0].w].sub && T[0].w !== 'it') || T[0].cap) && T[1].k === 'w' && /^(?:do|does|did|am|is|are|was|were|can|will)$/.test(T[1].w)) {
      const nAns = np(0, 1, {});
      if (nAns && nAns.end === 1) return { ok: true, ja: nAns.ja + (T[1].w === 'can' ? 'ができます' : (T[1].w === 'will' ? 'がやります' : 'です')) + '。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      reset(tokens);
    }
    // If you can't do it, I will. → あなたができないなら、私がやる（主節が S + 助動詞だけ）
    if (b >= 6 && isP(T[b - 3], ',') && T[b - 2].k === 'w' && PRON[T[b - 2].w] && PRON[T[b - 2].w].sub && T[b - 1].k === 'w' && /^(?:will|can|do|would)$/.test(T[b - 1].w) && T[0].k === 'w' && /^(?:if|when|because)$/.test(T[0].w)) {
      const scIw = sentence(1, b - 3, { sub: true });
      const nIw = scIw ? np(b - 2, b - 1, {}) : null;
      if (scIw && nIw) return { ok: true, ja: (T[0].w === 'if' ? 'もし' + scIw.out({ part: 'が', form: 'tara' }) + '、' : scIw.out({ part: 'が', form: 'te' }) + '、') + nIw.ja + (T[b - 1].w === 'can' ? 'ができる' : 'がやる') + '。', sp: '', names: ['ellipsis'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      reset(tokens);
    }
    // I like apples, and so does my sister. → 私はりんごが好きで、姉もそうだ / He can't swim, and neither can I. → 彼は泳げないし、私も泳げない
    {
      const kSo = T.findIndex((x, q) => q > 2 && isW(x, 'and') && isP(T[q - 1], ',') && T[q + 1] && /^(?:so|neither|nor)$/.test(T[q + 1].w || ''));
      if (kSo > 0 && T[kSo + 2] && T[kSo + 2].k === 'w' && (BE[T[kSo + 2].w] || DO[T[kSo + 2].w] || MODAL[T[kSo + 2].w] || HAVE[T[kSo + 2].w]) && kSo + 3 < b) {
        const r1So = translate1(T.slice(0, kSo - 1).map((x, k) => Object.assign({}, x, { i: k })).concat([tokenize('.')[0]].filter(Boolean)));
        reset(tokens);
        const nSo = np(kSo + 3, b, {});
        if (r1So && r1So.ok && nSo && nSo.end === b) {
          const negSo = T[kSo + 1].w !== 'so';
          return { ok: true, ja: r1So.ja.replace(/。$/, '').replace(/だ$/, 'で').replace(/(い)$/, '$1し').replace(/た$/, 'たし') + '、' + nSo.ja + (negSo ? 'もそうではない' : 'もそうだ') + '。', sp: '', names: ['ellipsis'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
        }
        reset(tokens);
      }
    }
    // Some like coffee, others like tea. → コーヒーが好きな人もいれば、紅茶が好きな人もいる
    if (isW(T[0], 'some') && T[1] && T[1].k === 'w' && !!vc(T[1], ['base'])) {
      const kOt = T.findIndex((x, q) => q > 2 && isW(x, 'others') && isP(T[q - 1], ','));
      if (kOt > 0 && kOt + 1 < b) {
        const t1Ot = tokenize('Some people ' + T.slice(1, kOt - 1).map((x) => x.s || x.w).join(' ') + '.');
        const t2Ot = tokenize('Some people ' + T.slice(kOt + 1, b).map((x) => x.s || x.w).join(' ') + '.');
        const r1Ot = translate1(t1Ot), r2Ot = r1Ot && r1Ot.ok ? translate1(t2Ot) : null;
        reset(tokens);
        if (r1Ot && r1Ot.ok && r2Ot && r2Ot.ok && /人もいる。$/.test(r1Ot.ja)) return { ok: true, ja: r1Ot.ja.replace(/人もいる。$/, '人もいれば、') + r2Ot.ja, sp: '', names: ['correlative'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      }
    }
    // I tried to open the window, but I couldn't. → 私は窓を開けようとしたが、開けられなかった（but のあとの助動詞だけの省略は前の動詞を補う）""")

# I'd like to help you, but I can't → 手伝いたいが、手伝えない
rep("""        const kTo = T.findIndex((x, q) => q < kBt && isW(x, 'to') && q > 0 && /^(?:tried|try|wanted|want|planned|hoped|decided)$/.test(T[q - 1].w || ''));""",
    """        const kTo = T.findIndex((x, q) => q < kBt && isW(x, 'to') && q > 0 && /^(?:tried|try|wanted|want|planned|hoped|decided|like)$/.test(T[q - 1].w || ''));""")
rep("""      if (kBt > 0 && T[kBt + 1] && T[kBt + 1].k === 'w' && PRON[T[kBt + 1].w] && PRON[T[kBt + 1].w].sub && T[kBt + 2] && /^(?:could|can|did|would|will)$/.test(T[kBt + 2].w || '') && isW(T[kBt + 3], 'not') && kBt + 4 === b) {""",
    """      if (kBt > 0 && T[kBt + 1] && T[kBt + 1].k === 'w' && PRON[T[kBt + 1].w] && PRON[T[kBt + 1].w].sub && T[kBt + 2] && /^(?:could|can|did|would|will)$/.test(T[kBt + 2].w || '') && isW(T[kBt + 3], 'not') && kBt + 4 === b && !(isW(T[kBt + 2], 'did') && !T.slice(0, kBt).some((x) => isW(x, 'to')))) {""")

rep("""    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""",
    """    ja = ja.replace(/と言って、した(?=。|$)/, 'と言って、実際にそうした');   // He said he would come, and he did → 来ると言って、実際にそうした
    ja = ja.replace(/誰か([^、。]{1,16}?)人を持って(いる|いた)/, '$1人が$2')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
