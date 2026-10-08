import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = """|homework|retire|retires|retired)$/.test(x.w || ''))) ja = ja.replace(/^([^、。]{1,8}?)さん(?=は|が|の|に|を|と)/, '$1先生');"""
assert s.count(old) == 1
s = s.replace(old, """|homework|retire|retires|retired)$/.test(x.w || '')) && !/^[^、。]{1,8}?さんは(?:[^、。]*?の)?先生(?:だ|です|だった|でした)/.test(ja)) ja = ja.replace(/^([^、。]{1,8}?)さん(?=は|が|の|に|を|と)/, '$1先生');   // Mrs. Sato is a teacher → 佐藤さんは先生だ（「佐藤先生は先生だ」にしない）""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
