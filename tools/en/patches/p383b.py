import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/で近い(?=。|$|だ|です)/, 'から近い').replace(/その(賞味期限|有効期限|締め切り|期限)に近い/g, '$1が近い');   // The station is close to my house → 私の家から近い / close to its expiration date → 賞味期限が近い\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
