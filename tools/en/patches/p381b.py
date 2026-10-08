import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "|universe|ocean|oceans|climate|weather|disease|diseases|crop|crops|plant|plants)$/.test(oh)) sense = { particle: 'を', core: '研究する', tr: true };   // studied several cities → 都市を研究した"
new = "|universe|ocean|oceans|climate|weather|disease|diseases|crop|crops|plant|plants|fever|cancer|bacteria|germ|germs|infection|infections|medicine|vaccine|vaccines|yellow fever|dinosaur|dinosaurs|fossil|fossils|volcano|volcanoes|earthquake|earthquakes)$/.test(oh)) sense = { particle: 'を', core: '研究する', tr: true };   // studied several cities → 都市を研究した / studying yellow fever → 黄熱病を研究している"
assert s.count(old) == 1
s = s.replace(old, new)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
