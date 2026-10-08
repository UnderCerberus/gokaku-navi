import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/知識の隙間/g, '知識の空白')"
assert s.count(old) == 1
s = s.replace(old, """    ja = ja.replace(/関心の必要性はない/g, '心配する必要はない').replace(/([^、。]{1,10}?)の必要性はない/g, '$1の必要はない').replace(/([^、。]{1,8})の(?:良い|よい)知識を持って/g, '$1をよく知って').replace(/(試験|テスト|旅行|パーティー|会議|発表|試合|面接)のために備え(た|る|て|ている)/g, (m0, a0, b0) => a0 + 'の準備をし' + ({ 'た': 'た', 'る': '', 'て': 'て', 'ている': 'ている' })[b0] + (b0 === 'る' ? 'する' : '').replace(/^する$/, '')).replace(/の準備をし(?=。|$)/, 'の準備をする');   // There is no need for concern → 心配する必要はない / She has a good knowledge of history → 歴史をよく知っている / We prepared for the test → 試験の準備をした
""" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
