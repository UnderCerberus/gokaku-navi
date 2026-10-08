import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/休みの日を持って(いる|いた)/g, (m0, a0) => '休みが' + (a0 === 'いる' ? 'ある' : 'あった')).replace(/^(?:彼女の|彼の|私の)?休みの日に、/, '休みの日には、');   // I have a day off tomorrow → 明日休みがある / On her days off → 休みの日には\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
