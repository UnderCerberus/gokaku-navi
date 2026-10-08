import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# He said he would come if he had time → 彼は、時間があったら来ると言った（伝達節の末尾の if 節は伝達内容の中に入れる）
rep("""    // 呼びかけ: Ken, come here.""",
    """    if (b > 6 && !tokens.__repIf) {
      const kR = T.findIndex((x, q) => q >= 1 && q <= 4 && /^(?:said|told|thought|promised|explained|wrote|replied|answered|believed|felt|hoped|guessed)$/.test(x.w || ''));
      if (kR > 0) {
        let kS = kR + 1;
        if (/^(?:told|promised)$/.test(T[kR].w) && T[kS] && T[kS].k === 'w' && PRON[T[kS].w] && !PRON[T[kS].w].sub) kS++;
        const hasThat = isW(T[kS], 'that');
        const kC = hasThat ? kS + 1 : kS;
        const kIf = T.findIndex((x, q) => q > kC + 2 && q < b - 2 && /^(?:if|unless)$/.test(x.w || '') && !isP(T[q - 1], ','));
        if (kIf > 0 && T[kC] && T[kC].k === 'w' && PRON[T[kC].w] && PRON[T[kC].w].sub && T.slice(kC, kIf).some((x) => /^(?:would|could|might)$/.test(x.w || ''))) {
          const tR = tokens.slice(0, kS).concat([{ k: 'w', w: 'that', s: 'that' }]).concat(tokens.slice(kIf, b)).concat([{ k: 'p', w: ',', s: ',' }]).concat(tokens.slice(kC, kIf)).concat(tokens.slice(b)).map((x, k) => Object.assign({}, x, { i: k, first: k === 0, cap: k === 0 ? x.cap : (x.w === 'i' ? true : (x.first ? false : x.cap)) }));
          tR.__repIf = true;
          const rR = translate1(tR);
          reset(tokens);
          if (rR && rR.ok) return rR;
        }
      }
    }
    // 呼びかけ: Ken, come here.""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
