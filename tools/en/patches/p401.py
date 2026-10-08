import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/静かになろうと/g, '静かにしようと').replace(/(?:それらが|彼らが)?([^、。]{1,16}?)ことは(?:かたく|固く|硬く)な(る|った)/, (m0, a0, b0) => a0 + 'のが難しくな' + b0);   // I try to be quiet → 静かにしようとする / it becomes hard for them to find food → 食べ物を見つけるのが難しくなる\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
