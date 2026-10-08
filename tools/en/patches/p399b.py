import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/冗談に話(す|し|さ)/g, (m0, a0) => '冗談を言' + ({ 'す': 'う', 'し': 'い', 'さ': 'わ' })[a0]).replace(/冗談を話(す|し|さ)/g, (m0, a0) => '冗談を言' + ({ 'す': 'う', 'し': 'い', 'さ': 'わ' })[a0]).replace(/私が私の/g, '私が');   // by telling jokes → 冗談を言うことによって / helped me finish my homework → 私が宿題を終えるのを手伝った\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
