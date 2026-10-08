import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    if (nom.head === 'dish' && /皿$/.test(ja) && T.some((x) => x.k === 'w' && /^(?:make|makes|made|cook|cooks|cooked|cooking|recipe|recipes|delicious|favorite|favourite|eat|ate|taste|restaurant|menu|dinner|lunch)$/.test(x.w)))"
new = "    if (nom.head === 'dish' && /皿$/.test(ja) && !(i > 1 && T[i - 1] && T[i - 1].w === 'the' && T[i - 2] && /^(?:wash|washes|washed|washing|do|does|did|doing|dry|dries|dried|clear|cleared|put)$/.test(T[i - 2].w || '')) && T.some((x) => x.k === 'w' && /^(?:make|makes|made|cook|cooks|cooked|cooking|recipe|recipes|delicious|favorite|favourite|eat|ate|taste|restaurant|menu|dinner|lunch)$/.test(x.w)))"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
