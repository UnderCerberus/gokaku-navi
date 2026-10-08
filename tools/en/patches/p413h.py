import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/階段を下りて歩い(た|て)/g, '歩いて階段を下り$1')"
assert s.count(old) == 1
s = s.replace(old, old + ".replace(/階段を下りて走っ(た|て)/g, '階段を駆け下り$1').replace(/階段を上って走っ(た|て)/g, '階段を駆け上が$1'.replace('が$1', 'っ$1'))")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
