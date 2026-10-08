import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "ja = ja.replace(/([^、。]{1,8}?)の中に(?:その)?([^、。]{1,8}?)を(拡大|広げ|進出)/g, '$2を$1に$3')"
new = "ja = ja.replace(/([^、。はが]{1,8}?)の中に(?:その)?([^、。はが]{1,8}?)を(拡大|広げ|進出)/g, '$2を$1に$3')"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
