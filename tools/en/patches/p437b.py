import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "/^(?:idea|way|mistake|pity|shame|waste|challenge|pleasure|honor|honour|privilege|tradition|custom|rule|habit|joy|fun|surprise|relief|thing|chance|opportunity|experience|dream)$/.test(nNi.head || '')"
assert s.count(old) == 1
s = s.replace(old, "/^(?:idea|mistake|pity|shame|waste|challenge|pleasure|honor|honour|privilege|tradition|custom|rule|habit|joy|fun|surprise|relief|experience)$/.test(nNi.head || '')")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
