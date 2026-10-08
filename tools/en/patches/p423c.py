import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/授業の((?:ほかの|他の)?(?:どの)?(?:生徒|学生|子ども|男子|女子|男の子|女の子))/g, 'クラスの$1');"
assert s.count(old) == 1
s = s.replace(old, ".replace(/授業の((?:ほかの|他の)?(?:どの)?(?:生徒|学生|子ども|男子|女子|男の子|女の子))/g, 'クラスの$1').replace(/授業で(最も|一番)/g, 'クラスで$1');")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
