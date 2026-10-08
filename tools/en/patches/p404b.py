import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/ストレスを感じ(?:ている|た)と感じ/g, 'ストレスを感じ');   // feel stressed → ストレスを感じる\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
