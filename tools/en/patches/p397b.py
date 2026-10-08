import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/(彼|彼女)のしっぽを振/g, 'しっぽを振')"
new = ".replace(/(彼|彼女|その)の?(?:しっぽ|尾)を振/g, 'しっぽを振').replace(/一日の大半今/g, '今は一日の大半を').replace(/一日の大半を?(眠|寝)(る|た)(?=。|$)/, (m0, a0, b0) => '一日の大半を' + (a0 === '眠' ? '眠って' : '寝て') + (b0 === 'る' ? '過ごす' : '過ごした'))"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
