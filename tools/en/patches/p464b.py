import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/人生の(?:簡単な|単純な)形/g, '単純な生命体')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/と信じている(科学者|専門家|研究者|医者)もいる/g, 'と考えている$1もいる');   // Some scientists believe that … → …と考えている科学者もいる\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
