import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    { const nx0 = j + 1 < lim ? T[j + 1] : null, ve = vc(t, ['ing']); if (ve && ve.e && nx0 && nx0.k === 'w' && nounC(nx0)"
new = "    if (j > 0 && T[j - 1].k === 'w' && /^(?:enjoy|enjoys|enjoyed|enjoying|finish|finished|finishes|stop|stopped|stops|keep|kept|keeps|start|started|starts|begin|began|begins|practice|practiced|practices|avoid|avoided|mind|quit|like|likes|liked|love|loves|loved|hate|hates|hated|consider|considered|imagine|miss|missed)$/.test(T[j - 1].w)) return true;   // We enjoyed singing songs（動名詞をとる動詞のあとは 自動詞の 〜ing + 名詞 でも動名詞）\n" + old
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
