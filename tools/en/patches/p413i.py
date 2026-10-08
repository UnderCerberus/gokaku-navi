import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/階段を上って走っ(た|て)/g, '階段を駆け上が$1'.replace('が$1', 'っ$1'))"
assert s.count(old) == 1
s = s.replace(old, ".replace(/階段を上って走っ(た|て)/g, '階段を駆け上がっ$1').replace(/階段を上って歩い(た|て)/g, '歩いて階段を上っ$1').replace(/階段に登(る|った|って)/g, '階段を上$1')")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
