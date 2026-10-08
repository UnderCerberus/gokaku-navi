import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/見るのにわくわくする/g, '見ていてわくわくする')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/(?:ほかの|他の)?誰かよりも/g, (m0) => m0.replace(/誰かよりも$/, '誰よりも')).replace(/自分のクラスのほかの誰よりも/g, 'クラスのほかの誰よりも');   // She runs faster than anyone else in her class → クラスのほかの誰よりも速く走る\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
