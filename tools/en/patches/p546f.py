import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# pictures that my grandfather had taken when she was a child → 彼女が子どもだったときに祖父が撮った写真
# These are the pictures that my grandfather took when he was young → これらは祖父が若かったときに撮った写真だ
# （関係詞節が過去完了か、主節が現在で従属節が過去なら、後ろの when / before … 節を関係詞節の中で読むのを先に試す）
rep("""  let WH_SUBIN = false;""",
    """  let WH_SUBIN = false;
  let REL_SUBIN = false;   // 関係詞節の中に後ろの従属節を入れて読む（sentence の 3) から試す）""")
rep("""        const gap = { type: 'np', rel: true, used: false, ante: node.head };                         // 目的格
        let cl = clause(j + 1, e1, { gap: gap, sub: true });""",
    """        const gap = { type: 'np', rel: true, used: false, ante: node.head };                         // 目的格
        if (REL_SUBIN && e1 - j >= 5) {
          for (let k = j + 3; k < e1 - 2; k++) {
            const sK = subAt(k, e1);
            if (!sK || !/^(?:when|before|after|while|until|once)$/.test(sK.key) || isP(T[k - 1], ',')) continue;
            const mK = mark();
            const gK = { type: 'np', rel: true, used: false, ante: node.head };
            const cK = clause(j + 1, k, { gap: gK, sub: true });
            const scK = cK && gK.used ? sentence(k + sK.len, e1, { sub: true }) : null;
            if (cK && scK) { gap.used = true; e = e1; return fin(subStr(sK.key, scK, cK, null).replace(/、$/, '') + cK.out({ part: 'が', form: 'attr' }), 'relative'); }
            fail(mK);
            break;
          }
        }
        let cl = clause(j + 1, e1, { gap: gap, sub: true });""")
rep("""      if (!WH_SUBIN && !isP(pv, ',') && /^(?:when|once|after|before|until|as soon as|if|whenever|the moment)$/.test(s2.key) && T.slice(a + 1, j - 2).some((x, q) => x.k === 'w' && /^(?:what|how|why|where|who|which|whether)$/.test(x.w)""",
    """      const kRs = !REL_SUBIN && !isP(pv, ',') && /^(?:when|before|after|while|until|once)$/.test(s2.key) ? T.findIndex((x, q) => q > a && q < j - 2 && x.k === 'w' && /^(?:that|which)$/.test(x.w) && T[q - 1].k === 'w' && !!nounC(T[q - 1]) && DET[T[q - 1].w] === undefined && !PRON[T[q - 1].w] && T[q + 1].k === 'w' && ((!!PRON[T[q + 1].w] && !!PRON[T[q + 1].w].sub) || DET[T[q + 1].w] !== undefined)) : -1;
      if (kRs > 0) {
        const relPf = T.slice(kRs, j).some((x, q, arr) => /^(?:had)$/.test(x.w || '') && arr[q + 1] && arr[q + 1].k === 'w' && !!vc(arr[q + 1], ['pp']));
        const mainPres = T.slice(a, kRs).some((x) => x.k === 'w' && /^(?:is|are|am|remember|remembers|love|loves|like|likes|keep|keeps|have|has|know|knows|still)$/.test(x.w));
        const subPast = T.slice(j + 1, b).some((x) => x.k === 'w' && (/^(?:was|were)$/.test(x.w) || (!!vc(x, ['past']) && !vc(x, ['base']))));
        if (relPf || (mainPres && subPast)) {
          const mRs = mark();
          REL_SUBIN = true;
          let wholeR = null;
          try { wholeR = clause(a, b, o); } finally { REL_SUBIN = false; }
          if (wholeR) return wrap(wholeR);
          fail(mRs);
        }
      }
      if (!WH_SUBIN && !isP(pv, ',') && /^(?:when|once|after|before|until|as soon as|if|whenever|the moment)$/.test(s2.key) && T.slice(a + 1, j - 2).some((x, q) => x.k === 'w' && /^(?:what|how|why|where|who|which|whether)$/.test(x.w)""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
