import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/夜の空/g, '夜空');"
assert s.count(old) == 1
s = s.replace(old, old + "\n    ja = ja.replace(/もし(?:私|彼|彼女|私たち|あなた)が(より多くの|もっと多くの|十分な)?お金を持っていたら/, (m0, a0) => 'もし' + (a0 ? (a0 === '十分な' ? '十分な' : 'もっと') : '') + 'お金があったら').replace(/授業の((?:ほかの|他の)?(?:どの)?(?:生徒|学生|子ども|男子|女子|男の子|女の子))/g, 'クラスの$1');   // If I had money → もしお金があったら / No other student in the class → クラスのほかのどの生徒も")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
