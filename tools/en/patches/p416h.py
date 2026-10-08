import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "ja = ja.replace(/(?:もっと)?(大きい|小さい)(?:大きさ|サイズ)でそれ(?:は|が)ありますか/, 'もっと$1サイズはありますか')"
assert s.count(old) == 1
s = s.replace(old, "ja = ja.replace(/(?:もっと|より)?(大きい|小さい)(?:大きさ|サイズ)でそれ(?:は|が)ありますか/, 'もっと$1サイズはありますか')")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
