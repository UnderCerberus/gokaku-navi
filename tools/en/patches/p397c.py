import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/いくつかの([^、。]{1,6}?)は水浸しだった/, '水浸しになった$1もあった').replace(/([^、。]{1,6}?)は水浸しだった(?=。|$)/, '$1は水浸しになった');   // some roads were flooded → 水浸しになった道路もあった\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
