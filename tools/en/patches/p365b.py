import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = """ja = ja.replace(/(今夜|今日|今晩|帰りが)?遅れるつもりだ(?=。|$)/, (m0, a0) => (a0 ? a0 + 'は' : '') + '遅くなる')"""
new = """ja = ja.replace(/(今夜|今日|今晩|帰りが)?遅れるつもりだ(?=。|$)/, (m0, a0) => (a0 ? a0 + 'は遅くなる' : '遅れそうだ'))"""
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
