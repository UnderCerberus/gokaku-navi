import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/人々でいっぱい/g, '人でいっぱい');"
assert s.count(old) == 1
s = s.replace(old, old + "\n    ja = ja.replace(/だろうようだ/g, 'ようだ').replace(/今までに([^、。]+?)ことがあったかどうか/g, '$1ことがあるかどうか');   // It seems that it will rain soon → 雨が降るようだ / asked me if I had ever been to Kyoto → 京都に行ったことがあるかどうか")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
