import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/かもしれなくて、/g, 'かもしれず、').replace(/だろう、そして/g, 'だろうし、');"
assert s.count(old) == 1
s = s.replace(old, old + "\n    ja = ja.replace(/世界の(多くの|一部の|さまざまな|ほかの|他の|あらゆる)部分/g, '世界の$1地域');   // in many parts of the world → 世界の多くの地域で")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
