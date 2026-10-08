import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')"
assert s.count(old) == 1
s = s.replace(old, """    ja = ja.replace(/(?:あなたが)?どちらをもっと上手に好きか/g, 'どちらのほうが好きか').replace(/ここの中は/g, 'ここは').replace(/外に雨が降/g, '外は雨が降').replace(/外に雪が降/g, '外は雪が降');   // see which one you like better → どちらのほうが好きか / It's hot in here → ここは暑い / it's raining outside → 外は雨が降っている
""" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
