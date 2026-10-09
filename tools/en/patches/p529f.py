import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Throwing away food is a waste of money → お金の無駄（a waste of + 名詞 は ごみ にしない）
rep("""    if (nom.head === 'waste' && /無駄$/.test(ja) && T.some((x) => x.k === 'w' && /^(?:landfill|""",
    """    if (nom.head === 'waste' && /無駄$/.test(ja) && !isW(T[nom.end], 'of') && T.some((x) => x.k === 'w' && /^(?:landfill|""")

# at every stage / at this stage / in the early stages → 段階（舞台 にしない。on (the) stage は舞台のまま）
rep("""    if (node && !node.pron && node.end >= 2 && isW(T[node.end - 1], 'fault')""",
    """    if (node && !node.pron && node.end >= 1 && /^stages?$/.test(T[node.end - 1].w || '') && /舞台/.test(node.ja || '')) {
      let q0St = node.end - 1;
      while (q0St > 0 && T[q0St - 1].k === 'w' && !PREP[T[q0St - 1].w] && (DET[T[q0St - 1].w] !== undefined || !!adjC(T[q0St - 1]) || /^(?:every|each)$/.test(T[q0St - 1].w))) q0St--;
      const pvSt = q0St > 0 ? T[q0St - 1].w || '' : '';
      if (pvSt !== 'on' && (T.slice(q0St, node.end - 1).some((x) => /^(?:every|each|this|that|these|those|early|earlier|late|later|final|initial|first|second|third|next|last|different|various|all|same|certain|critical|crucial|key)$/.test(x.w || '')) || /^(?:at|through|from)$/.test(pvSt))) node = Object.assign({}, node, { ja: node.ja.replace(/舞台(?!.*舞台)/, '段階') });
    }
    if (node && !node.pron && node.end >= 2 && isW(T[node.end - 1], 'fault')""")

# the rest of the world → 世界のほかの国々 / the rest of his family → 彼の家族のほかの人たち（残り にしない）
rep("""      if (isW(t, 'of') && !node.pron && j + 1 < lim) {
        const m0 = mark();
        // a few pages of one book and then a few pages of another""",
    """      if (isW(t, 'of') && node.head === 'rest' && !node.pron && j + 1 < lim) {
        const mRs = mark();
        const nRs = np(j + 1, lim, { noRel: true, noCoord: true });
        const worldRs = !!nRs && !nRs.pron && /^(?:world|globe|planet|earth)$/.test(nRs.head || '');
        const anRs = !!nRs && !nRs.pron && (!!nRs.an || /^(?:family|class|team|group|crew|staff|students|people|members|villagers)$/.test(nRs.head || ''));
        if (worldRs || anRs) { node = Object.assign({}, node, { ja: worldRs ? '世界のほかの国々' : (/^(?:my|your|his|her|our|their)$/.test(T[j + 1].w || '') ? nRs.ja + 'のほかの人たち' : '残りの' + nRs.ja), end: nRs.end, an: true }); continue; }
        fail(mRs);
      }
      if (isW(t, 'of') && !node.pron && j + 1 < lim) {
        const m0 = mark();
        // a few pages of one book and then a few pages of another""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
