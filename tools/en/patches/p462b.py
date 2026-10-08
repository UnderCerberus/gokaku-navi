import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = """.replace(/(試験|テスト|旅行|パーティー|会議|発表|試合|面接)のために備え(た|る|て|ている)/g, (m0, a0, b0) => a0 + 'の準備をし' + ({ 'た': 'た', 'る': '', 'て': 'て', 'ている': 'ている' })[b0] + (b0 === 'る' ? 'する' : '').replace(/^する$/, '')).replace(/の準備をし(?=。|$)/, 'の準備をする');"""
assert s.count(old) == 1
s = s.replace(old, """.replace(/(試験|テスト|旅行|パーティー|会議|発表|試合|面接)のために備え(ている|た|て|る)/g, (m0, a0, b0) => a0 + 'の準備を' + ({ 'た': 'した', 'る': 'する', 'て': 'して', 'ている': 'している' })[b0]);""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
