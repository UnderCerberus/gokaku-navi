import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# He was the last person I expected to see at the concert → 私がコンサートで会うとはまったく思っていなかった人（the last + 名詞 + S expected / thought … to V は「まさか〜とは思わなかった」）
rep("""  function relClause(node, lim, o) {
    let j = node.end;
    if (j >= lim || !T[j] || node.clause || node.gerund || DEPTH > 4) return null;
    const m = mark();""",
    """  function relClause(node, lim, o) {
    let j = node.end;
    if (j >= lim || !T[j] || node.clause || node.gerund || DEPTH > 4) return null;
    const m = mark();
    if (/^最後の/.test(node.ja || '') && !node.pron && T[j].k === 'w' && ((PRON[T[j].w] && PRON[T[j].w].sub) || isW(T[j], 'anyone')) && T[j + 1] && /^(?:expected|expect|thought|imagined|wanted|want)$/.test(T[j + 1].w || '') && isW(T[j + 2], 'to') && j + 3 < lim && T[j + 3].k === 'w' && !!vc(T[j + 3], ['base'])) {
      const gL = { type: 'np', rel: true, used: false, ante: node.head };
      const iL = vpNonfin(j + 3, lim, 'base', { gap: gL });
      if (iL && gL.used && verbal(iL.pred)) {
        const sL = PRON[T[j].w] && PRON[T[j].w].ja ? PRON[T[j].w].ja : ({ i: '私', you: 'あなた', he: '彼', she: '彼女', we: '私たち', they: '彼ら', anyone: '誰も' })[T[j].w] || '';
        const vL = /^(?:see|meet)$/.test(iL.vg ? iL.vg.lemma : '') && node.an ? iL.parts.join('') + '会う' : vpJoin(iL, 'dict');
        const wantL = /^(?:wanted|want)$/.test(T[j + 1].w);
        name('relative');
        return Object.assign({}, node, { ja: sL + 'が' + (wantL ? '最も' + iL.parts.join('') + (iL.vg && iL.vg.lemma === 'hear' ? '聞き' : (iL.vg && iL.vg.lemma === 'see' ? (node.an ? '会い' : '見') : iL.pred.form('stem'))) + (T[j + 1].w === 'wanted' ? 'たくなかった' : 'たくない') : vL + 'とはまったく思っていなかった') + node.ja.replace(/^最後の/, ''), end: iL.end, rel: true });
      }
      fail(m);
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
