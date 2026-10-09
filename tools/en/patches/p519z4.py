import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "|as if|as though|before|after|until|while|when|whenever|once)$/.test(key) && (sc.subj.pron === 'they' ?"
new = "|as if|as though|before|after|until|while|when|whenever|once|long before|long after|even before|as soon as)$/.test(key) && (sc.subj.pron === 'they' ?"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
