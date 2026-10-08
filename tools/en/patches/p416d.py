import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/毎週(月|火|水|木|金|土|日)曜日(?=[^にはもの、でだ。とかま])/g, '毎週$1曜日に');"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/^毎週(月|火|水|木|金|土|日)曜日(?=[^にはもの、でだ。とかま])/, '毎週$1曜日、').replace(/毎週(月|火|水|木|金|土|日)曜日(?=[^にはもの、でだ。とかま])/g, '毎週$1曜日に');")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
