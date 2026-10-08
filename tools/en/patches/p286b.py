import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/(^|[、はがにで])((?:もう)?[0-9０-９]+(?:杯|本|枚|切れ|箱|袋|缶|瓶|皿|冊|足|台))の([^、。をのがはにでとも「」]{1,10})を/g, '$1$3を$2')"
new = ".replace(/(^|[はがにで]|[^0-9０-９]、)((?:もう)?[0-9０-９]+(?:、[0-9０-９]+)?(?:杯|本|枚|切れ|箱|袋|缶|瓶|皿|冊|足|台))の([^、。をのがはにでとも「」]{1,10})を/g, '$1$3を$2')"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
