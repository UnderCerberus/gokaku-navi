import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/(事故|試合|地震|火事|戦争|けんか|爆発)にけがをし/g, '$1でけがをし');   // He was injured in a car accident → 自動車事故でけがをした\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
