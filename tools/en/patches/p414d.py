import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "return { ok: true, ja: CLOSE[q][1] + '。' + nCl.ja + 'より。', sp: ''"
assert s.count(old) == 1
s = s.replace(old, "return { ok: true, ja: CLOSE[q][1] + (/友達$/.test(CLOSE[q][1]) ? '、' : '。') + nCl.ja + 'より。', sp: ''")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
