import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/私的な寄付者/g, '個人の寄付者');"
assert s.count(old) == 1
s = s.replace(old, ".replace(/私的な寄付者/g, '個人の寄付者').replace(/(?:自分の)?([^、。のは]{1,8})のより意識するようにな/g, '$1をより意識するようにな').replace(/(自分|彼女|彼|私|あなた)の重さ/g, '$1の体重');")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
