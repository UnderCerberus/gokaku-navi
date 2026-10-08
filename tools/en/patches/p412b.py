import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/([^、。はが]{1,8}?)に(バス|電車|列車|飛行機|タクシー|船|地下鉄)に乗/g, '$1で$2に乗').replace(/([^、。はが]{1,8}?)に(電車|バス|列車|地下鉄)から降り/g, '$1で$2を降り');   // got on the bus at the station → 駅でバスに乗った / Get off the train at the next stop → 次の停留所で電車を降りなさい\n    if (tokens.some((x, q) => x.w === 'look' && tokens[q + 1] && tokens[q + 1].w === 'up') && tokens.some((x, q) => x.w === 'for' && tokens[q + 1] && tokens[q + 1].w === 'me')) ja = ja.replace(/^私を表す/, '');   // Can you look up this word for me? → この単語を調べてくれますか\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
