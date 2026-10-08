import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/^(?:彼女の|彼の|私の)?休みの日に、/, '休みの日には、')"
new = ".replace(/^(?:彼女の|彼の|私の)?休みの日(?:に|で|では)、/, '休みの日には、')"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
