import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/(食品|食べ物|製品|薬|ワクチン|原子力|車)の安全を(心配|確認|保証|疑)/g, '$1の安全性を$2');   // the safety of genetically modified food → 遺伝子組み換え食品の安全性\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
