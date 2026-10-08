import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/^([^、。]{1,10})は([^、。]{1,10}?)に利用できる(。?)$/, '$2は$1を利用できる$3')"
assert s.count(old) == 1
s = s.replace(old, ".replace(/^([^、。]{1,10})は([^、。]{1,10}?)に利用できる(。?)$/, (m0, a0, b0, c0) => (tokens.some((x) => x.w === 'for') && !/^(?:私|彼|彼女|私たち|あなた|彼ら|それ)/.test(a0) ? b0 + 'は' + a0 + 'を利用できる' + c0 : m0))")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
