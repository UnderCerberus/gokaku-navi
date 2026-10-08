import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "(が|は)健康(だ|です|だった|ではない)/g, '$1$2健康に良$3'.replace('良$3', '良い'));"
assert s.count(old) == 1
s = s.replace(old, "(が|は)健康(だ|です|だった|ではない)/g, (m0, a0, b0, c0) => a0 + b0 + '健康に良' + ({ 'だ': 'い', 'です': 'いです', 'だった': 'かった', 'ではない': 'くない' })[c0]);")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
