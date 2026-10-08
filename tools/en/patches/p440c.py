import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/早い返事/g, '早速のお返事').replace(/^私が意味するのは"
assert s.count(old) == 1
s = s.replace(old, ".replace(/(?:早|速)い返事/g, '早速のお返事').replace(/^私が意味するのは")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
