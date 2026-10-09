import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "return { ok: true, ja: r1So.ja.replace(/。$/, '').replace(/だ$/, 'で').replace(/(い)$/, '$1し').replace(/た$/, 'たし') + '、' + nSo.ja"
new = "return { ok: true, ja: r1So.ja.replace(/。$/, '').replace(/だ$/, 'で').replace(/(い)$/, '$1し').replace(/た$/, 'たし').replace(/([るうくぐすつぬぶむ])$/, '$1し') + '、' + nSo.ja"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
