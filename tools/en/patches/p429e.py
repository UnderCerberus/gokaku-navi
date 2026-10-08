import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
old = """.replace(/([0-9０-９]+(?:万|千|百)?)以上の(美術品|作品|絵画)/, '$1点以上の$2');"""
assert s.count(old) == 1
s = s.replace(old, old + """
    if (tokens.some((x, q) => x.w === 'home' && tokens[q + 1] && tokens[q + 1].w === 'to') && tokens.some((x) => /^(?:animals|animal|birds|bird|species|insects|fish|creatures|wildlife|plants|bears|monkeys|deer|whales|dolphins)$/.test(x.w || ''))) ja = ja.replace(/が(?:ある|いる)(。?)$/, 'が生息している$1').replace(/まれな(動物|鳥|種|昆虫|植物|生き物)/g, '珍しい$1');   // The forest is home to many rare animals → 森林には多くの珍しい動物が生息している
    ja = ja.replace(/(深刻な|大きな|新たな|重大な)?挑戦をもたらす/g, (m0, a0) => (a0 || '') + '課題をもたらす');   // poses a serious challenge to the economy → 経済に深刻な課題をもたらす""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
