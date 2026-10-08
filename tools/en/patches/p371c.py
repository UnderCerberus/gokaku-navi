import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = "    ja = ja.replace(/^(春|夏|秋|冬)に、/, '$1には、');"
assert s.count(old) == 1
s = s.replace(old, old + """
    ja = ja.replace(/(^|は|が)年の最も/, '$11年で最も').replace(/(英語|日本語|フランス語|スペイン語|中国語|韓国語|ドイツ語|ピアノ|演奏|技術|腕前|発音|スキル|技能|料理の腕)(は|が)(とても|ずいぶん|少しずつ|かなり|大いに)?良くな(った|る|っている)/g, (m0, a0, p0, d0, e0) => a0 + p0 + (d0 || '') + '上達' + ({ 'った': 'した', 'る': 'する', 'っている': 'している' })[e0]);   // It was the coldest day of the year → 1年で最も寒い日 / my English improved → 英語は上達した""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
