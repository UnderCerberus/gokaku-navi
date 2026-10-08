import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It looks nice, but do you have a cheaper one? → すてきに見えるが、もっと安いのはありますか（平叙文 + , but + 疑問文）
rep("""    // Dear Mr. Brown, I am writing to ask … → ブラウン様。…についてお尋ねしたく、ご連絡しました（書き出しの呼びかけ + 本文）
""",
    """    if (b > 6 && tokens[b] && isP(tokens[b], '?') && !tokens.__butQ) {
      const kBq = T.findIndex((x, q2) => q2 >= 3 && isP(x, ',') && T[q2 + 1] && /^(?:but|so|and)$/.test(T[q2 + 1].w || '') && T[q2 + 2] && /^(?:do|does|did|can|could|will|would|is|are|was|were|may|should|have|has|what|where|when|why|how|who|which)$/.test(T[q2 + 2].w || ''));
      if (kBq > 0) {
        const tBL = tokens.slice(0, kBq).concat([{ k: 'p', w: '.', s: '.' }]).map((x, k) => Object.assign({}, x, { i: k }));
        const tBR = tokens.slice(kBq + 2).map((x, k) => Object.assign({}, x, { i: k, first: k === 0, cap: k === 0 ? false : x.cap }));
        tBL.__butQ = true; tBR.__butQ = true;
        reset(tokens);
        const rBL = translate1(tBL);
        reset(tokens);
        const rBR = rBL && rBL.ok ? translate1(tBR) : null;
        reset(tokens);
        if (rBL && rBL.ok && rBR && rBR.ok && !(rBL.names || []).includes('fragment')) {
          const cj = { but: 'が、', so: 'ので、', and: '。' }[T[kBq + 1].w];
          const lj = rBL.ja.replace(/。$/, '');
          return Object.assign({}, rBR, { ja: (cj === '。' ? lj + '。' : (cj === 'が、' ? lj.replace(/だ$/, 'だ') + 'が、' : lj + 'ので、')) + rBR.ja });
        }
      }
    }
    // Dear Mr. Brown, I am writing to ask … → ブラウン様。…についてお尋ねしたく、ご連絡しました（書き出しの呼びかけ + 本文）
""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/(?:もっと)?(大きい|小さい)(?:大きさ|サイズ)でそれ(?:は|が)ありますか/, 'もっと$1サイズはありますか').replace(/(父|母|姉|妹|兄|弟|友達|祖母|祖父|息子|娘|妻|夫|彼女|彼)にとって([^、。]{1,10}?)を探して/, '$1のための$2を探して').replace(/昨夜遅く([^、。]*?)夜更かし(した|する)/, '$1昨夜遅くまで起きていた');   // do you have it in a larger size? → もっと大きいサイズはありますか / looking for a sweater for my father → 父のためのセーターを探している / stayed up late last night to study → 勉強するために昨夜遅くまで起きていた
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
