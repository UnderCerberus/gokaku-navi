import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "|consider|considered|imagine|miss|missed)$/.test(T[j - 1].w)) return true;   // We enjoyed singing songs（動名詞をとる動詞のあとは 自動詞の 〜ing + 名詞 でも動名詞）"
new = "|consider|considered|imagine|miss|missed)$/.test(T[j - 1].w) && j + 1 < lim && T[j + 1].k === 'w' && (!!nounC(T[j + 1]) || DET[T[j + 1].w] !== undefined) && !PREP[T[j + 1].w] && !/^(?:and|or|but)$/.test(T[j + 1].w)) return true;   // We enjoyed singing songs（動名詞をとる動詞のあとは 自動詞の 〜ing + 名詞 でも動名詞。I like skiing は名詞のまま）"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
