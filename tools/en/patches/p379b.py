import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "ja = ja.replace(/^((?:私たちの|私の|その)?クラス)は([^、。]*?)討論をした/, '$1で$2討論をした')"
new = "ja = ja.replace(/^((?:[^、。]{1,8}、)?)((?:私たちの|私の|その)?クラス)は([^、。]*?)討論をした/, '$1$2で$3討論をした')"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
