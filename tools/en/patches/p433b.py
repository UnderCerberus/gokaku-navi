import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = """      else if (L === 'skip' && /(?:^| )(?:breakfast|lunch|dinner|meal|meals|supper)$/.test(oh)) sense = { particle: 'を', core: '抜く', tr: true };"""
assert s.count(old) == 1
s = s.replace(old, old + """
      else if (L === 'support' && /(?:^| )(?:rule|rules|plan|plans|idea|ideas|policy|policies|proposal|proposals|decision|decisions|law|laws|candidate|candidates|party|parties|change|changes|project|projects|movement|campaign|view|views|opinion|opinions|bill|ban)$/.test(oh) && !vg.passive) sense = { particle: 'を', core: '支持する', tr: true };   // support the new rule → 新しい規則を支持する""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
