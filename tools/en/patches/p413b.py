import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "(a.an || (a.pron && PRON[a.pron] && PRON[a.pron].an)) ? '〜を迎えに行く' : it.ja;"
assert s.count(old) == 1
s = s.replace(old, "(a.an || (a.pron && PRON[a.pron] && PRON[a.pron].an)) ? (/^(?:me|us)$/.test(a.pron || '') ? '〜を迎えに来る' : '〜を迎えに行く') : it.ja;")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
