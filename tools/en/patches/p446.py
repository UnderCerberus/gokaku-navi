import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/人々でいっぱい/g, '人でいっぱい')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/^天気は(今日|明日|昨日|週末)(どう|は)/, '$1の天気は$2'.replace('$2', '$2'));   // How is the weather today? → 今日の天気はどうですか\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
