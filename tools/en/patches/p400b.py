import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/^((?:その|この)?(?:赤ちゃん|赤ん坊|子ども|子猫|子犬|猫|ネコ|犬))は([^、。]{0,12}?)(?:に|によって)行われ(た|ている|る)/, '$1は$2に抱かれ$3');   // The baby was held by her mother → 赤ちゃんは母親に抱かれた\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
