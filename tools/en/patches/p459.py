import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = """      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };"""
assert s.count(old) == 1
s = s.replace(old, old + """
      else if (L === 'fill' && /(?:^| )(?:gap|gaps|hole|holes|void|vacancy|vacancies|position|positions)$/.test(oh)) sense = { particle: 'を', core: '埋める', tr: true };   // fills a gap in our knowledge → 知識の空白を埋める
      else if (L === 'set' && /(?:^| )(?:record|records)$/.test(oh) && !vg.passive) sense = { particle: 'を', core: '樹立する', tr: true };   // He set a new world record → 新しい世界記録を樹立した""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
