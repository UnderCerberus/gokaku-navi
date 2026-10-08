import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/(?:すべて|それ|物事)が(?:すばらしい|元気)(だろう|だ)(?=。|$)/, '大丈夫$1')"
assert s.count(old) == 1
s = s.replace(old, ".replace(/(?:それ|物事)が(?:すばらしい|元気)(だろう|だ)(?=。|$)/, '大丈夫$1').replace(/(すべて)(?:が|は)(?:すばらしい|元気)(だろう|だ)(?=。|$)/, '$1大丈夫$2').replace(/^(明日|今日|週末|今週末|午後|明日の朝)は(?:よい|すばらしい|晴れ)だろう/, '$1は晴れるだろう')")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
