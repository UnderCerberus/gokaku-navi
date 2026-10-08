import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/科学の報告書/g, '理科のレポート')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/長いままでいることができない/g, '長くはいられない').replace(/長いままでいられない/g, '長くはいられない').replace(/長いままでいる/g, '長くいる');   // I can't stay long → 長くはいられない\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
