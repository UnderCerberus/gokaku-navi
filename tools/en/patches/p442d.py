import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = ".replace(/物(が|は)(?=うまく)/g, '物事$1')"
assert s.count(old) == 1
s = s.replace(old, ".replace(/物(が|は)(?=うまく)/g, '物事$1').replace(/(?:すべて|それ|物事)が(?:すばらしい|元気)(だろう|だ)(?=。|$)/, '大丈夫$1')")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
