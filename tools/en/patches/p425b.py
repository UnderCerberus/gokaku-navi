import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/((?:正しい|適切な)?(?:語|言葉|単語|答え|数字))で空欄に記入/g, '空欄に$1を記入');"
assert s.count(old) == 1
s = s.replace(old, old + "\n    ja = ja.replace(/(東京|パリ|ロンドン|北京|リオ|長野|札幌|ロサンゼルス|シドニー|アテネ)のオリンピック/g, '$1オリンピック');\n    if (tokens[0] && tokens[0].w === 'the' && tokens[1] && tokens[1].w === 'point' && tokens[2] && tokens[2].w === 'is') ja = ja.replace(/^点は/, '大事なのは');   // The point is whether … → 大事なのは…かどうかだ")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
