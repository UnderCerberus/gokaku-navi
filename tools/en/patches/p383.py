import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, """    ja = ja.replace(/それが(?:それで|その中に)?([^、。]{1,20}?)を持って(いた|いる)/, 'その中に$1が入って$2').replace(/見つけていて、/, '見つけて、');   // it had my student ID card in it → その中に学生証が入っていた / someone had found it and brought it there → 見つけて、
""" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
