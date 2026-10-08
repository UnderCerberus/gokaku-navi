import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "ja = ja.replace(/家まで([^、。]{0,8}?)歩い(た|て|ていた|ている|ていると)/g,"
assert s.count(old) == 1
s = s.replace(old, "ja = ja.replace(/(?<!の)家まで([^、。]{0,8}?)歩い(た|て|ていた|ている|ていると)/g,")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
