import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "      if (THE_ADJ[T[i + 1].w]) return postMod({ ja: THE_ADJ[T[i + 1].w], end: i + 2, an: true, pl: true, head: 'people' }, lim, o);"
new = "      if (THE_ADJ[T[i + 1].w] && !(i + 3 < lim && T[i + 2].k === 'w' && T[i + 3].k === 'w' && !!nounC(T[i + 2]) && !!nounC(T[i + 3]) && !PREP[T[i + 3].w] && !/^(?:need|needs|want|wants|live|lives|have|has|get|gets|make|makes|pay|pays|work|works|suffer|suffers|die|dies|help|helps|eat|eats|use|uses|like|likes)$/.test(T[i + 2].w))) return postMod({ ja: THE_ADJ[T[i + 1].w], end: i + 2, an: true, pl: true, head: 'people' }, lim, o);   // the old train station は 古い駅（形容詞 + 複合名詞）"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
