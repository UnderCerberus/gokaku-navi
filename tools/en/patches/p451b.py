import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# They were all happy / We are all students → They all were happy（be のあとの all / both は主語のあとへ）
rep("""    // 呼びかけ: Ken, come here.""",
    """    if (b > 3 && !tokens.__qFloat) {
      const kQf = T.findIndex((x, q) => q >= 1 && x.k === 'w' && /^(?:are|were)$/.test(x.w) && T[q - 1] && T[q - 1].k === 'w' && /^(?:we|they|you)$/.test(T[q - 1].w) && T[q + 1] && /^(?:all|both)$/.test(T[q + 1].w || '') && T[q + 2] && T[q + 2].k === 'w' && !isW(T[q + 2], 'of') && !isW(T[q + 2], 'the'));
      if (kQf > 0) {
        const tQf = tokens.slice(0, kQf).concat([tokens[kQf + 1], tokens[kQf]], tokens.slice(kQf + 2)).map((x, k) => Object.assign({}, x, { i: k }));
        tQf.__qFloat = true;
        const rQf = translate1(tQf);
        reset(tokens);
        if (rQf && rQf.ok) return rQf;
      }
    }
    // Little is known about the disease → その病気についてはほとんど知られていない
    if (b > 4 && /^(?:little|not)$/.test(T[0].w || '') && (T[0].w === 'little' ? seq(1, ['is', 'known', 'about']) : seq(1, ['much', 'is', 'known', 'about']))) {
      const kLk = T[0].w === 'little' ? 4 : 5;
      const nLk = np(kLk, b, { noRel: true });
      if (nLk && nLk.end === b) return { ok: true, ja: nLk.ja + 'についてはほとんど知られていない。', sp: '', names: ['passive'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      reset(tokens);
    }
    // 呼びかけ: Ken, come here.""")

rep("""    ja = ja.replace(/誰かより(?!も)/g, '誰よりも')""",
    """    if (tokens.some((x, q) => /^(?:was|were)$/.test(x.w || '') && tokens[q + 1] && /^(?:surprised|amazed|shocked)$/.test(tokens[q + 1].w || '')) && !tokens.some((x) => x.w === 'by')) ja = ja.replace(/驚いていた/g, '驚いた').replace(/ショックを受けていた/g, 'ショックを受けた');   // I was surprised → 驚いた
    ja = ja.replace(/^([^、。]{1,8}?)(?:たち)?の誰も/, '$1は誰も');   // None of the students were late → 学生は誰も遅れなかった
    ja = ja.replace(/誰かより(?!も)/g, '誰よりも')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
