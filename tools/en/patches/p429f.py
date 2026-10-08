import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/(深刻な|大きな|新たな|重大な)?挑戦をもたらす/g, (m0, a0) => (a0 || '') + '課題をもたらす');"
assert s.count(old) == 1
s = s.replace(old, old + "\n    ja = ja.replace(/(リスク|危険|費用|コスト|ストレス|量|ごみ)を(減らす|下げる|抑える)ことがある/g, '$1を$2ことができる');   // can reduce the risk of serious injury → リスクを減らすことができる\n    if (tokens.some((x, q) => x.w === 'home' && tokens[q + 1] && tokens[q + 1].w === 'to')) ja = ja.replace(/((?:約|およそ)?[0-9０-９]+(?:万|千|百)?人|人々|住民)がある(。?)$/, '$1が住んでいる$2');   // The island is home to about 500 people → 島には約500人が住んでいる")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
