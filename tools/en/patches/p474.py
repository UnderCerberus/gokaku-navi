import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# say + 「こと」の名詞（such a thing / the same thing / a word）→ を言う
rep("""      else if (L === 'say' && objs[0].pron && /^(?:it|this|that|something|anything|nothing|everything|them)$/.test(objs[0].pron)) sense = { particle: 'を', core: '言う', tr: true };""",
    """      else if (L === 'say' && ((objs[0].pron && /^(?:it|this|that|something|anything|nothing|everything|them)$/.test(objs[0].pron)) || /(?:^| )(?:thing|things|word|words|joke|jokes|lie|lies|prayer|prayers|grace|name|names)$/.test(oh))) sense = { particle: 'を', core: '言う', tr: true };   // He said such a thing → そんなことを言った""")

# You needn't have come so early. / You need not have worried. → そんなに早く来る必要はなかったのに
rep("""    // She went to the store only to find it closed.""",
    """    if (b > 4 && !tokens.__needH) {
      let kNh = T.findIndex((x, q) => q >= 1 && isW(x, 'need') && isW(T[q + 1], 'not') && isW(T[q + 2], 'have') && !!vc(T[q + 3], ['pp']));
      let nNh = 3;
      if (kNh < 0) { kNh = T.findIndex((x, q) => q >= 1 && seq(q, ['do', 'not', 'have', 'to', 'have']) && !!vc(T[q + 5], ['pp'])); nNh = 5; }
      if (kNh > 0) {
        const lemNh = vc(T[kNh + nNh], ['pp']).lemma;
        const mkNh = (w0, src) => Object.assign({}, src, { w: w0, s: w0, raw: w0, an: undefined, oi: undefined });
        const tNh = tokens.slice(0, kNh).concat([mkNh('did', tokens[kNh]), mkNh('not', tokens[kNh + 1]), mkNh('have', tokens[kNh + 2]), mkNh('to', tokens[kNh + 2]), Object.assign({}, tokens[kNh + nNh], { w: lemNh, s: lemNh, raw: lemNh, an: undefined })], tokens.slice(kNh + nNh + 1)).map((x, k) => Object.assign({}, x, { i: k }));
        tNh.__needH = true;
        const rNh = translate1(tNh);
        reset(tokens);
        if (rNh && rNh.ok && /必要はなかった。$/.test(rNh.ja)) return Object.assign({}, rNh, { ja: rNh.ja.replace(/とても(早く|遅く|多く|たくさん|急いで|心配)/, 'そんなに$1').replace(/。$/, 'のに。'), names: rNh.names.concat(['modal-perfect']) });
      }
    }
    // She went to the store only to find it closed.""")

rep("""    ja = ja.replace(/知識の隙間/g, '知識の空白')""",
    """    ja = ja.replace(/何か([^、。をがは]{1,8}?)ものを(言|話)/g, '何か$1ことを$2').replace(/ひと言言わ(ない|なかった)/g, 'ひと言も言わ$1');   // said something strange → 何か奇妙なことを言った / never says a word → ひと言も言わない
    if (tokens.some((x) => x.w === 'said') && !tokens.some((x) => x.w === 'for' || x.w === 'please')) ja = ja.replace(/によろしく伝えた/, 'にあいさつした');   // I said hello to her → 彼女にあいさつした
    ja = ja.replace(/知識の隙間/g, '知識の空白')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
