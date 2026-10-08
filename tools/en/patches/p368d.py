import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "  const MEASURE = dic({ bag: '袋', box: '箱',"
new = "  const MEASURE = dic({ ml: 'mL', milliliter: 'ミリリットル', milliliters: 'ミリリットル', cc: 'cc', bag: '袋', box: '箱',"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
