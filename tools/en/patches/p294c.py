import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = """.replace(/\\bU\\.S\\.(?:A\\.)?/g, 'USA')"""
assert s.count(old) == 1, s.count(old)
new = """.replace(/\\b((?:[Ll]ook|[Ss]earch|[Hh]unt)(?:s|es|ed|ing)?) (everywhere|all over|around|carefully|hard) for ([^,.;!?]+)/g, '$1 for $3 $2').replace(/\\bU\\.S\\.(?:A\\.)?/g, 'USA')"""
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
