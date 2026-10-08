import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "ja = ja.replace(/早く(来|到着|答え|返事)/g, 'すぐに$1');"
assert s.count(old) == 1
s = s.replace(old, "ja = ja.replace(/(?:早|速)く(来|到着|答え|返事)/g, 'すぐに$1');")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
