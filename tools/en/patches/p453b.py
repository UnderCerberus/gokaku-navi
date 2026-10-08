import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/いいよと(言っ|答え)/g, 'はいと$1');"
assert s.count(old) == 1
s = s.replace(old, ".replace(/いいよと(言っ|答え)/g, '「はい」と$1').replace(/(^|[^「])はいと(言っ|答え)/g, '$1「はい」と$2');")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
