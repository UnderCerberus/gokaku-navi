import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# sleep deserves more attention than it usually receives → 普段受けているより多くの注意 / He eats more than he usually does → いつもより多く
# （than + 代名詞 + usually / normally + 動詞・助動詞の省略節。頻度の副詞を挟んでも省略節として読む）
rep("""  function thanEllipsis(i, lim, mainSj) {""",
    """  function thanEllipsis(i, lim, mainSj) {
    if (i + 2 < lim && lim - i <= 4 && T[i].k === 'w' && ((PRON[T[i].w] && PRON[T[i].w].sub) || T[i].w === 'it') && T[i + 1] && /^(?:usually|normally|typically|generally|often)$/.test(T[i + 1].w || '')) {
      const tU = T[i + 2];
      if (tU && tU.k === 'w' && (DO[tU.w] || BE[tU.w] || MODAL[tU.w]) && i + 3 === lim) return 'いつも';
      const wvU = tU && tU.k === 'w' ? vc(tU, ['base', 'past', '3sg']) : null;
      if (wvU && wvU.e && i + 3 === lim) { const pU = P(verbSense(wvU.e, true).core); return '普段' + (verbal(pU) ? pU.form('te') + 'いる' : pU.plain()); }
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
