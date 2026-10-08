import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/私的な生活/g, '私生活')"
assert s.count(old) == 1
s = s.replace(old, "    ja = ja.replace(/(茶|野菜|果物|食べ物|食事|料理|朝食|昼食|夕食|和食|魚|牛乳|水|ジュース|スープ|サラダ|食品|おやつ|弁当)(が|は)健康(だ|です|だった|ではない)/g, '$1$2健康に良$3'.replace('良$3', '良い'));   // green tea is healthy → 緑茶が健康に良い\n" + old)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
