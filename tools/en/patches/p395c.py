import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/([^、。]{1,8}?)に([^、。]{1,10}?に)主に(行|来)/, '主に$2$1に$3').replace(/中の(喫茶店|カフェ|レストラン|店|庭)さえ持っている/, '中に$1さえある').replace(/中の(喫茶店|カフェ|レストラン|店|庭)を持っている/, '中に$1がある');   // went to libraries mainly to borrow books → 主に本を借りに図書館に行った / Some even have cafes inside → 中に喫茶店さえある\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
