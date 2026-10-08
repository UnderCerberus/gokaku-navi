import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "'wet paint': 'ペンキ塗りたて', "
assert s.count(old) == 1
s = s.replace(old, old + "'keep up the good work': 'その調子で頑張って', 'keep it up': 'その調子で頑張って', ")
old2 = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old2) == 1
s = s.replace(old2, "    ja = ja.replace(/(答え|理由|方法|解き方|意味|問題の答え|使い方)を理解できな/g, '$1が分からな').replace(/(旅行|旅|冒険|航海)で出発/g, '$1に出発');   // I can't figure out the answer → 答えが分からない / set off on a long journey → 長い旅に出発した\n" + old2)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
