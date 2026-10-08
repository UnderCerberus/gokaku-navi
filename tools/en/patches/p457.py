import io
p = r'C:\Claude\gokaku-navi\js\data\dict-m-z.js'
s = io.open(p, encoding='utf-8').read()
old = "    ['service', '名', '奉仕; サービス; 勤務', 1],"
assert s.count(old) == 1
s = s.replace(old, "    ['service', '名', 'サービス; 奉仕; 勤務', 1],")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)

p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/誰かより(?!も)/g, '誰よりも')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/(?:彼らの|自分の|私たちの)家に配達/g, '自宅に配達').replace(/オンラインの店/g, 'オンラインストア');   // have products delivered to their homes → 自宅に配達してもらう / online stores → オンラインストア\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
