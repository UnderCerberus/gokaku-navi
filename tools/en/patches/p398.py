import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/^朝に、/, '午前中は、').replace(/^午後に、/, '午後は、').replace(/^夕方に、/, '夕方は、').replace(/^夜に、/, '夜は、').replace(/^([^、。]{1,10}?)はしないが、/, '$1はそうではないが、');   // In the morning, I had a math test → 午前中は、数学の試験があった / Many people don't, but … → 多くの人々はそうではないが、\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
