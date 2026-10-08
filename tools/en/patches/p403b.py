import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "      const md = modifier(j, lim, hasDet || nmod > 0 || (j + 1 < lim && T[j + 1].k === 'w' && !!cand(T[j + 1], '名', ['pl'])) ||"
new = "      const gerAfterV = !hasDet && nmod === 0 && j > 0 && T[j].k === 'w' && !!vc(T[j], ['ing']) && T[j - 1].k === 'w' && /^(?:enjoy|enjoys|enjoyed|enjoying|finish|finished|finishes|stop|stopped|stops|keep|kept|keeps|start|started|starts|begin|began|begins|practice|practiced|practices|avoid|avoided|mind|quit|like|likes|liked|love|loves|loved|hate|hates|hated|consider|considered|imagine|miss|missed)$/.test(T[j - 1].w);   // We enjoyed singing songs の singing は動名詞\n      const md = gerAfterV ? null : modifier(j, lim, hasDet || nmod > 0 || (j + 1 < lim && T[j + 1].k === 'w' && !!cand(T[j + 1], '名', ['pl'])) ||"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
