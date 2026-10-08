import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/(施行される|完成する|開業する|開通する|開始される|オープンする|発売される|開催される)と期待されている/g, '$1予定だ')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/^世論は(.+?)の上で分けられている/, '$1をめぐって世論が分かれている').replace(/(かどうか|問題|計画|政策)の上で分けられている/g, '$1をめぐって意見が分かれている');   // Public opinion is divided over whether … → …かどうかをめぐって世論が分かれている\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
