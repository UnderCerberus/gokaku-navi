import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/中国の万里の長城/g, '万里の長城');"
new = old + """
    ja = ja.replace(/(傘|ハンカチ|ティッシュ|タオル|手)を提供し/, '$1を差し出し').replace(/(鳥|小鳥|鳥たち|ウグイス|スズメ)(が|は)([^、。]{0,12}?)歌(って|った|う|い|わ)/g, (m0, a0, b0, c0, d0) => a0 + b0 + c0 + '鳴' + ({ 'って': 'いて', 'った': 'いた', 'う': 'く', 'い': 'き', 'わ': 'か' })[d0]);   // offered me her umbrella → 傘を差し出してくれた / a bird singing → 鳥が鳴いている"""
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
