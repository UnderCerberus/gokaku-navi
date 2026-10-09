import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "!st.other.concat(st.manner).some((x) => /(?:%|倍|ポイント)$/.test(x))"
new = "!st.other.concat(st.manner).some((x) => /(?:%|倍|ポイント)$/.test(x) || /^約?[0-9０-９]/.test(x))"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
