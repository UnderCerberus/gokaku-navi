import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "ja = ja.replace(/(美しい|きれいな)?発表/g, (m0, a0) => (a0 || '') + '盛り付け');"
assert s.count(old) == 1
s = s.replace(old, "ja = ja.replace(/(美しい|きれいな)?発表/g, (m0, a0) => (a0 || '') + '盛り付け').replace(/季節の材料/g, '旬の食材').replace(/材料/g, '食材');\n    ja = ja.replace(/のその(使用|利用)/g, 'の$1').replace(/(使用|利用)とその/g, '$1と');   // its use of fresh ingredients and its beautiful presentation → 新鮮な旬の食材の使用と美しい盛り付け")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
