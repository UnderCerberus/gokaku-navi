import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the courage to share who I am with people → 自分がどんな人間であるかを人々と共有する（目的語の who + 主語の代名詞 + be は「どんな人間であるか」。である誰 にしない）
rep("""    if (t.w === 'what' && !o.noRel && !o.noWhat) {
      const wc = whatClause(i, lim); if (wc) return wc;""",
    """    if (t.w === 'who' && !o.noRel && i + 2 < lim + 1 && T[i + 1] && T[i + 1].k === 'w' && PRON[T[i + 1].w] && PRON[T[i + 1].w].sub && T[i + 2] && T[i + 2].k === 'w' && BE[T[i + 2].w] && i + 3 <= lim && (i + 3 === lim || T[i + 3].k === 'p' || (T[i + 3].k === 'w' && (!!PREP[T[i + 3].w] || /^(?:and|but|or|now|today|really)$/.test(T[i + 3].w))))) {
      const whoJa = ({ i: '自分', we: '自分たち', you: 'あなた', he: '彼', she: '彼女', they: '彼ら' })[T[i + 1].w] || PRON[T[i + 1].w].ja;
      name('indirect-q');
      return { ja: whoJa + 'がどんな人間であるか', end: i + 3, clause: true };
    }
    if (t.w === 'what' && !o.noRel && !o.noWhat) {
      const wc = whatClause(i, lim); if (wc) return wc;""")

# That experience gave me the confidence I needed to speak up more often → もっと頻繁に意見を言うのに必要だった自信（接触節の need + to do は「〜するのに必要な」。必要があった自信 にしない）
rep("""    if (/^最後の/.test(node.ja || '') && !node.pron && T[j].k === 'w' && ((PRON[T[j].w] && PRON[T[j].w].sub) || isW(T[j], 'anyone'))""",
    """    if (!node.pron && node.head && T[j].k === 'w' && PRON[T[j].w] && PRON[T[j].w].sub && T[j + 1] && /^(?:need|needs|needed)$/.test(T[j + 1].w || '') && isW(T[j + 2], 'to') && j + 3 < lim && T[j + 3].k === 'w' && !!vc(T[j + 3], ['base']) && /^(?:courage|confidence|time|money|energy|skills|skill|knowledge|information|help|support|strength|tools|equipment|experience|ability|space|materials)$/.test(node.head)) {
      const iNd = vpNonfin(j + 3, lim, 'base', {});
      if (iNd && verbal(iNd.pred)) { name('relative'); return Object.assign({}, node, { ja: vpJoin(iNd, 'dict') + 'のに必要' + (T[j + 1].w === 'needed' ? 'だった' : 'な') + node.ja, end: iNd.end, rel: true }); }
      fail(m);
    }
    if (/^最後の/.test(node.ja || '') && !node.pron && T[j].k === 'w' && ((PRON[T[j].w] && PRON[T[j].w].sub) || isW(T[j], 'anyone'))""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
