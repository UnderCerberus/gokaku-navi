import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Higher temperatures are not just uncomfortable → 単に不快なだけではない（be + not + just / only / simply / merely + 形容詞は「単に〜だけではない」。「単なる不快ではない」「ちょうど不快ではない」にしない）
rep("""    const exist = () => P(anim ? 'いる' : 'ある', anim ? 'v1' : 'aru');
    if (vg.lemma === 'be' && !vg.passive && lim - i >= 2 && isW(T[lim - 1], 'ago')) {""",
    """    const exist = () => P(anim ? 'いる' : 'ある', anim ? 'v1' : 'aru');
    if (vg.lemma === 'be' && vg.neg && !vg.passive && i + 2 === lim && /^(?:just|only|simply|merely)$/.test(T[i].w || '') && adjC(T[i + 1]) && !T.slice(lim).some((x) => isW(x, 'but'))) {
      const aJs = adjC(T[i + 1]);
      const fJs = aJs && aJs.e ? en.jp.adj(aJs.e.ja) : null;
      if (fJs && (fJs.kind === 'i' || fJs.kind === 'na')) {
        const mJs = mark();
        pick(i + 1, aJs.e);
        const ngJs = vg.neg;
        vg.neg = false;
        const rJs = fin(P('単に' + fJs.attr + 'だけではない', 'i'), tail(i + 2, lim, st, o, vg));
        if (rJs) return rJs;
        vg.neg = ngJs;
        fail(mJs);
      }
    }
    if (vg.lemma === 'be' && !vg.passive && lim - i >= 2 && isW(T[lim - 1], 'ago')) {""")

# Heat can be dangerous for elderly people → 高齢者にとって危険だ（危険・有害・重要などの形容詞 + for + 人は「〜にとって」）
rep("""      const ppE = parsePP(j + 1, lim, {});
      if (ppE) {
        const pj = ppE.ja;""",
    """      const ppE = parsePP(j + 1, lim, {});
      if (ppE) {
        const pj = ppE.prep === 'for' && ppE.obj && (ppE.obj.an || /^(?:me|us|him|her|them|you)$/.test(ppE.obj.pron || '')) && vg && vg.lemma === 'be' && /のために$/.test(ppE.ja) ? ppE.obj.ja + 'にとって' : ppE.ja;""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
