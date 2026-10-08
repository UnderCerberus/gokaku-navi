import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Dear Mr. Brown, I am writing to … → ブラウン様。…（呼びかけ + 本文が 1 文になったとき）
rep("""    // Hi Emma, thank you for your email. → こんにちは、エマ。メールをありがとう。（呼びかけの名前つきのあいさつ）
""",
    """    // Dear Mr. Brown, I am writing to ask … → ブラウン様。…についてお尋ねしたく、ご連絡しました（書き出しの呼びかけ + 本文）
    if (b > 5 && isW(T[0], 'dear') && !tokens.__drN) {
      const cDr = T.findIndex((x, q) => q >= 2 && q <= 5 && isP(x, ','));
      if (cDr > 1 && b > cDr + 2) {
        const nDr2 = np(1, cDr, { noRel: true });
        const tDr = tokens.slice(cDr + 1).map((x, k) => Object.assign({}, x, { i: k, first: k === 0, cap: k === 0 ? false : x.cap }));
        tDr.__drN = true;
        reset(tokens);
        const rDr = nDr2 && nDr2.end === cDr && (nDr2.proper || nDr2.an || /^(?:sir|madam|everyone|all|friend|friends|customer|customers|parents|students|members)$/.test(T[1].w || '')) ? translate1(tDr) : null;
        reset(tokens);
        if (rDr && rDr.ok) return Object.assign({}, rDr, { ja: nDr2.ja.replace(/^(?:ミスター|ミス|ミセス)/, '').replace(/さん$/, '') + (/(?:様|先生)$/.test(nDr2.ja) ? '' : '様') + '。' + rDr.ja });
      }
    }
    // Hi Emma, thank you for your email. → こんにちは、エマ。メールをありがとう。（呼びかけの名前つきのあいさつ）
""")

# Also, is it possible …? / However, is it true? → また、… / しかしながら、…（つなぎの副詞 + 疑問文）
rep("""        if (!node && b > 2 && T[0].k === 'w' && QLEAD[T[0].w]) {
          const a0 = isP(T[1], ',') ? 2 : 1;
          reset(tokens);
          const qn = question(a0, b);
          if (qn) { const lead0 = QLEAD[T[0].w], out0 = qn.out; node = Object.assign({}, qn, { out: (x) => lead0 + out0(x) }); }
        }""",
    """        if (!node && b > 2 && T[0].k === 'w' && QLEAD[T[0].w]) {
          const a0 = isP(T[1], ',') ? 2 : 1;
          reset(tokens);
          const qn = question(a0, b);
          if (qn) { const lead0 = QLEAD[T[0].w], out0 = qn.out; node = Object.assign({}, qn, { out: (x) => lead0 + out0(x) }); }
        }
        if (!node && b > 3 && T[0].k === 'w' && LEAD[T[0].w] && isP(T[1], ',') && !/^(?:yes|no|today|sometimes|usually|recently)$/.test(T[0].w)) {
          reset(tokens);
          const qL = question(2, b);
          if (qL) { const leadL = ({ however: 'しかし', also: 'また', besides: 'それに', actually: '実は', first: 'まず', finally: '最後に', anyway: 'とにかく' }[T[0].w] || LEAD[T[0].w]) + '、', outL = qL.out; node = Object.assign({}, qL, { out: (x) => leadL + outL(x) }); }
        }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
