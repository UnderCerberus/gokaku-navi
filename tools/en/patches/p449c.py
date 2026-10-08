import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# players must pass or bounce the ball → ボールをパスするか弾ませなければならない（V1 or V2 + 目的語は目的語を V1 にも補う）
rep("""    // 呼びかけ: Ken, come here.""",
    """    if (b > 5 && !tokens.__v1v2) {
      const TRV = /^(?:pass|throw|catch|kick|hit|wash|cut|cook|buy|sell|read|write|open|close|clean|fix|check|bounce|dribble|share|use|carry|hold|push|pull|wear|bring|keep|prepare|serve|choose|order|pick|paint|repair|recycle|reuse|borrow|lend|send|print|copy|save|delete|edit|sign|fold|wrap|dry|heat|boil|fry|bake|grill|peel|slice|chop|mix|stir|taste|smell|touch|feel|see|watch|hear|love|like|hate|need|want)$/;
      const kV = T.findIndex((x, q) => q >= 1 && x.k === 'w' && TRV.test(x.w) && T[q - 1] && T[q - 1].k === 'w' && (!!MODAL[T[q - 1].w] || isW(T[q - 1], 'to') || isW(T[q - 1], 'please')) && T[q + 1] && /^(?:or|and)$/.test(T[q + 1].w || '') && T[q + 2] && T[q + 2].k === 'w' && !!vc(T[q + 2], ['base']) && !nounC(T[q + 2]) && T[q + 3] && T[q + 3].k === 'w' && DET[T[q + 3].w] !== undefined);
      if (kV > 0) {
        const mV = mark();
        const nV2 = np(kV + 3, b, { noRel: true, noCoord: true });
        reset(tokens);
        if (nV2 && nV2.end > kV + 3) {
          const itTok = { k: 'w', w: 'it', s: 'it' };
          const tV = tokens.slice(0, kV + 1).concat(tokens.slice(kV + 3, nV2.end), tokens.slice(kV + 1, kV + 3), [itTok], tokens.slice(nV2.end)).map((x, k) => Object.assign({}, x, { i: k }));
          tV.__v1v2 = true;
          const rV = translate1(tV);
          reset(tokens);
          if (rV && rV.ok) return Object.assign({}, rV, { ja: rV.ja.replace(/、それを/, '、') });
        }
        fail(mV);
      }
    }
    // 呼びかけ: Ken, come here.""")

rep("""      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };""",
    """      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };
      else if (L === 'bounce' && /(?:^| )(?:ball|balls|it)$/.test(oh || (objs[0] && objs[0].pron) || '')) sense = { particle: 'を', core: '弾ませる', tr: true };   // bounce the ball → ボールを弾ませる
      else if (L === 'pass' && /(?:^| )(?:ball|balls)$/.test(oh)) sense = { particle: 'を', core: 'パスする', tr: true };   // pass the ball → ボールをパスする""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
