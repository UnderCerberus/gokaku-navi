import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# be (often) better able to: 頻度の副詞を挟む形も
rep("""      // are better able to understand → よりよく理解できる / more able to → もっと〜できる / less able to → あまり〜できない
      if (j + 3 < lim && /^(?:better|more|less)$/.test(T[j].w || '') && seq(j + 1, ['able', 'to']) && vc(T[j + 3], ['base'])) {
        if (T[j].w === 'less') vg.neg = true;
        vg.advs.push({ a: { ja: T[j].w === 'better' ? 'よりよく' : (T[j].w === 'more' ? 'もっと' : 'あまり'), kind: 'm', e: null }, w: T[j].w });
        vg.semi = 'able'; j += 3; return baseVerb();
      }""",
    """      // are (often) better able to understand → よりよく理解できる / more able to → もっと〜できる / less able to → あまり〜できない
      {
        let q = j;
        const advQ = [];
        while (q < lim && T[q].k === 'w' && ADV[T[q].w] && ADV[T[q].w][1] === 'f' && !ADV[T[q].w][2]) { advQ.push({ a: advC(T[q]), w: T[q].w }); q++; }
        const cmpA = q < lim && /^(?:better|more|less)$/.test(T[q].w || '') ? T[q].w : '';
        const qa = cmpA ? q + 1 : q;
        if ((advQ.length || cmpA) && qa + 2 < lim && seq(qa, ['able', 'to']) && vc(T[qa + 2], ['base'])) {
          advQ.forEach((x) => vg.advs.push(x));
          if (cmpA === 'less') vg.neg = true;
          if (cmpA) vg.advs.push({ a: { ja: cmpA === 'better' ? 'よりよく' : (cmpA === 'more' ? 'もっと' : 'あまり'), kind: 'm', e: null }, w: cmpA });
          vg.semi = 'able'; j = qa + 2; return baseVerb();
        }
      }""")

# seriously / severely + 被害・けがの語 → ひどく
rep("""  const pick = (i, e) => { if (e && T[i] && T[i].oi !== undefined) SEL.push([T[i].oi, e]); };""",
    """  // -ly の副詞の訳。seriously / severely + 被害・けがの語 → ひどく（真剣に ではない）
  function lyJa(q) {
    const av = advC(T[q]);
    if (!av) return '';
    if (/^(?:seriously|severely|heavily|gravely|critically)$/.test(T[q].w) && T[q + 1] && /^(?:damaged|injured|hurt|wounded|ill|sick|affected|burned|burnt|polluted|flooded|destroyed|disabled)$/.test(T[q + 1].w || '')) return 'ひどく';
    return av.ja;
  }
  const pick = (i, e) => { if (e && T[i] && T[i].oi !== undefined) SEL.push([T[i].oi, e]); };""")
rep("""      if (deg && lyAdj(k)) { const avL = advC(T[k]); pick(k, avL.e); deg += avL.ja; k++; }""",
    """      if (deg && lyAdj(k)) { pick(k, advC(T[k]).e); deg += lyJa(k); k++; }""")
rep("""            if (r0 && lyS) r0.lySo = lyS.ja;""",
    """            if (r0 && lyS) r0.lySo = lyJa(j + 1);""")
rep("""          const r1 = fin(P('とても' + (lyS ? lyS.ja : '') + f1.pred.s, f1.pred.cls), lim);""",
    """          const r1 = fin(P('とても' + (lyS ? lyJa(j + 1) : '') + f1.pred.s, f1.pred.cls), lim);""")

# 法助動詞 + never + 完了（would never have finished）は「決して」（一度も は経験の完了だけ）
rep("""    if (st.never) { parts.push(vg.perfect ? '一度も' : '決して');""",
    """    if (st.never) { parts.push(vg.perfect && !vg.modal ? '一度も' : '決して');""")

# the more successful you will become → ますます成功するだろう（〜している型の形容詞 + なる）
rep("""      const becomeV = (aj) => (aj.kind === 'v' ? P(/自信がある$/.test(aj.pred.plain()) ? aj.pred.plain().replace(/自信がある$/, '自信がつく') : aj.pred.plain() + 'ようになる', 'v5') : P(aj.adv + 'なる', 'v5'));""",
    """      const becomeV = (aj) => (aj.kind === 'v' ? P(/自信がある$/.test(aj.pred.plain()) ? aj.pred.plain().replace(/自信がある$/, '自信がつく') : aj.pred.plain() + 'ようになる', 'v5') :
        ((aj.kind === 'ta' || aj.kind === 'te') && /している$/.test(aj.pred.plain()) ? P(aj.pred.plain().replace(/している$/, 'する'), 'suru') : P(aj.adv + 'なる', 'v5')));""")

# The harder you work, … → 熱心に働けば働くほど（〜ほど の節では work を「働いている」にしない）
rep("""        const cl0 = k < e ? clause(k, e, o) : null;""",
    """        const cl0 = k < e ? clause(k, e, Object.assign({}, o, { hodo: true })) : null;""")
rep("""      const cl = k < e ? clause(k, e, o) : null;
      return cl ? { cl: cl, pre: pre, lessV: lessV } : null;""",
    """      const cl = k < e ? clause(k, e, Object.assign({}, o, { hodo: true })) : null;
      return cl ? { cl: cl, pre: pre, lessV: lessV } : null;""")
rep("""    else if (vg.lemma === 'work' && !vg.past && !vg.modal && !vg.prog && !vg.perfect && !vg.passive && !vg.nonfin && st.freq.every(""",
    """    else if (vg.lemma === 'work' && !o.hodo && !vg.past && !vg.modal && !vg.prog && !vg.perfect && !vg.passive && !vg.nonfin && st.freq.every(""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
